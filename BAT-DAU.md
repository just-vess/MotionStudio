# Bắt đầu nhanh trên máy có Claude Code

Xem [hướng dẫn đầy đủ trong README](README.md) và [hướng dẫn Multi-Agent](docs/MULTI-MODEL.md).

1. Clone repo và cài thư viện (cần Node.js >= 22):

```sh
git clone https://github.com/just-vess/MotionStudio.git
cd MotionStudio
npm ci
```

*(Trên Windows PowerShell, dùng `npm.cmd ci` nếu `npm.ps1` bị chặn.)*

2. Đặt lecture, slide (PDF/MD) và script hoặc transcript vào `inputs/`. Nếu đã có ảnh, clip MP4 hoặc bản thu giọng, bỏ vào `public/media/`.
3. Mở thư mục dự án trong Claude Code (tự nhận `CLAUDE.md` và 3 subagent trong `.claude/agents/`) rồi dán:

> `/ecosystem-video` Dùng lecture và script trong `inputs/` để dựng video 5 phút cho đồng nghiệp. Giữ lời chính của tôi, trích nguồn cho từng cảnh, thiết kế nhịp camera và chuyển động kiểu TED-Ed, rồi render và kiểm tra đoạn mẫu 30 giây.

4. Mở `out/pilot.mp4` và bảng khung `out/review-pilot.html` để xem thử. Góp ý theo `mã cảnh / mốc giây / cách sửa`, rồi yêu cầu Claude xuất bản đủ 5 phút (`out/ecosystem.mp4` và `out/review.html`).
