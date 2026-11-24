# Bản bàn giao cho người dựng

Lưu bản này ở `work/video-plan.md`. Giữ nguyên các mã cảnh (`S01`, `S02`...) khi sửa theo phản hồi. Các ví dụ trong repo dùng câu chuyện hai bến cảng hư cấu.

## Nội dung mở đầu

- Nêu câu hỏi dẫn và câu trả lời mà đồng nghiệp cần nhớ trong một câu.
- Ghi tên từng file nguồn cùng trang slide, đoạn script hoặc timestamp.
- Ghi thời lượng bài (mặc định 300 giây), trạng thái bản thu lời và cách dùng nhạc, phụ đề nếu có.

## Từng cảnh

| Mã | Đầu–cuối | Lời nguyên văn | Nguồn | Hành động nhìn thấy & Camera | Dựng bằng |
|---|---|---|---|---|---|
| S01 | 0:00–0:08 | Câu đã chốt | Slide hoặc mốc | Trạng thái trước → kích hoạt → kết quả; góc máy (`toàn cảnh` / `cận cảnh` / `lia`) | `illustration` / `flow` / `image` / `video` / `statement` |

Mốc chuyển động nên bám cụm từ mà người nói dùng để gọi tên sự thay đổi (khớp frame 30 fps). Với phép ví dụ minh họa, ghi đối tượng nào trong hình tương ứng với thành phần nào trong dự án thật và điểm khác biệt cần lưu ý. Nếu thiếu bằng chứng, ghi “cần xác nhận” và vị trí nguồn còn thiếu.

Với cảnh `illustration`, có thể ghi chú thêm cho người dựng các thông số hỗ trợ sẵn trong renderer (`src/Illustration.jsx`):
- `camera`: mảng key `(at, x, y, scale)` trên khung `1600 × 900` để lia hoặc phóng mượt tới chi tiết kích hoạt.
- `ease`: `smooth` (mượt), `in`, `out`, `linear`, hoặc `hold` (nhảy dứt khoát như cắt cảnh).
- `rotate` và `pivot`: góc xoay theo độ và tâm xoay chuẩn hóa `[0..1, 0..1]`.
- `showTitle: false` khi không cần tiêu đề đè lên tranh, và `cue.end` khi muốn ngắt phụ đề tạo nhịp lặng trước câu sau.

## Bàn giao tài sản

Với mỗi ảnh hoặc clip, ghi mã cảnh, tên file đích trong `public/media/`, đầu vào tham chiếu, thời lượng và `trimStart` nếu là clip MP4 (`video` layout tự tắt tiếng clip và hỗ trợ `cues` phụ đề), prompt tiếng Anh ngắn và phương án dự phòng bằng ảnh tĩnh hoặc lớp SVG/Remotion. Chỉ chọn clip khi hành động khó thể hiện bằng layer. Một cảnh nhiều lớp cần nêu rõ tiền cảnh, vật thể chuyển động, hậu cảnh và vị trí giữ cho chữ hoặc phụ đề.

## Duyệt

Chọn đoạn gần 30 giây (`pilotStart`) có quan hệ nhân quả khó nhất. Ghi mốc đầu, lý do chọn và một câu hỏi để hỏi người xem. Sau lần render đầu (`npm run pilot` và `npm run review:pilot`), xem `out/pilot.mp4` cùng bảng khung `out/review-pilot.html` rồi ghi nhận xét theo mẫu `mã cảnh / mốc / điều hiểu sai / cách sửa`.
