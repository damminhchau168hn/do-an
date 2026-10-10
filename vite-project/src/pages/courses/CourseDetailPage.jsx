import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function getEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function CourseDetailPage() {
  // Nhận id từ URL (ví dụ: c1, c2, c3...)
  const { id } = useParams();
  const [currentChapter, setCurrentChapter] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kho dữ liệu chuẩn hóa theo đúng tiêu đề 5 ô khóa học trên màn hình của bạn + Tích hợp Video
    const repository = {
      "c1": {
        name: "Chương 1: Cấu trúc dữ liệu & Giải thuật",
        quiz_id: "quiz-list",
        lessons: [
          { 
            id: "c1-l1", 
            name: "Bài 1: Tổng quan về Mảng và Danh sách liên kết", 
            video_url: "https://youtu.be/9HrpW3kiyw0?si=LCHcCCesKBzrpcaG", 
            content: "Mảng (Array) và Danh sách liên kết (Linked List) là hai cấu trúc dữ liệu tuyến tính cơ bản nhất. Hãy theo dõi video trên để hiểu cách phân bổ bộ nhớ RAM và so sánh độ phức tạp thời gian O(n) khi thực hiện chèn, xóa phần tử." 
          },
          { 
            id: "c1-l2", 
            name: "Bài 2: Cơ chế Stack (Ngăn xếp) và Queue (Hàng đợi)", 
            video_url: "https://youtu.be/jYLW3E4EMyg?si=6x0A16DfmHx0LYVi",
            content: "Video này minh họa trực quan nguyên lý LIFO (Vào sau ra trước) của Ngăn xếp và FIFO (Vào trước ra trước) của Hàng đợi kèm theo các bài toán ứng dụng thực tế trong lập trình." 
          }
        ]
      },
      "c2": {
        name: "Chương 2: Nhập môn Lập trình",
        quiz_id: "quiz-list",
        lessons: [
          { 
            id: "c2-l1", 
            name: "Bài 1: Biến, Kiểu dữ liệu và Câu lệnh điều kiện", 
            video_url: "https://youtu.be/CrHLRrpsg6Y?si=456P5Gc-0OFbF7MS",
            content: "Bắt đầu hành trình lập trình bằng cách làm quen với khái niệm lưu trữ biến, các kiểu dữ liệu cơ bản (số, chuỗi, logic) và cách điều hướng luồng chương trình bằng câu lệnh If-Else qua video hướng dẫn chi tiết." 
          },
          { 
            id: "c2-l2", 
            name: "Bài 2: Vòng lặp For, While và Hàm xử lý", 
            video_url: "https://youtu.be/dCveScuUE4U?si=pcipRJkkn4xADF70",
            content: "Tìm hiểu cách tối ưu hóa mã nguồn, tránh lặp code bằng cách sử dụng vòng lặp và đóng gói logic vào trong các hàm tái sử dụng." 
          }
        ]
      },
      "c3": {
        name: "Chương 3: Lập trình Web nâng cao (React & Node)",
        quiz_id: "quiz-list",
        lessons: [
          { 
            id: "c3-l1", 
            name: "Bài 1: Khởi tạo dự án và Component trong ReactJS", 
            video_url: "https://youtu.be/_4RQxs5OX-k?si=VAZH7JHczqfSE9oA",
            content: "Video hướng dẫn từng bước cài đặt môi trường Vite, cấu trúc thư mục chuẩn cho dự án Frontend và cách chia nhỏ giao diện thành các React Component độc lập." 
          },
          { 
            id: "c3-l2", 
            name: "Bài 2: Xây dựng RESTful API backend với NodeJS & Express", 
            video_url: "https://youtu.be/Lj-QNEo07yg?si=zzoLyI6-zeG_mbqo",
            content: "Học cách viết mã nguồn máy chủ (Server), tiếp nhận HTTP Request từ Client và phản hồi dữ liệu định dạng JSON chuẩn REST API." 
          }
        ]
      },
      "c4": {
        name: "Chương 4: Kỹ năng thuyết trình & làm việc nhóm",
        quiz_id: "quiz-list",
        lessons: [
          { 
            id: "c4-l1", 
            name: "Bài 1: Nghệ thuật thiết kế Slide và Thuyết trình lôi cuốn", 
            video_url: "https://youtu.be/rP9fJdW9dyI?si=6eC7nkG85Rnf5wMp",
            content: "Video chia sẻ các quy tắc vàng trong bố cục slide, cách sử dụng ngôn ngữ cơ thể và kiểm soát cao độ giọng nói để thu hút người nghe hoàn toàn từ những giây đầu tiên." 
          },
          { 
            id: "c4-l2", 
            name: "Bài 2: Phương pháp quản lý xung đột khi làm việc nhóm", 
            video_url: "https://youtu.be/PUEeQWPX84Q?si=nA2ZBIndLD3euXAB",
            content: "Học cách lắng nghe tích cực, phân chia công việc theo mô hình Scrum/Agile hiệu quả để tối ưu năng suất làm việc của một đội ngũ." 
          }
        ]
      },
      "c5": {
        name: "Chương 5: Tiếng Anh học thuật IELTS 6.5+",
        quiz_id: "quiz-list",
        lessons: [
          { 
            id: "c5-l1", 
            name: "Bài 1: Chiến thuật làm bài IELTS Reading - Skimming & Scanning", 
            video_url: "https://youtu.be/2gHPxjffc4E?si=7poIVczB712x5470",
            content: "Video hướng dẫn mẹo đọc lướt lấy ý chính và quét từ khóa để tìm đáp án chính xác nhất trong thời gian ngắn cho bài thi đọc IELTS." 
          },
          { 
            id: "c5-l2", 
            name: "Bài 2: Cấu trúc bài viết IELTS Writing Task 2 đạt điểm cao", 
            video_url: "https://youtu.be/ShwA1r3Bp-c?si=n1KNxVGkva-A_xmO",
            content: "Phân tích sơ đồ viết bài luận 4 đoạn tiêu chuẩn, cách triển khai luận điểm logic và sử dụng các từ nối học thuật nâng band điểm tiêu chí Coherence & Cohesion." 
          }
        ]
      }
    };

    // Hỗ trợ tìm kiếm theo cả dạng "c1" hoặc số "1"
    const lookupKey = id && !id.startsWith('c') ? `c${id}` : id;
    const selectedChapter = repository[lookupKey] || repository["c1"];

    // Nếu từng import bài học thì ưu tiên dữ liệu đã lưu
    let chapterData = selectedChapter;
    try {
      const saved = localStorage.getItem(`lessons_${lookupKey}`);
      if (saved) chapterData = { ...selectedChapter, lessons: JSON.parse(saved) };
    } catch (err) {
      console.error('Không đọc được dữ liệu đã lưu', err);
    }

    setCurrentChapter(chapterData);

    // Mặc định hiển thị bài học thứ nhất
    if (chapterData && chapterData.lessons.length > 0) {
      setActiveLesson(chapterData.lessons[0]);
    }
    setLoading(false);
  }, [id]);

  const chapterKey = id && !id.startsWith('c') ? `c${id}` : id;

  // Xuất các bài học của chương đang xem ra file JSON
  const handleExport = () => {
    if (!currentChapter) return;
    const data = { chapter: currentChapter.name, lessons: currentChapter.lessons };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chapterKey || 'chapter'}-lessons.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Nhập bài học từ file JSON (trùng id thì ghi đè, id mới thì thêm vào cuối)
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const list = Array.isArray(parsed) ? parsed : parsed.lessons;
        if (!Array.isArray(list)) throw new Error('Sai định dạng');

        const cleaned = list
          .filter((l) => l && l.name)
          .map((l, i) => ({
            id: l.id || `${chapterKey}-import-${Date.now()}-${i}`,
            name: String(l.name),
            video_url: l.video_url || '',
            content: l.content || '',
          }));
        if (cleaned.length === 0) throw new Error('Không có bài học hợp lệ');

        const map = new Map(currentChapter.lessons.map((l) => [l.id, l]));
        cleaned.forEach((l) => map.set(l.id, l));
        const merged = Array.from(map.values());

        setCurrentChapter({ ...currentChapter, lessons: merged });
        if (!activeLesson) setActiveLesson(merged[0]);
        localStorage.setItem(`lessons_${chapterKey}`, JSON.stringify(merged));
        alert(`Đã nhập ${cleaned.length} bài học.`);
      } catch (err) {
        alert('File không hợp lệ. Cần file JSON có danh sách "lessons" (mỗi bài có name, video_url, content).');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // cho phép chọn lại cùng một file
  };

  if (loading) return <div style={{ color: '#333', padding: '20px' }}>Đang tải nội dung...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fdfbf7', color: '#1f1f1f', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR BÊN TRÁI: DANH MỤC BÀI HỌC CỦA CHƯƠNG ĐANG CHỌN */}
      <div style={{ width: '360px', borderRight: '1px solid #e5e0d5', padding: '20px', overflowY: 'auto' }}>
        <Link to="/courses" style={{ color: '#4caf50', textDecoration: 'none', display: 'inline-block', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          ⬅️ Quay lại danh sách chương
        </Link>
        
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e0d5', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1f1f1f', fontWeight: 'bold', lineHeight: '1.4' }}>
            {currentChapter?.name}
          </h4>

          {/* NÚT EXPORT / IMPORT NỘI DUNG BÀI HỌC */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            <button
              onClick={handleExport}
              style={{ flex: 1, padding: '8px', backgroundColor: '#2196f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 'bold' }}
            >
              ⬇️ Export
            </button>

            <label
              style={{ flex: 1, padding: '8px', backgroundColor: '#9c27b0', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 'bold', textAlign: 'center' }}
            >
              ⬆️ Import
              <input type="file" accept=".json,application/json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
            {currentChapter?.lessons.map((lesson) => {
              const isSelected = activeLesson?.id === lesson.id;
              return (
                <li 
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  style={{
                    padding: '12px 10px',
                    marginBottom: '6px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    backgroundColor: isSelected ? '#4caf50' : '#f1ede4',
                    color: isSelected ? '#fff' : '#444',
                    transition: 'all 0.2s',
                    borderLeft: isSelected ? '4px solid #fff' : '4px solid transparent'
                  }}
                >
                  {lesson.name}
                </li>
              );
            })}
          </ul>

          <div style={{ textAlign: 'center', borderTop: '1px solid #e5e0d5', paddingTop: '15px' }}>
            <Link 
              to="/quiz-list" 
              style={{
                display: 'block',
                padding: '10px',
                backgroundColor: '#ff9800',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              Làm Bài Quiz Của Chương 📝
            </Link>
          </div>
        </div>
      </div>

      {/* KHU VỰC BÊN PHẢI: HIỂN THỊ TRÌNH PHÁT VIDEO VÀ VĂN BẢN */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', backgroundColor: '#fdfbf7' }}>
        {activeLesson ? (
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {/* Tiêu đề bài học */}
            <h2 style={{ borderBottom: '2px solid #4caf50', paddingBottom: '15px', color: '#1f1f1f', fontSize: '22px', fontWeight: 'bold', marginBottom: '25px' }}>
              {activeLesson.name}
            </h2>
            
            {/* KHUNG TRÌNH PHÁT VIDEO YOUTUBE NHÚNG PHẢN HỒI (RESPONSIVE) */}
            {getEmbedUrl(activeLesson.video_url) ? (
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <iframe
                  key={activeLesson.id}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  src={getEmbedUrl(activeLesson.video_url)}
                  title={activeLesson.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p style={{ color: '#ff9800', marginBottom: '25px' }}>
                Video chưa khả dụng hoặc link không hợp lệ.
              </p>
            )}
            
            {/* Mô tả chi tiết bên dưới video */}
            <h3 style={{ fontSize: '16px', color: '#4caf50', margin: '20px 0 10px 0', fontWeight: 'bold' }}>Tóm tắt nội dung bài học:</h3>
            <p style={{ lineHeight: '1.8', fontSize: '15.5px', color: '#333333', textAlign: 'justify', margin: 0 }}>
              {activeLesson.content}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#777' }}>
            Chọn bài học bên trái để bắt đầu học video.
          </div>
        )}
      </div>

    </div>
  );
}
