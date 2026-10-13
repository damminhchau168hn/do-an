import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function getEmbedUrl(url) {
  if (!url) return null;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
}

const repository = {
  c1: {
    name: 'Chương 1: Cấu trúc dữ liệu & Giải thuật',
    lessons: [
      {
        id: 'c1-l1',
        name: 'Bài 1: Tổng quan về Mảng và Danh sách liên kết',
        video_url: 'https://youtu.be/9HrpW3kiyw0',
        content:
          'Mảng (Array) và Danh sách liên kết (Linked List) là hai cấu trúc dữ liệu tuyến tính cơ bản. Tìm hiểu cách phân bổ bộ nhớ và độ phức tạp khi chèn, xóa phần tử.'
      },
      {
        id: 'c1-l2',
        name: 'Bài 2: Cơ chế Stack (Ngăn xếp) và Queue (Hàng đợi)',
        video_url: 'https://youtu.be/jYLW3E4EMyg',
        content:
          'Tìm hiểu nguyên lý LIFO của ngăn xếp và FIFO của hàng đợi cùng các ứng dụng trong lập trình.'
      }
    ]
  },
  c2: {
    name: 'Chương 2: Nhập môn Lập trình',
    lessons: [
      {
        id: 'c2-l1',
        name: 'Bài 1: Biến, Kiểu dữ liệu và Câu lệnh điều kiện',
        video_url: 'https://youtu.be/CrHLRrpsg6Y',
        content:
          'Làm quen với biến, kiểu dữ liệu cơ bản và cách sử dụng câu lệnh If-Else.'
      },
      {
        id: 'c2-l2',
        name: 'Bài 2: Vòng lặp For, While và Hàm xử lý',
        video_url: 'https://youtu.be/dCveScuUE4U',
        content:
          'Tìm hiểu vòng lặp và cách xây dựng hàm để tái sử dụng mã nguồn.'
      }
    ]
  },
  c3: {
    name: 'Chương 3: Lập trình Web nâng cao (React & Node)',
    lessons: [
      {
        id: 'c3-l1',
        name: 'Bài 1: Khởi tạo dự án và Component trong ReactJS',
        video_url: 'https://youtu.be/_4RQxs5OX-k',
        content:
          'Tìm hiểu cách khởi tạo dự án Vite và chia giao diện thành các React Component.'
      },
      {
        id: 'c3-l2',
        name: 'Bài 2: Xây dựng RESTful API với NodeJS & Express',
        video_url: 'https://youtu.be/Lj-QNEo07yg',
        content:
          'Tìm hiểu cách xây dựng máy chủ, xử lý HTTP Request và trả về dữ liệu JSON.'
      }
    ]
  },
  c4: {
    name: 'Chương 4: Kỹ năng thuyết trình & làm việc nhóm',
    lessons: [
      {
        id: 'c4-l1',
        name: 'Bài 1: Nghệ thuật thiết kế Slide và thuyết trình',
        video_url: 'https://youtu.be/rP9fJdW9dyI',
        content:
          'Tìm hiểu bố cục slide, ngôn ngữ cơ thể và cách trình bày thu hút người nghe.'
      },
      {
        id: 'c4-l2',
        name: 'Bài 2: Phương pháp quản lý xung đột khi làm việc nhóm',
        video_url: 'https://youtu.be/PUEeQWPX84Q',
        content:
          'Tìm hiểu cách lắng nghe, giải quyết xung đột và phối hợp làm việc nhóm.'
      }
    ]
  },
  c5: {
    name: 'Chương 5: Tiếng Anh học thuật IELTS 6.5+',
    lessons: [
      {
        id: 'c5-l1',
        name: 'Bài 1: IELTS Reading - Skimming & Scanning',
        video_url: 'https://youtu.be/2gHPxjffc4E',
        content:
          'Tìm hiểu cách đọc lướt lấy ý chính và tìm từ khóa trong bài IELTS Reading.'
      },
      {
        id: 'c5-l2',
        name: 'Bài 2: IELTS Writing Task 2',
        video_url: 'https://youtu.be/ShwA1r3Bp-c',
        content:
          'Tìm hiểu cách xây dựng bài luận có bố cục rõ ràng và lập luận logic.'
      }
    ]
  }
};

export default function CourseDetailPage() {
  const { id } = useParams();

  const chapterKey =
    id && id.startsWith('c') ? id : `c${id}`;

  const [currentChapter, setCurrentChapter] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chapter = repository[chapterKey];

    if (!chapter) {
      setCurrentChapter(null);
      setActiveLesson(null);
      setLoading(false);
      return;
    }

    setCurrentChapter(chapter);
    setActiveLesson(chapter.lessons[0] || null);
    setLoading(false);
  }, [chapterKey]);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        Đang tải nội dung...
      </div>
    );
  }

  if (!currentChapter) {
    return (
      <div style={{ padding: 30, textAlign: 'center' }}>
        <h2>Không tìm thấy chương học</h2>
        <Link to="/courses">Quay lại danh sách khóa học</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: '100vh',
        backgroundColor: '#F7F3E8',
        color: '#14213D',
        fontFamily: "'IBM Plex Sans', sans-serif"
      }}
    >
      {/* Sidebar bài học */}
      <aside
        style={{
          width: '100%',
          maxWidth: 360,
          flex: '1 1 280px',
          borderRight: '1px solid rgba(20,33,61,0.14)',
          padding: 20,
          boxSizing: 'border-box'
        }}
      >
        <Link
          to="/courses"
          style={{
            color: '#B84B2A',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: 20,
            fontSize: 14,
            fontWeight: 'bold'
          }}
        >
          ⬅️ Quay lại danh sách khóa học
        </Link>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(20,33,61,0.14)',
            padding: 15,
            borderRadius: 4
          }}
        >
          <h4
            style={{
              margin: '0 0 15px',
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: 1.5
            }}
          >
            {currentChapter.name}
          </h4>

          {/* Nút đăng ký khóa học */}
          <Link
            to={`/enroll/${chapterKey}`}
            style={{
              display: 'block',
              padding: 12,
              marginBottom: 15,
              backgroundColor: '#1F7A6C',
              color: '#F7F3E8',
              textDecoration: 'none',
              textAlign: 'center',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 'bold'
            }}
          >
            Đăng ký khóa học ✍️
          </Link>

          {/* Danh sách bài học */}
          {currentChapter.lessons.length > 0 ? (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 20px'
              }}
            >
              {currentChapter.lessons.map((lesson) => {
                const isSelected =
                  activeLesson?.id === lesson.id;

                return (
                  <li
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    style={{
                      padding: '12px 10px',
                      marginBottom: 6,
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 13.5,
                      lineHeight: 1.5,
                      backgroundColor: isSelected
                        ? '#14213D'
                        : '#EFE9D8',
                      color: isSelected ? '#F7F3E8' : '#14213D',
                      borderLeft: isSelected
                        ? '4px solid #F2A93B'
                        : '4px solid transparent'
                    }}
                  >
                    {lesson.name}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Chương này chưa có bài học.</p>
          )}

          {/* Quiz theo chương */}
          <div
            style={{
              textAlign: 'center',
              borderTop: '1px solid rgba(20,33,61,0.14)',
              paddingTop: 15
            }}
          >
            <Link
              to={`/quiz-list?chapter=${chapterKey}`}
              style={{
                display: 'block',
                padding: 10,
                backgroundColor: '#14213D',
                color: '#F7F3E8',
                textDecoration: 'none',
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 'bold'
              }}
            >
              Làm bài Quiz của chương 📝
            </Link>
          </div>
        </div>
      </aside>

      {/* Nội dung bài học */}
      <main
        style={{
          flex: '1 1 400px',
          minWidth: 0,
          padding: 'clamp(20px, 4vw, 40px)',
          boxSizing: 'border-box',
          backgroundColor: '#F7F3E8'
        }}
      >
        {activeLesson ? (
          <div style={{ maxWidth: 850, margin: '0 auto' }}>
            <h2
              style={{
                borderBottom: '2px solid #B84B2A',
                paddingBottom: 15,
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: 26,
                lineHeight: 1.5,
                marginBottom: 25
              }}
            >
              {activeLesson.name}
            </h2>

            {getEmbedUrl(activeLesson.video_url) ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%',
                  backgroundColor: '#000',
                  borderRadius: 8,
                  overflow: 'hidden',
                  marginBottom: 25,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                <iframe
                  key={activeLesson.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0
                  }}
                  src={getEmbedUrl(activeLesson.video_url)}
                  title={activeLesson.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <p style={{ color: '#B84B2A', marginBottom: 25 }}>
                Video chưa khả dụng hoặc đường dẫn không hợp lệ.
              </p>
            )}

            <h3
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 18,
                color: '#B84B2A',
                margin: '20px 0 10px',
                fontWeight: 'bold'
              }}
            >
              Tóm tắt nội dung bài học:
            </h3>

            <p
              style={{
                lineHeight: 1.8,
                fontSize: 15.5,
                color: '#14213D',
                textAlign: 'justify',
                margin: 0
              }}
            >
              {activeLesson.content}
            </p>
          </div>
        ) : (
          <div style={{ padding: 30, color: '#5B6472' }}>
            Chương này chưa có bài học để hiển thị.
          </div>
        )}
      </main>
    </div>
  );
}
