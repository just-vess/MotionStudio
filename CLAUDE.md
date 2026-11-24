# MotionStudio · Hướng dẫn cho Claude Code

## Bản đồ thư mục
- `inputs/`: lecture, slide PDF/MD, script và transcript gốc (chỉ đọc, không sửa).
- `public/media/`: ảnh trích từ slide, ảnh tạo bằng Gemini/Nano Banana, clip MP4 từ Flow và file thu lời.
- `content/storyboard.json`: dữ liệu cảnh dùng chung cho preview, pilot và render Full HD.
- `work/video-plan.md`: bản bàn giao do Antigravity/Gemini hoặc Claude tổng hợp trước khi dựng.
- `work/storyboard.md`: ghi chú từng cảnh theo mốc giây để chủ dự án đọc và duyệt.
- `out/`: video `pilot.mp4`, `ecosystem.mp4` và bảng khung kiểm tra `review-pilot.html`, `review.html`.

## Lệnh chính (trên Windows PowerShell dùng `npm.cmd` nếu bị chặn `npm.ps1`)
- `npm run check`: kiểm tra cấu trúc, nguồn, thời lượng 30 fps, camera/ease/rotate và file media.
- `npm run preview`: mở Remotion Studio để tua kiểm tra `Ecosystem` và `Pilot`.
- `npm run pilot`: xuất đoạn 30 giây từ `pilotStart` ra `out/pilot.mp4` (960 × 540).
- `npm run review:pilot`: kiểm tra thời lượng MP4 và trích bảng khung hình ra `out/review-pilot.html`.
- `npm run render`: xuất toàn bộ timeline (mặc định 300 giây) ra `out/ecosystem.mp4` (1920 × 1080).
- `npm run review`: kiểm tra bản dài và xuất bảng khung hình ra `out/review.html`.

## Quy tắc kiểm chứng dữ kiện
- Giữ nguyên câu chữ đã duyệt trong script; chỉ rút gọn khi có yêu cầu hoặc ghi rõ phần rút vào ghi chú.
- Mỗi cảnh trong `content/storyboard.json` phải có `source` gắn đúng số slide, đoạn script hoặc timestamp trong `inputs/`. Không tự bịa số liệu hay kết quả; chỗ thiếu phải ghi `cần xác nhận`.
- Không sửa các file gốc trong `inputs/`. Sau mỗi lần sửa `content/storyboard.json`, luôn chạy `npm run check`.

## Quy trình Multi-Agent trong Claude Code
Điểm vào chính là `/ecosystem-video` (định nghĩa ở `.claude/skills/ecosystem-video/SKILL.md`), phối hợp với 3 subagent trong `.claude/agents/`:
- `@source-reviewer` (`haiku`, chỉ đọc): rà `inputs/`, trích nguyên văn câu chốt, map nguồn và phát hiện chỗ thiếu hoặc mâu thuẫn.
- `@visual-director` (`sonnet`, chỉ đọc): thiết kế ẩn dụ TED-Ed, nhịp camera, `ease`/`rotate`/`pivot` và chọn pilot 30 giây.
- `@video-qa` (`haiku`, Read + Bash): chạy `npm run check` và `npm run review:pilot` (hoặc `npm run review`), đối chiếu nguồn, phụ đề và thời lượng sau render.

Hai kịch bản vận hành:
1. **Máy khách chỉ có Claude Code** (chưa có `work/video-plan.md`): chạy song song `@source-reviewer` và `@visual-director` trên `inputs/`, hợp nhất thành `work/video-plan.md` và `work/storyboard.md`, dựng Remotion trong luồng chính, render pilot rồi gọi `@video-qa`.
2. **Đã có bàn giao từ Google AI Pro / Antigravity** (đã có `work/video-plan.md`): gọi `@source-reviewer` kiểm tra chéo `work/video-plan.md` với `inputs/`, giữ nguyên mã cảnh khi dựng Remotion và dùng `@video-qa` nghiệm thu sau mỗi lần render.
