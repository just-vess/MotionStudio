# MotionStudio · Hướng dẫn chạy Multi-Agent và Đa Mô Hình

Cùng một thư mục dự án có thể chạy **thuần Claude Code** (multi-agent trên máy khách) hoặc **kết hợp Google AI Pro (Antigravity) với Claude Code**, không cần mua thêm API ngoài.

## Lựa chọn 1: Máy chỉ có Claude Code (Claude Multi-Agent)

Phù hợp khi cài thẳng repo trên máy của chủ dự án hoặc máy khách chỉ đăng nhập Claude Code. Repo đã cấu hình sẵn `CLAUDE.md`, skill `/ecosystem-video` và 3 subagent chuyên biệt trong `.claude/agents/`:

| Thành phần | Model | Quyền & Vai trò |
|---|---|---|
| Luồng chính (`/ecosystem-video`) | Model phiên chính (Sonnet/Opus) | Điều phối, hợp nhất kế hoạch, sửa `content/storyboard.json` / React và render MP4 |
| `@source-reviewer` | `haiku` | Chỉ đọc `inputs/`; trích nguyên văn câu chốt, gắn slide/timestamp và chỉ ra chỗ thiếu |
| `@visual-director` | `sonnet` | Chỉ đọc `inputs/`; thiết kế ẩn dụ TED-Ed, góc máy (`camera`), `ease` và chọn pilot 30 giây |
| `@video-qa` | `haiku` | Chạy `npm run check` và `npm run review:pilot` / `npm run review`, đối chiếu nguồn và bảng khung |

**Các bước chạy trên máy khách:**
1. Clone repo và cài gói:
   ```sh
   git clone https://github.com/just-vess/MotionStudio.git
   cd MotionStudio
   npm ci
   ```
   *(Trên Windows PowerShell nếu bị chặn `npm.ps1`, dùng `npm.cmd ci`.)*
2. Bỏ lecture, slide (PDF/Markdown) và script/transcript hiện có vào `inputs/`. Nếu đã thu lời hoặc có ảnh minh họa, bỏ vào `public/media/`.
3. Mở thư mục trong Claude Code và chạy:
   ```text
   /ecosystem-video Đọc lecture và script trong inputs/. Gọi song song source-reviewer và visual-director để lập kế hoạch video 5 phút, giữ nguyên câu đã duyệt và ghi nguồn từng cảnh. Chọn 30 giây khó giải thích nhất làm pilot, dựng storyboard rồi nhờ video-qa kiểm tra out/pilot.mp4 và out/review-pilot.html.
   ```
4. Xem `out/pilot.mp4` và bảng khung `out/review-pilot.html`. Góp ý theo `mã cảnh / mốc giây / cách sửa`, rồi yêu cầu dựng đủ 5 phút (`npm run render` và `npm run review`).

Cũng có thể gọi tay từng subagent bất kỳ lúc nào trong Claude Code bằng `@source-reviewer`, `@visual-director`, hoặc `@video-qa`.

---

## Lựa chọn 2: Kết hợp Google AI Pro (Antigravity) + Claude Code (Multi-Model)

Dùng khi bạn muốn tận dụng **Gemini Flash + Pro** ở khâu đọc nguồn, thiết kế kịch bản và **Nano Banana / Google Flow** ở khâu tạo tranh/clip, rồi giao **Claude Code** dựng Remotion và render:

1. **Trong Antigravity App** (đăng nhập Google AI Pro, mở thư mục repo, bỏ tài liệu vào `inputs/`), chạy:
   ```text
   /run-workflow Run workflows/lecture_plan.py
   ```
   Workflow chạy song song nhánh **Flash** (soát nguồn) và nhánh **Pro** (đạo diễn hình ảnh), rồi một lượt **Pro** cuối tổng hợp thành `work/video-plan.md`. Nếu tài khoản chưa bật Dynamic Workflows, yêu cầu Antigravity làm theo skill `lecture-production` (`.agents/skills/lecture-production/SKILL.md`). [Dynamic Workflows của Google](https://antigravity.google/docs/dynamic-workflows)
2. **Tạo tài sản tùy chọn (Nano Banana / Flow)**: Dùng các prompt trong `work/video-plan.md` để tạo ảnh PNG/JPG hoặc vài clip MP4 ngắn khó vẽ bằng code, lưu vào `public/media/` đúng tên file trong bảng bàn giao. Nếu hết hạn mức Flow, bỏ qua clip và để Claude dựng bằng ảnh tĩnh + lớp hình Remotion.
3. **Chuyển sang máy có Claude Code**: Vì `.gitignore` mặc định bỏ qua `inputs/`, `work/` và `public/media/*` để không lộ tài liệu riêng lên Git, hãy copy `inputs/`, `work/video-plan.md` và `public/media/` sang máy chạy Claude Code (nếu là máy khác), rồi dán:
   ```text
   /ecosystem-video Dùng work/video-plan.md và các nguồn trong inputs/ để dựng đoạn mẫu 30 giây. Nhờ source-reviewer đối chiếu lại nguồn, dựng các cảnh bằng Remotion và asset trong public/media/, chạy pilot rồi nhờ video-qa kiểm tra.
   ```
4. **Vòng duyệt bằng Gemini**: Đưa `out/pilot.mp4` (hoặc `out/review-pilot.html`) vào Gemini và hỏi: *“Ở giây nào hình làm người xem hiểu sai điều tôi đang nói? Chỉ ra tối đa ba ví dụ theo mẫu mã cảnh / mốc / điều hiểu sai / cách sửa.”* Chuyển nhận xét về Claude Code để chỉnh đúng mã cảnh, rồi chạy `npm run render` và `npm run review` cho bản 5 phút.

## Bảng phân vai công cụ

| Công cụ | Việc nên giao | Đầu ra |
|---|---|---|
| Gemini Flash + Pro (hoặc `@source-reviewer` + `@visual-director`) | Soát nguồn, thiết kế nhịp kể TED-Ed và hợp nhất shot list | `work/video-plan.md` |
| Gemini / Nano Banana | Khung hình mẫu, bộ tranh nhiều lớp hoặc ảnh tham chiếu nhất quán | PNG/JPG trong `public/media/` |
| Google Flow | Một vài shot ngắn có hành động hữu cơ khó vẽ bằng code | MP4 trong `public/media/` |
| Claude Code + Remotion | Chuyển giao, camera, sơ đồ, chữ tiếng Việt, đồng bộ lời và xuất file | `out/pilot.mp4`, `out/ecosystem.mp4` |
| `@video-qa` / Gemini ở vòng duyệt | Kiểm tra thời lượng, trích bảng khung hình và soi lệch hình–lời | `out/review-pilot.html`, `out/review.html` |

Kiểm tra credit trong Flow và đặt overage trong Antigravity về chế độ không tính phí vượt mức nếu chỉ dùng hạn mức gói Google AI Pro. [Quyền lợi Google AI Pro](https://support.google.com/googleone/answer/14534406?hl=en) · [Credit Google Flow](https://support.google.com/flow/answer/16526234)

## Lựa chọn 3: Tự động bàn giao trong Antigravity App (Orchestrator)

Nếu bộ chọn model của tài khoản hỗ trợ, chọn **Orchestrator** với **Gemini làm planner** và **Claude Sonnet làm executor** trong **Settings → Models → Orchestrator Settings**. Sau khi có `work/video-plan.md`, yêu cầu executor đọc `.claude/skills/ecosystem-video/SKILL.md`, dựng `content/storyboard.json` và chạy `npm run pilot` + `npm run review:pilot`. Nếu muốn dùng gói đăng nhập Claude Code sẵn có trên máy khách, chọn Lựa chọn 1 hoặc 2 ở trên. [Các model và Orchestrator](https://antigravity.google/docs/models?app=antigravity) · [FAQ về đăng nhập](https://antigravity.google/docs/faq/)
