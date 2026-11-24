# MotionStudio · từ lecture đến video 5 phút

Bộ dựng dành cho người đã có bài giảng, slide hoặc kịch bản gần hoàn chỉnh. Bạn đưa tài liệu vào thư mục `inputs/`, mở Claude Code (hoặc phối hợp thêm Google AI Pro trong Antigravity) và yêu cầu dựng. Các agent sẽ soát nguồn, thiết kế cảnh kiểu TED-Ed và để Remotion xuất video ngay trên máy. Cảnh mẫu trong repo kể câu chuyện hư cấu về hai bến cảng (36 giây) để thử toàn bộ quy trình.

**Dùng Multi-Agent và Đa Mô Hình.** Xem [hướng dẫn Multi-Agent & Google AI Pro](docs/MULTI-MODEL.md) để chạy 3 subagent ngay trong Claude Code trên máy khách, hoặc chia vai Gemini (lập kế hoạch/tài sản) + Claude Code (dựng & render).

## Mở lần đầu

Cần Node.js từ 22 trở lên cùng npm, và Claude Code để điều phối bằng câu lệnh tiếng Việt:

```sh
git clone https://github.com/just-vess/MotionStudio.git
cd MotionStudio
npm ci
```

Nếu nhận file ZIP hoặc Git bundle ngoại tuyến, giải nén hoặc `git clone <ten-file>.bundle MotionStudio` rồi chạy `npm ci`. Trên Windows, nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd` ở các lệnh. Lần cài và lần chạy đầu cần mạng để tải thư viện và trình duyệt render của Remotion. [Node.js](https://nodejs.org/en/download) · [Claude Code](https://code.claude.com/docs/en/overview) · [Remotion](https://www.remotion.dev/docs/)

## Dựng bài của bạn

1. Bỏ lecture và script vào `inputs/`. Có thể dùng PDF xuất từ slide, Markdown, TXT hoặc transcript. Nếu có bản ghi bài giảng dài, gửi kèm transcript có mốc phút để agent chọn đúng đoạn. Thêm ảnh gốc hoặc bản thu lời vào `public/media/` nếu đã có.
2. Mở đúng thư mục repo trong Claude Code (tự động nạp `CLAUDE.md`, skill `/ecosystem-video` và các subagent trong `.claude/agents/`). Dán câu lệnh sau:

> `/ecosystem-video` Đọc lecture và script trong `inputs/`. Giữ ý và giọng của tôi. Mở bằng một câu hỏi có trong bài, chọn một ẩn dụ giúp nhìn thấy cơ chế rồi nối về ví dụ thật trong lecture. Chuyển thành storyboard 5 phút, ghi nguồn cho từng cảnh, chọn 30 giây khó nhất để dựng thử rồi kiểm tra lại bản pilot.

3. Mở `out/pilot.mp4` và bảng khung `out/review-pilot.html`. Ví dụ góp ý: “Ở cảnh S03, giây 0:12, cho hiện tên bên nhận đúng lúc tôi đọc đến tên họ.” Khi đã chốt, yêu cầu Claude dựng đủ 5 phút (`npm run render` + `npm run review`) và xuất ghi chú `work/storyboard.md`.

## Kiến trúc Multi-Agent trong repo

- `CLAUDE.md` + `.claude/agents/`: định nghĩa 3 subagent cho Claude Code — `source-reviewer` (`haiku`, chỉ đọc để soát trích dẫn/mốc nguồn), `visual-director` (`sonnet`, thiết kế ẩn dụ TED-Ed và nhịp camera) và `video-qa` (`haiku`, kiểm tra storyboard + MP4 sau render).
- `.claude/skills/ecosystem-video/SKILL.md`: skill `/ecosystem-video` điều phối chạy song song 2 agent đầu khi làm thẳng trên Claude Code, hoặc nhận `work/video-plan.md` khi bàn giao từ Gemini.
- `.agents/skills/lecture-production/SKILL.md` + `workflows/lecture_plan.py`: skill và Dynamic Workflow cho Google Antigravity (`flash` + `pro` song song -> `pro` tổng hợp `work/video-plan.md`).

## Các lệnh có sẵn

| Lệnh | Kết quả |
|---|---|
| `npm run check` | Kiểm tra cấu trúc, nguồn, thời lượng 30 fps, camera/ease/rotate và đường dẫn media. |
| `npm run preview` | Mở Remotion Studio, chọn `Ecosystem` để tua cả bài hoặc `Pilot` để xem trích đoạn. |
| `npm run pilot` | Xuất đoạn 30 giây từ `pilotStart`, 960 × 540, vào `out/pilot.mp4`. |
| `npm run review:pilot` | Kiểm tra thời lượng MP4 pilot và xuất bảng khung hình vào `out/review-pilot.html`. |
| `npm run render` | Xuất tất cả các cảnh thành MP4 H.264, 1920 × 1080, 30 fps vào `out/ecosystem.mp4`. |
| `npm run review` | Kiểm tra bản đầy đủ (kèm audio nếu khai báo) và xuất bảng khung hình `out/review.html`. |

Có thể chạy ngay các lệnh trên với ví dụ đi kèm. Bản mẫu dùng chế độ nói trực tiếp (`"audio": null`), nên MP4 mẫu chỉ có hình; dòng `narration` trong storyboard là lời để thu hoặc dùng làm ghi chú.

## Chỉnh nội dung

`content/storyboard.json` là dữ liệu mà cả preview, render và review dùng chung. Mỗi cảnh có `id`, `seconds`, `title`, `detail`, `narration`, `source` và `layout`. `source` ghi trang slide hoặc timestamp để tra lại. Tổng `seconds` của các cảnh phải bằng `targetSeconds` (đặt `300` cho bài 5 phút). `pilot` cắt đúng 30 giây từ `pilotStart`, bao gồm âm thanh tại mốc đó.

| layout | Dùng khi | Dữ liệu thêm |
|---|---|---|
| `illustration` | Kể chuyện bằng tranh nhiều lớp, chuyển động và camera theo lời | `layers`, `cues`, tùy chọn `camera`, `showTitle`. Mẫu đầy đủ ở cảnh `hai-ben-cang` |
| `statement` | Chốt một ý, đặt câu hỏi, giới thiệu kết quả | `title` và `detail` |
| `flow` | Một đối tượng đi qua 2–4 bên | `steps` gồm `at` (giây từ đầu cảnh), `label`, `result`. Bước đầu ở giây 0 |
| `video` | Ghép clip MP4 ngắn, dựng âm thanh theo track lời chung | `video` (vd `media/S05.mp4`), `trimStart` (giây, tùy chọn) và `cues` (tùy chọn) |
| `image` | Dùng slide, sơ đồ, ảnh màn hình của tác giả | `image` (vd `media/slide-04.png`) |

Đặt ảnh, clip MP4 hoặc bản thu trong `public/media/`. Ví dụ, với file `public/media/voice.mp3`, đặt `"audio": "media/voice.mp3"` ở cấp cao nhất; nếu nói trực tiếp thì giữ `"audio": null`. Có thể mở rộng hình và hiệu ứng trong `src/index.jsx` và `src/style.css`.

Lecture (`inputs/`), tài sản tải thêm (`public/media/*`), ghi chú (`work/`) và file render (`out/`) được bỏ qua khi commit Git theo mặc định. `content/storyboard.json` được Git theo dõi nên tránh commit nội dung nội bộ nếu đẩy lên kho công khai.

## Dựng một cảnh minh họa mới

Tách tranh thành lớp nền, vật chuyển động và chi tiết chỉ xuất hiện khi lời kể nhắc tới (SVG hoặc PNG nền trong đặt trong `public/media/`; 4 file trong `public/art/` là tranh mẫu bàn giao). Mỗi lớp có `file`, `width`, tùy chọn `pivot` (`[0..1, 0..1]`, mặc định `[0, 0]`) và mảng `keys`. Mỗi key có `at` (giây trong cảnh, khớp 30 fps), `x`, `y` (góc trên trái trên khung `1600 × 900`), `scale`, `opacity` (`0–1`), tùy chọn `rotate` (độ) và `ease` (`linear`, `in`, `out`, `smooth`, `hold`).

Cảnh `illustration` hỗ trợ thêm:
- `camera`: mảng key `(at, x, y, scale, ease)` với `(x, y)` là tâm khung ngắm trên sân khấu `1600 × 900` (toàn cảnh mặc định là `x: 800, y: 450, scale: 1`).
- `showTitle`: đặt `false` nếu không muốn hiện tiêu đề đè lên khung hình.
- `cues`: mảng phụ đề `(at, text, end?)`; đặt `end` (tính theo giây trong cảnh) để tắt phụ đề sớm tạo khoảng lặng trước câu sau. Key, camera (nếu có) và cue đầu tiên luôn bắt đầu ở `at: 0`.

Xem phần [đánh giá 16 repo và quyết định chọn công cụ](docs/REPO-RESEARCH.md) để hiểu lựa chọn dựng, khớp tiếng và mở rộng bộ tranh.
