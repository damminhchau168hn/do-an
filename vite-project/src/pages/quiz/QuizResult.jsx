import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../styles/QuizResult.css";

const API = "http://localhost:3001";
const LETTERS = ["A", "B", "C", "D", "E", "F"];
const TEAL = "#1f7a6c";
const CLAY = "#b84b2a";

/* ================= Chuẩn hóa câu hỏi từ API =================
   Nếu tên trường trong db.json của bạn khác, chỉ cần sửa hàm này. */
function optionText(o) {
  const t = typeof o === "string" ? o : o.text ?? o.content ?? o.label ?? o.value ?? "";
  return String(t).replace(/^[A-F][.)]\s*/, "");
}

function normalizeQuestion(q) {
  const raw = q.options ?? q.answers ?? q.choices ?? [];
  const options = raw.map(optionText);

  // 1) đáp án có cờ is_correct / correct
  let correctIndex = raw.findIndex(
    (o) => typeof o === "object" && (o.is_correct || o.isCorrect || o.correct)
  );

  // 2) trường đáp án đúng ở cấp câu hỏi: số (bắt đầu từ 0), chữ "A", hoặc nội dung đáp án
  if (correctIndex < 0) {
    const v =
      q.correct_answer ??
      q.correct_option ??
      q.correct_index ??
      q.correctAnswer ??
      q.answer ??
      q.correct;
    if (typeof v === "number") {
      correctIndex = v;
    } else if (typeof v === "string") {
      const s = v.trim();
      if (/^[A-F]$/i.test(s)) {
        correctIndex = LETTERS.indexOf(s.toUpperCase());
      } else {
        const target = s.replace(/^[A-F][.)]\s*/, "").toLowerCase();
        correctIndex = options.findIndex((t) => t.trim().toLowerCase() === target);
      }
    }
  }

  return {
    id: q.id,
    text: q.content ?? q.question_text ?? q.question ?? q.text ?? q.title ?? "",
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

/* ================= Vòng tròn điểm ================= */
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

/* ================= Trang kết quả ================= */
function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();
  const submitted = location.state; // { answers, elapsed } do QuizDoing truyền sang
  const answers = submitted?.answers ?? {};

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.log("Kết quả — câu hỏi:", list, "Đáp án đã chọn:", answers);

        if (cancelled) return;
        setQuiz(quizData);
        setQuestions(list.map(normalizeQuestion));
      } catch (err) {
        console.error("Lỗi:", err);
        if (!cancelled) setError("Không thể tải kết quả");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  if (loading || error || !quiz) {
    return (
        <div className="qr-page">
          <div className="qr-wrap qr-state">
            {loading ? "Đang tải kết quả..." : error || "Không tìm thấy bài quiz."}
          </div>
        </div>
    );
  }

  if (!submitted) {
    return (
        <div className="qr-page">
          <div className="qr-wrap qr-state">
            Chưa có bài làm nào để hiển thị.
            <div className="qr-actions">
              <Link to="/quiz-list" className="qr-btn primary">
                Về danh sách quiz
              </Link>
            </div>
          </div>
        </div>
    );
  }

  /* ----- Chấm điểm ----- */
  const total = questions.length;
  const correct = questions.filter(
    (q) => q.correctIndex >= 0 && answers[q.id] === q.correctIndex
  ).length;
  const ungraded = questions.filter((q) => q.correctIndex < 0).length;
  const percent = total ? (correct / total) * 100 : 0;
  const score10 = total ? Math.round((correct / total) * 100) / 10 : 0; // thang 10
  const passScore = Number(quiz.pass_score ?? 0);
  const passed = score10 >= passScore;
  const color = passed ? TEAL : CLAY;

  return (
      <div className="qr-page">
        <div className="qr-hero">
          <p className="qr-eyebrow">{quiz.title}</p>

          <div className="qr-dial-wrap">
            <Dial percent={percent} color={color} sub={`${correct}/${total} câu đúng`} />
          </div>

          <h1 className="qr-title">
            {passed ? "Chúc mừng, bạn đã đạt!" : "Chưa đạt, hãy thử lại nhé!"}
          </h1>

          <div className="qr-meta">
            <div>
              <b>{submitted.elapsed != null ? formatTime(submitted.elapsed) : "--:--"}</b>
              <span>Thời gian làm bài</span>
            </div>
            <div>
              <b>
                {correct}/{total}
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
              Chưa xác định được đáp án đúng của {ungraded} câu (kiểm tra tên
              trường đáp án trong db.json).
            </p>
          )}
        </div>

        <main>
          <div className="qr-wrap">
            <h2 className="qr-section-title">Xem lại đáp án</h2>

            {questions.map((q, i) => {
              const picked = answers[q.id];
              return (
                <div className="qr-card" key={q.id}>
                  <div className="qr-num">
                    CÂU {i + 1} / {total}
                  </div>
                  <div className="qr-text">{q.text}</div>

                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.correctIndex;
                    const isWrongPick = idx === picked && !isCorrect;
                    const cls = isCorrect ? " correct" : isWrongPick ? " incorrect" : "";
                    return (
                      <div key={idx} className={`qr-opt${cls}`}>
                        <span className="qr-opt-letter">{LETTERS[idx]}</span>
                        {opt}
                        {isWrongPick && " — bạn đã chọn"}
                      </div>
                    );
                  })}

                  {picked === undefined && (
                    <div className="qr-skip">Bạn chưa trả lời câu này.</div>
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
