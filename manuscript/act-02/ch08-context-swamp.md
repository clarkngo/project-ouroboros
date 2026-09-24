---
status: draft
pov: Alex
---

# Chapter 8 — Context Swamp

![Chapter 8 — Context Swamp](artwork/chapters/ch08-context-swamp.png){.chapter-plate}

The second one arrived four days after Halden, while Alex and Devon were still elbow-deep in the first, which told her something about the shape of the problem before either of them had said a word about it out loud: a genuinely new failure would have waited its turn. This one didn't feel new. It felt like the same water table, rising somewhere else.

It was a small account, a logistics reseller called Farrow & Kline, three hundred tickets a month, the kind of customer nobody would have flown to Fort Worth for. A support agent told a customer their account was ineligible for expedited shipping — flatly, confidently, citing an account-tier restriction — and then, ninety seconds later in the same conversation, when the customer pushed back, cited the opposite restriction to justify a different denial. Not a contradiction a customer would necessarily catch. This one did, because she worked in logistics herself and knew her own contract terms better than the system explaining them to her did.

"Pull the transcript," Alex said, over Devon's shoulder, the two of them back in the same configuration they'd been in eleven weeks ago at 3 a.m., except this time it was 10 a.m. and the coffee was actually being drunk. "I want to see exactly which source it pulled each claim from."

It took Devon twenty minutes to find both. The first restriction came from Farrow & Kline's current contract terms, correctly retrieved, accurately stated. The second came from a promotional tier structure that had existed for exactly one quarter, two years ago, ingested during onboarding and never removed, technically still sitting in the same knowledge-base namespace as the live contract terms with nothing distinguishing "this is what's true now" from "this is what used to be true." The model hadn't picked one source over the other because it judged one more reliable. It had picked whichever one happened to surface first in that particular retrieval pass, a coin flip dressed up as confident prose, and would, if asked the same question in a different conversation, quite possibly have flipped the other way.

"This isn't the return-policy thing again," Devon said, and Alex could hear him working through it in real time, the specific cadence of someone updating a mental model rather than reciting a rehearsed diagnosis. "The return-policy thing was one stale document nobody flagged. This is — there's no flag that would have caught this. Both documents are, in some narrow sense, real. One's just dead and doesn't know it."

"How many more of these are in there."

"I genuinely don't know. That's the actual problem, Alex. I don't know how to know."

They spent the rest of the day building something to find out, which turned into the closest thing either of them had to an honest answer by that evening: a crude script, nothing elegant, that walked every document and prompt fragment currently reachable by any live agent and flagged anything that hadn't been touched, reviewed, or referenced in a change log in more than ninety days. It was a blunt instrument. It couldn't tell them whether an untouched document was stale or simply, correctly, unchanging — a company's legal name doesn't need a ninety-day refresh. But blunt was better than nothing, and nothing was what they'd had that morning.

The number it produced, a little after 7 p.m., made Devon put his coffee down without drinking it, which Alex had come to recognize, across two incidents now, as his specific tell.

"Fourteen hundred documents," he said. "Fourteen hundred pieces of context reachable by at least one live agent that haven't been touched in over ninety days. I don't know how many of those are actually stale versus just stable. I don't have a way to know that yet. But fourteen hundred is — that's not a list of things to go fix one by one. That's a landscape."

Alex looked at the number for a long moment, and felt something settle into place that had been circling for days without quite landing — a way of naming what she'd been trying to describe to herself since the return-policy call. "It's not really a bug list," she said. "A bug list has a bottom. You work through it, it gets shorter, eventually it's empty. This doesn't have a bottom, because it's not static — every ticket we resolve, every document we ingest for a new customer, every prompt patch we ship, adds to the pile faster than any one person could review it. It's not a backlog. It's a physical process. Things decay. We built a system that accumulates faster than it forgets, and called the accumulation 'knowledge,' and never built anything that distinguishes knowledge that's still true from knowledge that used to be."

"So what do we actually call it. For the incident report. 'Stale document' doesn't cover the Farrow & Kline thing — that one wasn't even really about the document being wrong, it was about two documents disagreeing and the system having no way to know which one it was standing on."

Alex thought about the scratchpad architecture underneath all of it — the shared context that grew across a conversation, across a ticket, sometimes across a customer's whole relationship with the product, evicted only when it hit a hard token ceiling and never before, with no policy for what got thrown out first, no distinction anywhere in the pipeline between a fact still load-bearing and a fact that had quietly stopped being one. "Context swamp," she said, the phrase arriving whole, the way the good ones sometimes did. "Everything goes in. Nothing meaningfully comes out except by brute token-limit eviction, which doesn't care what's true, only what's oldest in the buffer. True things and dead things sink into the same water and come back up looking identical. That's the name."

---

Claire found out about Farrow & Kline the way she found out about most things now — the weekly incident digest, which she'd started reading in full rather than skimming since the Halden call, a habit Alex had noticed without commenting on it, filing it instead as one of the quieter, more durable outcomes of the last several weeks. She called within the hour.

"I read the writeup," Claire said, without preamble, which was how Alex had learned to recognize when something had actually rattled her rather than merely interested her. "Fourteen hundred documents. Alex, I need you to help me understand what I'm supposed to say to a customer if this happened to them instead of a three-hundred-ticket reseller who happened to catch it herself. If it's structural — if you're telling me this isn't a short list of things we fix and then it's done — what do I tell a customer about all the ones we haven't found yet?"

It was, Alex thought, exactly the right question, and she felt a small, complicated relief at hearing Claire ask it unprompted, a relief that had nothing to do with being right and everything to do with not being alone in the room with the size of the problem anymore. "You tell them the true thing," she said. "Which is that we don't currently have a way to bound how much of this exists, and that not having a way to bound it is itself the thing we're now treating as the priority, over any single fix. I know that's not a comfortable sentence to put in front of a customer."

"It's more comfortable than the alternative, which is them finding the next one themselves and wondering what else we knew and didn't say." A pause, and Alex could hear something shifting in it, a decision being reached in real time rather than announced after the fact. "What do you actually need. Not the polite version. The real one."

"I need the eval-suite work to stop being a project Devon and I do in the gaps between fires. I need headcount, and I need it to be understood, at the board level if it has to go there, as the actual foundation the rest of this is built on — not a nice-to-have quality initiative, but the thing that turns 'we don't know how much of this exists' into a number we can actually track going down over time instead of just hoping it isn't growing faster than we're finding it."

"How many people."

"Two, to start. One specifically to build out the audit tooling Devon and I hacked together today into something real — something that can tell the difference between stale and merely stable, not just flag everything that hasn't been touched in ninety days. One to start building the actual eval harness itself, the thing Devon and I keep saying we'll get to and don't."

"I'll have it by Friday," Claire said, an echo, Alex realized, of almost the exact sentence she herself had used eleven weeks earlier after the first incident, and something in the symmetry of it — the two of them trading that promise back and forth across a widening, then narrowing, gap — felt, for the first time in days, like something closer to an actual partnership than a negotiation.

She hung up and sat for a moment with the fourteen hundred number still open on her second monitor, the landscape of it, unbounded and quietly growing, somewhere underneath every conversation the company was currently having with every customer it had. It wasn't a comfortable thing to sit with. But it was, she thought, the first time in eleven weeks that naming the size of the problem correctly had felt like progress instead of just dread — and she understood, distantly, that this was probably what Victor had been trying to get her to see all along: that the fix was never going to be a patch. It was going to be an instrument. And you couldn't build the instrument until you'd stopped flinching from how much there actually was to measure.
