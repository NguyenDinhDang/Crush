/* =========================================================
   CẤU HÌNH TRANG WEB (CONFIG.JS)
   Chỉnh sửa các thông tin bên dưới để tùy biến trang web
========================================================= */

const CONFIG = {
  // Tên người ấy
  name: "Trang",

  // Tên file nhạc nền (đặt file nhạc cùng thư mục với index.html)
  musicFile: "aiduaemve.mp3",

  // Tự động cuộn trang (Thời gian tính bằng giây, ví dụ 7 = 7 giây, 0 = tắt)
  autoScrollSeconds: 7,

  // Tiêu đề thẻ trang web (Tab trình duyệt)
  pageTitle: "Trang ơi...",

  // Dòng chữ ở màn hình chờ (Loading)
  loadingText: "Đang chuẩn bị một điều đặc biệt dành cho Trang...",

  // Phần 1: Hero
  heroName: "Trang...",
  heroTypedText: "Anh có điều muốn nói...",
  scrollHint: "Kéo xuống",

  // Phần 2: Story (Những câu từ thổ lộ)
  storyLines: [
    { text: "Ngay từ lần đầu gặp em...", fx: "fade-up" },
    { text: "Có điều gì đó rất đặc biệt.", fx: "fade-up" },
    { text: "Càng nói chuyện...", fx: "blur-in" },
    { text: "Anh càng mong mỗi ngày đều được gặp em.", fx: "slide-right" },
    { text: "Em làm cho những ngày bình thường trở nên thật vui.", fx: "scale-in" },
    { text: "Anh không biết tương lai sẽ thế nào...", fx: "fade-up" },
    { text: "Nhưng anh muốn trong tương lai đó luôn có em.", fx: "scale-in", isAccent: true }
  ],

  // Phần 3: Timeline (Dòng thời gian - Sử dụng mã định danh icon Lucide)
  timelineTitle: "Câu chuyện của tụi mình",
  timelineItems: [
    {
      icon: "sparkles",
      title: "Lần đầu gặp",
      desc: "Một khoảnh khắc rất bình thường, nhưng lại trở thành khởi đầu.",
      direction: "slide-right"
    },
    {
      icon: "message-circle",
      title: "Lần đầu nói chuyện",
      desc: "Vài câu ngại ngùng, nhưng lại khiến anh nhớ mãi.",
      direction: "slide-left"
    },
    {
      icon: "coffee",
      title: "Những lần trò chuyện",
      desc: "Càng nói chuyện, anh càng thấy thoải mái và vui hơn.",
      direction: "slide-right"
    },
    {
      icon: "flower-2",
      title: "Những lần nhớ em",
      desc: "Có những hôm chẳng vì lý do gì, anh vẫn nghĩ về em.",
      direction: "slide-left"
    },
    {
      icon: "heart",
      title: "Hôm nay",
      desc: "Anh quyết định nói ra điều mà anh giữ trong lòng bấy lâu.",
      direction: "slide-right",
      isAccent: true
    }
  ],

  // Phần 4: Gallery (Kỷ niệm / Album)
  // Bạn có thể điền đường dẫn ảnh từ máy vào 'image' (ví dụ: "images/1.jpg" hoặc "anh1.png")
  galleryTitle: "Vài khoảnh khắc",
  polaroids: [
    { image: "", caption: "khoảnh khắc 01", rot: "-6deg" },
    { image: "", caption: "khoảnh khắc 02", rot: "4deg" },
    { image: "", caption: "khoảnh khắc 03", rot: "-3deg" },
    { image: "", caption: "khoảnh khắc 04", rot: "7deg" }
  ],

  // Phần 5: Trích dẫn (Quote)
  quoteLine1: "Đôi khi...",
  quoteLine2: "Hạnh phúc chỉ đơn giản là có ai đó để nhớ.",

  // Phần 6: Lời tỏ tình
  askName: "Trang...",
  askQuestion: "Làm người yêu anh nhé?",
  yesBtnText: "Đồng ý",
  noBtnText: "Không đồng ý",
  
  // Các câu chối từ khi bấm/rê chuột nút "Không"
  noDodgePhrases: [
    "Không đồng ý",
    "Em chắc chứ?",
    "Đừng mà...",
    "Nghĩ lại nha",
    "Không được đâu",
    "Anh buồn đó",
    "Thật sao em?",
    "Suy nghĩ lại chút đi mà"
  ],

  // Phần 7: Màn hình thành công khi chọn Đồng Ý
  successThankTitle: "Cảm ơn em",
  successLine1: "Từ hôm nay...",
  successLine2: "Anh sẽ cố gắng làm em hạnh phúc.",

  // Chân trang (Footer)
  footerText: "Made with love just for Thiên Trang",

  // Phần 8: Hiệu ứng 3D Heart Galaxy (Các câu chữ tình cảm bay lơ lửng trong không gian 3D)
  floatingRomanticTexts: [
    "Yêu em",
    "Forever",
    "Love you",
    "Em là điều tuyệt vời nhất",
    "Together",
    "Bình yên bên em"
  ],

  // Easter Egg (Mật mã Konami / Bấm phím mũi tên)
  konamiMessage: "Anh thích em rất nhiều."
};
