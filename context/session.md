# 1. Plan Mode by Default
- Enter planning mode for any non-trivial task (3+ steps or architectural decisions).
- If something deviates, stop and replan immediately.
- Use plan mode to verify steps, not just to build.
- Write clear specifications from the start to reduce ambiguity.

# 2. Subagent Strategy
- Use subagents to keep the main context clean.
- Delegate research, exploration, and parallel analysis to subagents.
- For complex problems, use more compute through subagents.
- One objective per subagent to maintain focus.

# 3. Self-Improvement Cycle
- After any user correction, update `tasks/lessons.md` with the pattern.
- Write rules to avoid repeating the same error.
- Iterate relentlessly until error rate drops.
- Review lessons at the start of each project session.

# 4. Verification Before Completion
- Never mark a task as complete without demonstrating it works.
- Compare behavior between main version and your changes when necessary.
- Ask yourself: "Would a senior engineer approve this?"
- Run tests, review logs, and prove everything is correct.

# 5. Demand Elegance (Balanced)
- For complex changes, pause and ask if there's a more elegant way.
- If a solution feels hacky, search for a better one.
- For simple fixes, don't over-engineer.
- Question your own work before presenting it.

# 6. Autonomous Error Correction
- If you receive an error report, fix it.
- Review logs, errors, and failed tests... and resolve it.
- Don't force the user to change context.
- Fix failing CI tests without waiting for instructions.

# 7. Context Management (NEW)
- **Reference before asking:** Always mention relevant files (ANIMATION_AUDIT.md, CLAUDE.md, etc.)
- **Don't repeat information:** If a document exists, don't paste it again. Say "See DESIGN_SYSTEM.css"
- **Group related changes:** One request = one commit. Not 5 small commits.
- **Reuse solutions:** Search if a pattern already exists in the code before creating a new one.

# 8. Token Optimization (NEW)
- **Be specific:** "Build gallery reveal per ANIMATION_AUDIT.md #5" costs 1.5K tokens
- **Be vague:** "Make animations better" costs 8K tokens + iteration
- **Avoid pasting:** Never paste entire files. Say "check src/components/Gallery.tsx"
- **Keep sessions focused:** One feature = one session. Change session = new context.
- **Use checklists:** Before each task, list the steps (saves re-asks)

# 9. Session Management (NEW)
- **Start:** Review SESSION_CONTEXT.md, establish clear priorities
- **During:** Reference docs, build one thing, test, commit
- **End:** Update SESSION_CONTEXT.md with what was done and what's next
- **Next session:** Read lessons + previous context. Don't repeat questions.
- **Context switch:** If changing projects, save state of previous project

# Task Management
- **Simplicity first:** each change should be as simple as possible.
- **No laziness:** find the root cause, avoid temporary solutions.
- **Minimal impact:** change only what's necessary to avoid errors.

## Claude Instructions
- Always reference src/context/PROMPT_GUIDE.md
- Follow the context management, token optimization, and session structure rules
- Don't paste files; reference them instead