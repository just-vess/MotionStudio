import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const cliPackage = require.resolve('@remotion/cli/package.json');
const cli = path.join(path.dirname(cliPackage), require(cliPackage).bin.remotion);

function remotion(command, args) {
  const result = spawnSync(process.execPath, [cli, command, ...args], {maxBuffer: 10 * 1024 * 1024});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr?.toString().trim() || 'Lỗi xử lý MP4');
  return result.stdout;
}

function html(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function timestamp(seconds) {
  return Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
}

function inspect() {
  const board = JSON.parse(readFileSync('content/storyboard.json', 'utf8').replace(/^\uFEFF/, ''));
  const pilot = process.argv[2] === 'pilot';
  const filename = pilot ? 'out/pilot.mp4' : 'out/ecosystem.mp4';
  const offset = pilot ? board.pilotStart : 0;
  const expected = pilot ? Math.min(30, board.targetSeconds - offset) : board.targetSeconds;
  const metadata = JSON.parse(remotion('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', filename]));
  const video = metadata.streams.find(s => s.codec_type === 'video');
  const duration = Number(video?.duration ?? metadata.format?.duration);
  if (!video || !Number.isFinite(duration) || Math.abs(duration - expected) > 0.05) {
    throw new Error('Thời lượng video khác storyboard. Hãy render lại ' + filename);
  }
  if (board.audio && !metadata.streams.some(s => s.codec_type === 'audio')) {
    throw new Error('MP4 thiếu track âm thanh đã khai báo trong storyboard');
  }
  const figures = [];
  let cursor = 0;
  for (const scene of board.scenes) {
    const cues = scene.cues || scene.steps?.map(step => ({at: step.at, text: step.result})) || [{at: 0, text: scene.narration}];
    for (const [i, cue] of cues.entries()) {
      const start = Math.max(offset, cursor + cue.at);
      const end = Math.min(offset + expected, cursor + (cues[i + 1]?.at ?? scene.seconds));
      if (end <= start) continue;
      const sample = Math.min(end - 1 / 30, start + (end - start) / 2);
      const jpeg = remotion('ffmpeg', ['-v', 'error', '-ss', Math.max(0, sample - offset).toFixed(4), '-i', filename,
        '-frames:v', '1', '-vf', 'scale=480:-2', '-c:v', 'mjpeg', '-f', 'image2pipe', 'pipe:1']);
      if (!jpeg.length) throw new Error('Không trích được hình ở giây ' + sample);
      figures.push('<figure><img src="data:image/jpeg;base64,' + jpeg.toString('base64') +
        '"><figcaption><b>' + timestamp(start) + '–' + timestamp(end) + ' · ' + html(scene.id) +
        '</b><p>' + html(cue.text) + '</p><small>' + html(scene.source) + '</small></figcaption></figure>');
    }
    cursor += scene.seconds;
  }

  const page = '<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + html(board.title) +
    '</title><style>*{box-sizing:border-box}body{margin:3vw;background:#faf4e8;color:#193641;font:16px/1.45 system-ui}h1{font:clamp(30px,4vw,64px) Georgia,serif;margin:0}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:24px}figure{margin:0}img{width:100%;display:block}figcaption{padding:12px 0}p{margin:6px 0}small{color:#4d6266}header{margin-bottom:26px}</style><header><h1>' +
    html(board.title) + '</h1><p>' + html(filename) + ' · ' + video.width + ' × ' + video.height + ' · ' + expected +
    ' giây</p></header><section>' + figures.join('') + '</section></html>';
  mkdirSync('out', {recursive: true});
  const output = pilot ? 'out/review-pilot.html' : 'out/review.html';
  writeFileSync(output, page);
  console.log(output + ' · ' + figures.length + ' khung trích từ MP4');
}

try {
  inspect();
} catch (error) {
  console.error('Kiểm tra video: ' + error.message);
  process.exitCode = 1;
}
