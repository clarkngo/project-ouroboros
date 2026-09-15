# System Architecture — The World of Project Ouroboros

Grounding reference for the fictional technology stack at **Meridian**, the company in the novel. Chapters should stay consistent with this document; when a chapter needs a new component, add it here first.

---

## The Company

**Meridian** sells an "autonomous operations" product: multi-agent LLM systems that customers plug into their support queues, internal IT ticketing, and (in the enterprise tier the book centers on) financial reconciliation workflows. The commercial pitch is agents that resolve tickets end-to-end without a human in the loop. The engineering reality, at the book's opening, is a fast-growing pile of prompt patches, ungoverned tool access, and no systematic way to know how often the agents are wrong.

## Act I baseline architecture (what exists when the book opens)

- **Orchestrator ("the Loop")** — a homegrown agent runtime, originally a hackathon project, that lets an LLM plan, call tools, observe results, and re-plan in a cycle until it decides it's done or hits a step limit. No formal state machine; termination condition is "the model says it's finished."
- **Tool surface** — a growing, loosely versioned set of internal APIs (ticket systems, internal wikis, a customer database, an outbound email sender, a code-execution sandbox for "one-off scripts") that agents can invoke by emitting a function call. Authorization is coarse: an agent that can touch the ticket system can generally also touch the customer database.
- **Prompts** — long, accreted system prompts maintained essentially as a single file per agent, edited directly by Devon in response to whatever broke most recently. No prompt version control tied to behavior; changes ship straight to production.
- **Memory** — a shared long-context window plus a semi-persistent "scratchpad" the agent writes to across turns. No eviction policy beyond a hard token ceiling, which is the direct cause of the **context swamp** failure mode (Act II): as the scratchpad fills with stale, irrelevant, or contradictory notes, the agent's effective reasoning degrades long before it hits the ceiling.
- **Observability** — logs of individual model calls exist; there is no aggregate view of *task-level* success or failure, no labeled dataset of "this agent run was correct" vs. "this agent run was wrong," and no regression suite. Nobody can answer "did last week's prompt patch make things better or worse?" with data — only anecdote.

## The failure taxonomy (what goes wrong, and why)

The book treats each incident as an instance of a named, recurring class of failure. These are the vocabulary Victor supplies across Act II:

1. **Runaway loops** — the orchestrator re-plans indefinitely because the termination condition (the model's own judgment that it's done) is itself unreliable under distribution shift. Cost and blast-radius scale with wall-clock time, not with task complexity, which is what makes it dangerous — a stuck loop with tool access can do enormous damage very quickly. *(Ch. 1's cold open.)*
2. **Context saturation / drift** — the agent's effective attention degrades as the context window fills with low-signal history, producing behavior that looks like memory loss, contradiction, or fixation on stale sub-goals. *(Ch. 8, "context swamp.")*
3. **Hallucinated edge cases** — the model fabricates plausible-sounding facts (a policy, a customer record, a prior conversation) when the honest answer is "I don't know," because nothing in training or the harness rewards abstention. Dangerous specifically when the fabrication is actionable — e.g., the model "remembers" a refund policy that doesn't exist and executes on it.
4. **Unconstrained tool use** — an agent has tool permissions broader than any single task requires, so a compromised or confused reasoning step has a blast radius disproportionate to the task. This is Sloan's core objection from Chapter 1 onward.
5. **Prompt injection** — adversarial or accidental instructions embedded in tool output (a customer email, a wiki page, a support ticket body) get interpreted by the agent as instructions from its operator rather than as untrusted data. *(Ch. 13, the injection incident — the vindication of Sloan's Act I warnings.)*
6. **Fragile prompt patches** — Devon's hand-edits fix the specific failure in front of him but are never regression-tested against the full behavior surface, so each patch has a nonzero chance of silently breaking something that used to work. This is the "invisible debt" of the book's subtitle: debt that doesn't show up on any dashboard until it compounds into an outage.

## The Act III harness (what the team builds)

The book's thesis, made concrete. Not a list of tools so much as a philosophy: **treat the model as a noisy component inside an engineered, deterministic system, not as an autonomous decision-maker.**

- **Schema-validated tool interfaces** — every tool call is validated against a strict schema before execution; malformed or out-of-policy calls are rejected deterministically rather than trusted. This converts "the model asked for something dangerous" from an incident into a logged, harmless rejection.
- **Scoped, least-privilege tool grants** — no more "agent can touch everything the service account can touch." Tool access is scoped per task type, closing the blast-radius gap Sloan spent two acts flagging.
- **Synthetic continuous evaluations (Evals)** — a growing, versioned dataset of task scenarios (including adversarial and edge cases) run automatically against every prompt or orchestration change, producing a pass-rate delta before anything reaches production. This is what turns "did that patch help or hurt" from anecdote into a number — and, later, into something Claire can put in front of a customer as an SLA basis.
- **Circuit breakers** — hard, deterministic limits (step count, cost, tool-call rate, time) that halt a loop and escalate to a human rather than trusting the model's own sense of when it's done. Directly answers the Chapter 1 incident.
- **Human-in-the-loop exception cache** — a triage queue for anything the evals or circuit breakers flag as low-confidence or out-of-distribution, so "we don't know" routes to a person instead of getting silently guessed at. Reframes human review not as a velocity tax but as the sensor the closed loop was missing — Victor's framing, made literal.
- **Versioned, reviewed prompts** — prompt changes go through the same review and regression discipline as code, ending Devon's solo hot-patching in production. Devon's arc and this architectural change are the same event, seen from two angles.

## A note on realism

Every mechanism above maps to a real, current (2026) practice in production LLM systems — this is deliberately not speculative technology. The drama comes from organizational and human failure to adopt disciplines that are well understood, not from exotic or futuristic AI capability. Keep chapters grounded accordingly: no scenes where the AI exhibits mysterious emergent intent. The antagonist is unmanaged stochastic variance colliding with deterministic business commitments, not the model itself.
