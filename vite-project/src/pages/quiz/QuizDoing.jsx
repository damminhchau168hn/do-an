
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API, CURRENT_USER_ID } from "../../api/quizUtils";
import "../../styles/QuizDoing.css";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* Chuẩn hóa câu hỏi */
function normalizeQuestion(q) {
  const rawOptions = q.options ?? q.answers ?? q.choices ?? [];

  return {
    id: q.id,
    text:
      q.content ??
      q.question_text ??
      q.question ??
      q.text ??
      q.title ??
      "",
    options: rawOptions.map((o) => {
      const t =
        typeof o === "string"
          ? o
          : o.text ?? o.content ?? o.label ?? o.value ?? "";

      return String(t).replace(/^[A-F][.)]\s*/, "");
    }),
  };
}

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* Lấy nội dung của một đáp án */
function getOptionText(option) {
  if (typeof option === "string") return option;

  return (
    option?.text ??
    option?.content ??
    option?.label ??
    option?.value ??
    ""
  );
}

/* Kiểm tra đáp án người dùng chọn có đúng không */
function isCorrectAnswer(question, selectedIndex) {
  if (selectedIndex === undefined) return false;

  const options = question.options ?? question.answers ?? question.choices ?? [];
  const correct =
    question.correct_answer ??
    question.correctAnswer ??
    question.answer;

  if (correct === undefined || correct === null) return false;

  // Đáp án đúng là số thứ tự bắt đầu từ 0
  if (typeof correct === "number") {
    return selectedIndex === correct;
  }

  const correctText = String(correct).trim();

  // Đáp án đúng là chữ A, B, C, D...
  const letterIndex = LETTERS.indexOf(correctText.toUpperCase());

  if (letterIndex !== -1) {
    return selectedIndex === letterIndex;
  }

  // Đáp án đúng là nội dung hoặc chỉ số dạng chuỗi
  const selectedText = String(
    getOptionText(options[selectedIndex])
  )
    .replace(/^[A-F][.)]\s*/, "")
    .trim();

  const correctIndex = Number(correctText);

  if (
    correctText !== "" &&
    Number.isInteger(correctIndex) &&
    correctIndex >= 0 &&
    correctIndex < options.length &&
    String(correctIndex) === correctText
  ) {
    // Nếu chuỗi số trùng nội dung đáp án thì ưu tiên so nội dung
    const optionTextAtIndex = String(getOptionText(options[correctIndex]))
      .replace(/^[A-F][.)]\s*/, "")
      .trim();

    if (optionTextAtIndex === correctText) {
      return selectedText === correctText;
    }

    return selectedIndex === correctIndex;
  }

  return selectedText === correctText.replace(/^[A-F][.)]\s*/, "").trim();
}

function QuizDoing() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Tránh lưu trùng một lượt làm
  const submittedRef = useRef(false);

  /* Tải quiz và câu hỏi */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: quizData } = await axios.get(
          `${API}/quizzes/${quizId}`
        );

        const list = await Promise.all(
          (quizData.question_ids ?? []).map((id) =>
            axios
              .get(`${API}/questions/${id}`)
              .then((response) => response.data)
          )
        );

        if (cancelled) return;

        setQuiz(quizData);
        setQuestions(list.map(normalizeQuestion));
        setRemaining((quizData.time_limit_minutes ?? 15) * 60);
      } catch (err) {
        console.error("Lỗi tải quiz:", err);

        if (!cancelled) {
          setError("Không thể tải bài quiz");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const limitSeconds = (quiz?.time_limit_minutes ?? 15) * 60;

  /* Nộp bài, tính điểm và lưu kết quả */
  const submit = async (autoSubmit = false) => {
    if (submittedRef.current || submitting) return;

    const unanswered =
      questions.length - Object.keys(answers).length;

    if (
      !autoSubmit &&
      unanswered > 0 &&
      !window.confirm(
        `Bạn còn ${unanswered} câu chưa trả lời. Vẫn nộp bài?`
      )
    ) {
      return;
    }

    submittedRef.current = true;
    setSubmitting(true);

    try {
      // Lấy dữ liệu câu hỏi gốc, bao gồm đáp án đúng
      const questionData = await Promise.all(
        questions.map((q) =>
          axios
            .get(`${API}/questions/${q.id}`)
            .then((response) => response.data)
        )
      );

      let correctCount = 0;

      questionData.forEach((question) => {
        const selectedIndex = answers[question.id];

        if (isCorrectAnswer(question, selectedIndex)) {
          correctCount++;
        }
      });

      const total = questionData.length;
      const score =
        total > 0
          ? Number(((correctCount / total) * 10).toFixed(2))
          : 0;

      const elapsed = autoSubmit
        ? limitSeconds
        : Math.max(0, limitSeconds - remaining);

      // Lưu lượt làm vào db.json qua JSON Server
      const { data: attempt } = await axios.post(
        `${API}/attempts`,
        {
          quiz_id: quizId,
          user_id: CURRENT_USER_ID,
          score,
          correct_count: correctCount,
          total_questions: total,
          answers,
          elapsed,
          status: "completed",
          submitted_at: new Date().toISOString(),
        }
      );

      // Chuyển sang trang kết quả sau khi lưu thành công
      navigate(`/quiz-result/${quizId}`, {
        state: {
          answers,
          elapsed,
          score,
          correctCount,
          total,
          attemptId: attempt.id,
        },
      });
    } catch (err) {
      console.error("Lỗi khi nộp bài:", err);

      submittedRef.current = false;
      setSubmitting(false);

      window.alert(
        "Không thể lưu kết quả. Hãy kiểm tra JSON Server và cấu trúc đáp án trong db.json."
      );
    }
  };

  /* Đếm ngược và tự động nộp khi hết giờ */
  useEffect(() => {
    if (loading || error || questions.length === 0 || submitting) {
      return;
    }

    if (remaining <= 0) {
      submit(true);
      return;
    }

    const id = setTimeout(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);

    return () => clearTimeout(id);
  }, [remaining, loading, error, questions.length, submitting]);

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
                    disabled={submitting}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: idx,
                      }))
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
              disabled={current === 0 || submitting}
              onClick={() => setCurrent((c) => c - 1)}
            >
              ← Câu trước
            </button>

            <div className="qd-nav-right">
              <button
                className="qd-btn ghost"
                disabled={current === total - 1 || submitting}
                onClick={() => setCurrent((c) => c + 1)}
              >
                Câu tiếp →
              </button>

              <button
                className="qd-btn primary"
                disabled={submitting}
                onClick={() => submit(false)}
              >
                {submitting ? "Đang lưu..." : "Nộp bài"}
              </button>
            </div>
          </div>

          <p className="qd-note">
            Kết quả được lưu khi bạn nộp bài. Hết giờ hệ thống sẽ tự động nộp bài.
          </p>
        </div>
      </main>
    </div>
  );
}

export default QuizDoing;