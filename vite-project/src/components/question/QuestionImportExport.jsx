
import { useRef, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "../../styles/QuestionImportExport.css"

const API = "http://localhost:3001";

function QuestionImportExportPage() {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Hiển thị thông báo
  function showMessage(text, type = "info") {
    setMessage(text);
    setMessageType(type);
  }

  // Chuyển đáp án A/B/C/D thành index 0/1/2/3
  function convertAnswer(answer) {
    const value = String(answer ?? "").trim().toUpperCase();

    if (["A", "B", "C", "D"].includes(value)) {
      return value.charCodeAt(0) - 65;
    }

    if (["0", "1", "2", "3"].includes(value)) {
      return Number(value);
    }

    return -1;
  }

  // EXPORT câu hỏi ra Excel
  async function handleExport() {
    try {
      setLoading(true);
      showMessage("");

      const response = await axios.get(`${API}/questions`);
      const questions = response.data;

      if (!Array.isArray(questions) || questions.length === 0) {
        showMessage("Hiện chưa có câu hỏi để xuất.", "error");
        return;
      }

      const rows = questions.map((question) => {
        const options = Array.isArray(question.options)
          ? question.options
          : [];

        const correctIndex = Number(question.correct_answer);

        return {
          content: question.content ?? "",
          optionA: options[0] ?? "",
          optionB: options[1] ?? "",
          optionC: options[2] ?? "",
          optionD: options[3] ?? "",
          correct_answer:
            Number.isInteger(correctIndex) &&
            correctIndex >= 0 &&
            correctIndex <= 3
              ? ["A", "B", "C", "D"][correctIndex]
              : question.correct_answer ?? "",
          explanation: question.explanation ?? "",
          difficulty: question.difficulty ?? "medium",
          session_id: question.session_id ?? "",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Questions"
      );

      XLSX.writeFile(workbook, "question-bank.xlsx");

      showMessage(
        `Xuất thành công ${questions.length} câu hỏi.`,
        "success"
      );
    } catch (error) {
      console.error("Lỗi export câu hỏi:", error);

      showMessage(
        "Không thể xuất dữ liệu. Hãy kiểm tra JSON Server tại cổng 3001.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  // IMPORT câu hỏi từ Excel
  async function handleImport(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);
      showMessage("");

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      if (!workbook.SheetNames.length) {
        showMessage("File Excel không có sheet dữ liệu.", "error");
        return;
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      if (!rows.length) {
        showMessage("File Excel chưa có dữ liệu câu hỏi.", "error");
        return;
      }

      const validQuestions = [];
      const invalidRows = [];

      rows.forEach((row, index) => {
        // Chuẩn hóa tên cột, không phân biệt chữ hoa/chữ thường
        const data = {};

        Object.entries(row).forEach(([key, value]) => {
          data[key.trim().toLowerCase()] = value;
        });

        const content = String(data.content ?? "").trim();

        const options = [
          String(data.optiona ?? "").trim(),
          String(data.optionb ?? "").trim(),
          String(data.optionc ?? "").trim(),
          String(data.optiond ?? "").trim(),
        ];

        const correctAnswer = convertAnswer(data.correct_answer);

        if (
          !content ||
          options.some((option) => !option) ||
          correctAnswer < 0
        ) {
          invalidRows.push(index + 2);
          return;
        }

        validQuestions.push({
          content,
          options,
          correct_answer: correctAnswer,
          explanation: String(data.explanation ?? "").trim(),
          difficulty:
            String(data.difficulty ?? "medium").trim() || "medium",
          session_id:
            data.session_id === "" || data.session_id == null
              ? null
              : data.session_id,
        });
      });

      if (validQuestions.length === 0) {
        showMessage(
          `Không có dòng hợp lệ. Kiểm tra các dòng: ${invalidRows.join(", ")}.`,
          "error"
        );
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
          console.error("Lỗi khi thêm câu hỏi:", error);
          failed++;
        }
      }

      let result = `Import thành công ${imported}/${validQuestions.length} câu hỏi.`;

      if (invalidRows.length > 0) {
        result += ` Bỏ qua dòng lỗi: ${invalidRows.join(", ")}.`;
      }

      if (failed > 0) {
        result += ` Có ${failed} câu hỏi chưa thêm được.`;
      }

      showMessage(
        result,
        imported > 0 && failed === 0 && invalidRows.length === 0
          ? "success"
          : "info"
      );
    } catch (error) {
      console.error("Lỗi import câu hỏi:", error);

      showMessage(
        "Không đọc được file. Hãy chọn file Excel .xlsx hoặc .xls hợp lệ.",
        "error"
      );
    } finally {
      setLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // Tải file Excel mẫu
  function handleDownloadTemplate() {
    const sample = [
      {
        content: "React dùng để làm gì?",
        optionA: "Xây dựng giao diện người dùng",
        optionB: "Quản lý cơ sở dữ liệu",
        optionC: "Thiết kế phần cứng",
        optionD: "Tạo hệ điều hành",
        correct_answer: "A",
        explanation:
          "React là thư viện JavaScript để xây dựng giao diện.",
        difficulty: "easy",
        session_id: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sample);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Questions"
    );

    XLSX.writeFile(workbook, "question-template.xlsx");
  }

  // Giao diện trang
  return (
    <div className="qie-page">
      <div className="qie-header">
        <div className="qie-heading-icon">📚</div>

        <div>
          <h1>Import / Export câu hỏi</h1>
          <p>Quản lý câu hỏi nhanh chóng bằng file Excel.</p>
        </div>
      </div>

      <div className="qie-card">
        <h2>Quản lý dữ liệu câu hỏi</h2>

        <p className="qie-card-description">
          Bạn có thể nhập nhiều câu hỏi từ Excel hoặc xuất dữ liệu
          hiện có để lưu trữ, chỉnh sửa.
        </p>

        <div className="qie-actions">
          <button
            type="button"
            className="qie-btn qie-btn-export"
            onClick={handleExport}
            disabled={loading}
          >
            <span>📤</span> Export Excel
          </button>

          <button
            type="button"
            className="qie-btn qie-btn-import"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <span>📥</span> Import Excel
          </button>

          <button
            type="button"
            className="qie-btn qie-btn-template"
            onClick={handleDownloadTemplate}
            disabled={loading}
          >
            <span>📄</span> Tải file mẫu
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            disabled={loading}
            className="qie-hidden-input"
          />
        </div>

        {loading && (
          <p className="qie-loading">
            Đang xử lý dữ liệu, vui lòng chờ...
          </p>
        )}

        {message && (
          <div
            className={`qie-message qie-message-${messageType}`}
            role="status"
          >
            {message}
          </div>
        )}
      </div>

      <div className="qie-card qie-guide">
        <h2>Hướng dẫn sử dụng</h2>

        <div className="qie-guide-item">
          <span className="qie-guide-number">1</span>

          <div>
            <h3>Tải file mẫu</h3>
            <p>
              Tải file Excel mẫu và điền nội dung câu hỏi,
              bốn đáp án cùng đáp án đúng.
            </p>
          </div>
        </div>

        <div className="qie-guide-item">
          <span className="qie-guide-number">2</span>

          <div>
            <h3>Import câu hỏi</h3>
            <p>
              Chọn file Excel đã điền để thêm câu hỏi vào hệ thống.
              Các dòng thiếu nội dung hoặc đáp án đúng sẽ bị bỏ qua.
            </p>
          </div>
        </div>

        <div className="qie-guide-item">
          <span className="qie-guide-number">3</span>

          <div>
            <h3>Export dữ liệu</h3>
            <p>
              Tải danh sách câu hỏi hiện có trong API thành file Excel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionImportExportPage;