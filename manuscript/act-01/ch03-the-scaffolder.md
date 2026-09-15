---
status: draft
pov: Devon
---

# Chapter 3 — The Scaffolder

Devon Reyes had a theory, which he'd never said out loud to anyone because it sounded worse out loud than it felt in his head, that he was good at this job for the same reason he'd been good, at nineteen, at talking his manager at the electronics store out of firing a stock kid who kept miscounting inventory: he was fluent in the specific dialect of *almost right*. Most people wanted things to be simply right or simply wrong, a clean binary they could file and move on from. Devon had never found that binary especially load-bearing. The stock kid wasn't lazy, he was dyslexic and embarrassed to say so. The model wasn't lying when it told a customer their refund had been processed three hours before it actually had — it was *confident*, which was a different failure with a different fix, and you couldn't repair the second thing by yelling at it for the first.

The step limit he'd written at four in the morning had gone into production at 6:40, after ninety minutes of testing against the incident's own transcript to make sure two hundred calls was a real ceiling and not a number he'd picked because it sounded responsible. It held. He'd watched it hold on three separate ambiguous-lookup scenarios he manufactured himself, synthetic tickets built specifically to make the Loop chase its tail the way Halden's had, and each time, around call one-eighty, the new guard rail fired clean: hard stop, page a human, no retry wrapper resurrection. It was, by any reasonable measure, a good night's work, and he felt the specific, slightly shameful satisfaction of having personally stood between the company and a worse morning than the one it got.

Nobody else knew that feeling existed, was the thing. Not because they didn't care — Alex cared, visibly, more than almost anyone he'd worked for — but because the actual mechanism of the fix lived entirely in Devon's head and in a single file called `orchestrator/prompts/support_agent_v47.md`, and the gap between those two facts was the whole shape of his job.

He pulled the file up now, mid-morning, coffee number three, to do the thing he did almost every day and had stopped noticing as unusual: patch it directly.

```
support_agent_v47.md
—
... [11,400 words of accumulated instruction, examples,
    edge-case callouts, and exception handling, built up
    over fourteen months by Devon and, before him, two
    engineers who no longer worked at Meridian] ...

## Handling ambiguous billing lookups
If an invoice lookup returns multiple matching records,
do not assume the most recent record is authoritative.
Cross-reference against the customer's stated ticket
description before selecting a record to act on. If
ambiguity cannot be resolved after gathering additional
context, escalate to a human reviewer rather than
guessing.

[NEW — added 06:52 today]
If ambiguity persists after THREE context-gathering
attempts, STOP GATHERING CONTEXT and escalate immediately.
Do not attempt a fourth lookup under any circumstances.
This is a hard rule, not a suggestion.
```

He read the new block twice, the way he always did, half satisfied and half — he made himself sit with the second half this time, because something about last night had left the feeling more exposed than usual — half aware of exactly how thin this was as an engineering artifact. It was, when he looked at it honestly, a stern note left for a coworker who might or might not read it carefully, taped to the front of a machine whose actual internal wiring nobody at the company had access to. He was not editing code. He was editing *tone of voice, applied to a system that responded to tone of voice roughly as reliably as a person half-listening responds to being told something twice.* The step-limit circuit breaker from 4 a.m. was real engineering, deterministic, would hold no matter how confidently the model reasoned itself past it. This — the eleven-thousand-word file, the new paragraph in all caps because caps had, empirically, slightly better compliance rates than lowercase for hard constraints, a fact Devon had derived from vibes and eighteen months of pattern-matching rather than from any dataset he could point to — this was something else. A prayer with good production values.

He pushed the change. There was no review queue for it, not really — technically a pull request existed, technically it required one approval, but the unspoken understanding on the team was that Devon's prompt changes got approved by whoever was online and free in under five minutes, because Devon understood the file better than anyone else who might review it, and asking him to wait for a more careful process felt, to everyone including Devon, like asking a surgeon to wait for a committee while someone was still on the table. Priya rubber-stamped it forty seconds after he pinged her. It was live nine minutes after that.

He felt good about it for almost forty-five minutes, which was, he would reflect much later, close to a personal record.

---

"Walk me through what actually changed," Alex said, at the desk beside his, mid-afternoon, post-incident review looming at four and both of them doing prep work that felt less like prep and more like triage on the triage. "Not the circuit breaker — I read that diff, it's clean, I approved it myself an hour ago on the way in. The prompt change."

"Added a hard stop after three context-gathering attempts on ambiguous lookups. Belt and suspenders under the step limit — the step limit's the real backstop, but I wanted the model to self-terminate way before two hundred calls, ideally around call four or five, so we're not relying on the breaker at all in the common case."

"How do you know it'll hold."

"I ran it against synthetic ambiguous tickets. Six of them. Held on all six."

"How do you know it'll hold on the seventh kind of ambiguous ticket. The one you didn't think to write."

He didn't have an answer to that, and the not-having sat in his chest with a specific, familiar weight, because it was the same question, roughly, every time, and he'd developed a set of answers over fourteen months that were less *answers* and more *ways of restating that he'd been careful.* "I know the failure mode we saw last night," he said. "I patched that failure mode. I can't promise you there isn't a different one shaped differently enough that this patch doesn't catch it."

"That's not a criticism of you," Alex said, and something in how carefully she said it told him she'd rehearsed the sentence, or at least thought about how to land it before she walked over. "I want to be really clear about that, because I think you hear a version of this conversation as *Devon didn't do a good enough job*, and that's not what I'm doing. You did excellent work last night, under conditions where excellent work was genuinely hard to produce. What I'm doing is pointing at the *shape* of how we ship changes to this system, which is: you notice a failure, you write a sentence that tells the model not to do the specific thing you noticed, we ship it in under ten minutes because you're the only person who can review it fast enough to matter, and we have no way of checking whether that sentence broke something else it was doing correctly yesterday."

"We'd know pretty fast if it broke something big."

"Would we? Or would we know the way we knew about last night — forty-one minutes in, because a cost alert fired, not because anyone was watching for *behavior* changing, only for *volume* changing?" She wasn't being unkind about it, which somehow made it land harder than if she had been; Alex's whole management style, as far as Devon had ever been able to characterize it, was a refusal to let a real problem hide behind a comfortable framing, applied with total consistency to herself as much as to anyone else. "Here's what's actually bothering me, and it's not you, it's the architecture we've let grow up around you. There's exactly one person at this company who can safely make a change to how the support agent behaves. That's not a compliment to how good you are, even though you are good. That's a description of a single point of failure with a name and a Slack handle, and single points of failure don't care how competent the point is. You get sick. You go on vacation. You leave — I'm not saying you're going to, I'm saying *the system doesn't know you're not going to*, and neither do I, honestly, fourteen months in, and that's on me for letting it get this far without building anything under you."

Devon looked at the eleven-thousand-word file, still open in the next tab, the new all-caps paragraph sitting at the bottom of it like a note stuck to a much larger and much less legible whiteboard. He thought about 4 a.m., the specific quiet competence of watching a step limit hold against a synthetic ticket he'd built himself in twenty minutes of adrenaline-fueled focus, the private, unshared satisfaction of being the person who could do that. He thought about how much of his last fourteen months at this company had run on exactly that feeling, and how strange it was to have someone name it out loud as a liability rather than an asset, in a tone that made unmistakably clear she meant both things at once and wasn't choosing between them.

"So what, we stop shipping prompt changes until we've built — what, a whole test suite for a system whose failure modes we don't even have a full list of yet?"

"No. We keep shipping them, because Halden's ticket doesn't wait for us to have a perfect process, and neither will the next one. But I want you to start keeping a list — every patch, what failure it was responding to, what you tested, what you didn't have time to test. Not for a review board. For us. Because at some point, probably sooner than either of us wants, we're going to sit down and turn that list into the first real regression suite this system has ever had, and I'd rather it be built from fourteen months of your actual judgment calls than from nothing."

"That's going to be a long list."

"I know," Alex said, and there was something almost rueful in it, an acknowledgment of scale that Devon hadn't expected and that made the whole conversation land differently than he'd braced for. "That's kind of the point. It shouldn't be able to fit in one file. The fact that it currently does is the whole problem, in miniature."

He didn't say anything for a moment, turning it over — the mild vertigo of watching something he'd been quietly proud of get correctly, patiently reframed as debt, without anyone ever telling him he'd done anything wrong. It was a strange kind of correction, one with no target to push back against, because she hadn't blamed him for a single decision he'd made. She'd just drawn a box around fourteen months of decisions and shown him the shape of the box from the outside, which he found, to his own mild surprise, he couldn't argue with even a little.

"I'll start the list today," he said.

"Good. And Devon — the step limit was the right call, and it was fast, and it probably saved us a much worse morning than the one we had. I don't want the rest of this conversation to bury that part."

"I heard both halves," he said, which was true, and did not make either half sit any easier, and he went back to the eleven-thousand-word file with the strange new awareness that somewhere in its accumulated paragraphs, arranged in no order he could fully reconstruct anymore, was a record of every 4-a.m. decision he'd made for over a year, none of it tested against anything but his own memory of what had gone wrong the last time.
