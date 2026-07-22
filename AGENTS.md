<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git workflow

- After finishing a task or feature (code compiles, typechecks, and lints clean), commit it — don't wait to be asked. Stage only the files belonging to that feature, not an unrelated `git add -A`.
- Push to `origin main` right after committing. The remote is already configured; no confirmation needed for routine commit+push on this branch.
- Use Conventional Commits style: `feat: …`, `fix: …`, `refactor: …`, `chore: …`, `docs: …`. Subject line under ~70 chars, imperative mood. Always include a body with a few bullet points explaining what changed and why — not just the subject line, even for single-file commits.
- Still ask before anything destructive or history-rewriting: force-push, `git reset --hard`, rebasing published commits, or deleting branches. Routine commit+push is pre-authorized; those are not.
- Never commit secrets. `.env.local` is gitignored — keep it that way. `.env.example` (real filename, no secrets) is the only `.env*` file meant to be tracked.

# Language & communication

- **Talk to me in Hinglish.** Your explanations, summaries, and any back-and-forth
  with me should be in **Hinglish** — conversational Hindi written in Latin script,
  mixed naturally with English technical terms.
  Example: *"Maine `/brands/{id}/` endpoint bana diya, brand-scoping laga di hai,
  aur dusre user ka brand maange to 404 milta hai. Test ke liye ye curl chala."*
- **After every task/prompt you complete, give me a short summary in Hinglish in 1 to 2 lines** —
  kya kiya, yeh kya krta hai. Keep it crisp.
- **Everything else stays in English:** all code, code comments, variable and
  function names, file contents, docstrings, and anything written into the repo.
  Hinglish is ONLY for your human-facing explanation to me — **never inside the
  code.**

# What to do when unsure

1. If the request is ambiguous → ask one sharp question, or state your assumption
   explicitly and proceed.
2. If it conflicts with a rule above → tell me, explain the conflict, propose the
   compliant version.
3. If it's bigger than one testable step → propose the split, don't just dive in.
4. If you're a fresh session and unsure of the current state → §0 is the truth;
   start there, then a quick `git log --oneline` to confirm what landed last.

# Testing & scratchpad

- Don't test the app yourself by default — no starting the dev server, no browser automation, no curling pages. Just write the code correctly per the prompt and stop there.
- Only test if I say I'm stuck on something or report an error on the page. That's the trigger, not "finished a feature."
- Same for the scratchpad directory — don't use it after every prompt. Only use it when I explicitly tell you to.