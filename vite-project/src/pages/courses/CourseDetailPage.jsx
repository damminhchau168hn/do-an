import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CourseDetailPage() {
  // id ở đây chính là ID của Chương được truyền từ trang danh sách sang
  const { id } = useParams();
  const [currentChapter, setCurrentChapter] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kho dữ liệu chứa bài học chi tiết của từng chương bằng chữ hoàn toàn
    const repository = {
      "1": {
        name: "Chương 1: Cấu trúc dữ liệu & Giải thuật cơ bản",
        quiz_id: "quiz-list",
        lessons: [
          { id: "c1-l1", name: "Bài 1: Giới thiệu về Mảng và Danh sách liên kết", content: "Mảng (Array) là một cấu trúc dữ liệu lưu trữ các phần tử có cùng kiểu dữ liệu tại các vùng nhớ liên tiếp nhau. Trong khi đó, Danh sách liên kết (Linked List) gồm các nút (Nodes), mỗi nút chứa dữ liệu và một con trỏ liên kết đến nút tiếp theo. Ưu điểm của danh sách liên kết là tối ưu hóa việc chèn và xóa phần tử một cách linh hoạt mà không cần cấp phát lại bộ nhớ liên tục." },
          { id: "c1-l2", name: "Bài 2: Cơ chế hoạt động của Ngăn xếp và Hàng đợi", content: "Ngăn xếp (Stack) hoạt động theo nguyên lý LIFO (Last In First Out - Vào sau ra trước), ví dụ như chức năng Undo/Redo. Hàng đợi (Queue) ngược lại hoạt động theo nguyên lý FIFO (First In First Out - Vào trước ra trước), thường ứng dụng trong việc xếp hàng xử lý tiến trình, tin nhắn chờ đợi trong hệ thống mạng." }
        ]
      },
      "2": {
        name: "Chương 2: Nhập môn Lập trình Web với NodeJS",
        quiz_id: "quiz-list",
        lessons: [
          { id: "c2-l1", name: "Bài 1: Tổng quan về NodeJS và kiến trúc Event-Driven", content: "NodeJS là môi trường chạy JavaScript phía máy chủ, xây dựng trên V8 Engine của Chrome. Cơ chế hoạt động chính của NodeJS dựa trên kiến trúc Event-Driven (hướng sự kiện) kết hợp Single-threaded và Non-blocking I/O. Nhờ đó, server có khả năng xử lý hàng vạn kết nối đồng thời với lượng tài nguyên phần cứng cực kỳ tiết kiệm." },
          { id: "c2-l2", name: "Bài 2: Quản lý thư viện dự án với NPM", content: "NPM là trình quản lý thư viện đi kèm khi cài đặt NodeJS. Bài viết này hướng dẫn cách sử dụng file package.json để kiểm soát phiên bản phần mềm, thiết lập các biến môi trường thông qua tệp tin .env phục vụ quá trình kết nối cổng bảo mật (Port) và bảo mật mã nguồn." }
        ]
      },
      "3": {
        name: "Chương 3: Lập trình Web nâng cao (React & Express)",
        quiz_id: "quiz-list",
        lessons: [
          { id: "c3-l1", name: "Bài 1: Định tuyến Routing trong ExpressJS", content: "ExpressJS cung cấp hệ thống định tuyến (Routing) mạnh mẽ giúp Server định vị và phản hồi chính xác các yêu cầu HTTP Request (GET, POST, PUT, DELETE) gửi từ Client. Lập trình viên dễ dàng phân chia cấu trúc mã nguồn theo dạng Controller/Route tách biệt rõ ràng." },
          { id: "c3-l2", name: "Bài 2: Quản lý trạng thái State trong ReactJS", content: "Học cách sử dụng Hook useState và useEffect để đồng bộ hóa giao diện người dùng theo sự thay đổi của dữ liệu. Khả năng render mượt mà nhờ cơ chế Virtual DOM giúp React trở thành thư viện xây dựng giao diện Single Page Application (SPA) phổ biến nhất hiện nay." }
        ]
      },
      "4": {
        name: "Chương 4: Kết nối và Quản trị Cơ sở dữ liệu MongoDB",
        quiz_id: "quiz-list",
        lessons: [
          { id: "c4-l1", name: "Bài 1: Thiết lập Schema cơ sở dữ liệu với Mongoose", content: "MongoDB thuộc nhóm cơ sở dữ liệu NoSQL lưu trữ thông tin dưới dạng tài liệu JSON/BSON linh hoạt. Nhằm ràng buộc dữ liệu chặt chẽ cho hệ thống lớn, Mongoose ORM hỗ trợ tạo lập các Schema và Model quy định rõ ràng kiểu dữ liệu của từng thuộc tính trước khi lưu xuống database." },
          { id: "c4-l2", name: "Bài 2: Thực hiện các câu lệnh thao tác CRUD nâng cao", content: "Hướng dẫn viết mã lệnh xử lý nghiệp vụ bất đồng bộ async/await kết hợp các phương thức như find(), findOneAndUpdate() hay deleteOne() để giải quyết bài toán thêm mới, tra cứu, sửa đổi và loại bỏ bản ghi ra khỏi cơ sở dữ liệu đám mây." }
        ]
      }
    };

    // Tìm dữ liệu chương khớp với ID trên URL, nếu không tìm thấy mặc định lấy chương 1 để tránh lỗi trắng trang
    const selectedChapter = repository[id] || repository["1"];
    setCurrentChapter(selectedChapter);

    // Mặc định hiển thị bài học đầu tiên của chương được chọn
    if (selectedChapter && selectedChapter.lessons.length > 0) {
      setActiveLesson(selectedChapter.lessons[0]);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Đang tải nội dung chương học...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR BÊN TRÁI: CHỈ HIỂN THỊ 1 CHƯƠNG ĐANG CHỌN VÀ CÁC BÀI CỦA NÓ */}
      <div style={{ width: '360px', borderRight: '1px solid #333', padding: '20px', overflowY: 'auto' }}>
        <Link to="/courses" style={{ color: '#4caf50', textDecoration: 'none', display: 'inline-block', marginBottom: '20px', fontSize: '14px' }}>
          ⬅️ Quay lại danh sách chương
        </Link>
        
        <div style={{ backgroundColor: '#262626', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#fff', fontWeight: 'bold', lineHeight: '1.4' }}>
            {currentChapter?.name}
          </h4>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
            {currentChapter?.lessons.map((lesson, index) => {
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
                    backgroundColor: isSelected ? '#4caf50' : '#333',
                    color: isSelected ? '#fff' : '#ccc',
                    transition: 'all 0.2s',
                    borderLeft: isSelected ? '4px solid #fff' : '4px solid transparent'
                  }}
                >
                  {lesson.name}
                </li>
              );
            })}
          </ul>

          <div style={{ textAlign: 'center', borderTop: '1px solid #444', paddingTop: '15px' }}>
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

      {/* KHU VỰC BÊN PHẢI: ĐỌC NỘI DUNG CHỮ CỦA BÀI HỌC */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', backgroundColor: '#141414' }}>
        {activeLesson ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #4caf50', paddingBottom: '15px', color: '#fff', fontSize: '24px' }}>
              {activeLesson.name}
            </h2>
            <p style={{ marginTop: '25px', lineHeight: '1.9', fontSize: '16.5px', color: '#e0e0e0', textAlign: 'justify' }}>
              {activeLesson.content}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#aaa' }}>
            Chọn bài học bên trái để xem nội dung văn bản.
          </div>
        )}
      </div>

    </div>
  );
}
