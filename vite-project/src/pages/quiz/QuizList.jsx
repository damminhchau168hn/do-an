
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

/* Vòng tròn kết quả */
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

/* Sắp xếp quiz theo chương */
const byChapter = (a, b) =>
  String(a.session_id).localeCompare(
    String(b.session_id),
    undefined,
    { numeric: true }
  );

/* Tính trạng thái quiz */

function buildRows(quizzes, attempts) {
  const stats = {};

  // Chỉ tính lượt làm đã nộp
  const submittedAttempts = attempts.filter((a) => {
    return (
      ["submitted", "completed", "finished"].includes(
        String(a.status || "").toLowerCase()
      ) &&
      a.submitted_at
    );
  });

  submittedAttempts.forEach((a) => {
    const id = String(a.quiz_id);

    const s = stats[id] ?? (stats[id] = {
      count: 0,
      best: 0,
    });

    s.count += 1;
    s.best = Math.max(s.best, Number(a.score) || 0);
  });

  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const orderA = Number(String(a.session_id).replace("s", ""));
    const orderB = Number(String(b.session_id).replace("s", ""));
    return orderA - orderB;
  });

  let previousPassed = true;
  let previousTitle = "";

  return sortedQuizzes.map((quiz) => {
    const s = stats[String(quiz.id)];
    const published = quiz.status === "published";

    const passed =
      !!s && s.count > 0 &&
      s.best >= Number(quiz.pass_score ?? 5);

    // Quiz đầu tiên được mở nếu đã xuất bản.
    // Quiz tiếp theo chỉ mở khi quiz trước đạt điểm yêu cầu.
    const unlocked = published && previousPassed;

    let state;

    if (!unlocked) {
      state = "locked";
    } else if (s && s.count > 0) {
      state = passed ? "done" : "failed";
    } else {
      state = "ready";
    }

    const row = {
      quiz,
      state,
      stats: s,
      passed,
      published,
      prevTitle: previousTitle,
    };

    previousPassed = passed;
    previousTitle = quiz.title;

    return row;
  });
}

/* Nội dung từng quiz */
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
      meta: `${base} · Đã nộp ${stats.count} lượt`,
      badge: `Đã hoàn thành · ${stats.best}/10`,
      badgeClass: "teal",
    };
  }

  if (state === "failed") {
    return {
      meta: `${base} · Đã nộp ${stats.count} lượt`,
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

/* Nút thao tác */
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

/* Component chính */
function QuizList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      axios.get(`${API}/quizzes`),
      axios.get(`${API}/attempts`, {
        params: { user_id: CURRENT_USER_ID },
      }),
    ])
      .then(([quizRes, attemptRes]) => {
        if (!cancelled) {
          setRows(buildRows(quizRes.data, attemptRes.data));
        }
      })
      .catch((err) => {
        console.error("Lỗi tải quiz:", err);
        if (!cancelled) {
          setError("Không thể tải danh sách Quiz");
        }
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
        <p className="quiz-eyebrow">
          Cấu trúc dữ liệu &amp; Giải thuật
        </p>

        <h1 className="quiz-heading">Các bài quiz</h1>

        <p className="quiz-lede">
          Hoàn thành quiz của chương trước với số điểm đạt để mở khóa
          quiz của chương tiếp theo. Mỗi quiz được tính giờ, lời giải
          hiển thị sau khi nộp bài.
        </p>

        {loading && (
          <div className="quiz-state">Đang tải danh sách Quiz...</div>
        )}

        {error && (
          <div className="quiz-state error">{error}</div>
        )}

        {!loading && !error && (
          <div className="quiz-list">
            {rows.length === 0 && (
              <div className="quiz-state">Chưa có quiz nào.</div>
            )}

            {rows.map((row) => {
              const { quiz, state, stats } = row;
              const { meta, badge, badgeClass } = rowTexts(row);

              const showResult =
                (state === "done" || state === "failed") &&
                !!stats &&
                stats.count > 0;

              return (
                <div
                  key={quiz.id}
                  className={`quiz-row${
                    state === "locked" ? " locked" : ""
                  }`}
                >
                  {showResult ? (
                    <Dial
                      percent={Math.round(stats.best * 10)}
                      color={COLORS[state]}
                    />
                  ) : (
                    <div className="quiz-placeholder">?</div>
                  )}

                  <div>
                    <div className="quiz-title">{quiz.title}</div>
                    <div className="quiz-meta">{meta}</div>
                  </div>

                  <span className={`quiz-badge ${badgeClass}`}>
                    {badge}
                  </span>

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