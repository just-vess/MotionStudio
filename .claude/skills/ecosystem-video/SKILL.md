---
name: ecosystem-video
description: Dùng lecture, slide và script sẵn có để dựng motion graphics trong repo này, từ chia cảnh và đồng bộ lời đọc đến preview, pilot và MP4 năm phút.
---

# Dựng video từ lecture đã có

## Nhận bàn giao từ Gemini

Nếu có work/video-plan.md, dùng nó làm bản phân cảnh đầu vào và kiểm tra các trích dẫn chính với inputs/. Giữ mã cảnh, lời đã duyệt và chỉ dựng phần người dùng yêu cầu. Nếu Gemini và script khác nhau, ưu tiên bản lời đã duyệt. Với clip Flow đã tải, dùng layout video, video là đường dẫn trong media/ và trimStart nếu cần cắt phần mở. Chọn thời lượng cảnh nằm trong phần có thật của clip. Render clip ở chế độ tắt tiếng để track lời của bài kiểm soát âm thanh. Nếu chưa có clip, dựng từ ảnh hay lớp hình hiện có.

## Đọc nguồn và lập bản dựng

1. Đọc README.md, content/storyboard.json và tài liệu trong inputs/. Ưu tiên thứ tự, giọng văn, thuật ngữ và các câu đã chốt trong script. Dùng lecture để tìm đúng hình hoặc bằng chứng cho từng câu. Nếu người dùng cho hai bản khác nhau, ghi rõ bản đang dùng. Giữ nguyên tệp gốc.
2. Với slide, ghi trang hoặc số slide. Với transcript, ghi timestamp hoặc đoạn. Nếu không đọc được định dạng, thử công cụ cục bộ hiện có để trích nội dung. Nếu vẫn thiếu lời hoặc hình, chỉ hỏi đúng phần cần thiết, ví dụ bản xuất PDF hoặc transcript có timestamp. Nếu đầu vào trống, hướng dẫn đặt tài liệu vào inputs/ và giới thiệu cách chạy bản mẫu.
3. Nếu script dài hơn 5 phút khi đọc thử, đề xuất cụ thể câu có thể rút và giữ ý gốc trong ghi chú. Phân biệt kết quả thật với kế hoạch theo cách tác giả đã nói. Dùng bản đọc và thời lượng đo được để chia cảnh. Với lời chưa thu, ghi rõ mốc tạm. Chỉ hỏi khi thiếu dữ liệu làm thay đổi ý tác giả.
4. Viết work/storyboard.md cho chủ dự án đọc, gồm mốc đầu/cuối, mã cảnh, lời đọc nguyên văn, ý trên màn hình, chuyển động, hình cần dùng và nguồn. Ghi các chỗ chờ xác nhận riêng. Dùng chữ tiếng Việt ngắn đủ đọc trong phòng họp. Chọn đoạn mẫu chứa một chuyển giao quan trọng. Có thể thêm layout mới vào renderer khi ý trong lecture cần hình khác.

## Biên tập hình cho một bài giải thích

Chọn câu hỏi mà khán giả có thể tự dự đoán câu trả lời. Lấy một hình ảnh quen thuộc từ chính lecture nếu có. Kể bằng một chuỗi hành động có quan hệ nhân quả. Cuối đoạn quay về đối tượng thật, nói rõ phần nào của hình minh họa tương ứng với cơ chế đang giải thích. Ghi cho từng nhịp một cụm từ trong script, mốc đọc, điều cần nhìn thấy, và vật nào đổi trạng thái. Với phép ví, đánh dấu điểm khác với thực tế để lời kết chính xác.

Dựng một khung hình tiêu biểu để chọn bảng màu và các đối tượng sẽ lặp lại. Sau đó dựng animatic (bản nháp có tranh, thứ tự cảnh và lời tạm) cho đoạn có cơ chế khó nhất. Trong phòng chiếu 16:9, ưu tiên dựng cả không gian ngay từ đầu rồi cho người xem theo vật đang đổi vị trí. Thay đổi góc nhìn khi cần lộ ra quan hệ mới. Dùng lại đối tượng qua các cảnh để khán giả nhận ra. Có thể dùng ảnh slide thật khi quay về ứng dụng dự án. Ví dụ “hai bến cảng” chỉ minh họa kỹ thuật, hãy chọn hình của riêng bài này.

## Chuyển storyboard thành video

- Dùng layout illustration cho cảnh kể bằng hình. Lớp nền, nhân vật hoặc vật thể là file SVG/PNG riêng. Gắn từng chuyển động vào từ khóa trong câu nói qua layers[].keys[].at. Đặt cues theo nhịp đọc, giữ ngắn khi đã có voice. Xem scene hai bến cảng trong content/storyboard.json và hướng dẫn tọa độ trong README.md.
- Cập nhật content/storyboard.json theo cấu trúc trong README.md. Thay toàn bộ nội dung minh họa bằng các cảnh của dự án. Mặc định đặt targetSeconds là 300. Chọn pilotStart để đoạn mẫu có đủ 30 giây. Sau mỗi thay đổi chạy npm run check.
- Khi có slide hoặc ảnh, trích hình từ chính lecture vào public/media/. Đặt asset dùng cho scene image và đối chiếu lại nhãn, chữ, tỷ lệ ảnh. Với luồng phối hợp, đặt mốc steps[].at đúng lúc lời nói nhắc đến từng bước. Nếu có voice-over, đặt đường dẫn audio đến bản thu cuối và thử đồng bộ câu đầu, giữa và cuối. Nếu lecture ghi hình dài, lấy phần đã chọn và chuẩn bị track nói độ dài phù hợp trước khi gắn. Khi người nói trực tiếp, để audio là null và dùng storyboard làm ghi chú.
- Dùng Remotion đã có trong repo. Nếu thiếu dependency, dùng npm ci. Khi người dùng yêu cầu dựng, chạy npm run pilot và đưa đường dẫn video. Khi có góp ý, sửa đúng mã cảnh và render lại đoạn liên quan. Khi yêu cầu xuất bản dài, chạy npm run render và giao out/ecosystem.mp4 cùng work/storyboard.md. Có thể dùng npm run preview để tua và xem từng cảnh.
- Trước khi giao, phát thử file xuất, đối chiếu thời lượng thực tế, hình bị cắt, dấu tiếng Việt, cỡ chữ và tiếng nếu có. Báo rõ giá trị nào lấy từ render hay kiểm tra file và việc nào còn cần người trình bày nghe hoặc xem. Nếu lỗi, đọc lỗi đầu tiên, sửa và chạy lại bước đang làm.
