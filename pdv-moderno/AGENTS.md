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

## Subagents

Subagents are optional.

Use subagents only when the user asks for `nivel 2`, `subagents`, or when the task is large enough to justify delegation.

When subagents are used, the main Codex agent remains the orchestrator and must integrate, review, and validate the result.

Do not use subagents for small fixes, simple documentation edits, or changes in a single small file.

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
