import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const PAGE_SIZE = 20;

const DIFFICULTY = {
  easy: { label: 'Dễ', bg: '#e8f5ee', color: '#14532d' },
  medium: { label: 'Trung bình', bg: '#fff4de', color: '#7a4b00' },
  hard: { label: 'Khó', bg: '#fdecec', color: '#7f1d1d' },
};

// Bỏ dấu + chữ thường để gõ "lap trinh" vẫn tìm ra "Lập trình"
const normalize = (s) =>
  (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

const selectStyle = {
  padding: '9px 12px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--line)',
  background: 'var(--card)',
  color: 'var(--ink)',
  fontSize: 14,
  minWidth: 160,
};

function isCorrect(question, index) {
  const answer = question.correct_answer;
  return Array.isArray(answer) ? answer.map(Number).includes(index) : Number(answer) === index;
}

export default function QuestionBankPage() {
  const location = useLocation();
  const importedIds = useMemo(
    () => (location.state?.importedIds ?? []).map(String),
    [location.state]
  );

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Tải lại mỗi khi vào trang hoặc vừa import xong (location.key đổi)
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    setVisible(PAGE_SIZE);
    axiosClient
      .get('/questions')
      .then((res) => { if (!ignore) setQuestions(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (!ignore) setError('Không tải được ngân hàng câu hỏi. Hãy kiểm tra JSON Server tại cổng 3001.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [location.key]);

  // Câu vừa import xếp lên đầu
  const ordered = useMemo(() => {
    if (importedIds.length === 0) return questions;
    const fresh = questions.filter((q) => importedIds.includes(String(q.id)));
    const rest = questions.filter((q) => !importedIds.includes(String(q.id)));
    return [...fresh, ...rest];
  }, [questions, importedIds]);

  const key = normalize(keyword.trim());
  const filtered = ordered.filter((q) => {
    if (difficulty && (q.difficulty ?? 'medium') !== difficulty) return false;
    if (key) {
      const haystack = normalize(
        `${q.content ?? ''} ${(q.options ?? []).join(' ')} ${q.explanation ?? ''}`
      );
      if (!haystack.includes(key)) return false;
    }
    return true;
  });

  const shown = filtered.slice(0, visible);
  const hasFilter = Boolean(key || difficulty);

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: 6 }}>Ngân hàng câu hỏi</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
        Kiểm tra nội dung các câu hỏi trong hệ thống. Đáp án đúng được tô màu xanh.
      </p>

      {importedIds.length > 0 && (
        <div
          role="status"
          style={{
            marginBottom: 16,
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            background: '#e8f5ee',
            border: '1px solid #2f8f5b',
            color: '#14532d',
            fontSize: 14,
          }}
        >
          Vừa import <strong>{importedIds.length}</strong> câu hỏi. Các câu mới được xếp lên đầu và
          đánh dấu <strong>Mới</strong> để bạn kiểm tra.
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <input
          type="search"
          className="search-box"
          style={{ width: '100%', marginBottom: 14 }}
          placeholder="Tìm theo nội dung câu hỏi, câu trả lời hoặc giải thích..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setVisible(PAGE_SIZE); }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <select
            style={selectStyle}
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setVisible(PAGE_SIZE); }}
            aria-label="Lọc theo độ khó"
          >
            <option value="">Tất cả độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>

          {hasFilter && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { setKeyword(''); setDifficulty(''); }}
            >
              Xóa bộ lọc
            </button>
          )}

          <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
            {hasFilter ? `${filtered.length} / ${questions.length}` : questions.length} câu hỏi
          </span>
        </div>
      </div>

      {loading && <div className="card"><div className="state-block">Đang tải ngân hàng câu hỏi...</div></div>}

      {!loading && error && <div className="card"><div className="state-block error">{error}</div></div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card">
          <div className="state-block">
            {hasFilter
              ? 'Không có câu hỏi nào phù hợp với bộ lọc hiện tại.'
              : 'Ngân hàng chưa có câu hỏi nào. Hãy dùng Câu hỏi Excel → Import Excel để thêm.'}
          </div>
        </div>
      )}

      {!loading && !error && shown.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {shown.map((q, index) => {
            const isNew = importedIds.includes(String(q.id));
            const level = DIFFICULTY[q.difficulty] ?? DIFFICULTY.medium;
            const options = Array.isArray(q.options) ? q.options : [];

            return (
              <div
                key={q.id}
                className="card"
                style={isNew ? { border: '2px solid #2f8f5b' } : undefined}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <strong style={{ color: 'var(--ink-soft)' }}>Câu {index + 1}</strong>
                  {isNew && (
                    <span style={{ background: '#2f8f5b', color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                      Mới
                    </span>
                  )}
                  <span style={{ background: level.bg, color: level.color, fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>
                    {level.label}
                  </span>
                  {q.session_id && (
                    <span style={{ color: 'var(--ink-soft)', fontSize: 12 }}>Mã chương: {q.session_id}</span>
                  )}
                </div>

                <h3 style={{ marginBottom: 12 }}>{q.content}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {options.map((option, i) => {
                    const correct = isCorrect(q, i);
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: 10,
                          padding: '8px 12px',
                          borderRadius: 8,
                          fontSize: 14,
                          background: correct ? '#e8f5ee' : 'transparent',
                          border: `1px solid ${correct ? '#2f8f5b' : 'var(--line)'}`,
                          color: correct ? '#14532d' : 'var(--ink)',
                          fontWeight: correct ? 600 : 400,
                        }}
                      >
                        <span style={{ minWidth: 20 }}>{LETTERS[i]}.</span>
                        <span style={{ flex: 1 }}>{option}</span>
                        {correct && <span aria-label="Đáp án đúng">✓</span>}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
                    <strong>Giải thích:</strong> {q.explanation}
                  </p>
                )}
              </div>
            );
          })}

          {filtered.length > shown.length && (
            <div style={{ textAlign: 'center' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Xem thêm ({filtered.length - shown.length} câu còn lại)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}