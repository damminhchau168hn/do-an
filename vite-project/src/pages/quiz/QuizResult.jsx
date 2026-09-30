import React, { useEffect, useRef, useState } from "react";
import "../../styles/QuizResult.css";

function QuizResult() {
  const dialRef = useRef(null);

  const [result, setResult] = useState({
    correctCount: 0,
    totalQuestions: 10,
    percent: 0,
    answers: {},
  });

  // Danh sách câu hỏi + đáp án đúng
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
      explanation:
        "Stack tuân theo nguyên tắc LIFO (Last In, First Out) — phần tử được thêm vào sau cùng sẽ được lấy ra đầu tiên.",
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
      explanation:
        "Push là thao tác dùng để thêm một phần tử vào đỉnh của Stack.",
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
      explanation:
        "Pop dùng để lấy và xóa phần tử ở trên cùng của Stack.",
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
      explanation:
        "Stack hoạt động theo LIFO nên phần tử được thêm cuối cùng sẽ được lấy ra đầu tiên.",
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
      explanation:
        "Peek cho phép xem phần tử trên cùng của Stack mà không xóa phần tử đó.",
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
      explanation:
        "Stack rỗng khi không chứa bất kỳ phần tử nào.",
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
      explanation:
        "Queue hoạt động theo nguyên tắc FIFO — phần tử vào trước sẽ được lấy ra trước.",
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
      explanation:
        "Enqueue là thao tác thêm một phần tử vào cuối Queue.",
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
      explanation:
        "Stack thường được sử dụng để quản lý các lời gọi hàm trong chương trình.",
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
      explanation:
        "Thực hiện Pop trên Stack rỗng gây ra tình trạng Underflow.",
    },
  ];

  // Lấy kết quả đã lưu
  useEffect(() => {
    const savedResult = localStorage.getItem("quizResult");

    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  const percent = result.percent;

  const size = 140;
  const stroke = size / 9;
  const radius = (size - stroke) / 2;

  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (percent / 100) * circumference;

  // Animation vòng tròn
  useEffect(() => {
    const dial = dialRef.current;

    if (!dial) return;

    const valueCircle =
      dial.querySelector(".dial-value");

    if (!valueCircle) return;

    requestAnimationFrame(() => {
      valueCircle.style.strokeDashoffset = offset;
    });
  }, [offset]);

  return (
    <div className="quiz-result">

      {/* HEADER */}
      <header className="site">
        <div className="nav-row">

          <a href="/" className="logo">
            Skill<span>book</span>
          </a>

          <a
            href="/quiz-list"
            className="course-crumb"
          >
            ← Danh sách quiz
          </a>

          <div className="avatar">
            TL
          </div>

        </div>
      </header>


      {/* RESULT */}
      <div className="result-hero">

        <p className="eyebrow">
          Quiz Chương 1 — Danh sách & Ngăn xếp
        </p>


        {/* VÒNG TRÒN % */}
        <div className="dial-wrap">

          <div
            className="dial"
            ref={dialRef}
            style={{
              width: size,
              height: size,
            }}
          >

            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
            >

              <circle
                className="dial-track"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={stroke}
              />

              <circle
                className="dial-value"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={stroke}
                stroke="var(--teal)"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
              />

            </svg>


            <div className="dial-label">

              <div className="percent">
                <span className="percent-number">
                  {percent}
                </span>

                <span className="percent-symbol">
                  %
                </span>
              </div>

              <span className="dial-sub">
                {result.correctCount}/
                {result.totalQuestions} câu đúng
              </span>

            </div>

          </div>

        </div>


        <h1>
          Gút dóp
        </h1>


        {/* THÔNG TIN */}
        <div className="result-meta">

          <div>
            <b>10:30</b>
            <span>
              Thời gian làm bài
            </span>
          </div>

          <div>
            <b>
              {result.correctCount}/
              {result.totalQuestions}
            </b>

            <span>
              Câu trả lời đúng
            </span>
          </div>

          <div>
            <b>1/1</b>

            <span>
              Lượt đã dùng
            </span>
          </div>

        </div>

      </div>


      {/* XEM LẠI ĐÁP ÁN */}
      <main>

        <div className="wrap">

          <h2 className="section-head">
            Xem lại đáp án
          </h2>


          {questions.map((question) => {

            const userAnswer =
              result.answers?.[`q${question.id}`];

            return (
              <div
                className="q-card"
                key={question.id}
              >

                <div className="q-num">
                  CÂU {question.id} /{" "}
                  {result.totalQuestions}
                </div>

                <div className="q-text">
                  {question.text}
                </div>


                {/* CÁC ĐÁP ÁN */}
                {question.options.map(
                  ([letter, text]) => {

                    const isCorrect =
                      letter ===
                      question.correctAnswer;

                    const isUserAnswer =
                      letter === userAnswer;

                    let className = "opt";

                    // Đáp án đúng
                    if (isCorrect) {
                      className += " correct";
                    }

                    // Người dùng chọn sai
                    if (
                      isUserAnswer &&
                      !isCorrect
                    ) {
                      className += " incorrect";
                    }

                    return (
                      <div
                        className={className}
                        key={letter}
                      >

                        <span className="opt-letter">
                          {letter}
                        </span>

                        <span>
                          {text}
                        </span>

                        {/* Chú thích */}
                        {isCorrect && (
                          <span className="answer-label">
                            ✓ Đáp án đúng
                          </span>
                        )}

                        {isUserAnswer &&
                          !isCorrect && (
                            <span className="answer-label">
                              ✕ Bạn chọn
                            </span>
                          )}
                      </div>
                    );
                  }
                )}


                {/* LỜI GIẢI */}
                <div className="explain">
                  <b>Lời giải:</b>{" "}
                  {question.explanation}
                </div>
              </div>
            );
          })}


          {/* BUTTON */}
          <div className="result-actions">
            <a
              href="/quiz-list"
              className="btn btn-ghost"
            >
              Về danh sách quiz
            </a>
            <a
              href="/quiz-doing"
              className="btn btn-primary"
            >
              Làm lại bài
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuizResult;