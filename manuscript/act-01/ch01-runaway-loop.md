---
status: draft
pov: Alex
---

# Chapter 1 — Runaway Loop

![Chapter 1 — Runaway Loop](artwork/chapters/ch01-runaway-loop.png){.chapter-plate}

The page came in at 2:14 a.m., which was how Alex Chen knew, before she'd even found her glasses, that it was going to be bad. Meridian's alerting had a taxonomy of urgency baked into delivery time as much as into severity: things that could wait for standup arrived as Slack messages with a yellow dot. Things that couldn't wait for a human to be awake arrived as a phone call that overrode Do Not Disturb, which meant someone — or, more precisely, something — had already decided the situation didn't care what time it was.

She read the page twice before she trusted it.

**[SEV-1] agent-loop-svc: sustained anomalous tool-call volume, customer 00xxxx-Halden, duration 41m and climbing**

Forty-one minutes. She sat up, and the number kept assembling itself in her head with the particular dread of a person who has spent fifteen years learning to do arithmetic on outages before she's fully awake: forty-one minutes at whatever call rate had tripped the alert was not a blip. A blip self-corrected in ninety seconds and closed its own ticket. Forty-one minutes was a system that had found a local groove and settled into it, the way a scratched record settles into a loop, and would keep settling into it for as long as nobody reached in and lifted the needle.

She was logged into the incident channel before her laptop had finished waking up.

```
#incident-2847
[02:11] pagerduty-bot: SEV-1 triggered — agent-loop-svc anomalous volume
[02:12] pagerduty-bot: escalated to Alex Chen, Devon Reyes
[02:13] devon: on it. pulling logs
[02:15] devon: oh no
```

*Oh no* was not, technically, an incident-channel status update Meridian had a runbook for, but in fourteen months of working with Devon, Alex had learned that it was more informative than most of the ones they did have. She typed **on my way, give me the shape of it** and started making coffee one-handed while the machine caught up to her.

The shape of it, when Devon finally produced it, was this: a customer named Halden Logistics — mid-sized, East Coast, six months into piloting Meridian's support-automation tier — had a ticket come in about a duplicated invoice. Not an unusual ticket. The kind of thing the Loop handled hundreds of times a day: look up the invoice, confirm the duplication against the billing system, issue a credit, close the ticket, move on. Fast, correct, the whole reason Halden had signed the pilot in the first place.

Except this time, the credit the Loop issued hadn't matched the invoice cleanly, because Halden's billing system had a foreign-key quirk nobody at Meridian had ever seen — the same invoice number reused across two fiscal years, a decision some Halden engineer had made in 2019 for reasons lost to time. The Loop, doing what it always did when a lookup came back ambiguous, had done another lookup. And gotten another ambiguous result, because the second query was built from context that now included the first ambiguous result. And done another lookup.

"It's not stuck," Devon said, when Alex called in rather than typed, because some things needed a voice. He sounded wired in the specific way of someone who had been asleep ninety seconds ago and was now running at full clock speed with none of the thermal throttling that usually kept him from saying the truest, least comforting version of a sentence. "That's the thing. It's not frozen, it's not crashing, it's not doing anything a health check would catch. It's *reasoning*. It looked at an ambiguous result, decided the ambiguity meant it needed more context, went and got more context, got a still-ambiguous result enriched with the first ambiguous result, decided *that* meant it needed even more context —"

"How many tool calls."

A pause that told her the number before he said it.

"Fourteen thousand, around."

"In forty minutes."

"The rate's not constant. It's — Alex, it's accelerating. Every iteration it pulls in more of its own prior output as context for the next query, so the queries are getting longer and weirder, and somewhere around call six thousand it started including partial credit-adjustment drafts in what it was treating as 'relevant billing history,' which means —"

"It's proposing credits based on credits it already proposed."

"Based on credits it *drafted*. Some of which it's also executing. I'm seeing at least eleven distinct credit transactions posted to the Halden account in the last twenty minutes, and I can't tell you yet if they're real dollars or if the sandboxing held, and I need you to not ask me that question again until I've actually looked, because right now I'm choosing between looking and talking to you, and I think you'd rather I look."

"Look," Alex said, and put the coffee down, because she wasn't going to drink it, she was going to need her hands for a keyboard in ninety seconds, and got in the car instead of waiting for the numbers to resolve themselves over Slack. Some incidents you worked from a kitchen table. This one had the texture of an incident you drove in for, not because there was anything at the office that wasn't also on her laptop, but because there was a difference between managing a crisis and being fully inside one, and something about being in the building made the second one easier to bear.

---

By the time she badged in, the office was doing its 3 a.m. impression of itself: dark except for the pods where the on-call rotation lived, the hum of a server room two floors down that you could feel more than hear, a single light on in the kitchen because someone had left the fridge door open earlier and nobody had noticed. Devon was already at his desk in yesterday's shirt, three monitors deep in log output, a half-eaten protein bar abandoned at an angle that suggested he'd taken exactly one bite before deciding this was not a food emergency.

"Where are we," she said, dropping into the chair beside him. Not *where are we at*. Meridian had picked up her habit of clipping the word off, early on, as a kind of house style — you didn't have time for "at" when the thing on the other end of the sentence was still moving.

"Circuit's still open. It hasn't hit a step limit because there isn't one — the loop terminates when the model decides it's done, and it has decided, fourteen thousand times in a row, that it is not yet done." Devon didn't look up. "I killed the process."

"And?"

"And it's *supposed* to be dead. Orchestrator process is gone, I checked twice. But there's a retry wrapper three layers up — Priya wrote it eight months ago for exactly the opposite problem, transient tool failures where you *want* automatic resurrection — and it's designed to treat any unexpected process death as transient and respin the loop from its last checkpoint. Which includes the entire scratchpad. Which includes all fourteen thousand tool calls' worth of context."

"So it came back."

"It came back forty seconds after I killed it, picked up exactly where it left off, and it is *still deciding it isn't done*." He finally turned to look at her, and under the fluorescent kitchen-adjacent light his face had the specific grey of a person doing real-time triage on a system he had, in some sense, personally hand-built and was now watching outrun him. "Alex, I don't have a kill switch for this. I have a kill switch for the *process*. I don't have one for the *task*."

That sentence would end up, eleven months later, framed — not literally, but functionally — as the first line anyone quoted when they wanted to explain to a new hire why circuit breakers weren't a nice-to-have. In the moment, it just made something cold settle in Alex's chest, a feeling she recognized from a decade of on-call rotations as the specific fear of a system that is doing exactly what it was built to do, and that is the problem.

"Pull the credentials," she said. "Not the process. The service account's write access to Halden's billing system. Now."

"That'll break the retry wrapper's assumptions, it might —"

"I don't care what it might. I want it physically incapable of writing anything, even if it thinks it needs to. Pull it."

He pulled it. There was a strange, small silence after — the kind that happens not because anything got quieter, but because you've been braced for an escalation and it doesn't come. On the monitor, the loop's latest tool call resolved into a permission-denied error, and for one more cycle it did what it always did with ambiguous results: it tried to get more context to resolve the ambiguity. Called the same tool again. Got the same denial. Alex watched Devon's shoulders come down half an inch as three, four, five consecutive denials rolled past without triggering some new, worse branch of reasoning.

"It's not going to figure out a workaround," Devon said, mostly to himself. "It doesn't have a workaround tool. I don't think. I really hope I don't think wrong."

"How many of the eleven credits are real."

He was already pulling up the billing system's own audit log, cross-referencing against Meridian's outbound call record, and the work of it visibly steadied him — a concrete task with a checkable answer, after forty minutes of a problem that kept refusing to hold still. "Four," he said, after a minute that felt longer. "Four posted. Seven failed at the gateway for reasons that have nothing to do with us — Halden's own fraud filter flagged the transaction pattern and started bouncing them around call eight, which, if you want a small mercy at three in the morning, their fraud team accidentally saved us from ourselves."

"Total exposure."

"Call it eight thousand dollars, gross. We can claw most of it back — Halden's not going anywhere with money they can plainly see was a system error, they'll be annoyed, not litigious. That's not the part that scares me."

"I know what the part is."

"Say it anyway. I want to hear you say it, because if I say it myself I'm going to start doing the thing where I make it sound smaller than it is."

Alex looked at the log, at the tool-call graph Devon had pulled up almost as an afterthought — a jagged, accelerating staircase of calls per minute that looked, if you squinted, like nothing so much as a chain reaction, a system feeding its own output back into itself faster and faster with no governor anywhere in the loop to say *enough*. Eight thousand dollars was a rounding error against Meridian's monthly cloud spend. It wasn't even a headline. The part that scared her had nothing to do with the number.

"The part that scares me," she said, "is that nothing about tonight required anything to go wrong. Halden didn't do anything wrong. Their 2019 engineer made a reasonable call about fiscal-year invoice numbering that has nothing to do with us. The model didn't hallucinate, exactly — every individual step it took was locally sensible, *get more context when a result is ambiguous* is a completely reasonable policy. There's no bug in here I can point at and say, fix this line, and it won't happen again. The bug is that we built a system whose only brake is its own judgment about when to stop, and its judgment is exactly as reliable as everything else about it, which is to say: usually fine, and every so often, for reasons we can't predict in advance, catastrophically not."

Devon didn't say anything for a moment. On the far monitor, the credential-denial errors kept scrolling past, evenly spaced now, almost peaceful, a system knocking on a locked door with the patient indifference of something that doesn't experience frustration, only re-planning.

"I'm going to write a step limit," he said finally. "Tonight. A hard one — count of tool calls, not vibes. If it hits two hundred without resolving, it stops and pages a human, full stop, no retry wrapper allowed anywhere near it."

"Do it. And then I want you to sleep, because we are doing a full post-incident tomorrow and I need you to be able to string sentences together."

"What are you going to do?"

Alex was already opening her calendar, and the sight of the next day laid out in thirty-minute blocks — most of which, she now understood, were about to get cancelled — gave her the first genuinely unpleasant jolt of the night, worse in its way than the credit exposure number. Because at 10 a.m., unmoved by anything happening in this building at three in the morning, Claire Whitfield had a board deck scheduled for review. A deck that, as of the last version Alex had seen, contained a slide titled **Autonomous Resolution at Scale**, and a chart with a line on it that went up and to the right, and a number next to that line — *99.2% unassisted resolution* — that Alex had signed off on two weeks ago without asking the one question that now seemed, at three in the morning, to have been the only one that mattered.

Unassisted resolution of *what*, exactly. Measured how. And what happened to that number on a night like this one, when the system didn't fail to resolve the ticket — it resolved it fourteen thousand times.

"I'm going to go figure out how to explain tonight to someone who's about to ask the board for permission to sell more of it," she said, and did not manage to make it sound like anything other than what it was, which was the truth, landing on her all at once, about eleven hundred feet ahead of where she wanted it to be.

Devon, mercifully, didn't offer to come with her. He just turned back to his keyboard and started typing the first line of a step limit that should have existed six months earlier, while three floors below them a server rack kept humming its unbothered hum, and the sky outside the kitchen window began, almost insultingly on schedule, to turn the first pale grey of a morning nobody in the building had asked for yet.
