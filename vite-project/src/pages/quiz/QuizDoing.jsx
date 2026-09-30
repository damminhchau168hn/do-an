import React, { useEffect, useState } from "react";
import "../../styles/QuizDoing.css";

function QuizTake() {
  // Đáp án người dùng đã chọn
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // 20 phút
  const [remaining, setRemaining] = useState(20 * 60);

  // Danh sách câu hỏi
  const questions = [
    {
      id: 1,
      text: "Ngăn xếp (Stack) hoạt động theo nguyên tắc nào?",
      options: [
        ["A", "FIFO — vào trước ra trước"],
        ["B", "LIFO — vào sau ra trước"],
        ["C", "Ngẫu nhiên"],
        ["D", "Theo độ ưu tiên"],
      ],
      correctAnswer: "B",
    },

    {
      id: 2,
      text: "Thao tác nào dùng để thêm một phần tử vào Stack?",
      options: [
        ["A", "Push"],
        ["B", "Pop"],
        ["C", "Peek"],
        ["D", "Delete"],
      ],
      correctAnswer: "A",
    },

    {
      id: 3,
      text: "Thao tác nào dùng để lấy phần tử trên cùng của Stack?",
      options: [
        ["A", "Push"],
        ["B", "Peek"],
        ["C", "Pop"],
        ["D", "Insert"],
      ],
      correctAnswer: "C",
    },

    {
      id: 4,
      text: "Phần tử nào được lấy ra đầu tiên trong Stack?",
      options: [
        ["A", "Phần tử đầu tiên được thêm"],
        ["B", "Phần tử ở giữa"],
        ["C", "Phần tử nhỏ nhất"],
        ["D", "Phần tử được thêm cuối cùng"],
      ],
      correctAnswer: "D",
    },

    {
      id: 5,
      text: "Thao tác Peek trong Stack dùng để làm gì?",
      options: [
        ["A", "Xóa toàn bộ Stack"],
        ["B", "Xem phần tử trên cùng nhưng không xóa"],
        ["C", "Thêm phần tử"],
        ["D", "Sắp xếp Stack"],
      ],
      correctAnswer: "B",
    },

    {
      id: 6,
      text: "Khi nào Stack được gọi là rỗng?",
      options: [
        ["A", "Khi không có phần tử nào"],
        ["B", "Khi có một phần tử"],
        ["C", "Khi có nhiều phần tử"],
        ["D", "Khi Stack đầy"],
      ],
      correctAnswer: "A",
    },

    {
      id: 7,
      text: "Hàng đợi (Queue) hoạt động theo nguyên tắc nào?",
      options: [
        ["A", "LIFO"],
        ["B", "FIFO"],
        ["C", "Ngẫu nhiên"],
        ["D", "Theo độ ưu tiên"],
      ],
      correctAnswer: "B",
    },

    {
      id: 8,
      text: "Thao tác thêm phần tử vào Queue được gọi là gì?",
      options: [
        ["A", "Pop"],
        ["B", "Dequeue"],
        ["C", "Enqueue"],
        ["D", "Peek"],
      ],
      correctAnswer: "C",
    },

    {
      id: 9,
      text: "Stack thường được sử dụng để hỗ trợ vấn đề nào?",
      options: [
        ["A", "Quản lý lời gọi hàm"],
        ["B", "Lưu trữ dữ liệu cố định"],
        ["C", "Sắp xếp bảng"],
        ["D", "Kết nối mạng"],
      ],
      correctAnswer: "A",
    },

    {
      id: 10,
      text: "Điều gì xảy ra khi Pop một Stack đang rỗng?",
      options: [
        ["A", "Overflow"],
        ["B", "Underflow"],
        ["C", "Reset"],
        ["D", "Nothing"],
      ],
      correctAnswer: "B",
    },
  ];

  // Đếm số câu đã trả lời
  const answeredCount = Object.keys(selectedAnswers).length;

  // Đồng hồ
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Chọn đáp án
  const handleSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [`q${questionId}`]: answer,
    }));
  };

  // Nộp bài
  const handleSubmit = () => {
    let correctCount = 0;

    questions.forEach((question) => {
      const userAnswer = selectedAnswers[`q${question.id}`];

      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    // Tính phần trăm
    const percent = Math.round(
      (correctCount / questions.length) * 100
    );

    // Lưu kết quả vào localStorage
    const result = {
      correctCount: correctCount,
      totalQuestions: questions.length,
      percent: percent,
      answers: selectedAnswers,
    };

    localStorage.setItem(
      "quizResult",
      JSON.stringify(result)
    );

    // Chuyển sang trang kết quả
    window.location.href = "/quiz-result";
  };

  const minutes = String(
    Math.floor(remaining / 60)
  ).padStart(2, "0");

  const seconds = String(
    remaining % 60
  ).padStart(2, "0");

  const isUrgent = remaining <= 60;

  return (
    <div className="quiz-take">

      {/* Thanh trên cùng */}
      <div className="exam-bar">
        <div className="exam-bar-inner">

          <div>
            <div className="exam-title">
              Quiz Chương 1 — Danh sách & Ngăn xếp
            </div>

            <div className="exam-sub">
              Câu {answeredCount}/{questions.length} · Đã trả lời {answeredCount}
            </div>
          </div>

          {/* Thanh tiến trình */}
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${(answeredCount / questions.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Đồng hồ */}
          <div
            className={`timer ${
              isUrgent ? "urgent" : ""
            }`}
          >

            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>

            <span>
              {minutes}:{seconds}
            </span>

          </div>

        </div>
      </div>

      {/* Nội dung */}
      <main>

        <div className="wrap">

          {questions.map((question) => (

            <div
              className="q-card"
              key={question.id}
            >

              <div className="q-num">
                CÂU {question.id} / {questions.length} · CHỌN MỘT ĐÁP ÁN
              </div>

              <div className="q-text">
                {question.text}
              </div>

              {question.options.map(
                ([letter, text]) => {

                  const selected =
                    selectedAnswers[
                      `q${question.id}`
                    ] === letter;

                  return (
                    <label
                      className={`opt ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      key={letter}
                    >

                      <input
                        type="radio"
                        name={`q${question.id}`}
                        checked={selected}
                        onChange={() =>
                          handleSelect(
                            question.id,
                            letter
                          )
                        }
                      />

                      <span className="opt-letter">
                        {letter}
                      </span>

                      <span>
                        {text}
                      </span>

                    </label>
                  );
                }
              )}

            </div>

          ))}

          {/* Nút điều hướng */}
          <div className="qa-nav">

            <button
              className="btn btn-ghost"
              type="button"
            >
              ← Câu trước
            </button>

            <div className="qa-actions">

              <button
                className="btn btn-ghost"
                type="button"
              >
                Câu tiếp →
              </button>

              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSubmit}
              >
                Nộp bài
              </button>

            </div>

          </div>

          <p className="autosave-note">
            Bài làm được lưu tự động mỗi 10 giây.
            Hết giờ hệ thống sẽ tự động nộp bài.
          </p>

        </div>

      </main>

    </div>
  );
}

export default QuizTake;