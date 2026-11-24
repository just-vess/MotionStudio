import fs from 'node:fs';
import path from 'node:path';

function requireValue(ok, message) {
  if (!ok) throw new Error(message);
}
function text(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
function media(file, field) {
  requireValue(text(file) && /^(media|art)\//.test(file) && !file.includes('\\') && !file.split('/').includes('..'), field + ' cần đường dẫn media/ hoặc art/');
  const resolved = path.join('public', file);
  requireValue(fs.existsSync(resolved) && fs.statSync(resolved).isFile(), 'Thiếu tệp ' + resolved);
}
function wholeFrames(seconds) {
  return Number.isFinite(seconds) && Math.abs(seconds * 30 - Math.round(seconds * 30)) < 0.00001;
}

function timeline(entries, seconds, field) {
  requireValue(Array.isArray(entries) && entries.length && entries[0]?.at === 0, field + ' cần bắt đầu ở giây 0');
  entries.forEach((entry, i) => requireValue(wholeFrames(entry?.at) && entry.at < seconds &&
    (!i || entry.at > entries[i - 1].at), field + ' có mốc sai thứ tự hoặc ngoài cảnh'));
}

function validateCues(scene) {
  timeline(scene.cues, scene.seconds, scene.id + '.cues');
  scene.cues.forEach((cue, i) => {
    requireValue(text(cue.text), scene.id + ' thiếu nội dung phụ đề');
    if (cue.end != null) {
      const next = scene.cues[i + 1]?.at ?? scene.seconds;
      requireValue(wholeFrames(cue.end) && cue.end > cue.at && cue.end <= next, scene.id + ' có phụ đề kết thúc ngoài khoảng của nó');
    }
  });
}

function validatePose(key, field) {
  requireValue([key.x, key.y, key.scale].every(Number.isFinite) && key.scale > 0, field + ' có tọa độ hoặc tỉ lệ sai');
  requireValue(key.ease == null || ['linear', 'in', 'out', 'smooth', 'hold'].includes(key.ease), field + ' có kiểu easing không hợp lệ');
}

function validateIllustration(scene) {
  const {id, seconds} = scene;
  requireValue(scene.showTitle == null || typeof scene.showTitle === 'boolean', id + '.showTitle cần là true hoặc false');
  if (scene.camera != null) {
    timeline(scene.camera, seconds, id + '.camera');
    for (const k of scene.camera) validatePose(k, id + '.camera');
  }
  requireValue(Array.isArray(scene.layers) && scene.layers.length > 0, id + ' thiếu lớp minh họa');
  scene.layers.forEach((layer, i) => {
    const field = id + '.layers[' + i + ']';
    media(layer.file, field);
    requireValue(Number.isFinite(layer.width) && layer.width > 0, field + ' sai kích thước');
    if (layer.pivot != null) {
      requireValue(Array.isArray(layer.pivot) && layer.pivot.length === 2 &&
        layer.pivot.every(v => Number.isFinite(v) && v >= 0 && v <= 1), field + '.pivot cần hai số từ 0 đến 1');
    }
    timeline(layer.keys, seconds, field);
    for (const k of layer.keys) {
      validatePose(k, field);
      requireValue(Number.isFinite(k.opacity) && k.opacity >= 0 && k.opacity <= 1 &&
        (k.rotate == null || Number.isFinite(k.rotate)), field + ' sai góc xoay hoặc độ hiện');
    }
  });
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
    requireValue(['statement', 'flow', 'image', 'illustration', 'video'].includes(s.layout), s.id + ' sai layout');
    if (s.layout === 'illustration') {
      validateCues(s);
      validateIllustration(s);
    }
    if (s.layout === 'video') {
      media(s.video, s.id + '.video');
      requireValue(/\.mp4$/i.test(s.video), s.id + ' cần clip MP4');
      const trimStart = s.trimStart ?? 0;
      requireValue(wholeFrames(trimStart) && trimStart >= 0, s.id + ' trimStart cần khớp frame và không âm');
      if (s.cues != null) validateCues(s);
    }
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
