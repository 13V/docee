# Local tooling

Agent Reach v1.5.0 was installed from [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) at commit `a19a171fa980a0785849596492e0af4db800c82f`, separate from this project.

- Source checkout: `%USERPROFILE%\.agent-reach\tools\agent-reach`
- Isolated Python environment: `%USERPROFILE%\.agent-reach-venv`
- Codex skill, including references: `%USERPROFILE%\.codex\skills\agent-reach`
- Installation checks: `%USERPROFILE%\.agent-reach\install-state.md`

The environment's `Scripts` directory was added to the user PATH. Existing app processes may retain an older PATH; the full executable path works immediately:

```powershell
& "$env:USERPROFILE\.agent-reach-venv\Scripts\agent-reach.exe" doctor --json
& "$env:USERPROFILE\.agent-reach-venv\Scripts\agent-reach.exe" check-update
```

Agent Reach routes to upstream tools. This research used its Jina Reader backend to read the official Yo-Chi pages and Docee merchant menu. Instagram reading through Jina returned a service block, so the public Docee profile and available grid were inspected in the browser. The authenticated Instagram backend is not configured.

The CLI and Python requirements passed validation. Jina, RSS, V2EX and Bilibili public search are ready. GitHub CLI reading was independently verified. Other services require optional backends or credentials. No browser credentials were imported. The installed skill becomes available to Codex on the next turn.

The prototype itself needs only Node.js 24.x and a modern browser; there are no third-party JavaScript dependencies or account services. Run `npm run dev` from this repository and open `http://127.0.0.1:4173`. The server binds only to the local computer.
