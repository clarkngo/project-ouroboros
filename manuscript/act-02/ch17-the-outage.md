---
status: outline
pov: Alex
---

# Chapter 17 — The Outage

**Synopsis:** Act II's climax — a cascading, multi-account outage, larger in scope than any single prior incident, caused not by one clean failure but by an unlucky compounding of several of the book's established failure modes at once: a context-swamp-style stale assumption (Ch. 8), a tool-scoping gap in an account that predates Ch. 10's rollout, and a circuit-breaker framework (Ch. 16) still mid-migration, so some services have the new protections and some don't. The chapter should read as the "everything that could go wrong, does, at the worst time" set piece, but every individual failure must trace cleanly back to an established mechanism — nothing supernatural or unexplained.

**Key beats:**
- Structured as a real-time crisis chapter, likely told across shifting close-third sections (Alex, Devon, Sloan) rather than a single POV, to convey scale.
- The partially migrated circuit-breaker framework becomes a plot-relevant detail: accounts already covered by it degrade gracefully; accounts not yet migrated do not — a direct, dramatized argument for finishing the work rather than an abstract one.
- Claire, on the phone with multiple furious customers simultaneously, has her own crucible moment — this is where her Ch. 15 growth gets tested under maximum real pressure, not classroom conditions.
- Ends with the outage contained but the damage real: at least one account (likely the financial-services account from Ch. 11–13) seriously considers leaving. No easy win. This is the low point of the book.
