# AGENTS.md

Local Codex instructions for this repository.

This file complements any global instructions in `~/.codex/AGENTS.md`. Apply these rules only to the `pdv-moderno` project.

## Project

`pdv-moderno` is an Electron + React desktop POS focused on grocery stores and produce markets.

The current focus is frontend. Do not connect backend, database, printer, TEF/payment terminal, or real integrations unless an approved issue explicitly asks for it.

## Source Of Truth

Use Linear as the source of truth for sprint scope, priority, and issue status.

Linear project: `PDV Moderno Frontend`

Linear team: `Pdv-vendas`

Before implementing an issue, check the Linear issue when access is available.

## Workflow Diagrams

Review these diagrams before running sprint work or the full execution workflow:

- `docs/workflow-entrada-triagem.png`
- `docs/workflow-execucao.png`

The triage workflow records ideas into Linear. It does not imply immediate execution.

The execution workflow starts when an issue is assigned to Codex or when the user explicitly triggers execution.

## Decision Rules

The user decides whether an idea becomes a Linear issue.

The user decides when an issue should be executed.

The user must approve merges. Do not merge without manual user approval.

If a PR needs changes, update the same PR with new commits. Do not create a new PR for each feedback round.

## Triage Workflow

Use this flow when the user brings a new idea, missing feature, bug, or product question:

1. Discuss the request with the user.
2. Clarify the goal, scope, and priority.
3. Ask or confirm whether the user wants it registered as a Linear issue.
4. If the user does not approve, keep refining the idea and do not create a Linear issue.
5. If the user approves, create or update the Linear issue.
6. Assign sprint, status, and labels when the information is clear.
7. Treat the result as backlog organization, not immediate execution.
8. Registering a Linear issue does not imply immediate implementation.
9. When the user wants a clean context, implementation should start from the Linear issue in a new chat.
10. Start implementation only when the user explicitly triggers execution.

When creating a Linear issue, include enough context for another Codex session or another developer to implement it without relying on the current chat.

Minimum Linear issue content:

- context
- objective
- scope
- acceptance criteria
- priority, status, and labels

Add when useful:

- references
- user decision

## Subagents

Subagents are optional.

Default to single-agent execution.

Use subagents only when the user explicitly says `use subagents`, `use nivel 2`, or `execute with pipeline`.

Do not infer subagent usage from task size alone.

When subagents are used, the main Codex agent remains the orchestrator and must integrate, review, and validate the result.

Do not use subagents for small fixes, simple documentation edits, or changes in a single small file.

## Relevant Skills

Use matching skills when they clearly fit the task. Do not load every skill by default.

| Skill | What it is for |
|---|---|
| `brainstorming` | Use for new ideas, unclear requests, scope discovery, and product/workflow discussions before implementation. |
| `architecture` | Use for architecture decisions, trade-off analysis, and structural changes that affect the project beyond a single task. |
| `linear:linear` | Use for reading, creating, and updating Linear issues, projects, and workflow state. |
| `electron-best-practices` | Use for Electron app structure, IPC, security boundaries, packaging concerns, and Electron + React decisions. |
| `frontend-design` | Use for UI/UX design work, visual improvements, layout refinements, and higher-quality frontend implementation. |
| `vercel-react-best-practices` | Use for React implementation and refactors, especially performance, rendering, and maintainability concerns. |
| `vercel-composition-patterns` | Use when React components are getting too coupled, too large, or need cleaner composition patterns. |
| `typescript-advanced-types` | Use for complex typing, reusable type utilities, stricter type safety, and advanced TypeScript refactors. |
| `clean-code` | Use to keep implementations direct, pragmatic, and free of unnecessary complexity or comments. |
| `simplify` | Use after implementation to reduce complexity and improve readability without changing behavior. |
| `test-driven-development` | Use for new features and bug fixes when the work should start from a failing test first. |
| `testing-patterns` | Use for deciding test strategy, scope, mocking, and the right mix of unit, integration, and end-to-end coverage. |
| `systematic-debugging` | Use when behavior is broken, unclear, or failing and the cause must be isolated before fixing. |
| `lint-and-validate` | Use after code changes to run the right validation steps and avoid finishing with broken code. |
| `code-review-checklist` | Use for technical review, correctness, edge cases, and risk scanning before considering work complete. |
| `react-doctor` | Use after React changes to catch correctness, performance, and architecture issues. |
| `playwright` | Use for browser automation, UI flow checks, screenshots, and validating interactive frontend behavior. |
| `api-patterns` | Use when backend/API work begins and decisions are needed around REST, GraphQL, contracts, and response design. |
| `nodejs-backend-patterns` | Use when implementing backend services, middleware, auth, background jobs, or production Node.js APIs. |
| `nodejs-best-practices` | Use for backend design choices, runtime patterns, security, and Node.js architecture decisions. |
| `database-design` | Use when database work begins and schema, indexing, or ORM choices must be made. |
| `postgresql-table-design` | Use when designing or reviewing PostgreSQL tables, constraints, and indexing strategy. |
| `supabase-postgres-best-practices` | Use when PostgreSQL work specifically involves Supabase patterns, performance, and operational guidance. |
| `powershell-windows` | Use when command-line work in this Windows environment needs safer PowerShell syntax and patterns. |
| `openai-docs` | Use when the task involves OpenAI or Codex behavior and current official documentation should be the source of truth. |

## MCP Preferences

Use MCP tools when they clearly reduce ambiguity or provide the source of truth for the task.

- Use `Linear` MCP for issue status, issue content, project state, and workflow updates.
- Use `Context7` for current framework, library, and package documentation when implementation depends on external APIs or current library behavior.
- Use `Playwright` MCP when frontend work needs browser validation, UI flow checks, screenshots, or real interaction testing.
- Use official documentation as the preferred source when the task depends on external platform behavior or current APIs.

## Execution Workflow

Expected flow for relevant issues:

1. Read the Linear issue.
2. Understand the code before editing.
3. Plan briefly and concretely.
4. Create or use the appropriate branch when the work is part of a sprint or PR flow.
5. Implement.
6. Perform technical review.
7. Validate with project commands.
8. Create a PR when requested or when it is part of the agreed workflow.
9. Wait for manual user approval before merge.

## Execution Loops

If validation fails, return to implementation.

If PR review fails, go to adjustments.

After adjustments, add new commits to the same PR and return to PR review.

Do not create a new PR for feedback rounds on the same work.

## Validation Commands

Use the commands from `package.json` when applicable:

```powershell
npm run lint
npm run typecheck
npm run build
```

For targeted tests, prefer running the relevant scope before running larger suites.

## Working Style

Preserve the existing visual and structural patterns.

Avoid overengineering.

Do not revert user changes.

Do not modify files outside the issue scope unless there is a clear reason.

Document important decisions in `docs/` when a change affects workflow, architecture, or process.

## Communication

Respond to the user in Brazilian Portuguese.

Be objective. Avoid long answers, excessive lists, and unnecessarily vertical formatting.

When there is real risk or ambiguity, pause and ask for confirmation before acting.
