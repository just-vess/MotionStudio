import fs from 'node:fs';
import path from 'node:path';

function requireValue(ok, message) {
  if (!ok) throw new Error(message);
}
function text(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
function media(file, field) {
  requireValue(text(file) && file.startsWith('media/') && !file.includes('\\') && !file.split('/').includes('..'), field + ' cần đường dẫn media/ten-tep');
  const resolved = path.join('public', file);
  requireValue(fs.existsSync(resolved) && fs.statSync(resolved).isFile(), 'Thiếu tệp ' + resolved);
}
function wholeFrames(seconds) {
  return Number.isFinite(seconds) && Math.abs(seconds * 30 - Math.round(seconds * 30)) < 0.00001;
}

try {
  const board = JSON.parse(fs.readFileSync('content/storyboard.json', 'utf8').replace(/^\uFEFF/, ''));
  requireValue(text(board.title), 'Thiếu title của video');
  requireValue(Array.isArray(board.scenes) && board.scenes.length, 'Cần ít nhất một cảnh');
  let frames = 0;
  const ids = new Set();
  for (const s of board.scenes) {
    requireValue(text(s.id) && !ids.has(s.id), 'Thiếu hoặc trùng mã cảnh ' + s.id);
    ids.add(s.id);
    requireValue(wholeFrames(s.seconds) && s.seconds > 0, s.id + ' cần thời lượng dương, khớp frame ở 30 fps');
    frames += Math.round(s.seconds * 30);
    for (const key of ['title', 'source', 'narration', 'detail']) requireValue(text(s[key]), s.id + ' thiếu ' + key);
    requireValue(['statement', 'flow', 'image'].includes(s.layout), s.id + ' sai layout');
    if (s.layout === 'image') media(s.image, s.id + '.image');
    if (s.layout === 'flow') {
      requireValue(Array.isArray(s.steps) && s.steps.length >= 2 && s.steps.length <= 4, s.id + ' cần 2–4 bước');
      let previous = -1;
      for (const step of s.steps) {
        requireValue(wholeFrames(step.at) && step.at > previous && step.at < s.seconds && text(step.label) && text(step.result), s.id + ' có bước hoặc mốc thời gian sai');
        previous = step.at;
      }
      requireValue(s.steps[0].at === 0, s.id + ' cần bắt đầu ở giây 0');
    }
  }
  requireValue(wholeFrames(board.targetSeconds) && Math.round(board.targetSeconds * 30) === frames, 'Tổng thời lượng cảnh khác targetSeconds. Tổng hiện tại ' + frames / 30 + ' giây');
  requireValue(wholeFrames(board.pilotStart) && board.pilotStart >= 0 && board.pilotStart * 30 < frames, 'pilotStart nằm ngoài timeline');
  if (board.audio != null) media(board.audio, 'audio');
  console.log(board.scenes.length + ' cảnh · ' + frames / 30 + ' giây · ' + frames + ' frame · ' + (board.audio ? board.audio : 'nói trực tiếp / chưa gắn voice'));
} catch (error) {
  console.error('Storyboard: ' + error.message);
  process.exitCode = 1;
}
