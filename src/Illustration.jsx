import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

function poseAt(keys, frame) {
  if (keys.length === 1) return keys[0];
  const frames = keys.map(k => Math.round(k.at * 30));
  const result = {};
  for (const field of ['x', 'y', 'opacity', 'scale']) {
    result[field] = interpolate(frame, frames, keys.map(k => k[field]), {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  }
  return result;
}

export function Illustration({scene}) {
  const frame = useCurrentFrame();
  const cue = scene.cues.filter(c => c.at * 30 <= frame).at(-1);
  return <AbsoluteFill style={{backgroundColor:'#173848', overflow:'hidden'}}>
    <div style={{position:'absolute', width:1600, height:900, transform:'scale(1.2)', transformOrigin:'top left'}}>
      {scene.layers.map((layer, index) => {
        const pose = poseAt(layer.keys, frame);
        return <Img key={index} src={staticFile(layer.file)} style={{
          position:'absolute', left:pose.x, top:pose.y, width:layer.width,
          opacity:pose.opacity, transform:'scale('+pose.scale+')', transformOrigin:'top left',
        }}/>;
      })}
    </div>
    <div style={{position:'absolute', top:69, left:92, right:92, color:'#fff1d1',
      fontFamily:'Georgia, serif', fontSize:64, lineHeight:1.12, textShadow:'0 2px 8px #183748'}}>{scene.title}</div>
    {cue && <div style={{position:'absolute', bottom:44, left:78, right:78, textAlign:'center'}}>
      <span style={{display:'inline-block', background:'#132e38', color:'#fff4dc', borderRadius:12,
        padding:'14px 30px', fontFamily:'Segoe UI, Arial, sans-serif', fontSize:42, lineHeight:1.3}}>{cue.text}</span>
    </div>}
  </AbsoluteFill>;
}
