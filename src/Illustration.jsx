import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const STAGE_WIDTH = 1600;
const STAGE_HEIGHT = 900;
const DEFAULT_CAMERA = {x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2, scale: 1};
const LAYER_FIELDS = {x: 0, y: 0, scale: 1, opacity: 1, rotate: 0};
const curves = {
  linear: Easing.linear,
  in: Easing.in(Easing.cubic),
  out: Easing.out(Easing.cubic),
  smooth: Easing.inOut(Easing.cubic),
  hold: () => 0,
};

// The destination key describes how the subject arrives there. A hold jumps
// on the exact destination frame, so a cut works equally when scrubbing.
function sample(keys, defaults, frame, fps) {
  if (!keys?.length) return defaults;
  const next = keys.findIndex(key => Math.round(key.at * fps) > frame);
  if (next < 1) return {...defaults, ...keys[next === 0 ? 0 : keys.length - 1]};
  const start = keys[next - 1];
  const end = keys[next];
  const first = Math.round(start.at * fps);
  const last = Math.round(end.at * fps);
  const weight = curves[end.ease ?? 'linear']((frame - first) / (last - first));
  const pose = {};
  for (const [field, fallback] of Object.entries(defaults)) {
    const from = start[field] ?? fallback;
    const to = end[field] ?? fallback;
    pose[field] = from + (to - from) * weight;
  }
  return pose;
}

export function IllustrationCaptions({cues}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = cues?.findLast(item => Math.round(item.at * fps) <= frame);
  if (!cue || (cue.end != null && frame >= Math.round(cue.end * fps))) return null;
  return <div style={{
    position: 'absolute', bottom: 44, left: 78, right: 78, textAlign: 'center',
    fontFamily: '"Segoe UI", Arial, sans-serif', fontSize: 42, lineHeight: 1.3,
  }}>
    <span style={{
      display: 'inline-block', padding: '12px 26px 14px', maxWidth: '95%',
      background: 'rgba(14, 32, 37, 0.9)', color: '#fff7e8', borderRadius: 9,
      textWrap: 'balance', overflowWrap: 'anywhere',
    }}>{cue.text}</span>
  </div>;
}

export function Illustration({scene}) {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const camera = sample(scene.camera, DEFAULT_CAMERA, frame, fps);
  const fit = Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT);
  return <AbsoluteFill style={{backgroundColor: '#173848', overflow: 'hidden'}}>
    <div style={{
      position: 'absolute', width: STAGE_WIDTH, height: STAGE_HEIGHT,
      left: (width - STAGE_WIDTH * fit) / 2, top: (height - STAGE_HEIGHT * fit) / 2,
      transform: 'scale(' + fit + ')', transformOrigin: 'top left',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: 'translate(' + STAGE_WIDTH / 2 + 'px,' + STAGE_HEIGHT / 2 + 'px) ' +
          'scale(' + camera.scale + ') translate(' + -camera.x + 'px,' + -camera.y + 'px)',
        transformOrigin: 'top left',
      }}>
        {scene.layers.map((layer, index) => {
          const pose = sample(layer.keys, LAYER_FIELDS, frame, fps);
          const [px, py] = layer.pivot ?? [0, 0];
          return <Img key={index} src={staticFile(layer.file)} style={{
            position: 'absolute', left: pose.x, top: pose.y, width: layer.width, opacity: pose.opacity,
            transform: 'rotate(' + pose.rotate + 'deg) scale(' + pose.scale + ')',
            transformOrigin: px * 100 + '% ' + py * 100 + '%',
          }}/>;
        })}
      </div>
    </div>
    {scene.showTitle !== false && <div style={{
      position: 'absolute', top: 69, left: 92, right: 92, color: '#fff1d1',
      fontFamily: 'Georgia, serif', fontSize: 64, lineHeight: 1.12, textShadow: '0 2px 8px #183748',
    }}>{scene.title}</div>}
    <IllustrationCaptions cues={scene.cues}/>
  </AbsoluteFill>;
}
