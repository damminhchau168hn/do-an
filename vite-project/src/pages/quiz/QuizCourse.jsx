import React, { useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import '../../styles/QuizCourse.css';



const quizData = {

  "1": {

    name: "Chương 1: Cấu trúc dữ liệu & Giải thuật cơ bản",

    questions: [

      {

        id: "c1-q1",

        question: "Mảng (Array) lưu trữ các phần tử như thế nào trong bộ nhớ?",

        options: [

          "Ở các vùng nhớ rời rạc, liên kết với nhau bằng con trỏ",

          "Ở các vùng nhớ liên tiếp nhau, cùng kiểu dữ liệu",

          "Chỉ lưu trên ổ cứng, không lưu trong RAM",

          "Ở các vùng nhớ ngẫu nhiên, mỗi phần tử một kiểu khác nhau"

        ],

        answer: 1,

        explanation: "Mảng lưu các phần tử cùng kiểu dữ liệu tại các vùng nhớ liên tiếp, nhờ đó truy cập theo chỉ số rất nhanh."

      },

      {

        id: "c1-q2",

        question: "Ưu điểm nổi bật của Danh sách liên kết (Linked List) so với mảng là gì?",

        options: [

          "Truy cập phần tử bất kỳ nhanh hơn bằng chỉ số",

          "Tiết kiệm bộ nhớ hơn do không cần con trỏ",

          "Chèn và xóa phần tử linh hoạt, không cần cấp phát lại bộ nhớ liên tục",

          "Tự động sắp xếp các phần tử"

        ],

        answer: 2,

        explanation: "Mỗi nút chứa dữ liệu và con trỏ tới nút kế tiếp nên việc chèn/xóa chỉ cần đổi con trỏ."

      },

      {

        id: "c1-q3",

        question: "Ngăn xếp (Stack) hoạt động theo nguyên lý nào?",

        options: [

          "FIFO (Vào trước ra trước)",

          "LIFO (Vào sau ra trước)",

          "Ngẫu nhiên",

          "Theo độ ưu tiên tăng dần"

        ],

        answer: 1,

        explanation: "Stack là LIFO: phần tử được thêm vào sau cùng sẽ được lấy ra đầu tiên."

      },

      {

        id: "c1-q4",

        question: "Chức năng Undo/Redo trong các trình soạn thảo thường ứng dụng cấu trúc dữ liệu nào?",

        options: ["Hàng đợi (Queue)", "Mảng hai chiều", "Ngăn xếp (Stack)", "Cây nhị phân"],

        answer: 2,

        explanation: "Thao tác gần nhất cần được hoàn tác trước, đúng với nguyên lý LIFO của Stack."

      },

      {

        id: "c1-q5",

        question: "Hàng đợi (Queue) phù hợp nhất với tình huống nào sau đây?",

        options: [

          "Xếp hàng xử lý tiến trình, tin nhắn chờ trong hệ thống mạng",

          "Hoàn tác thao tác gõ phím",

          "Lưu trữ cấu hình ứng dụng",

          "Tra cứu phần tử theo chỉ số"

        ],

        answer: 0,

        explanation: "Queue theo nguyên lý FIFO nên phù hợp với việc xử lý theo thứ tự đến trước, phục vụ trước."

      },

      {

        id: "c1-q6",

        question: "Mỗi nút (Node) trong Danh sách liên kết gồm những thành phần nào?",

        options: [

          "Chỉ gồm dữ liệu",

          "Dữ liệu và một con trỏ liên kết đến nút tiếp theo",

          "Chỉ số và kích thước của mảng",

          "Hai ngăn xếp lồng nhau"

        ],

        answer: 1,

        explanation: "Mỗi nút chứa dữ liệu và một con trỏ trỏ tới nút kế tiếp, nhờ đó các nút được nối thành chuỗi."

      },

      {

        id: "c1-q7",

        question: "Vì sao truy cập phần tử thứ k trong Danh sách liên kết thường chậm hơn so với mảng?",

        options: [

          "Vì dữ liệu được lưu trên ổ cứng",

          "Vì phải mã hóa dữ liệu mỗi lần truy cập",

          "Vì phải duyệt tuần tự từ nút đầu qua từng con trỏ cho đến vị trí k",

          "Vì danh sách liên kết luôn có kích thước cố định"

        ],

        answer: 2,

        explanation: "Mảng truy cập thẳng theo chỉ số, còn danh sách liên kết phải đi lần lượt qua từng nút bắt đầu từ nút đầu."

      },

      {

        id: "c1-q8",

        question: "Thao tác thêm một phần tử vào Ngăn xếp (Stack) thường được gọi là gì?",

        options: ["pop", "enqueue", "peek", "push"],

        answer: 3,

        explanation: "push thêm phần tử lên đỉnh Stack, còn pop lấy phần tử ở đỉnh ra."

      },

      {

        id: "c1-q9",

        question: "Thao tác lấy phần tử ra khỏi Hàng đợi (Queue) thường được gọi là gì?",

        options: ["dequeue", "push", "insert", "append"],

        answer: 0,

        explanation: "enqueue thêm phần tử vào cuối hàng đợi, dequeue lấy phần tử ở đầu hàng ra theo nguyên lý FIFO."

      },

      {

        id: "c1-q10",

        question: "Khi gọi pop() trên một Stack đang chứa các phần tử 1, 2, 3 (thêm lần lượt theo thứ tự đó), phần tử nào được lấy ra?",

        options: ["1", "2", "3", "Không có phần tử nào"],

        answer: 2,

        explanation: "Stack theo LIFO: phần tử 3 được thêm vào sau cùng nên sẽ được lấy ra trước."

      }

    ]

  },

  "2": {

    name: "Chương 2: Nhập môn Lập trình Web với NodeJS",

    questions: [

      {

        id: "c2-q1",

        question: "NodeJS được xây dựng trên engine nào?",

        options: ["SpiderMonkey của Firefox", "Chakra của Microsoft", "V8 Engine của Chrome", "JavaScriptCore của Safari"],

        answer: 2,

        explanation: "NodeJS là môi trường chạy JavaScript phía máy chủ, dựa trên V8 Engine của Chrome."

      },

      {

        id: "c2-q2",

        question: "Cơ chế hoạt động chính của NodeJS dựa trên kiến trúc nào?",

        options: [

          "Multi-threaded và Blocking I/O",

          "Event-Driven, Single-threaded và Non-blocking I/O",

          "Client-Server thuần túy không có sự kiện",

          "Microservices bắt buộc"

        ],

        answer: 1,

        explanation: "Kiến trúc hướng sự kiện kết hợp đơn luồng và I/O không chặn giúp server xử lý nhiều kết nối đồng thời với ít tài nguyên."

      },

      {

        id: "c2-q3",

        question: "File nào dùng để kiểm soát phiên bản các thư viện trong dự án NodeJS?",

        options: ["package.json", "index.html", ".gitignore", "server.log"],

        answer: 0,

        explanation: "package.json khai báo các thư viện phụ thuộc cùng phiên bản của chúng, do NPM quản lý."

      },

      {

        id: "c2-q4",

        question: "Tệp .env thường được dùng để làm gì trong dự án NodeJS?",

        options: [

          "Chứa giao diện người dùng",

          "Thiết lập biến môi trường như Port và thông tin cần bảo mật",

          "Lưu toàn bộ mã nguồn của server",

          "Tự động cài đặt NodeJS"

        ],

        answer: 1,

        explanation: "File .env giữ các biến môi trường (cổng, khóa bí mật...) tách khỏi mã nguồn để bảo mật tốt hơn."

      },

      {

        id: "c2-q5",

        question: "NPM là gì?",

        options: [

          "Một trình duyệt web chạy JavaScript",

          "Trình quản lý thư viện đi kèm khi cài đặt NodeJS",

          "Một hệ quản trị cơ sở dữ liệu",

          "Một framework xây dựng giao diện"

        ],

        answer: 1,

        explanation: "NPM (Node Package Manager) là trình quản lý thư viện được cài kèm NodeJS."

      },

      {

        id: "c2-q6",

        question: "Lệnh nào dùng để cài đặt thư viện Express vào dự án NodeJS?",

        options: ["npm get express", "npm install express", "node express", "npm run express"],

        answer: 1,

        explanation: "npm install <tên thư viện> tải thư viện về và ghi vào danh sách phụ thuộc trong package.json."

      },

      {

        id: "c2-q7",

        question: "Non-blocking I/O trong NodeJS có nghĩa là gì?",

        options: [

          "Server từ chối các yêu cầu đến khi xử lý xong yêu cầu trước",

          "Server không bao giờ đọc hoặc ghi file",

          "Mỗi yêu cầu được xử lý trên một máy chủ riêng biệt",

          "Server không phải đứng chờ thao tác I/O hoàn tất mới xử lý tiếp các yêu cầu khác"

        ],

        answer: 3,

        explanation: "Khi một thao tác I/O đang chờ, NodeJS tiếp tục xử lý việc khác và quay lại khi có kết quả, nhờ đó phục vụ được nhiều kết nối cùng lúc."

      },

      {

        id: "c2-q8",

        question: "Nhờ kiến trúc Event-Driven, NodeJS đặc biệt phù hợp với loại ứng dụng nào?",

        options: [

          "Ứng dụng cần xử lý rất nhiều kết nối đồng thời như chat, API",

          "Ứng dụng tính toán khoa học nặng trên CPU",

          "Ứng dụng chỉ chạy offline trên máy tính",

          "Ứng dụng không cần kết nối mạng"

        ],

        answer: 0,

        explanation: "NodeJS xử lý hàng vạn kết nối đồng thời với tài nguyên tiết kiệm nên rất hợp với chat, API và các dịch vụ thời gian thực."

      },

      {

        id: "c2-q9",

        question: "Thư mục nào chứa các thư viện được cài đặt bằng NPM trong dự án?",

        options: ["src", "public", "node_modules", "dist"],

        answer: 2,

        explanation: "NPM tải toàn bộ thư viện về thư mục node_modules, thư mục này thường được loại khỏi Git."

      },

      {

        id: "c2-q10",

        question: "Vì sao không nên đưa tệp .env lên kho mã nguồn công khai như GitHub?",

        options: [

          "Vì tệp .env làm chậm quá trình cài đặt NPM",

          "Vì GitHub không hỗ trợ tệp có đuôi .env",

          "Vì tệp .env chứa thông tin nhạy cảm như khóa bí mật, chuỗi kết nối database",

          "Vì NodeJS không đọc được tệp .env nếu đã đưa lên Git"

        ],

        answer: 2,

        explanation: "Tệp .env chứa thông tin cần bảo mật nên cần giữ riêng và thêm vào .gitignore."

      }

    ]

  },

  "3": {

    name: "Chương 3: Lập trình Web nâng cao (React & Express)",

    questions: [

      {

        id: "c3-q1",

        question: "Hệ thống Routing của ExpressJS giúp Server làm gì?",

        options: [

          "Vẽ giao diện người dùng",

          "Nén hình ảnh tự động",

          "Định vị và phản hồi chính xác các HTTP Request (GET, POST, PUT, DELETE) từ Client",

          "Thay thế hoàn toàn cơ sở dữ liệu"

        ],

        answer: 2,

        explanation: "Routing ánh xạ từng phương thức và đường dẫn tới hàm xử lý tương ứng, thường tách thành Controller/Route rõ ràng."

      },

      {

        id: "c3-q2",

        question: "Trong ReactJS, hai Hook nào được dùng để đồng bộ giao diện theo sự thay đổi của dữ liệu?",

        options: ["useRoute và useServer", "useQuery và useFetch", "useState và useEffect", "useNode và useExpress"],

        answer: 2,

        explanation: "useState lưu trạng thái, useEffect xử lý tác vụ phụ khi dữ liệu hoặc component thay đổi."

      },

      {

        id: "c3-q3",

        question: "Cơ chế nào giúp React render mượt mà khi xây dựng Single Page Application (SPA)?",

        options: [

          "Virtual DOM",

          "Tải lại toàn bộ trang mỗi lần thay đổi",

          "Chỉ dùng CSS thuần",

          "Lưu giao diện vào cơ sở dữ liệu"

        ],

        answer: 0,

        explanation: "Virtual DOM giúp React so sánh và chỉ cập nhật những phần thực sự thay đổi trên giao diện."

      },

      {

        id: "c3-q4",

        question: "Phương thức HTTP nào thường được dùng để lấy (đọc) dữ liệu từ Server?",

        options: ["POST", "GET", "PUT", "DELETE"],

        answer: 1,

        explanation: "GET dùng để lấy dữ liệu, không làm thay đổi dữ liệu trên Server."

      },

      {

        id: "c3-q5",

        question: "Phương thức HTTP nào thường được dùng để tạo mới dữ liệu?",

        options: ["POST", "GET", "DELETE", "HEAD"],

        answer: 0,

        explanation: "POST gửi dữ liệu lên Server để tạo mới một bản ghi."

      },

      {

        id: "c3-q6",

        question: "Phương thức HTTP nào thường được dùng để cập nhật dữ liệu đã có?",

        options: ["GET", "POST", "DELETE", "PUT"],

        answer: 3,

        explanation: "PUT dùng để cập nhật dữ liệu đã tồn tại, DELETE dùng để xóa dữ liệu."

      },

      {

        id: "c3-q7",

        question: "Lợi ích của việc chia mã nguồn Express thành Controller và Route tách biệt là gì?",

        options: [

          "Giúp server chạy nhanh gấp nhiều lần",

          "Mã nguồn rõ ràng, dễ đọc, dễ bảo trì và mở rộng",

          "Không cần dùng HTTP Request nữa",

          "Giúp tự động tạo giao diện React"

        ],

        answer: 1,

        explanation: "Tách Route (định tuyến) và Controller (xử lý nghiệp vụ) giúp cấu trúc dự án gọn gàng và dễ bảo trì."

      },

      {

        id: "c3-q8",

        question: "Trong React, useEffect với mảng phụ thuộc rỗng [] sẽ chạy khi nào?",

        options: [

          "Chỉ một lần sau lần render đầu tiên của component",

          "Mỗi lần người dùng click chuột",

          "Không bao giờ chạy",

          "Mỗi giây một lần"

        ],

        answer: 0,

        explanation: "Với mảng phụ thuộc rỗng, effect chỉ chạy một lần sau lần render đầu tiên."

      },

      {

        id: "c3-q9",

        question: "Khi gọi hàm cập nhật state (ví dụ setCount) của useState, điều gì xảy ra?",

        options: [

          "Trang web tự động bị tải lại hoàn toàn",

          "Dữ liệu được lưu thẳng xuống database",

          "Server Express được khởi động lại",

          "State thay đổi và React render lại giao diện theo giá trị mới"

        ],

        answer: 3,

        explanation: "Khi state thay đổi, React render lại component và cập nhật phần giao diện bị ảnh hưởng."

      },

      {

        id: "c3-q10",

        question: "Single Page Application (SPA) hoạt động như thế nào?",

        options: [

          "Mỗi lần chuyển trang đều tải lại toàn bộ một file HTML mới",

          "Chỉ hiển thị được một nội dung duy nhất, không thể thay đổi",

          "Tải một trang HTML ban đầu rồi cập nhật nội dung động mà không tải lại toàn bộ trang",

          "Chỉ chạy trên máy chủ, không chạy trên trình duyệt"

        ],

        answer: 2,

        explanation: "SPA chỉ tải trang một lần và cập nhật giao diện bằng JavaScript, giúp trải nghiệm mượt mà hơn."

      }

    ]

  },

  "4": {

    name: "Chương 4: Kết nối và Quản trị Cơ sở dữ liệu MongoDB",

    questions: [

      {

        id: "c4-q1",

        question: "MongoDB thuộc nhóm cơ sở dữ liệu nào và lưu thông tin dưới dạng gì?",

        options: [

          "SQL, lưu dạng bảng với cột và hàng cố định",

          "NoSQL, lưu dạng tài liệu JSON/BSON linh hoạt",

          "Cơ sở dữ liệu đồ thị, lưu dạng nút và cạnh",

          "File text thuần, không có cấu trúc"

        ],

        answer: 1,

        explanation: "MongoDB là CSDL NoSQL hướng tài liệu, lưu dữ liệu dạng JSON/BSON."

      },

      {

        id: "c4-q2",

        question: "Mongoose Schema có vai trò gì?",

        options: [

          "Quy định rõ kiểu dữ liệu của từng thuộc tính trước khi lưu xuống database",

          "Tạo giao diện React tự động",

          "Thay thế Express làm máy chủ web",

          "Mã hóa toàn bộ đường truyền mạng"

        ],

        answer: 0,

        explanation: "Schema và Model giúp ràng buộc dữ liệu chặt chẽ, đặc biệt hữu ích cho hệ thống lớn."

      },

      {

        id: "c4-q3",

        question: "Trong thao tác CRUD với Mongoose, phương thức nào dùng để xóa một bản ghi?",

        options: ["find()", "findOneAndUpdate()", "deleteOne()", "populate()"],

        answer: 2,

        explanation: "find() dùng tra cứu, findOneAndUpdate() dùng sửa đổi, còn deleteOne() dùng để loại bỏ bản ghi khỏi cơ sở dữ liệu."

      },

      {

        id: "c4-q4",

        question: "Mongoose là gì?",

        options: [

          "Một hệ điều hành cho máy chủ",

          "Một trình duyệt web",

          "Một thư viện giúp làm việc với MongoDB trong NodeJS thông qua Schema và Model",

          "Một công cụ nén hình ảnh"

        ],

        answer: 2,

        explanation: "Mongoose là thư viện ánh xạ dữ liệu cho MongoDB, cung cấp Schema và Model để thao tác với database dễ dàng hơn."

      },

      {

        id: "c4-q5",

        question: "CRUD là viết tắt của các thao tác nào?",

        options: [

          "Create, Read, Update, Delete",

          "Connect, Run, Upload, Download",

          "Copy, Rename, Undo, Delete",

          "Compile, Render, Update, Deploy"

        ],

        answer: 0,

        explanation: "CRUD gồm Create (thêm mới), Read (tra cứu), Update (sửa đổi) và Delete (xóa)."

      },

      {

        id: "c4-q6",

        question: "async/await được dùng trong các câu lệnh thao tác database nhằm mục đích gì?",

        options: [

          "Tăng dung lượng lưu trữ của database",

          "Xử lý bất đồng bộ nhưng viết mã theo thứ tự dễ đọc, dễ hiểu",

          "Mã hóa dữ liệu trước khi lưu",

          "Tự động tạo Schema cho Mongoose"

        ],

        answer: 1,

        explanation: "Các thao tác với database là bất đồng bộ, async/await giúp viết mã tuần tự, dễ đọc và dễ xử lý lỗi hơn."

      },

      {

        id: "c4-q7",

        question: "Phương thức nào của Mongoose dùng để tra cứu (tìm) các bản ghi trong collection?",

        options: ["deleteOne()", "find()", "save()", "drop()"],

        answer: 1,

        explanation: "find() trả về các bản ghi khớp điều kiện tìm kiếm."

      },

      {

        id: "c4-q8",

        question: "Trong MongoDB, một document tương đương với khái niệm nào trong cơ sở dữ liệu quan hệ (SQL)?",

        options: ["Một bảng (table)", "Một cột (column)", "Một khóa ngoại (foreign key)", "Một hàng (row)"],

        answer: 3,

        explanation: "Collection tương đương bảng, còn mỗi document tương đương một hàng dữ liệu."

      },

      {

        id: "c4-q9",

        question: "Phương thức nào của Mongoose vừa tìm bản ghi vừa cập nhật nó?",

        options: ["findOneAndUpdate()", "deleteOne()", "find()", "create()"],

        answer: 0,

        explanation: "findOneAndUpdate() tìm bản ghi khớp điều kiện rồi sửa đổi nội dung của bản ghi đó."

      },

      {

        id: "c4-q10",

        question: "BSON mà MongoDB sử dụng là gì?",

        options: [

          "Một ngôn ngữ truy vấn giống SQL",

          "Một định dạng ảnh",

          "Một giao thức mạng bảo mật",

          "Định dạng nhị phân của JSON, giúp lưu trữ và truy xuất hiệu quả"

        ],

        answer: 3,

        explanation: "BSON (Binary JSON) là dạng biểu diễn nhị phân của JSON, hỗ trợ thêm nhiều kiểu dữ liệu và xử lý nhanh hơn."

      }

    ]

  }

};









export default function QuizCourse() {

  // Lấy ID chương từ URL: /quiz-course/2

  const { chapterId: requested } = useParams();



  const chapterId = quizData[requested] ? requested : '1';

  const chapter = quizData[chapterId];



  // Lưu riêng đáp án và trạng thái nộp bài cho từng chương

  const [answers, setAnswers] = useState({});     // { [chapterId]: { [questionId]: optionIndex } }

  const [submitted, setSubmitted] = useState({}); // { [chapterId]: true }



  const chapterAnswers = answers[chapterId] || {};

  const isSubmitted = !!submitted[chapterId];

  const total = chapter.questions.length;

  const answeredCount = Object.keys(chapterAnswers).length;



  const getScore = (cid) =>

    quizData[cid].questions.filter((q) => (answers[cid] || {})[q.id] === q.answer).length;



  const handleSelect = (questionId, optionIndex) => {

    if (isSubmitted) return;

    setAnswers((prev) => ({

      ...prev,

      [chapterId]: { ...(prev[chapterId] || {}), [questionId]: optionIndex }

    }));

  };



  const handleSubmit = () => setSubmitted((prev) => ({ ...prev, [chapterId]: true }));



  const handleReset = () => {

    setAnswers((prev) => ({ ...prev, [chapterId]: {} }));

    setSubmitted((prev) => ({ ...prev, [chapterId]: false }));

  };



  const score = getScore(chapterId);



  // Gắn class theo trạng thái của từng đáp án

  const getOptionClass = (picked, optIndex, correctIndex) => {

    const classes = ['quiz-option'];

    if (isSubmitted) {

      classes.push('is-locked');

      if (optIndex === correctIndex) classes.push('is-correct');

      else if (optIndex === picked) classes.push('is-wrong');

    } else if (optIndex === picked) {

      classes.push('is-selected');

    }

    return classes.join(' ');

  };



  return (

  <div className="quiz-page">

    <div className="quiz-main">

      <div className="quiz-content">



        {/* NÚT QUAY LẠI */}

        <Link to="/courses" className="quiz-back-link">

          ⬅️ Quay lại khóa học

        </Link>



        {/* TIÊU ĐỀ QUIZ CỦA CHƯƠNG */}

        <h2 className="quiz-title">{chapter.name}</h2>



        <p className="quiz-progress">

          Đã trả lời {answeredCount}/{total} câu

        </p>



        {/* DANH SÁCH CÂU HỎI */}

        {chapter.questions.map((q, qIndex) => {

          const picked = chapterAnswers[q.id];



          return (

            <div key={q.id} className="quiz-question">

              <div className="quiz-question-text">

                Câu {qIndex + 1}. {q.question}

              </div>



              {/* CÁC ĐÁP ÁN */}

              {q.options.map((opt, optIndex) => (

                <div

                  key={optIndex}

                  onClick={() => handleSelect(q.id, optIndex)}

                  className={getOptionClass(

                    picked,

                    optIndex,

                    q.answer

                  )}

                >

                  {String.fromCharCode(65 + optIndex)}. {opt}

                </div>

              ))}



              {/* GIẢI THÍCH SAU KHI NỘP BÀI */}

              {isSubmitted && (

                <div className="quiz-explanation">

                  <span

                    className={`quiz-verdict ${

                      picked === q.answer ? 'is-right' : 'is-wrong'

                    }`}

                  >

                    {picked === q.answer

                      ? 'Chính xác. '

                      : 'Chưa đúng. '}

                  </span>



                  {q.explanation}

                </div>

              )}

            </div>

          );

        })}



        {/* NỘP BÀI VÀ HIỂN THỊ KẾT QUẢ */}

        <div className="quiz-actions">

          {isSubmitted ? (

            <>

              <div className="quiz-result">

                Kết quả: {score}/{total} câu đúng

              </div>



              <button

                onClick={handleReset}

                className="quiz-btn quiz-btn-reset"

              >

                Làm lại chương này

              </button>

            </>

          ) : (

            <button

              onClick={handleSubmit}

              disabled={answeredCount < total}

              className="quiz-btn quiz-btn-submit"

            >

              {answeredCount < total

                ? `Còn ${total - answeredCount} câu chưa trả lời`

                : 'Nộp bài'}

            </button>

          )}

        </div>



      </div>

    </div>

  </div>

);

}
