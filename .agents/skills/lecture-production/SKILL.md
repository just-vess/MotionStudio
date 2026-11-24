---
name: lecture-production
description: Plan a five-minute illustrated video from an existing lecture and script, using Gemini for source review and visual design and handing off to Claude Code for rendering.
---

# Lecture production

Read [the operator guide](../../../docs/MULTI-MODEL.md) and [the handoff format](../../../docs/VIDEO-PLAN.md). Keep the original wording of approved voice-over and keep each fact traceable to a slide, a script passage, or a recording timestamp. Work with files the user has put in inputs/. If those files are empty, ask for the existing lecture and script before inferring any project detail.

In Antigravity, use the bundled native workflow when requested by running `/run-workflow Run workflows/lecture_plan.py`. The workflow uses a Flash source reviewer and a Pro visual director, then a Pro editor who reconciles their results. Review work/video-plan.md against the source and tell the user which 30 seconds to watch first. Use Vietnamese for the plan, existing narration, and on-screen wording when the lecture is Vietnamese.

For a manual run, perform the same three steps in this conversation. Write work/video-plan.md only when there is enough source material. Use exact English prompts for the optional image or video generation stages and keep on-screen words in the lecture language.

When the plan is ready, hand off work/video-plan.md to Claude Code with the /ecosystem-video skill. If using Antigravity Orchestrator with a Claude executor, ask it to read .claude/skills/ecosystem-video/SKILL.md, implement the approved plan in this folder, and run npm run pilot. For Google Gemini image generation or Flow, give the operator the asset prompts collected in the plan. They can place downloaded assets in public/media/. The workflow works with local still illustrations if they choose to skip generated clips.
