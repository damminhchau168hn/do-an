import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useRole } from '../../context/RoleContext';

const API = 'http://localhost:3001';
const ALLOWED_ROLES = ['admin', 'instructor'];

const MAX_OPTIONS = 5; // tối đa 5 câu trả lời
const MIN_OPTIONS = 2; // tối thiểu 2 câu trả lời
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const TOAST_COLORS = {
  success: { bg: '#e8f5ee', border: '#2f8f5b', color: '#14532d' },
  error: { bg: '#fdecec', border: '#c0392b', color: '#7f1d1d' },
  info: { bg: '#eef3fb', border: '#3b6fd4', color: '#1e3a8a' },
};

// Bỏ dấu, chữ thường, bỏ ký tự đặc biệt: "Câu trả lời 1" -> "cautraloi1"
const normKey = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');

const DIFFICULTY_MAP = { de: 'easy', trungbinh: 'medium', kho: 'hard', easy: 'easy', medium: 'medium', hard: 'hard' };

// Đọc "A", "C" hoặc "A, C" (cũng nhận số 1-5) -> số (1 đáp án) hoặc mảng (nhiều đáp án)
function parseCorrect(value, optionCount) {
  const tokens = String(value ?? '')
    .trim()
    .toUpperCase()
    .split(/[\s,;/|]+/)
    .filter(Boolean);
  if (tokens.length === 0) return null;

  const indexes = [];
  for (const token of tokens) {
    let idx = -1;
    if (/^[A-E]$/.test(token)) idx = token.charCodeAt(0) - 65;
    else if (/^[1-5]$/.test(token)) idx = Number(token) - 1;
    if (idx < 0 || idx >= optionCount) return null;
    if (!indexes.includes(idx)) indexes.push(idx);
  }
  indexes.sort((a, b) => a - b);
  return indexes.length === 1 ? indexes[0] : indexes;
}

// Chuyển đáp án đúng trong hệ thống thành chữ: 0 -> "A", [0,2] -> "A, C"
function formatCorrect(value) {
  const list = Array.isArray(value) ? value : [value];
  const letters = list
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n >= 0 && n < MAX_OPTIONS)
    .map((n) => LETTERS[n]);
  return letters.join(', ');
}

// Đọc một dòng Excel (tên cột không phân biệt dấu/hoa thường)
function readRow(row) {
  const data = {};
  Object.entries(row).forEach(([key, value]) => {
    data[normKey(key)] = value;
  });

  const pick = (...keys) => {
    for (const k of keys) {
      if (data[k] !== undefined && String(data[k]).trim() !== '') return data[k];
    }
    return '';
  };

  const options = [];
  for (let i = 1; i <= MAX_OPTIONS; i++) {
    options.push(
      String(pick(`cautraloi${i}`, `dapan${i}`, `option${LETTERS[i - 1].toLowerCase()}`)).trim()
    );
  }

  const difficultyRaw = normKey(pick('dokho', 'difficulty'));

  return {
    content: String(pick('noidungcauhoi', 'noidung', 'cauhoi', 'content')).trim(),
    options,
    correct: pick('cautraloidung', 'dapandung', 'correctanswer'),
    explanation: String(pick('giaithich', 'explanation')).trim(),
    difficulty: DIFFICULTY_MAP[difficultyRaw] ?? 'medium',
    session_id: pick('machuong', 'sessionid') === '' ? null : pick('machuong', 'sessionid'),
  };
}

export default function QuestionMenu() {
  const { user, role } = useRole();
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Chỉ admin và giảng viên mới thấy menu này
  if (!ALLOWED_ROLES.includes(role)) return null;

  function showMessage(text, type = 'info') {
    clearTimeout(timerRef.current);
    if (!text) {
      setToast(null);
      return;
    }
    setToast({ text, type });
    timerRef.current = setTimeout(() => setToast(null), 9000);
  }

  // EXPORT: xuất toàn bộ ngân hàng câu hỏi trong hệ thống ra Excel
  async function handleExport() {
    try {
      setLoading(true);
      showMessage('');

      const response = await axios.get(`${API}/questions`);
      const questions = response.data;

      if (!Array.isArray(questions) || questions.length === 0) {
        showMessage('Hiện chưa có câu hỏi nào trong ngân hàng để xuất.', 'error');
        return;
      }

      const rows = questions.map((q, index) => {
        const options = Array.isArray(q.options) ? q.options : [];
        return {
          STT: index + 1,
          'Nội dung câu hỏi': q.content ?? '',
          'Câu trả lời 1': options[0] ?? '',
          'Câu trả lời 2': options[1] ?? '',
          'Câu trả lời 3': options[2] ?? '',
          'Câu trả lời 4': options[3] ?? '',
          'Câu trả lời 5': options[4] ?? '',
          'Câu trả lời đúng': formatCorrect(q.correct_answer),
          'Giải thích': q.explanation ?? '',
          'Độ khó': q.difficulty ?? 'medium',
          'Mã chương': q.session_id ?? '',
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet['!cols'] = [
        { wch: 6 }, { wch: 50 },
        { wch: 28 }, { wch: 28 }, { wch: 28 }, { wch: 28 }, { wch: 28 },
        { wch: 18 }, { wch: 50 }, { wch: 12 }, { wch: 12 },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
      XLSX.writeFile(workbook, 'ngan-hang-cau-hoi.xlsx');

      showMessage(`Đã xuất toàn bộ ${questions.length} câu hỏi trong ngân hàng.`, 'success');
    } catch (error) {
      console.error('Lỗi export câu hỏi:', error);
      showMessage('Không thể xuất dữ liệu. Hãy kiểm tra JSON Server tại cổng 3001.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // IMPORT: đọc file Excel đã điền theo mẫu và thêm vào ngân hàng câu hỏi
  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      showMessage('');

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });

      if (!workbook.SheetNames.length) {
        showMessage('File Excel không có sheet dữ liệu.', 'error');
        return;
      }

      // Luôn đọc sheet đầu tiên (sheet "Questions")
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!rows.length) {
        showMessage('File Excel chưa có dữ liệu câu hỏi.', 'error');
        return;
      }

      // Lấy các câu hỏi đã có để tránh thêm trùng
      const existingRes = await axios.get(`${API}/questions`);
      const existing = new Set(
        (Array.isArray(existingRes.data) ? existingRes.data : []).map((q) => normKey(q.content))
      );

      const validQuestions = [];
      const invalidRows = [];
      let duplicates = 0;

      rows.forEach((row, index) => {
        const rowNumber = index + 2; // dòng 1 là tiêu đề cột
        const item = readRow(row);

        // Bỏ qua dòng trống (chỉ có STT)
        const isEmpty =
          !item.content &&
          item.options.every((o) => !o) &&
          String(item.correct).trim() === '' &&
          !item.explanation;
        if (isEmpty) return;

        // Câu trả lời phải liền nhau từ 1: không được bỏ trống ở giữa
        let last = -1;
        item.options.forEach((o, i) => { if (o) last = i; });
        const options = item.options.slice(0, last + 1);
        const hasGap = options.some((o) => !o);

        const correct = parseCorrect(item.correct, options.length);

        if (!item.content || hasGap || options.length < MIN_OPTIONS || correct === null) {
          invalidRows.push(rowNumber);
          return;
        }

        const key = normKey(item.content);
        if (existing.has(key)) {
          duplicates++;
          return;
        }
        existing.add(key);

        const now = new Date().toISOString();
        validQuestions.push({
          content: item.content,
          options,
          correct_answer: correct,
          explanation: item.explanation,
          difficulty: item.difficulty,
          session_id: item.session_id,
          created_by: user?.id ?? null,
          created_at: now,
          updated_at: now,
        });
      });

      if (validQuestions.length === 0) {
        let text = 'Không có câu hỏi hợp lệ để thêm.';
        if (invalidRows.length > 0) text += ` Kiểm tra các dòng: ${invalidRows.join(', ')}.`;
        if (duplicates > 0) text += ` ${duplicates} câu đã có trong ngân hàng.`;
        showMessage(text, 'error');
        return;
      }

      let imported = 0;
      let failed = 0;

      // Thêm từng câu hỏi vào JSON Server
      for (const question of validQuestions) {
        try {
          await axios.post(`${API}/questions`, question);
          imported++;
        } catch (error) {
          console.error('Lỗi khi thêm câu hỏi:', error);
          failed++;
        }
      }

      let result = `Đã thêm ${imported}/${validQuestions.length} câu hỏi vào ngân hàng.`;
      if (duplicates > 0) result += ` Bỏ qua ${duplicates} câu đã có.`;
      if (invalidRows.length > 0) result += ` Dòng lỗi (đã bỏ qua): ${invalidRows.join(', ')}.`;
      if (failed > 0) result += ` ${failed} câu chưa thêm được.`;

      showMessage(
        result,
        imported > 0 && failed === 0 && invalidRows.length === 0 ? 'success' : 'info'
      );
    } catch (error) {
      console.error('Lỗi import câu hỏi:', error);
      showMessage('Không đọc được file. Hãy chọn file Excel .xlsx hoặc .xls hợp lệ.', 'error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // Tải file Excel mẫu
  function handleDownloadTemplate() {
    const sample = [
      {
        STT: 1,
        'Nội dung câu hỏi': 'React dùng để làm gì?',
        'Câu trả lời 1': 'Xây dựng giao diện người dùng',
        'Câu trả lời 2': 'Quản lý cơ sở dữ liệu',
        'Câu trả lời 3': 'Thiết kế phần cứng',
        'Câu trả lời 4': 'Tạo hệ điều hành',
        'Câu trả lời 5': '',
        'Câu trả lời đúng': 'A',
        'Giải thích': 'React là thư viện JavaScript để xây dựng giao diện.',
      },
      {
        STT: 2,
        'Nội dung câu hỏi': 'Chọn tất cả các ngôn ngữ lập trình.',
        'Câu trả lời 1': 'JavaScript',
        'Câu trả lời 2': 'HTML',
        'Câu trả lời 3': 'Python',
        'Câu trả lời 4': 'CSS',
        'Câu trả lời 5': 'Java',
        'Câu trả lời đúng': 'A, C, E',
        'Giải thích': 'HTML và CSS là ngôn ngữ đánh dấu và định dạng, không phải ngôn ngữ lập trình.',
      },
      {
        STT: 3,
        'Nội dung câu hỏi': 'Hà Nội là thủ đô của Việt Nam.',
        'Câu trả lời 1': 'Đúng',
        'Câu trả lời 2': 'Sai',
        'Câu trả lời 3': '',
        'Câu trả lời 4': '',
        'Câu trả lời 5': '',
        'Câu trả lời đúng': 'A',
        'Giải thích': 'Hà Nội là thủ đô của nước Cộng hòa xã hội chủ nghĩa Việt Nam.',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sample);
    worksheet['!cols'] = [
      { wch: 6 }, { wch: 50 },
      { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 },
      { wch: 18 }, { wch: 55 },
    ];

    const guide = XLSX.utils.aoa_to_sheet([
      ['HƯỚNG DẪN ĐIỀN FILE MẪU'],
      [''],
      ['1. Điền dữ liệu ở sheet "Questions", mỗi dòng là một câu hỏi. Xóa 3 dòng ví dụ trước khi nhập câu hỏi thật.'],
      ['2. Cột "Nội dung câu hỏi" bắt buộc phải có.'],
      ['3. Mỗi câu hỏi có từ 2 đến 5 câu trả lời (Câu trả lời 1 đến Câu trả lời 5). Điền liền nhau từ cột 1, không bỏ trống ở giữa.'],
      ['4. Cột "Câu trả lời đúng": nhập chữ cái A, B, C, D hoặc E (A là Câu trả lời 1, B là Câu trả lời 2...).'],
      ['   Câu hỏi có nhiều đáp án đúng thì ngăn cách bằng dấu phẩy, ví dụ: A, C'],
      ['5. Cột "Giải thích" không bắt buộc.'],
      ['6. Cột STT chỉ để đánh số, hệ thống không đọc cột này.'],
      ['7. Câu hỏi có nội dung trùng với câu đã có trong ngân hàng sẽ được bỏ qua.'],
    ]);
    guide['!cols'] = [{ wch: 120 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
    XLSX.utils.book_append_sheet(workbook, guide, 'Hướng dẫn');
    XLSX.writeFile(workbook, 'file-mau-cau-hoi.xlsx');
  }

  const items = [
    { icon: '📤', label: 'Export Excel', onClick: handleExport },
    { icon: '📥', label: 'Import Excel', onClick: () => fileInputRef.current?.click() },
    { icon: '📄', label: 'Tải file mẫu', onClick: handleDownloadTemplate },
  ];

  const toastColor = toast ? TOAST_COLORS[toast.type] ?? TOAST_COLORS.info : null;

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          font: 'inherit',
          color: 'inherit',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? 'Đang xử lý…' : 'Câu hỏi Excel ▾'}
      </button>

      {open && !loading && (
        <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 10, zIndex: 50 }}>
          <div
            style={{
              minWidth: 190,
              background: 'var(--card, #fff)',
              border: '1px solid var(--line, #e5e0d5)',
              borderRadius: 'var(--radius, 10px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: 6,
            }}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '9px 12px',
                  borderRadius: 8,
                  font: 'inherit',
                  fontSize: 14,
                  color: 'var(--ink, #222)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ô chọn file ẩn dùng cho Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImport}
        style={{ display: 'none' }}
      />

      {/* Thông báo kết quả */}
      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: 90,
            right: 24,
            zIndex: 100,
            maxWidth: 400,
            padding: '12px 16px',
            borderRadius: 10,
            fontSize: 14,
            background: toastColor.bg,
            border: `1px solid ${toastColor.border}`,
            color: toastColor.color,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}