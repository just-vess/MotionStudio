# MotionStudio với Google AI Pro và Claude

Dùng chung một thư mục, mỗi công cụ nhận một nhiệm vụ. Nhánh này dựng được từ file cục bộ và không cần cấu hình API key.

## Chạy đoạn 30 giây đầu

1. Giải nén hoặc clone repo. Chạy `npm ci` tại thư mục có package.json. Bỏ lecture, script và transcript hiện có vào `inputs/`. Mở thư mục trong [Antigravity App](https://antigravity.google/docs/getting-started) và đăng nhập Google.
2. Trong Antigravity, nhập lệnh bên dưới và xem nội dung script khi app hỏi. Nhánh Flash soát tài liệu, nhánh Pro nghĩ cách kể bằng hình. Một lượt Pro cuối ghi kế hoạch ở `work/video-plan.md`. Nếu tài khoản chưa có Dynamic Workflows, yêu cầu Antigravity làm theo skill `lecture-production` trong một chat. [Dynamic Workflows của Google](https://antigravity.google/docs/dynamic-workflows)

   ```text
   /run-workflow Run workflows/lecture_plan.py
   ```

3. Mở cùng thư mục trong Claude Code. Dán câu lệnh bên dưới. Claude sẽ ghép ảnh, clip đã tải hoặc lớp hình Remotion, canh theo lời đọc rồi xuất `out/pilot.mp4`.

   ```text
   /ecosystem-video Dùng work/video-plan.md và các nguồn trong inputs/ để dựng đoạn mẫu 30 giây. Giữ nguyên câu đã duyệt và kiểm tra nguồn của mỗi dữ kiện. Dùng các file đã có trong public/media/ rồi render pilot để tôi xem.
   ```

4. Có thể đưa MP4 30 giây vào Gemini để xem lại. Hỏi “Ở giây nào hình làm người xem hiểu sai điều tôi đang nói? Hãy chỉ ra tối đa ba ví dụ và mô tả cách sửa.” Chuyển nhận xét về Claude Code theo mốc giây. Chạy `npm run render` khi đã duyệt đoạn mẫu và yêu cầu điền đủ timeline 300 giây.

## Mỗi công cụ làm phần nào

| Công cụ | Việc nên giao | Đầu ra |
|---|---|---|
| Gemini Flash + Pro trong Antigravity | Soát nguồn, thiết kế nhịp kể và hợp nhất shot list | `work/video-plan.md` |
| Gemini / Nano Banana | Một khung hình mẫu, bộ tranh nhiều lớp hoặc hình tham chiếu nhất quán | PNG hoặc JPG trong `public/media/` |
| Google Flow | Một vài shot ngắn có hành động hữu cơ hoặc khó vẽ bằng code. Giữ khung tham chiếu từ bộ tranh đã duyệt | MP4 trong `public/media/` |
| Claude Code và Remotion | Chuyển giao, camera, sơ đồ, chữ tiếng Việt, đồng bộ lời và xuất file | `out/pilot.mp4`, `out/ecosystem.mp4` |
| Gemini ở vòng duyệt | Chỉ ra mốc hình và lời lệch nhau | Nhận xét cho Claude theo giây |

Nano Banana và Flow chạy trong sản phẩm Google. Tải tác phẩm đã chọn xuống thư mục media với tên trong shot list. Có thể dựng toàn bộ bằng ảnh và Remotion khi đã hết hạn mức Flow. Kiểm tra credit trong Flow và đặt Antigravity overage thành Never nếu chỉ muốn dùng hạn mức cơ bản. [Quyền lợi Google AI Pro](https://support.google.com/googleone/answer/14534406?hl=en) · [Credit Google Flow](https://support.google.com/flow/answer/16526234)

## Tự động bàn giao trong Antigravity App

Nếu bộ chọn model của tài khoản hỗ trợ, chọn **Orchestrator** với **Gemini làm planner** và **Claude Sonnet làm executor** trong **Settings → Models → Orchestrator Settings**. Sau khi có video-plan.md, yêu cầu executor đọc skill tại `.claude/skills/ecosystem-video/SKILL.md` rồi dựng pilot. Đây là model Claude do Antigravity cung cấp trong phiên đó. Nếu muốn dùng tài khoản Claude hiện có, chọn quy trình hai ứng dụng ở trên. [Các model và Orchestrator](https://antigravity.google/docs/models?app=antigravity)

Google hỗ trợ đăng nhập trực tiếp trong Antigravity. Họ quy định quyền dùng headless cho scripting và CI trực tiếp, đồng thời không hỗ trợ bọc quyền đăng nhập gói cá nhân trong agent hoặc app bên thứ ba. Gói quota của ứng dụng và Gemini Developer API dùng các hạn mức khác nhau. Nhánh này chạy workflow bên trong Antigravity bằng chức năng có sẵn và chuyển file cho Claude Code. [FAQ về đăng nhập](https://antigravity.google/docs/faq/) · [Hạn mức Gemini Developer API](https://ai.google.dev/gemini-api/docs/pricing)
