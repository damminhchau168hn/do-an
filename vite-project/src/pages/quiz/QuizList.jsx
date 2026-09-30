import { useEffect, useState } from "react";
import "../../styles/QuizList.css";

const quizzes = [
  {
    id: 1,
    title: "Quiz Chương 1 — Danh sách & Ngăn xếp",
    questions: 10,
    time: 15,
    note: "Đã làm 1/1 lượt",
    progress: 100,
    state: "done", // done | ready | locked
    badge: "Đã hoàn thành · 9/10",
    href: "/quiz-result",
  },
  {
    id: 2,
    title: "Quiz Chương 2 — Cây & BST",
    questions: 12,
    time: 20,
    note: "Mở đến 28/08/2026",
    progress: 0,
    state: "ready",
    badge: "Sẵn sàng làm bài",
    href: "/quiz-take",
  },
  {
    id: 3,
    title: "Quiz Chương 3 — Đồ thị",
    questions: 15,
    time: 25,
    note: "Mở từ 02/09/2026",
    progress: 0,
    state: "locked",
    badge: "Chưa mở",
  },
  {
    id: 4,
    title: "Quiz Chương 4 — Quy hoạch động",
    questions: 10,
    time: 15,
    note: "Mở từ 09/09/2026",
    progress: 0,
    state: "locked",
    badge: "Chưa mở",
  },
];

const DIAL_COLOR = {
  done: "#1f7a6c",
  ready: "#f2a93b",
  locked: "#5b6472",
};
const BADGE_CLASS = { done: "teal", ready: "amber", locked: "ink" };

/* ================= Vòng tròn tiến độ ================= */
function Dial({ percent, color, size = 52 }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const stroke = size / 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = ready ? c - (percent / 100) * c : c;

  return (
    <div className="dial" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="dial-track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
        />
        <circle
          className="dial-value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="dial-label" style={{ color }}>
        {Math.round(percent)}%
      </div>
    </div>
  );
}

/* ================= Nút hành động ================= */
function QuizAction({ quiz }) {
  if (quiz.state === "locked") {
    return (
      <button className="quiz-btn ghost" disabled>
        Chưa mở
      </button>
    );
  }
  if (quiz.state === "done") {
    return (
      <a href={quiz.href} className="quiz-btn ghost">
        Xem kết quả
      </a>
    );
  }
  return (
    <a href={quiz.href} className="quiz-btn primary">
      Bắt đầu làm bài
    </a>
  );
}

/* ================= Component chính ================= */
function QuizList() {
  return (
    <div className="quiz-page">
      <div className="quiz-wrap">
        <p className="quiz-eyebrow">Cấu trúc dữ liệu &amp; Giải thuật</p>
        <h1 className="quiz-heading">Các bài quiz</h1>
        <p className="quiz-lede">
          Mỗi quiz được tính giờ ở máy chủ. Đáp án chỉ hiển thị lời giải sau khi
          nộp bài, theo cấu hình của giảng viên.
        </p>

        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`quiz-row${quiz.state === "locked" ? " locked" : ""}`}
            >
              <Dial percent={quiz.progress} color={DIAL_COLOR[quiz.state]} />

              <div>
                <div className="quiz-title">{quiz.title}</div>
                <div className="quiz-meta">
                  {quiz.questions} câu · {quiz.time} phút · {quiz.note}
                </div>
              </div>

              <span className={`quiz-badge ${BADGE_CLASS[quiz.state]}`}>
                {quiz.badge}
              </span>

              <QuizAction quiz={quiz} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizList;
