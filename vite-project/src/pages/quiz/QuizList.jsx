import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API, CURRENT_USER_ID } from "../../api/quizUtils";
import "../../styles/QuizList.css";

const COLORS = {
  locked: "#9ca3af",
  done: "#14b8a6",
  failed: "#f59e0b",
  ready: "#f59e0b",
};

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

/* ================= Tính trạng thái từng quiz =================
   Quy tắc: quiz đầu luôn mở; quiz chương sau chỉ mở khi quiz chương trước
   đã có lượt làm đạt điểm (điểm cao nhất >= pass_score). */
const byChapter = (a, b) =>
  String(a.session_id).localeCompare(String(b.session_id), undefined, { numeric: true });

function buildRows(quizzes, attempts) {
  const stats = {};
  attempts.forEach((a) => {
    const s = stats[a.quiz_id] ?? (stats[a.quiz_id] = { count: 0, best: 0 });
    s.count += 1;
    s.best = Math.max(s.best, Number(a.score) || 0);
  });

  let prev = null;
  return [...quizzes].sort(byChapter).map((quiz) => {
    const s = stats[quiz.id];
    const passed = !!s && s.best >= Number(quiz.pass_score ?? 0);
    const published = quiz.status === "published";
    const prevPassed = prev ? prev.passed : true;

    let state;
    if (!published || !prevPassed) state = "locked";
    else if (passed) state = "done";
    else if (s) state = "failed";
    else state = "ready";

    const row = { quiz, state, stats: s, passed, published, prevTitle: prev?.quiz.title };
    prev = row;
    return row;
  });
}

function rowTexts(row) {
  const { quiz, state, stats, published, prevTitle } = row;
  const n = quiz.question_ids?.length ?? 0;
  const base = `${n} câu · ${quiz.time_limit_minutes} phút`;

  if (state === "locked") {
    return {
      meta: published
        ? `${base} · Cần đạt "${prevTitle}" để mở khóa`
        : `${base} · Chưa mở`,
      badge: "Chưa mở",
      badgeClass: "ink",
    };
  }
  if (state === "done") {
    return {
      meta: `${base} · Đã làm ${stats.count} lượt`,
      badge: `Đã hoàn thành · ${stats.best}/10`,
      badgeClass: "teal",
    };
  }
  if (state === "failed") {
    return {
      meta: `${base} · Đã làm ${stats.count} lượt · Cần ${quiz.pass_score}/10 để đạt`,
      badge: `Chưa đạt · ${stats.best}/10`,
      badgeClass: "amber",
    };
  }
  return {
    meta: `${base} · Điểm đạt ${quiz.pass_score}/10`,
    badge: "Sẵn sàng làm bài",
    badgeClass: "amber",
  };
}

function QuizAction({ row }) {
  const { quiz, state } = row;
  if (state === "locked") {
    return (
      <button className="quiz-btn ghost" disabled>
        Chưa mở
      </button>
    );
  }
  if (state === "done") {
    return (
      <Link to={`/quiz-result/${quiz.id}`} className="quiz-btn ghost">
        Xem kết quả
      </Link>
    );
  }
  return (
    <Link to={`/quiz-doing/${quiz.id}`} className="quiz-btn primary">
      {state === "failed" ? "Làm lại" : "Bắt đầu làm bài"}
    </Link>
  );
}

/* ================= Component chính ================= */
function QuizList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      axios.get(`${API}/quizzes`),
      axios.get(`${API}/attempts`, { params: { user_id: CURRENT_USER_ID } }),
    ])
      .then(([quizRes, attemptRes]) => {
        if (!cancelled) setRows(buildRows(quizRes.data, attemptRes.data));
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        if (!cancelled) setError("Không thể tải danh sách Quiz");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
      <div className="quiz-page">
        <div className="quiz-wrap">
          <p className="quiz-eyebrow">Cấu trúc dữ liệu &amp; Giải thuật</p>
          <h1 className="quiz-heading">Các bài quiz</h1>
          <p className="quiz-lede">
            Hoàn thành quiz của chương trước với số điểm đạt để mở khóa quiz của
            chương tiếp theo. Mỗi quiz được tính giờ, lời giải hiển thị sau khi nộp bài.
          </p>

          {loading && <div className="quiz-state">Đang tải danh sách Quiz...</div>}
          {error && <div className="quiz-state error">{error}</div>}

          {!loading && !error && (
            <div className="quiz-list">
              {rows.length === 0 && <div className="quiz-state">Chưa có quiz nào.</div>}

              {rows.map((row) => {
                const { quiz, state, stats } = row;
                const { meta, badge, badgeClass } = rowTexts(row);
                const percent = stats ? Math.round(stats.best * 10) : 0;

                return (
                  <div
                    key={quiz.id}
                    className={`quiz-row${state === "locked" ? " locked" : ""}`}
                  >
                    <Dial percent={percent} color={COLORS[state]} />

                    <div>
                      <div className="quiz-title">{quiz.title}</div>
                      <div className="quiz-meta">{meta}</div>
                    </div>

                    <span className={`quiz-badge ${badgeClass}`}>{badge}</span>

                    <QuizAction row={row} />
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
