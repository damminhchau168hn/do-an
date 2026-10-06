import axios from "axios";

export const API = "http://localhost:3001";
// Tạm thời dùng sinh viên u1 (Trần Lan). Khi có đăng nhập thì lấy id từ tài khoản.
export const CURRENT_USER_ID = "u1";
export const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* ================= Chuẩn hóa câu hỏi từ API =================
   Nếu tên trường trong db.json khác, chỉ cần sửa hàm này. */
function optionText(o) {
  const t = typeof o === "string" ? o : o.text ?? o.content ?? o.label ?? o.value ?? "";
  return String(t).replace(/^[A-F][.)]\s*/, "");
}

export function normalizeQuestion(q) {
  const raw = q.options ?? q.answers ?? q.choices ?? [];
  const options = raw.map(optionText);

  // correct_answer là số (bắt đầu từ 0), chữ "A", hoặc nội dung đáp án.
  // Câu chọn nhiều đáp án (mảng) chưa được hỗ trợ chấm điểm -> correctIndex = -1
  let correctIndex = -1;
  const v =
    q.correct_answer ?? q.correct_option ?? q.correct_index ?? q.correctAnswer ?? q.answer ?? q.correct;
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

  return {
    id: q.id,
    text: q.content ?? q.question_text ?? q.question ?? q.text ?? q.title ?? "",
    options,
    correctIndex,
    explain: q.explanation ?? q.solution ?? q.explain ?? "",
  };
}

/* ================= Tải dữ liệu ================= */
export async function fetchQuizWithQuestions(quizId) {
  const { data: quiz } = await axios.get(`${API}/quizzes/${quizId}`);
  const list = await Promise.all(
    (quiz.question_ids ?? []).map((id) =>
      axios.get(`${API}/questions/${id}`).then((r) => r.data)
    )
  );
  return { quiz, questions: list.map(normalizeQuestion) };
}

export async function fetchUserAttempts(userId = CURRENT_USER_ID) {
  const { data } = await axios.get(`${API}/attempts`, { params: { user_id: userId } });
  return data;
}

export async function fetchLatestAttempt(quizId, userId = CURRENT_USER_ID) {
  const { data } = await axios.get(`${API}/attempts`, {
    params: { quiz_id: quizId, user_id: userId },
  });
  if (!data.length) return null;
  return [...data].sort((a, b) =>
    String(b.submitted_at).localeCompare(String(a.submitted_at))
  )[0];
}

// Trả về { [questionId]: chỉ số đáp án đã chọn }
export async function fetchAttemptAnswers(attemptId) {
  const { data } = await axios.get(`${API}/answers`, { params: { attempt_id: attemptId } });
  const map = {};
  data.forEach((a) => {
    map[a.question_id] = a.selected_option;
  });
  return map;
}

/* ================= Chấm điểm =================
   Chỉ tính các câu xác định được đáp án đúng (câu chọn nhiều đáp án tạm thời bỏ qua).
   Điểm theo thang 10, làm tròn 1 chữ số thập phân. */
export function gradeAnswers(questions, answers) {
  const gradable = questions.filter((q) => q.correctIndex >= 0);
  const correct = gradable.filter((q) => answers[q.id] === q.correctIndex).length;
  const total = gradable.length;
  const score10 = total ? Math.round((correct / total) * 100) / 10 : 0;
  return { correct, total, score10, ungraded: questions.length - total };
}

/* ================= Lưu bài làm ================= */
export async function submitAttempt({ quiz, questions, answers, durationSeconds, startedAt }) {
  const { correct, total, score10 } = gradeAnswers(questions, answers);
  const stamp = Date.now();
  const attemptId = `a${stamp}`;
  const now = new Date().toISOString();

  // Tìm enrollment của sinh viên trong khóa học chứa quiz này (không bắt buộc)
  let enrollmentId = null;
  try {
    const { data: session } = await axios.get(`${API}/sessions/${quiz.session_id}`);
    const { data: enrolls } = await axios.get(`${API}/enrollments`, {
      params: { user_id: CURRENT_USER_ID, course_id: session.course_id },
    });
    enrollmentId = enrolls[0]?.id ?? null;
  } catch (err) {
    console.warn("Không tìm được enrollment:", err);
  }

  await axios.post(`${API}/attempts`, {
    id: attemptId,
    attempt_id: attemptId,
    quiz_id: quiz.id,
    user_id: CURRENT_USER_ID,
    enrollment_id: enrollmentId,
    status: "submitted",
    score: score10,
    started_at: startedAt,
    submitted_at: now,
    duration_seconds: durationSeconds,
    created_at: startedAt,
  });

  // Lưu lần lượt từng đáp án (câu bỏ trống thì không lưu)
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const selected = answers[q.id];
    if (selected === undefined) continue;
    const id = `an${stamp}_${i}`;
    await axios.post(`${API}/answers`, {
      id,
      answer_id: id,
      attempt_id: attemptId,
      question_id: q.id,
      selected_option: selected,
      is_correct: q.correctIndex >= 0 ? selected === q.correctIndex : null,
      answered_at: now,
      time_spent_seconds: 0,
      view_explanation_count: 0,
      created_at: now,
      updated_at: now,
    });
  }

  return { attemptId, correct, total, score10 };
}