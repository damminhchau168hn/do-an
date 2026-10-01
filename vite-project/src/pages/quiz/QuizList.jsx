import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/QuizList.css";

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

/* ================= Component chính ================= */
function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/quizzes")
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setError("Không thể tải danh sách Quiz");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="quiz-page">
      <div className="quiz-wrap">
        <p className="quiz-eyebrow">Cấu trúc dữ liệu &amp; Giải thuật</p>
        <h1 className="quiz-heading">Các bài quiz</h1>
        <p className="quiz-lede">
          Mỗi quiz được tính giờ ở máy chủ. Đáp án chỉ hiển thị lời giải sau khi
          nộp bài, theo cấu hình của giảng viên.
        </p>

        {loading && <div className="quiz-state">Đang tải danh sách Quiz...</div>}
        {error && <div className="quiz-state error">{error}</div>}

        {!loading && !error && (
          <div className="quiz-list">
            {quizzes.length === 0 && (
              <div className="quiz-state">Chưa có quiz nào.</div>
            )}

            {quizzes.map((quiz) => {
              const isOpen = quiz.status === "published";
              const questionCount = quiz.question_ids?.length ?? 0;

              return (
                <div
                  key={quiz.id}
                  className={`quiz-row${isOpen ? "" : " locked"}`}
                >
                  <Dial
                    percent={0}
                    color={isOpen ? "#f2a93b" : "#5b6472"}
                  />

                  <div>
                    <div className="quiz-title">{quiz.title}</div>
                    <div className="quiz-meta">
                      {questionCount} câu · {quiz.time_limit_minutes} phút ·
                      Điểm đạt {quiz.pass_score}
                    </div>
                  </div>

                  <span className={`quiz-badge ${isOpen ? "amber" : "ink"}`}>
                    {isOpen ? "Sẵn sàng làm bài" : "Chưa mở"}
                  </span>

                  {isOpen ? (
                    <Link
                      to={`/quiz-doing/${quiz.id}`}
                      className="quiz-btn primary"
                    >
                      Bắt đầu làm bài
                    </Link>
                  ) : (
                    <button className="quiz-btn ghost" disabled>
                      Chưa mở
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizList;
