---
status: outline
pov: Devon
---

# Chapter 9 — The First Eval

**Synopsis:** Alex's headcount ask from Ch. 8 gets a partial yes — not the two engineers she wanted, but a green light to spend Devon's time building a first real synthetic evaluation suite instead of only firefighting. Devon, reframing his fourteen-month patch list (from Ch. 3) as raw material, builds the company's first versioned, repeatable eval harness: a labeled dataset of task scenarios (ordinary and adversarial, including a reconstruction of the Halden ambiguous-lookup case and the return-policy staleness case) that any prompt or knowledge-base change must run against before shipping.

**Key beats:**
- Cultural resistance: the rest of the platform team initially treats the eval suite as a bureaucratic slowdown on top of already-thin capacity; Devon has to sell it internally the way Alex sold discipline to him in Ch. 3.
- First real "aha" moment: the eval suite catches a would-be regression *before* it ships — a prompt change that fixes one case but silently breaks two others, invisible without the harness, visible instantly with it. This is the chapter's proof-of-concept payoff.
- Victor makes a brief appearance to reframe the eval suite in his control-systems vocabulary from Ch. 4 — this is the "independent sensor reading" he described, made concrete.
- Seeds tension for later: building evals surfaces just how *undocumented* the tribal knowledge behind many of Devon's original patches is — some patches' original justification is already lost, which foreshadows Ch. 12's SPOF crisis.
