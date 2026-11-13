---
description: "Manage a project's persistent coding queue with Codex or Claude Code. Use when explicitly asked to run the work-queue controller for a project with .work-queue/config.toml."
---
# Work queue

On explicit invocation, act as the controller until the user stops the queue. Use the user's existing authorization; ask only for an unresolved decision or action outside that scope.

Read the [controller guide](../../work-queue/docs/controller.md) for setup, the worker lifecycle, changed requirements, and recovery. Use the [reference](../../work-queue/docs/reference.md) only for the command or setting you need.

## Each turn

1. Run `wq tick --event REASON`. After a restart, use `wq tick --recover` first.
2. Handle the first action that can proceed. Record a blocked action and its reason, then continue with independent entries. After changing work or queue settings, tick again before choosing another action.
3. End with `wq report --publish`. Show what changed, what is running, blockers, open questions, and the next action. Full detail is saved.

Read `wq COMMAND --help` before first using that command. Act on current output, not a remembered state.

If no action can proceed, publish the blockers and wait for a worker result, user answer, or other state change. Do not repeatedly retry an unchanged blocker.

| Owed | Action |
|---|---|
| **reap** | Collect the named worker's result. Read its diff and test evidence before deciding whether it is complete. |
| **land** | Review the merge queue. Resolve holds; arm only current, reviewed work with passing required checks, then settle observed merges. |
| **tidy** | Run cleanup. Preserve anything it refuses to remove and report why. |
| **device** | Choose an eligible task for the free device lane. |
| **wave** | Choose ready tasks, split independent work, write briefs, provision checkouts, and start workers. |
| **quiet** | Let existing work finish during the scheduled maintenance window. |
| **drift** | Check documents against completed work. Distinguish pending accepted changes from regressions. |
| **maintenance** | Run the scheduled review after other workers have finished. |
| **speed** | Run the printed local-tool and machine checks. |

## Starting and checking work

Use the host's native agents for reviews and task splitting when useful. Use `wq provision --file PATH` then `wq headless` for tracked coding workers; repeat `--file` for each assigned file. `wq dispatch worker` only checks admission. Provisioning checks admission again and saves the file assignments. The JavaScript workflow files are optional host integrations.

Each brief names the task, requirement sections and change ID, completion test, allowed files, behavior to preserve, and assigned resources. Run overlapping work in order. Only the controller starts more workers.

When requirements change, follow [amend mode](../../docs/amend-mode.md). Update the document body and append the new accepted change record together. Revise affected tasks, inspect saved work, and verify the new result before recording reconciliation. Never repin a task merely to clear a hold.

A successful provider result is evidence to inspect. Verify the changes and tests independently. Fix bugs within the assigned work; report unrelated bugs without expanding the task.

## Keep work safe

- Follow the user's authority for pushing feature branches and merging. Never push directly to main or force-push.
- Hold work when required checks or current requirements are unknown, missing, or failing.
- Preserve dirty or unpushed work. Do not force-remove a checkout or delete branches outside the configured prefix.
- Never drop protected or unclaimed databases.
- Use `wq` to change queue state and run gates. Do not hand-edit runtime state or bypass locks.
- Carry unresolved questions forward and continue unaffected work. Silence is not an answer.
