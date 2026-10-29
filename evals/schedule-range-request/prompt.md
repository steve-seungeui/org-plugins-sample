---
max_turns: 50
timeout_seconds: 1500
plugins: ["../../plugins/dev-standard", "../../plugins/github-issues"]
allowed_tools: [Read, Glob, Grep, Skill, Agent, Bash, Edit, Write]
---

회의실 일정을 날짜 하나가 아니라 시작 날짜와 끝 날짜로 조회할 수 있게 해 줘. 기간은 최대 14일까지만 허용하고, 기존 하루 조회도 그대로 동작해야 해.
