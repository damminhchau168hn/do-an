
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../styles/QuizResult.css";

const API = "http://localhost:3001";
const CURRENT_USER_ID = "u1";
const LETTERS = ["A", "B", "C", "D", "E", "F"];
const TEAL = "#1f7a6c";
const CLAY = "#b84b2a";

function optionText(o) {
  const t =
    typeof o === "string"
      ? o
      : o?.text ?? o?.content ?? o?.label ?? o?.value ?? "";

  return String(t).replace(/^[A-F][.)]\s*/, "");
}

function normalizeQuestion(q) {
  const raw = q.options ?? q.answers ?? q.choices ?? [];
  const options = raw.map(optionText);

  let correctIndex = raw.findIndex(
    (o) =>
      typeof o === "object" &&
      (o.is_correct || o.isCorrect || o.correct)
  );

  if (correctIndex < 0) {
    const value =
      q.correct_answer ??
      q.correct_option ??
      q.correct_index ??
      q.correctAnswer ??
      q.answer ??
      q.correct;

    if (typeof value === "number") {
      correctIndex = value;
    } else if (typeof value === "string") {
      const s = value.trim();

      if (/^[A-F]$/i.test(s)) {
        correctIndex = LETTERS.indexOf(s.toUpperCase());
      } else {
        const target = s
          .replace(/^[A-F][.)]\s*/, "")
          .toLowerCase();

        correctIndex = options.findIndex(
          (t) => t.trim().toLowerCase() === target
        );
      }
    }
  }

  return {
    id: q.id,
    text:
      q.content ??
      q.question_text ??
      q.question ??
      q.text ??
      q.title ??
      "",
    options,
    correctIndex,
    explain: q.explanation ?? q.solution ?? q.explain ?? "",
  };
}

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function Dial({ percent, color, sub, size = 140 }) {
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
    <div className="qr-dial" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="qr-dial-track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
        />
        <circle
          className="qr-dial-value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="qr-dial-label" style={{ color }}>
        <span>
          {Math.round(percent)}
          <small>%</small>
        </span>
        {sub && <span className="qr-dial-sub">{sub}</span>}
      </div>
    </div>
  );
}

function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();

  // Nếu vừa nộp bài, nhận dữ liệu được truyền từ QuizDoing
  const submitted = location.state;

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState(submitted?.answers ?? {});
  const [elapsed, setElapsed] = useState(submitted?.elapsed ?? null);
  const [savedScore, setSavedScore] = useState(
    submitted?.score ?? null
  );
  const [savedCorrect, setSavedCorrect] = useState(
    submitted?.correctCount ?? null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: quizData } = await axios.get(
          `${API}/quizzes/${quizId}`
        );

        const [questionList, attemptRes] = await Promise.all([
          Promise.all(
            (quizData.question_ids ?? []).map((id) =>
              axios
                .get(`${API}/questions/${id}`)
                .then((res) => res.data)
            )
          ),
          axios.get(`${API}/attempts`, {
            params: {
              quiz_id: quizId,
              user_id: CURRENT_USER_ID,
            },
          }),
        ]);

        if (cancelled) return;

        setQuiz(quizData);
        setQuestions(questionList.map(normalizeQuestion));

        // Ưu tiên kết quả vừa nộp. Nếu mở lại từ danh sách,
        // lấy lượt làm đã lưu gần nhất.
        if (!submitted) {
          const attempts = attemptRes.data ?? [];

          const latest = [...attempts].sort((a, b) => {
            const dateA = new Date(
              a.submitted_at ?? a.created_at ?? 0
            ).getTime();
            const dateB = new Date(
              b.submitted_at ?? b.created_at ?? 0
            ).getTime();

            return dateB - dateA;
          })[0];

          if (latest) {
            setAttempt(latest);
            setAnswers(latest.answers ?? {});
            setElapsed(latest.elapsed ?? null);
            setSavedScore(latest.score ?? null);
            setSavedCorrect(latest.correct_count ?? null);
          }
        }
      } catch (err) {
        console.error("Lỗi tải kết quả:", err);

        if (!cancelled) {
          setError("Không thể tải kết quả. Hãy kiểm tra JSON Server.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  if (loading) {
    return (
      <div className="qr-page">
        <div className="qr-wrap qr-state">Đang tải kết quả...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="qr-page">
        <div className="qr-wrap qr-state">
          {error || "Không tìm thấy bài quiz."}
          <div className="qr-actions">
            <Link to="/quiz-list" className="qr-btn primary">
              Về danh sách quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!submitted && !attempt) {
    return (
      <div className="qr-page">
        <div className="qr-wrap qr-state">
          Chưa có bài làm nào được lưu cho quiz này.
          <div className="qr-actions">
            <Link to={`/quiz-doing/${quizId}`} className="qr-btn primary">
              Bắt đầu làm bài
            </Link>
            <Link to="/quiz-list" className="qr-btn ghost">
              Về danh sách quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = questions.length;

  const correct = questions.filter(
    (q) =>
      q.correctIndex >= 0 &&
      Number(answers[q.id]) === q.correctIndex
  ).length;

  const ungraded = questions.filter(
    (q) => q.correctIndex < 0
  ).length;

  const percent = total ? (correct / total) * 100 : 0;

  const score10 =
    savedScore !== null
      ? Number(savedScore)
      : total
        ? Math.round((correct / total) * 100) / 10
        : 0;

  const correctToShow =
    savedCorrect !== null ? Number(savedCorrect) : correct;

  const passScore = Number(quiz.pass_score ?? 0);
  const passed = score10 >= passScore;
  const color = passed ? TEAL : CLAY;

  return (
    <div className="qr-page">
      <div className="qr-hero">
        <p className="qr-eyebrow">{quiz.title}</p>

        <div className="qr-dial-wrap">
          <Dial
            percent={total ? (correctToShow / total) * 100 : 0}
            color={color}
            sub={`${correctToShow}/${total} câu đúng`}
          />
        </div>

        <h1 className="qr-title">
          {passed
            ? "Chúc mừng, bạn đã đạt!"
            : "Chưa đạt, hãy thử lại nhé!"}
        </h1>

        <div className="qr-meta">
          <div>
            <b>
              {elapsed != null ? formatTime(Number(elapsed)) : "--:--"}
            </b>
            <span>Thời gian làm bài</span>
          </div>

          <div>
            <b>
              {correctToShow}/{total}
            </b>
            <span>Câu trả lời đúng</span>
          </div>

          <div>
            <b>{score10}/10</b>
            <span>Điểm (cần {passScore} để đạt)</span>
          </div>
        </div>

        {ungraded > 0 && (
          <p className="qr-warn">
            Chưa xác định được đáp án đúng của {ungraded} câu.
            Hãy kiểm tra trường đáp án trong db.json.
          </p>
        )}
      </div>

      <main>
        <div className="qr-wrap">
          <h2 className="qr-section-title">Xem lại đáp án</h2>

          {questions.map((q, i) => {
            const picked = answers[q.id] === undefined
              ? undefined
              : Number(answers[q.id]);

            return (
              <div className="qr-card" key={q.id}>
                <div className="qr-num">
                  CÂU {i + 1} / {total}
                </div>

                <div className="qr-text">{q.text}</div>

                {q.options.map((opt, idx) => {
                  const isCorrect = idx === q.correctIndex;
                  const isWrongPick =
                    idx === picked && !isCorrect;

                  const cls = isCorrect
                    ? " correct"
                    : isWrongPick
                      ? " incorrect"
                      : "";

                  return (
                    <div key={idx} className={`qr-opt${cls}`}>
                      <span className="qr-opt-letter">
                        {LETTERS[idx]}
                      </span>
                      {opt}
                      {idx === picked && isCorrect && " — đáp án của bạn"}
                      {isWrongPick && " — bạn đã chọn"}
                    </div>
                  );
                })}

                {picked === undefined && (
                  <div className="qr-skip">
                    Bạn chưa trả lời câu này.
                  </div>
                )}

                {q.explain && (
                  <div className="qr-explain">
                    <b>Lời giải:</b> {q.explain}
                  </div>
                )}
              </div>
            );
          })}

          <div className="qr-actions">
            <Link to="/quiz-list" className="qr-btn ghost">
              Về danh sách quiz
            </Link>
            <Link to="/" className="qr-btn primary">
              Tiếp tục khóa học
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuizResult;