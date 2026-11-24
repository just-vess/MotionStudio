# MotionStudio · từ lecture đến video 5 phút

Bộ dựng dành cho người đã có bài giảng, slide hoặc kịch bản gần hoàn chỉnh. Anh đưa tài liệu vào thư mục, mở Claude Code và yêu cầu dựng. Claude chuyển lời đã viết thành các cảnh, rồi Remotion xuất video trên máy. Cảnh mẫu trong repo kể một tình huống đặt phòng hư cấu, dài 40 giây để thử quy trình.

## Mở lần đầu

Cần Node.js từ 22 trở lên cùng npm, và Claude Code để chuyển nội dung bằng câu lệnh tiếng Việt. Với bản Git bundle, đặt file bundle vào một thư mục rồi chạy:

~~~sh
git clone motionstudio-starter.bundle MotionStudio
cd MotionStudio
npm ci
~~~

Nếu nhận file ZIP mã nguồn, giải nén, mở terminal ở thư mục có package.json rồi chạy `npm ci`. Trên Windows, nếu PowerShell chặn npm.ps1, dùng `npm.cmd` ở các lệnh. Lần cài và lần chạy đầu cần mạng để tải thư viện và trình duyệt render. [Node.js](https://nodejs.org/en/download) · [Claude Code](https://code.claude.com/docs/en/overview) · [Remotion](https://www.remotion.dev/docs/)

## Dựng bài của anh

1. Bỏ lecture và script vào `inputs/`. Có thể dùng PDF xuất từ slide, Markdown, TXT hoặc transcript. Nếu có bản ghi bài giảng dài, gửi kèm transcript có mốc phút để Claude chọn đúng đoạn. Thêm ảnh gốc hoặc bản thu lời nếu đã có.
2. Mở đúng thư mục repo trong Claude Code. Dán câu lệnh sau.

> /ecosystem-video Đọc lecture và script trong inputs/. Giữ ý, thứ tự và giọng của tôi. Chuyển thành storyboard 5 phút, ghi mỗi cảnh lấy từ slide hoặc đoạn nào. Dùng hình thật trong lecture nếu phù hợp. Cập nhật dữ liệu cảnh, chọn 30 giây thể hiện rõ cách hệ sinh thái vận hành rồi render bản mẫu để tôi xem.

3. Mở `out/pilot.mp4`. Ví dụ góp ý: “Ở cảnh bàn giao, cho hiện tên bên nhận đúng lúc tôi đọc đến tên họ.” Khi đã chốt, nói với Claude: “Dùng bản này dựng đủ 5 phút, xuất MP4 và gửi tôi ghi chú lời nói theo thời gian.”
4. Lấy video tại `out/ecosystem.mp4`, ghi chú ở `work/storyboard.md`. Nếu đang dùng Claude chat trên web, có thể đưa lecture vào chat để biên tập, rồi chuyển storyboard sang Claude Code trong thư mục này cho phần dựng và render.

## Các lệnh có sẵn

| Lệnh | Kết quả |
|---|---|
| npm run check | Kiểm tra cấu trúc, nguồn, thời lượng, mốc chuyển động và đường dẫn media. |
| npm run preview | Mở Remotion Studio, chọn Ecosystem để tua cả bài hoặc Pilot để xem trích đoạn. |
| npm run pilot | Xuất đoạn từ pilotStart, tối đa 30 giây, 960 × 540, vào out/pilot.mp4. |
| npm run render | Xuất tất cả các cảnh thành MP4 H.264, 1920 × 1080, 30 fps. |

Có thể chạy ngay các lệnh trên với ví dụ đi kèm. Bản mẫu dùng chế độ nói trực tiếp, nên MP4 mẫu chỉ có hình. Dòng narration trong storyboard là lời để thu hoặc dùng làm ghi chú.

## Chỉnh nội dung

`content/storyboard.json` là dữ liệu mà cả preview và hai lệnh render dùng chung. Mỗi cảnh có id, seconds, title, detail, narration, source và layout. Source ghi trang slide hoặc timestamp để tra lại. Tổng seconds của các cảnh phải bằng targetSeconds. Đặt 300 cho bài 5 phút. Pilot lấy đúng mốc trên bản dài, bao gồm âm thanh tại mốc đó.

| layout | Dùng khi | Dữ liệu thêm |
|---|---|---|
| statement | Chốt một ý, đặt câu hỏi, giới thiệu kết quả | title và detail |
| flow | Một đối tượng đi qua 2–4 bên | steps gồm at (giây tính từ đầu cảnh), label, result. Bước đầu ở giây 0 |
| image | Dùng slide, sơ đồ, ảnh màn hình của tác giả | image, ví dụ media/slide-04.png |

Đặt ảnh hoặc bản thu trong `public/media/`. Ví dụ, với file `public/media/voice.mp3`, đặt `"audio": "media/voice.mp3"` ở cấp cao nhất. Dùng một track lời đọc đã cắt cho đúng timeline. Nếu anh nói trực tiếp thì giữ `"audio": null`. Có thể mở rộng hình và chuyển động trong `src/index.jsx` và `src/style.css`.

Lecture, media, ghi chú và file render được bỏ qua khi commit Git theo mặc định. Storyboard JSON là file được Git theo dõi và có thể chứa lời thật sau khi biên tập. Bộ bàn giao gốc chỉ chứa ví dụ hư cấu.
