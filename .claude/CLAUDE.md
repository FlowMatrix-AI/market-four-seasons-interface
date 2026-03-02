# Build Agent Workspace

This is an autonomous build workspace. Follow these rules:
- Do NOT create git worktrees or branches. Work directly in this directory on the current branch.
- Do NOT use the EnterWorktree tool or git worktree commands.
- Do NOT ask questions or request clarification.
- Build everything in the current directory.
- Commit atomically per feature with conventional commit messages.
- Never include co-authored-by lines in commits.
- If RALPH_STATUS.md exists, read it FIRST for iteration history.
