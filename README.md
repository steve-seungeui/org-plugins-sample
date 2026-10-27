# 조직 표준 플러그인 예제

『Claude Code로 완성하는 AI 에이전트 하네스』의 예제 저장소다. 조직이 여러 저장소에 배포하는 표준 플러그인을 담는다.

| 플러그인 | 내용 |
| --- | --- |
| `plugins/dev-standard` | 이슈 처리 절차, 영향 범위 조사 서브에이전트, 품질 게이트, main 브랜치 보호, GitHub MCP 서버 |

## 마켓플레이스로 설치하기

이 저장소는 `org-plugins` 마켓플레이스다. `.claude-plugin/marketplace.json`이 마켓플레이스에 등록된 플러그인과 각 플러그인의 위치를 정한다.

Claude Code 세션에서 다음 명령을 실행하면 마켓플레이스를 등록하고 `dev-standard`를 설치한다.

```text
/plugin install dev-standard --marketplace steve-seungeui/org-plugins-sample
```

조직의 모든 개발자에게 설치하려면 관리형 설정의 `extraKnownMarketplaces`에 이 마켓플레이스를 등록하고 `enabledPlugins`에 `dev-standard@org-plugins`를 `true`로 지정한다.

## 저장소에 두는 품질 게이트 설정

`dev-standard`의 품질 게이트는 실행할 검사와 API 문서 규칙을 플러그인을 사용하는 저장소의 `.claude/quality-gate.json`에서 읽는다. 이 파일이 없으면 게이트는 작업을 마치지 못하게 한다.

```json
{
  "checks": [
    { "name": "테스트", "command": "pytest -q" }
  ],
  "apiDocs": { "routes": "app/api/", "document": "README.md" }
}
```

- `checks`: 작업을 마치기 전에 실행할 검사의 이름과 명령
- `apiDocs`: `routes`로 시작하는 파일이 바뀌면 `document`도 함께 바뀌어야 한다는 규칙(없으면 검사하지 않음)

## 로컬에서 시험하기

```bash
claude plugin validate ./plugins/dev-standard
claude --plugin-dir ./plugins/dev-standard
```

GitHub MCP 서버가 사용하는 토큰은 세션에서 `/plugin configure dev-standard` 명령을 실행해 입력한다.

## 라이선스

MIT
