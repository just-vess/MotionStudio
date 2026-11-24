import React from 'react';
import {AbsoluteFill, Composition, Html5Audio, Img, OffthreadVideo, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import board from '../content/storyboard.json';
import './style.css';
import {Illustration} from './Illustration';

const fps = 30;
const total = board.scenes.reduce((sum, scene) => sum + Math.round(scene.seconds * fps), 0);
const pilotFrom = Math.round(board.pilotStart * fps);
const fade = (frame, length) => interpolate(frame, [0, length], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

function Flow({steps, frame}) {
  return <div className="flow">{steps.map((step, index) => {
    const appear = fade(frame - Math.round(step.at * fps), 15);
    return <div className="station" key={index} style={{opacity: appear, transform: 'translateY(' + (1 - appear) * 22 + 'px)'}}>
      <div className="track"><i/>{index < steps.length - 1 && <span/>}</div>
      <h2>{step.label}</h2><p>{step.result}</p>
    </div>;
  })}</div>;
}

function Scene({scene}) {
  const frame = useCurrentFrame();
  if (scene.layout === 'video') {
    return <AbsoluteFill style={{background:'#102d31'}}>
      <OffthreadVideo src={staticFile(scene.video)} muted trimBefore={Math.round((scene.trimStart ?? 0) * fps)}
        style={{width:'100%', height:'100%', objectFit:'contain'}}/>
    </AbsoluteFill>;
  }
  if (scene.layout === 'illustration') return <Illustration scene={scene}/>;
  const intro = fade(frame + 1, 14);
  return <AbsoluteFill className={'canvas ' + scene.layout}>
    <header>{board.title}</header>
    <main style={{opacity: intro, transform: 'translateY(' + (1 - intro) * 14 + 'px)'}}>
      <section><h1>{scene.title}</h1><p className="detail">{scene.detail}</p></section>
      {scene.layout === 'flow' && <Flow steps={scene.steps} frame={frame}/>}
      {scene.layout === 'image' && <Img className="visual" src={staticFile(scene.image)}/>}
    </main>
  </AbsoluteFill>;
}

function Timeline({offset = 0}) {
  let cursor = -offset;
  return <AbsoluteFill style={{background: '#102d31'}}>
    {board.audio && <Sequence from={-offset} durationInFrames={total}><Html5Audio src={staticFile(board.audio)}/></Sequence>}
    {board.scenes.map(scene => {
      const start = cursor;
      const duration = Math.round(scene.seconds * fps);
      cursor += duration;
      return <Sequence key={scene.id} name={scene.id} from={start} durationInFrames={duration}><Scene scene={scene}/></Sequence>;
    })}
  </AbsoluteFill>;
}

function Root() {
  const format = {component: Timeline, width: 1920, height: 1080, fps};
  return <>
    <Composition {...format} id="Ecosystem" durationInFrames={total}/>
    <Composition {...format} id="Pilot" durationInFrames={Math.min(30 * fps, total - pilotFrom)} defaultProps={{offset: pilotFrom}}/>
  </>;
}
registerRoot(Root);
