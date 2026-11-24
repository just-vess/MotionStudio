---
name: ecosystem-video
description: Dùng lecture, slide và script sẵn có để dựng motion graphics trong repo này, từ chia cảnh, điều phối subagent và đồng bộ lời đọc đến preview, pilot, review và MP4 năm phút.
---

# Dựng video từ lecture đã có

## Điều phối đa tác tử (Multi-Agent) trong Claude Code

Luồng chính đóng vai trò điều phối (orchestrator) và trực tiếp chỉnh `content/storyboard.json`, asset hoặc code Remotion. Tận dụng 3 subagent trong `.claude/agents/` để tách biệt đọc nguồn, đạo diễn hình và kiểm định:

1. **Nếu đã có `work/video-plan.md`** (bàn giao từ Google AI Pro / Antigravity):
   - Gọi subagent `source-reviewer` kiểm tra chéo các câu thoại và nguồn trích dẫn trong `work/video-plan.md` so với `inputs/`.
   - Luồng chính giữ nguyên mã cảnh (`S01`, `S02`...) và lời đã duyệt, chuyển thành `content/storyboard.json`, xuất `work/storyboard.md` và chạy `npm run pilot`.
   - Gọi subagent `video-qa` chạy `npm run check` và `npm run review:pilot` để nghiệm thu `out/pilot.mp4` cùng `out/review-pilot.html`.
2. **Nếu chưa có `work/video-plan.md`** (chạy độc lập trên máy chỉ có Claude Code):
   - Gọi **song song** hai subagent `source-reviewer` (`haiku`, soát `inputs/`) và `visual-director` (`sonnet`, thiết kế ẩn dụ TED-Ed, nhịp camera, `ease` và đoạn pilot 30 giây).
   - Luồng chính hợp nhất kết quả thành `work/video-plan.md` và `work/storyboard.md`, dựng scene trong `content/storyboard.json`, rồi chạy `npm run pilot`.
   - Gọi subagent `video-qa` nghiệm thu bằng `npm run check` và `npm run review:pilot`. Khi người dùng chốt bản dài, chạy `npm run render` rồi gọi `video-qa` chạy `npm run review`.

Nếu `inputs/` chưa có file nào ngoài `.gitkeep`, dừng lại hướng dẫn người dùng bỏ lecture, slide hoặc script vào `inputs/` trước khi suy đoán nội dung.

## Nhận bàn giao từ Gemini hoặc kế hoạch đã duyệt

Khi có `work/video-plan.md`, dùng nó làm bản phân cảnh đầu vào và đối chiếu với `inputs/` qua `source-reviewer`. Giữ mã cảnh, lời đã duyệt và chỉ dựng phần người dùng yêu cầu. Nếu bản kế hoạch và script gốc khác nhau, ưu tiên bản lời đã duyệt trong `inputs/`.

Với clip Flow hoặc video ngắn đã tải về `public/media/`, dùng layout `video`, trường `video` là đường dẫn dạng `media/ten-clip.mp4`, và `trimStart` (tính bằng giây, khớp frame 30 fps) nếu cần cắt phần mở đầu. Chọn thời lượng cảnh nằm trong phần có thật của clip. Renderer tự tắt tiếng clip để track lời chung kiểm soát âm thanh; có thể thêm mảng `cues` để hiện phụ đề theo nhịp đọc ngay trên clip. Nếu chưa có clip, dùng ngay phương án dự phòng bằng ảnh hoặc nhiều lớp hình `illustration`.

## Đọc nguồn và lập bản dựng

1. Đọc `README.md`, `content/storyboard.json` và tài liệu trong `inputs/` (hoặc giao cho `source-reviewer`). Ưu tiên thứ tự, giọng văn, thuật ngữ và các câu đã chốt trong script. Dùng lecture để tìm đúng hình hoặc bằng chứng cho từng câu. Nếu người dùng cho hai bản khác nhau, ghi rõ bản đang dùng. Giữ nguyên tệp gốc trong `inputs/`.
2. Với slide, ghi trang hoặc số slide. Với transcript, ghi timestamp hoặc đoạn. Nếu không đọc được định dạng, thử công cụ cục bộ hiện có để trích nội dung. Nếu vẫn thiếu lời hoặc hình, chỉ hỏi đúng phần cần thiết, ví dụ bản xuất PDF hoặc transcript có timestamp.
3. Nếu script dài hơn 5 phút khi đọc thử, đề xuất cụ thể câu có thể rút và giữ ý gốc trong ghi chú. Phân biệt kết quả thật với kế hoạch theo cách tác giả đã nói. Dùng bản đọc và thời lượng đo được để chia cảnh. Với lời chưa thu, ghi rõ mốc tạm. Chỉ hỏi khi thiếu dữ liệu làm thay đổi ý tác giả.
4. Viết `work/storyboard.md` cho chủ dự án đọc, gồm mốc đầu/cuối, mã cảnh, lời đọc nguyên văn, ý trên màn hình, chuyển động, hình cần dùng và nguồn. Ghi các chỗ chờ xác nhận riêng. Dùng chữ tiếng Việt ngắn đủ đọc trong phòng họp. Chọn đoạn mẫu chứa một chuyển giao hoặc cơ chế nhân–quả quan trọng. Có thể thêm layout mới vào renderer khi ý trong lecture cần hình khác.

## Biên tập hình cho một bài giải thích

Chọn câu hỏi mà khán giả có thể tự dự đoán câu trả lời. Lấy một hình ảnh quen thuộc từ chính lecture nếu có. Kể bằng một chuỗi hành động có quan hệ nhân quả. Cuối đoạn quay về đối tượng thật, nói rõ phần nào của hình minh họa tương ứng với cơ chế đang giải thích. Ghi cho từng nhịp một cụm từ trong script, mốc đọc, điều cần nhìn thấy, và vật nào đổi trạng thái. Với phép ví, đánh dấu điểm khác với thực tế để lời kết chính xác.

Dựng một khung hình tiêu biểu để chọn bảng màu và các đối tượng sẽ lặp lại. Sau đó dựng animatic (bản nháp có tranh, thứ tự cảnh và lời tạm) cho đoạn có cơ chế khó nhất. Trong phòng chiếu 16:9, ưu tiên dựng cả không gian ngay từ đầu rồi cho người xem theo vật đang đổi vị trí. Thay đổi góc nhìn khi cần lộ ra quan hệ mới. Dùng lại đối tượng qua các cảnh để khán giả nhận ra. Có thể dùng ảnh slide thật khi quay về ứng dụng dự án. Ví dụ “hai bến cảng” chỉ minh họa kỹ thuật, hãy chọn hình của riêng bài này.

## Đạo diễn chuyển động và khớp tiếng

Trong storyboard của mỗi đoạn giải thích, ghi vật người xem đang theo, vị trí đầu và cuối của nó, điều làm nó chuyển động, kết quả nhìn thấy và cụm từ trong lời dẫn khớp với kết quả. Dành một nhịp để người xem kịp nhận ra trạng thái ban đầu trước khi vật di chuyển. Cho vật dừng lại đủ lâu ở trạng thái cuối. Nếu hình chỉ lặp lại câu đang đọc, hãy tìm một thay đổi quan sát được hoặc đưa lên một bằng chứng từ lecture.

Chọn cỡ cảnh theo câu hỏi của đoạn. Toàn cảnh cho thấy các bên ở đâu. Cận cảnh cho biết hành động nào kích hoạt thay đổi. Quay lại toàn cảnh để thấy hệ quả ở bên nhận. Qua điểm cắt, giữ hướng di chuyển và vị trí tương đối của hai bên. Có thể nối hai cảnh bằng cách giữ cùng vật ở cùng vùng khung hình. Cho nền chuyển động nhẹ nếu chuyển động đó giúp nhìn ra hướng, khoảng cách hoặc thời gian. Chọn một vùng ảnh cần thu hút ánh mắt trong mỗi nhịp.

Dùng lớp minh họa độc lập (`illustration`) để vẽ hoạt động của dự án. Thiết kế màu riêng cho vật, thông tin và kết quả, dùng cùng quy ước đến cuối bài. Ưu tiên hình thật hoặc hình vẽ của dự án cho các trạng thái cần kiểm chứng. Với chủ đề mới, bố trí các lớp SVG/PNG trong `public/media/` hoặc viết component React mới trong `src/` khi cơ chế trong lecture cần tương tác đặc thù.

Với layout `illustration`, các tùy chọn dưới đây giúp diễn tả hành động bằng các mốc thời gian tính từ đầu cảnh. Mỗi mốc cần khớp một frame ở 30 fps:

- `scene.camera` là mảng key có `at, x, y, scale`. Tọa độ là tâm ống kính trên khung `1600 × 900`. Ví dụ, khung toàn cảnh bắt đầu với `{"at":0,"x":800,"y":450,"scale":1}`. Thêm `{"at":2,"x":1120,"y":510,"scale":1.65,"ease":"smooth"}` để tiến đến một chi tiết trong 2 giây. Kiểm tra mép tranh khi lia hoặc phóng. Giữ camera đứng yên lúc người xem cần đọc.
- `ease` đặt trên key đích của camera hoặc lớp hình. `smooth` cho nhịp tăng tốc rồi giảm tốc, `in` cho nhịp lấy đà, `out` cho động tác chậm dần, `linear` cho tốc độ đều. `hold` giữ nguyên trạng thái trước rồi nhảy ở đúng frame đích, hợp với cắt cảnh. Mặc định là `linear`.
- Layer key có thêm `rotate` theo độ. Ví dụ lớp biển hiệu dùng `"pivot":[0.5,0]` để xoay quanh chính giữa cạnh trên. `x, y` của lớp là tọa độ góc trên trái trước khi xoay. Cần ghi giá trị `rotate` trên cả hai key nếu góc xoay phải giữ nguyên trong khoảng.
- Đặt `"showTitle":false` khi lời dẫn và hình đã giới thiệu bối cảnh. Trường `end` trong một cue phụ đề cho phép dừng phụ đề sớm để chừa nhịp lặng trước cue tiếp theo (hoặc trước cuối cảnh).

Xem animatic ở hai lượt. Lượt đầu tắt tiếng và che phụ đề khi kiểm tra xem hình có thể hiện đúng nguyên nhân, hướng đi và kết quả. Lượt hai phát với bản đọc của tác giả, đánh dấu câu đến sớm hoặc muộn bằng giây cụ thể, chỉnh các key liên quan và phát lại ở tốc độ thật. Khi người trình bày dùng giọng trực tiếp, lấy mốc từ lần họ nói thử.

## Chuyển storyboard thành video

- Dùng layout `illustration` cho cảnh kể bằng hình. Lớp nền, nhân vật hoặc vật thể là file SVG/PNG riêng đặt trong `public/media/`. Gắn từng chuyển động vào từ khóa trong câu nói qua `layers[].keys[].at`. Đặt `cues` theo nhịp đọc, giữ ngắn khi đã có voice. Dùng hướng dẫn tọa độ trong `README.md` và các quy ước camera ở trên.
- Cập nhật `content/storyboard.json` theo cấu trúc trong `README.md`. Thay toàn bộ nội dung minh họa bằng các cảnh của dự án. Mặc định đặt `targetSeconds` là `300`. Chọn `pilotStart` để đoạn mẫu có đủ 30 giây. Sau mỗi thay đổi chạy `npm run check`.
- Khi có slide hoặc ảnh, trích hình từ chính lecture vào `public/media/`. Đặt asset dùng cho scene `image` và đối chiếu lại nhãn, chữ, tỷ lệ ảnh. Với luồng phối hợp, đặt mốc `steps[].at` đúng lúc lời nói nhắc đến từng bước. Nếu có voice-over, đặt đường dẫn `audio` đến bản thu cuối và thử đồng bộ câu đầu, giữa và cuối. Nếu lecture ghi hình dài, lấy phần đã chọn và chuẩn bị track nói độ dài phù hợp trước khi gắn. Khi người nói trực tiếp, để `audio` là `null` và dùng `work/storyboard.md` làm ghi chú.
- Dùng Remotion đã có trong repo. Nếu thiếu dependency, dùng `npm ci`. Khi người dùng yêu cầu dựng mẫu, chạy `npm run pilot` rồi kiểm tra bằng `npm run review:pilot` (hoặc giao cho `video-qa`), sau đó đưa đường dẫn `out/pilot.mp4` và `out/review-pilot.html`. Khi có góp ý, sửa đúng mã cảnh và render lại đoạn liên quan. Khi yêu cầu xuất bản dài, chạy `npm run render` rồi `npm run review`, giao `out/ecosystem.mp4`, `out/review.html` và `work/storyboard.md`. Có thể dùng `npm run preview` để tua và xem từng cảnh.
- Trước khi giao, phát thử file xuất, đối chiếu thời lượng thực tế, hình bị cắt, dấu tiếng Việt, cỡ chữ và tiếng nếu có. Báo rõ giá trị nào lấy từ `check`/`review` hay file render thực tế và việc nào còn cần người trình bày nghe hoặc xem. Nếu lỗi, đọc lỗi đầu tiên, sửa và chạy lại bước đang làm.
