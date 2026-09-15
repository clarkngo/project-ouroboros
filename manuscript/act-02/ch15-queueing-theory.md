---
status: outline
pov: Alex
---

# Chapter 15 — Queueing Theory

**Synopsis:** The second Victor lecture chapter, mirroring Ch. 4's structure but with higher stakes and a wider audience — Alex brings Claire this time, a deliberate structural choice, since the earlier lecture was Alex-only. Victor teaches queueing theory as applied to the human-in-the-loop exception cache concept: a system that routes uncertain cases to humans isn't free unless you reason about arrival rates, service rates, and queue stability the same way you would for any other operational queue. Introduces the idea that "add a human reviewer" is not automatically safe — an unbounded queue with a human server still fails, just more slowly and less visibly than an unbounded agent loop.

**Key beats:**
- Victor uses a concrete worked example (possibly reusing the financial-services account's ticket volume) to show Claire, in her own vocabulary, why naive human-in-the-loop proposals from the Ch. 14 postmortem would silently create a new failure mode — a growing backlog nobody's watching — if not designed with real queueing discipline.
- This is the chapter that most repairs Claire and Alex's relationship: watching Claire engage seriously and competently with the math, rather than needing it dumbed down, changes how Alex sees her.
- Victor gets a small, deliberately incomplete glimpse of his backstory here — a passing, specific reference to "the switching system" he worked on early in his career and the incident that shaped his wariness of over-trusting under-instrumented systems (full reveal held for Act III).
- Chapter closes with the shape of the exception-cache design that will be built in Act III already visible on Victor's whiteboard.
