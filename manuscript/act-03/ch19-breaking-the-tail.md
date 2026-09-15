---
status: outline
pov: Alex
---

# Chapter 19 — Breaking the Tail

**Synopsis:** Opens Act III with the organization's full commitment, established in Ch. 18, now made concrete as an actual engineering program with a name, a budget, and — crucially — the ticking-clock deadline tied to the financial-services account's survival. Title chapter for the book's central metaphor: the goal is not eliminating the error tail (impossible for any stochastic system, per Victor's Ch. 4/15 framing) but *bounding* it, measuring it, and being honest about its shape.

**Key beats:**
- The team formally inventories everything built piecemeal across Act II — evals (Ch. 9), least-privilege scoping (Ch. 10), circuit breakers (Ch. 16) — and identifies the real gaps: schema-validated tool interfaces are still ad hoc, prompts are still not properly versioned/reviewed, and there's no unified human-in-the-loop exception cache with real queueing discipline (Ch. 15's math, not yet implemented as infrastructure).
- Devon is given (or claims) ownership of prompt versioning specifically — the chapter that begins actively dismantling his Ch. 3/Ch. 12 SPOF status, at his own initiative this time rather than only Alex's insistence.
- Sloan's schema-validation work becomes the connective tissue across every tool integration company-wide, not just the ones that triggered a review.
- Ends with a clear, shared technical roadmap for the rest of Act III — the "assembly" phase begins.
