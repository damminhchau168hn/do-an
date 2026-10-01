import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/QuizDoing.css";

const API = "http://localhost:3001";
const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* ================= Chuẩn hóa câu hỏi từ API =================
   Nếu tên trường trong db.json của bạn khác, chỉ cần sửa hàm này. */
function normalizeQuestion(q) {
  const rawOptions = q.options ?? q.answers ?? q.choices ?? [];
  return {
    id: q.id,
    text: q.content ?? q.question_text ?? q.question ?? q.text ?? q.title ?? "",
    options: rawOptions.map((o) => {
      const t =
        typeof o === "string" ? o : o.text ?? o.content ?? o.label ?? o.value ?? "";
      return String(t).replace(/^[A-F][.)]\s*/, ""); // bỏ tiền tố "A. " nếu có
    }),
  };
}

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function QuizDoing() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [remaining, setRemaining] = useState(0);

  // Tải quiz + các câu hỏi
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: quizData } = await axios.get(`${API}/quizzes/${quizId}`);
        const list = await Promise.all(
          (quizData.question_ids ?? []).map((id) =>
            axios.get(`${API}/questions/${id}`).then((r) => r.data)
          )
        );
        console.log("Quiz:", quizData, "Câu hỏi:", list);

        if (cancelled) return;
        setQuiz(quizData);
        setQuestions(list.map(normalizeQuestion));
        setRemaining((quizData.time_limit_minutes ?? 15) * 60);
      } catch (err) {
        console.error("Lỗi:", err);
        if (!cancelled) setError("Không thể tải bài quiz");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const limitSeconds = (quiz?.time_limit_minutes ?? 15) * 60;

  const submit = () => {
    const unanswered = questions.length - Object.keys(answers).length;
    if (
      unanswered > 0 &&
      !window.confirm(`Bạn còn ${unanswered} câu chưa trả lời. Vẫn nộp bài?`)
    ) {
      return;
    }
    navigate(`/quiz-result/${quizId}`, {
      state: { answers, elapsed: limitSeconds - remaining },
    });
  };

  // Đếm ngược, hết giờ tự động nộp bài
  useEffect(() => {
    if (loading || error) return;
    if (remaining <= 0) {
      navigate(`/quiz-result/${quizId}`, {
        state: { answers, elapsed: limitSeconds },
      });
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, loading, error, navigate, quizId, answers, limitSeconds]);

  if (loading || error || questions.length === 0) {
    return (
        <div className="qd-page">
          <div className="qd-wrap qd-state">
            {loading
              ? "Đang tải bài quiz..."
              : error || "Bài quiz này chưa có câu hỏi."}
          </div>
        </div>
    );
  }

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const question = questions[current];

  return (
      <div className="qd-page">
        <div className="qd-bar">
          <div className="qd-bar-inner">
            <div>
              <div className="qd-title">{quiz.title}</div>
              <div className="qd-sub">
                Câu {current + 1}/{total} · Đã trả lời {answered}
              </div>
            </div>

            <div className="qd-progress">
              <div
                className="qd-progress-fill"
                style={{ width: `${(answered / total) * 100}%` }}
              />
            </div>

            <div className={`qd-timer${remaining <= 60 ? " urgent" : ""}`}>
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
              <span>{formatTime(remaining)}</span>
            </div>
          </div>
        </div>

        <main className="qd-main">
          <div className="qd-wrap">
            <div className="qd-card">
              <div className="qd-num">
                CÂU {current + 1} / {total} · CHỌN MỘT ĐÁP ÁN
              </div>
              <div className="qd-text">{question.text}</div>

              {question.options.map((opt, idx) => {
                const selected = answers[question.id] === idx;
                return (
                  <label
                    key={idx}
                    className={`qd-opt${selected ? " selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q${question.id}`}
                      checked={selected}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: idx }))
                      }
                    />
                    <span className="qd-opt-letter">{LETTERS[idx]}</span>
                    {opt}
                  </label>
                );
              })}
            </div>

            <div className="qd-nav">
              <button
                className="qd-btn ghost"
                disabled={current === 0}
                onClick={() => setCurrent((c) => c - 1)}
              >
                ← Câu trước
              </button>
              <div className="qd-nav-right">
                <button
                  className="qd-btn ghost"
                  disabled={current === total - 1}
                  onClick={() => setCurrent((c) => c + 1)}
                >
                  Câu tiếp →
                </button>
                <button className="qd-btn primary" onClick={submit}>
                  Nộp bài
                </button>
              </div>
            </div>

            <p className="qd-note">
              Bài làm được lưu tự động mỗi 10 giây. Hết giờ hệ thống sẽ tự động
              nộp bài.
            </p>
          </div>
        </main>
      </div>
  );
}

export default QuizDoing;
