---
status: draft
pov: Devon
---

# Chapter 7 — Cracks in the Demo

The Halden expansion call was supposed to be easy, which in Devon's experience was the exact category of call that never was.

It made a certain grim sense that Halden would be the account to expand fastest after the incident — Claire had explained it to him once, in the specific patient tone she used when she suspected an engineer was about to be offended by a sales insight, that a customer who watches a vendor catch and fix its own mistake fast and transparently often trusts that vendor *more* than one who's never had a visible failure, because now they've actually seen what happens when something goes wrong instead of taking it on faith. Eleven weeks after the 2 a.m. page, Halden's ops director, a clipped, competent woman named Renata Ibitola, was on a call to greenlight tripling the Loop's ticket volume across two more of Halden's regional support queues, and had asked, reasonably, for a live walkthrough first.

Devon drove the demo himself, which he didn't usually do — demos were normally Priya's job, or one of the two newer platform engineers who'd joined since Halden — but Alex had asked him personally to run this one, and hadn't needed to explain why. If it went well, it went well because the person who'd fixed the original incident was standing behind it. If it went badly, better that the person with the fastest hands on the actual system was the one in the room.

It went fine for the first eighteen minutes. Devon walked Renata through three live tickets pulled from Halden's real queue — a shipping delay inquiry, a duplicate-charge question resolved correctly this time by a lookup path that, yes, he'd personally rewritten twice since the incident, and a password reset that resolved in nine seconds flat and drew an actual small laugh of appreciation from Renata, the good kind, the kind that meant the thing was working exactly as advertised. He felt the particular, dangerous ease of a demo going well, the sense of a system behaving itself, and some part of him — quieter now than it would have been eleven weeks ago, but not gone — allowed himself a private, private-enough-that-nobody-could-see-it pride in how far the thing had come.

Then Renata asked, almost as an aside, "Can it handle a return-policy question? We get a lot of those on the apparel side."

"Sure," Devon said, and typed in a synthetic ticket on the spot, something he hadn't scripted, because eighteen minutes of clean demo had made him a little braver than he should have been. *Customer is asking whether they can return an item purchased 45 days ago without the original receipt.*

The agent's response came back fast, fluent, and confident, the way it always did, the specific cadence Devon had spent fourteen months tuning to sound helpful without sounding robotic: *Yes — under Halden's extended holiday return policy, items purchased within the last 60 days can be returned without a receipt if the purchase can be verified through the loyalty program. I can process this return for you now.*

Devon felt the sentence land wrong about half a second before his conscious mind caught up to why. Halden didn't have a loyalty program. He was fairly sure of that. He was fairly sure, and fairly sure was a phrase that had started, in the last eleven weeks, to make the back of his neck go cold in a way it hadn't used to.

"We don't have a loyalty program," Renata said, into the small silence, in the flat tone of someone who has just watched a vendor's system describe a piece of her own company's infrastructure to her incorrectly, live, on a call she'd specifically asked to run so she could evaluate trust. "We killed that program two years ago. And our return window is thirty days, not sixty, and it was never sixty, even under the old policy."

"Let me pull the source," Devon said, keeping his voice level with an effort that cost him more than it should have, and found it in about four seconds — a stale FAQ document, ingested into the agent's knowledge base during initial onboarding fourteen months ago, describing a promotional sixty-day-with-loyalty-verification policy Halden had apparently run for one holiday season back when the original onboarding data was pulled, and never updated since, because nobody at either company had thought to flag "return policy" as the kind of document that needed a refresh cadence. The agent hadn't hallucinated the sixty days or the loyalty program out of nothing. It had retrieved something real, something that had once been true, stale by roughly eighteen months, and presented it with exactly the same fluent confidence it used for something verified against live data thirty seconds ago. There was no tell in the tone. That was the whole problem. Wrong and right came out of the system sounding identical, and the only thing separating them was whatever the underlying source happened to be that day, and nobody had ever built anything that checked.

"It's pulling from a stale onboarding document," Devon said. "Fourteen months old. I can see exactly which file, I can see exactly why it thinks this is current, and I want to be straight with you about something rather than smooth it over: this isn't the failure mode from eleven weeks ago. That one was the system doing something dangerous with ambiguous live data. This is different and, if I'm honest, in some ways I like less, because it's not ambiguous at all from the model's side — it found a clean, specific, confidently wrong answer, and nothing in the pipeline flagged that the source document might be out of date before it got served to a customer."

He watched Renata absorb that, and understood, watching her, that the honesty was landing better than a smoother answer would have — she'd have caught a smoother answer for what it was in about one more sentence, and the cost of being caught in a dodge on this specific call, on this specific account, would have been much higher than the cost of an uncomfortable true sentence. "How many other documents in that knowledge base are eighteen months stale," she asked, "that I don't happen to know the current answer to well enough to catch it live?"

"I don't know," Devon said, which was also true, and also the correct thing to say, and landed in his own chest with a weight he didn't let show on his face. "I can tell you I'm going to find out before end of day, and I can tell you what actually needs to exist here, which isn't a patch — I could go make this one document say sixty days is wrong right now, five minutes, done, and it would fix nothing, because the actual gap is that we ingested a pile of documents fourteen months ago and never built anything that checks whether they're still true. That's a real gap. I'd rather tell you that than tell you I fixed it in five minutes and have you find the next stale one yourself in three weeks."

Renata was quiet for a moment — the specific quiet, Devon had come to recognize across eleven weeks of a much more attentive relationship with Halden than either party had wanted to need, of someone deciding how much benefit of the doubt a vendor had actually earned versus how much they were merely asking for. "I appreciate you not smoothing it over," she said, finally. "I'm not going to pretend this doesn't move my confidence back some from where it was eighteen minutes ago. But I've had vendors lie to my face about smaller things than this, so. Tell Alex I want a written plan for a document-freshness process, not a patch, by end of week, and I want the expansion timeline to reflect it actually existing before we triple volume, not before you promise to build it."

"That's fair," Devon said, and meant it, and closed the call four minutes later with the specific hollowed-out feeling of having survived something rather than won it.

---

He found Alex at her desk before he'd even finished the walk from the call room, and told her the whole thing in the clipped, complete way he'd learned she preferred over the softened version — the loyalty program, the sixty days, Renata's flat unsurprised anger, the plan he'd promised by end of week that he did not yet have a first idea for.

Alex listened without interrupting, which she rarely did all the way through, and when he finished she didn't say anything for a moment, just looked at the wall past his shoulder with an expression he'd started to recognize over the last eleven weeks as the specific look of someone doing arithmetic she didn't like the shape of.

"How stale is the rest of the knowledge base," she said. "Not the return policy document specifically. All of it. Halden's, and everyone else's."

"I don't know. I genuinely don't. Nobody's ever audited it end to end — it just keeps growing, every customer's onboarding adds more, and nothing ever ages out unless someone happens to notice it's wrong, which mostly means a customer catches it, which mostly means it's already gone out the door once."

"So the actual failure today wasn't the return policy."

"What do you mean?"

"The return policy was a symptom. Eleven weeks ago you told me you were going to start keeping a list — every patch, what it fixed, what you didn't have time to test. You've kept that list. I've read it every week. It's forty-some entries of individually reasonable fixes to individually real problems, and not one of them touches this, because this isn't a prompt problem at all. It's a data problem sitting one layer underneath the prompt, and I think — " she stopped, and something in the stopping told him she was arriving at the thought in real time rather than reciting one she'd already had — "I think that's exactly the shape of what's coming for us next. We've spent eleven weeks getting genuinely good at catching the failures that show up as the system doing something *wrong* in a single obvious step. Today's failure showed up as the system doing everything *right*, cleanly, confidently, using an input nobody had checked was still true. That's a different animal. That's not a broken step. That's the whole context the model's reasoning over quietly rotting out from underneath it, and I don't think we have a single piece of instrumentation in this entire architecture that would catch that happening anywhere else, right now, today, in ways smaller than a customer noticing live on a call."

Devon didn't have anything to say to that, because he could feel, underneath the specific exhaustion of having just survived a bad demo, the larger and much less comfortable shape of what she was describing settling into place — not a single fire to put out, but a slow, structural, distributed kind of rot, spread across everything the system had ever ingested and never revisited, waiting in some unknown number of documents and prompts and cached assumptions for the next customer, the next call, the next moment when confident and wrong turned out to sound exactly the same.

"We should call it something," he said, mostly to have something to say. "Give it a name. Makes it easier to track if it has a name instead of just being the vague dread I'm going to be sitting with tonight."

Alex considered that for a second. "Context swamp," she said. "Everything true eventually sinks into it and stops looking any different from everything that never was."

Neither of them said anything else for a while. Outside, the ordinary end-of-day churn of the office went on, oblivious, and somewhere in a server rack three floors down, sixteen thousand words of accumulated instruction and an unaudited pile of onboarding documents sat quietly doing exactly what they'd always done, waiting, the way these things always seemed to wait, for someone to ask them a question they weren't ready to answer.
