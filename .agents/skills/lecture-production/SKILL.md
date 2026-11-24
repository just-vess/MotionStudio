---
name: lecture-production
description: Plan a five-minute illustrated video from an existing lecture and script, using Gemini for source review and visual design and handing off to Claude Code for rendering.
---

# Lecture production

Read [the operator guide](../../../docs/MULTI-MODEL.md) and [the handoff format](../../../docs/VIDEO-PLAN.md). Keep the original wording of approved voice-over and keep each fact traceable to a slide, a script passage, or a recording timestamp. Work with files the user has put in `inputs/`. If those files are empty, ask for the existing lecture and script before inferring any project detail.

## Planning in Antigravity (Gemini Multi-Agent)

In Antigravity, use the bundled native workflow when requested by running `/run-workflow Run workflows/lecture_plan.py`. The workflow spawns a `flash` source reviewer and a `pro` visual director in parallel, then a `pro` editor reconciles their reports into `work/video-plan.md`.

If the user's account does not have Dynamic Workflows enabled, run the same three steps manually in conversation (using subagents or sequential turns) and save `work/video-plan.md` only when there is enough source material in `inputs/`.

Include concrete visual direction that matches the upgraded Remotion renderer in `src/Illustration.jsx` and `src/index.jsx`:
- Scene `layout` (`illustration`, `flow`, `image`, `video`, `statement`).
- For `illustration`: camera framing/pan-zoom beats (`camera` on `1600 × 900`), easing feel (`smooth`, `in`, `out`, `linear`, `hold`), rotation/pivot cues (`rotate`, `pivot`), `showTitle: false` when visuals already open cleanly, and `cue.end` silence gaps where helpful.
- For `video`: `public/media/*.mp4` filename, `trimStart` (seconds aligned to 30 fps), optional `cues` for Vietnamese captions, and a still-image or Remotion fallback.
- Use exact concise English prompts for optional image (Gemini / Nano Banana) or video (Google Flow) assets while keeping narration, scene titles, and on-screen cues in the lecture language (Vietnamese when the lecture is Vietnamese).

Review `work/video-plan.md` against `inputs/` and tell the user which 30-second pilot cut (`pilotStart`) to watch first.

## Handing off to Claude Code (Client Machine or Orchestrator)

1. **Client machine with Claude Code**: Transfer `work/video-plan.md` plus any downloaded assets in `public/media/` (note that `.gitignore` keeps `inputs/`, `work/`, and `public/media/*` untracked by default) and run `/ecosystem-video`. Claude Code's `.claude/agents/` (`source-reviewer` and `video-qa`) will cross-check citations, build `content/storyboard.json` + `work/storyboard.md`, render `out/pilot.mp4` (`npm run pilot`), and inspect `out/review-pilot.html` (`npm run review:pilot`).
2. **Antigravity Orchestrator (when available in Model settings)**: With Gemini as planner and Claude Sonnet as executor, instruct the executor to read `.claude/skills/ecosystem-video/SKILL.md`, implement `work/video-plan.md`, and run `npm run pilot` + `npm run review:pilot`.
3. **Post-render Gemini review loop**: Inspect `out/pilot.mp4` or `out/review-pilot.html` in Gemini and send at most three concrete fixes back to Claude Code formatted as `mã cảnh / mốc giây / điều hiểu sai / cách sửa`.
