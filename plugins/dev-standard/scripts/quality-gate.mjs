// Claude가 에이전트 루프를 종료하려 할 때 호출된다. 저장소의 품질 게이트 설정에 정의된 검사를 실행한다.
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const { cwd } = JSON.parse(raw);
const projectDir = process.env.CLAUDE_PROJECT_DIR ?? cwd;
const run = (cmd) => execSync(cmd, { cwd: projectDir, stdio: "pipe" }).toString();

const changed = new Set(
  [
    run("git diff --name-only origin/main...HEAD"),
    run("git diff --name-only HEAD"),
    run("git ls-files --others --exclude-standard"),
  ]
    .join("\n")
    .split("\n")
    .filter(Boolean),
);
if (changed.size === 0) process.exit(0);

// 검사 명령과 API 문서 규칙은 저장소마다 다르므로 저장소의 설정 파일에서 읽는다.
const configPath = join(projectDir, ".claude", "quality-gate.json");
if (!existsSync(configPath)) {
  console.error(
    "품질 게이트를 통과하지 못했습니다.\n" +
      ".claude/quality-gate.json이 없어 이 저장소에서 실행할 검사를 알 수 없습니다.",
  );
  process.exit(2);
}
const { checks = [], apiDocs } = JSON.parse(readFileSync(configPath, "utf8"));

const failures = [];
for (const { name, command } of checks) {
  try {
    run(command);
  } catch {
    failures.push(`${name}(${command})가 실패했습니다.`);
  }
}
if (
  apiDocs &&
  [...changed].some((file) => file.startsWith(apiDocs.routes)) &&
  !changed.has(apiDocs.document)
) {
  failures.push(
    `API 라우트가 바뀌었지만 ${apiDocs.document}의 API 목록이 갱신되지 않았습니다.`,
  );
}
if (failures.length > 0) {
  console.error(["품질 게이트를 통과하지 못했습니다.", ...failures].join("\n"));
  process.exit(2);
}
