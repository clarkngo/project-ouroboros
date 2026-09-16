# Character Bible — Project Ouroboros

Working reference for voice, motivation, and arc consistency across the manuscript. Update this file as characters evolve; treat it as the single source of truth when a later chapter needs to check a detail against an earlier one.

---

## Alex Chen — Lead

**Role:** Systems architect turned VP of Applied Systems at Meridian (the company).

**Age/background:** Late 30s. Came up as a backend infrastructure engineer — distributed databases, then site reliability — before the AI push pulled her into applied ML systems. No formal ML background; learned it the way she learns everything, by reading postmortems.

**Voice:** Terse, declarative, allergic to hand-waving. Thinks in invariants and failure modes. Uses systems metaphors reflexively, sometimes to the irritation of non-technical stakeholders. Dry rather than warm; earns trust slowly.

**Function in the story:** The bridge — the only character who has to translate between the board's growth narrative and the engineering team's reality. She is not the smartest person in the room (that's Victor) and not the most technically hands-on (that's Devon); her competence is judgment under incomplete information and the discipline to say no under pressure.

**Arc:** Opens the book firefighting a crisis she didn't cause, reactive and worn down. Her turn is learning to stop treating discipline (evals, circuit breakers, schema validation) as a tax on velocity and start treating it as the actual source of velocity. Ends the book as the person who can say "we are not shipping this" and make it stick — not because she has more authority, but because she has the receipts.

**Key relationships:**
- Claire: former allies, now on opposite sides of a widening gap between commercial promises and operational reality. Not villainized — Claire's pressure is real and Alex partially accepts responsibility for not pushing back sooner.
- Devon: protective of him, aware she has let him become a single point of failure and feels guilty about it.
- Victor: her intellectual anchor. Skeptical of him early, converted gradually.
- Sloan: initially sees Sloan as an obstacle; comes to see Sloan as the only one who was right from day one.

---

## Devon — The Lone Scaffolder

**Role:** Staff-level engineer, informally "the person who knows how the agents actually work." No formal title matches what he does.

**Background:** Self-taught, prompt-engineering-first career trajectory — started as a support engineer who got good at coaxing the internal chatbot into behaving, and backed into being the de facto owner of the agent runtime because nobody else wanted the pager.

**Voice:** Fast-talking when explaining something he understands, clipped and evasive when asked what he changed and why. Uses humor to deflect scrutiny. Talks about the models with more empathy than he talks about people — "it's not lying, it's just confident."

**Function in the story:** The embodiment of the book's central pathology: heroic, undocumented, one-person patching that looks like velocity and is actually accumulating debt. He is not incompetent — he is often right in the moment — but the org has structurally made him irreplaceable, which is a failure of the system, not of him.

**Arc:** Starts the book as the indispensable fixer, quietly proud of being needed at 2 a.m. Cracks under the weight of being the only rollback plan the company has. His turn is the hardest emotionally — accepting that his production access and tribal knowledge are a liability, and helping build the very harness (schema-validated tools, versioned prompts, eval gates) that makes him replaceable. Ends the book relieved rather than diminished.

**Key relationships:**
- Alex: wants her approval more than he'll admit; resents that she lets him carry the risk alone.
- Victor: initially dismisses Victor's theory as academic; Victor is the one who reframes Devon's hand-patching as "manual control of an unmodeled system," which lands.

---

## Claire — Commercial Head

**Role:** VP of Revenue / Commercial, driving the autonomous-agent enterprise product line.

**Background:** Enterprise SaaS sales and growth, hired specifically to scale ARR. Genuinely believes in the product; her sin is not malice but a category error — she reasons about a stochastic system using deterministic-software intuitions (SLAs, uptime guarantees, "just fix the bug").

**Voice:** Confident, metric-fluent, persuasive in exactly the register a board wants to hear. Not a caricature — she has real command of the numbers and real stakes (her comp, her credibility, promises made to a board she also has to manage).

**Function in the story:** The pressure source. She commits the company to autonomous enterprise SLAs before the engineering org has the harness to support them, not out of recklessness but because nobody gave her a vocabulary for "this system has an error tail we cannot currently bound."

**Arc:** Does not become an engineer. Her arc is learning to ask a different question of the org — not "when will it be done" but "what is the failure rate we're underwriting, and who is watching it." Her reconciliation with Alex is professional, not personal: they build a shared vocabulary (evals-as-SLA-evidence) that lets her sell confidently without lying to customers.

**Key relationships:**
- Alex: the central working relationship of the book — adversarial in the middle acts, rebuilt on new terms by the end.
- Sloan: near the end, Claire is the one who starts citing Sloan's risk register in sales calls, a quiet sign of her arc.

---

## Victor — The Systems Theorist

**Role:** Semi-retired principal engineer / internal consultant, pulled in as a "special advisor" after the first major incident. Background in classical control systems, queueing theory, and early cybernetics (Wiener, Ashby, Beer are his touchstones).

**Background:** Old enough to have built SCADA and telecom switching systems before "AI" was the word for any of this. Treats large language models as noisy nodes in a network, not minds — his signature move is redrawing whatever whiteboard diagram is in front of him as a block diagram with feedback loops and error terms.

**Voice:** Aphoristic, occasionally maddening, never in a hurry. Teaches by analogy — queueing theory, thermostats, the Byzantine Generals problem — rather than by naming the AI-specific term for something. Not a mystic; his eccentricity is precision, not vagueness.

**Function in the story:** Delivers the book's thesis in pieces, across multiple conversations, rather than in one lecture. He is the character who insists the team stop asking "why did the model do that" (a question about an opaque mind) and start asking "what is the closed-loop gain of this system, and where is the sensor that would tell us it's drifting" (a question about an engineered system).

**Arc:** The most static character by design — he is the fixed point the others triangulate against — but the book earns one late reveal: Victor's insistence on treating AI as "just" a noisy control-loop component comes from having watched an earlier generation of engineers over-trust an under-instrumented system, with real consequences he doesn't discuss until near the end.

**Key relationships:**
- Alex: mentor-to-peer over the course of the book.
- Devon: the relationship with the most movement — Victor is the one who gives Devon a way to see his own patching as legitimate engineering once it's made systematic.

---

## Sloan — Security & Risk Lead

**Role:** Head of Security, later given an expanded mandate covering AI-specific risk (prompt injection, unvetted tool execution, data exfiltration via agent tool use).

**Background:** Came from classical appsec and red-teaming. Was raising the alarm about unconstrained tool use before "prompt injection" had a name anyone outside the team used.

**Voice:** Precise, unemotional, allergic to euphemism. Frequently the person in the room who says the sentence everyone else is avoiding. Not obstructionist for its own sake — every block comes with a specific attack scenario, stated plainly.

**Function in the story:** Initially reads as the "department of no," a source of friction with Claire's timeline. The book's structural argument is that Sloan is not opposed to velocity — Sloan is opposed to *unmeasured* risk, and the same harness that gives Claire defensible SLAs (evals, circuit breakers) is what lets Sloan turn blanket denial into staged, scoped approval.

**Arc:** Goes from "the person who says no" to "the person who designs the gate everyone else ships through." The character with the cleanest, quietest redemption — Sloan doesn't change much personally, the org changes to finally have a place for what Sloan was already saying.

**Key relationships:**
- Alex: the earliest ally Alex has, though it doesn't feel that way until Act II.
- Claire: the central antagonistic-but-not-villainous pairing in the first half; resolves into mutual respect once evals give both of them a shared, defensible standard of risk.

---

## Name Reference (for continuity)

- **Alex Chen** — VP of Applied Systems.
- **Devon Reyes** — Staff engineer, agent runtime owner.
- **Claire Whitfield** — VP of Revenue / Commercial.
- **Victor Aldana** — Special advisor, systems theorist.
- **Sloan Ferreira** — Head of Security & Risk.
- **Harmon** — Lead investor / board member (surname not yet used on the page; keep it that way unless a chapter needs it).
- **Priya** — Platform engineer, works closely with Devon; approves/reviews his early prompt changes (Ch. 3).
- **Marcus** — Platform engineer, pulled half-time onto audit tooling in Ch. 8–9.
- **Oskar** — Internal-tools team lead; the Slack-integration scope gap in Ch. 10. Returns in Ch. 21 to acknowledge Sloan was right — the character with the cleanest small redemption arc besides Sloan's own.
- **Farah** — Product engineer, pushes back on circuit-breaker thresholds in Ch. 16 (stand-in for the velocity-tax objection Claire herself voiced in Act I).
- **Nadia Okonkwo** — Joins Devon's team in Act III (Ch. 20). The living proof of Devon's SPOF status actually being dismantled: catches a near-miss the eval suite hadn't covered yet (Ch. 20), handles the Ch. 23 tail event as primary on-call without Devon's involvement, and is shown training the next hire by Ch. 24.
- **The company** — **Meridian**. Sells the "autonomous operations" product referenced throughout `docs/system-architecture.md`.

**Customer accounts (recurring):**
- **Halden Logistics** — the Ch. 1 incident account; ops director **Renata Ibitola**. Expands post-incident (Ch. 7); return-policy staleness incident.
- **Vantage Rail** — rail operator, the Ch. 5/6 tool-grant deal; VP of Operations **Marisol Ibarra**. First launch under the new discipline. Unaffected by Ch. 17's outage — fully migrated architecture. Renewal in Ch. 24 takes eleven minutes, a deliberate callback to the original six-week negotiation.
- **Farrow & Kline** — small logistics reseller; the contradictory-tier incident that opens Ch. 8 and gives "context swamp" its name.
- **Corvid Capital** — mid-sized asset manager; the financial-services account introduced Ch. 11. Highest-stakes account in the book. Claire wins it with the honest, scoped pitch (Ch. 11); Devon's skipped eval gate (Ch. 12) is exposed by the Ch. 13 injection postmortem, not caused by it; queue backlog fallout in Ch. 17; Ch. 22 is the account's joint technical-review audit (not a relaunch pitch — Corvid's own engineers stress-test the finished architecture directly); renewed at a higher tier by Ch. 24.
- **Callahan Supply** — Meridian's oldest pilot account, onboarded nearly two years before the Ch. 1 Halden incident (so nearly three years old by Ch. 17). Stable and unremarkable the whole time, therefore never prioritized for migration onto the post-Halden architecture — the exact gap that causes Ch. 17's outage. Fully migrated afterward as part of Ch. 18's board-funded standing practice.
- **Briarwell Health** — new pilot account, onboarded entirely under the finished Act III architecture (no legacy debt grandfathered in). The Ch. 23 tail-event account — deliberately a customer the reader has no incident history with, to show the discipline generalizes rather than only working on accounts the team has personally nursed.

## Voice & POV Notes

- Primary POV is close-third on Alex for the majority of chapters; frequent close-third chapters shift to Devon (production-floor chaos) or Claire (boardroom/commercial pressure) to widen the aperture. Starting in Act II (Ch. 10), Sloan also becomes a POV character as her role widens from a single negotiation to company-wide practice — a deliberate escalation, not a slip; keep her sections as flat and procedural in narration as her dialogue always was. Victor remains the one character never given a POV chapter — he is seen only from outside, which preserves his mystique until his Act III backstory reveal. Ch. 17 (the outage) is the one deliberately multi-POV chapter in the book, split into named sections (Alex / Devon / Sloan / Claire) to convey scale during the climax — an exception to the one-POV-per-chapter norm, not a new pattern to repeat elsewhere.
- Technical concepts should always enter through a character's stakes, never as exposition for its own sake — Victor's lectures work because someone in the room needs the answer *right now*.
- Avoid making Claire a strawman and Sloan a prophet without cost — both should be right about something the other undervalues for most of the book.
