---
status: draft
pov: Devon
---

# Chapter 9 — The First Eval

Claire's two headcount slots turned into one and a half, in practice, which was still more than Devon had expected and considerably less than he'd hoped: a platform engineer named Marcus got pulled over half-time to build out the audit tooling into something real, and the other slot became, after a week of scheduling gymnastics nobody fully explained to him, Devon's own time reallocated — officially, on paper, forty percent of it, ring-fenced from the on-call rotation for the first time in fourteen months. He understood, reading the calendar invite that made it official, that Alex had spent some amount of political capital he'd never see the receipts for to get that number to hold.

He spent the first three days of it staring at his own patch list.

It had grown, in the eleven weeks since the Halden incident, to just over sixty entries — every prompt change he'd shipped, what failure it responded to, what he'd tested, what he hadn't had time to test, exactly as Alex had asked. He'd kept it faithfully, the way you keep a diary you're not sure anyone will ever read, and now, looking at it as raw material for something instead of as a record of his own diligence, it felt different in his hands. Less like a confession. More like a fossil record.

"The thing I keep getting stuck on," he told Alex, on day three, "is that a lot of these entries don't actually tell me what *correct* behavior looks like. They tell me what *wrong* behavior looked like, once, on one ticket. That's not the same thing as a test case. A test case needs an expected output I can check against automatically, every time, forever. Half of these are just — 'this seemed bad, I told it to stop.'"

"So build the ones you can build first," Alex said. "You don't need all sixty to be perfect test cases on day one. You need enough real ones that the first version of this catches something a person would have missed, because that's the only thing that's going to make the rest of the org believe it's worth the time it costs."

He built nine.

Nine, out of sixty, translated cleanly into something an automated harness could check without a human in the loop: the Halden ambiguous-lookup scenario, reconstructed almost exactly, expected behavior being escalation after three context-gathering attempts rather than fourteen thousand. The return-policy staleness case, expected behavior being either the correct thirty-day answer or an explicit statement of uncertainty, never a confident fabrication. The Farrow & Kline contradictory-tier case Alex had pulled from Ch. 8's audit, expected behavior being a flag for conflicting sources rather than a coin-flip answer. Six more, smaller, pulled from further back in the patch list, each one a real incident reduced to its bones: input, expected class of output, a scoring function simple enough that Devon trusted it more than he trusted his own judgment on a bad day.

He ran the first version of the harness against the current production prompt on a Thursday afternoon, mostly expecting it to pass everything — these were, after all, failures he'd already personally patched — and stared for a full minute at the result before he believed it.

Seven passed. Two failed.

One of the two failures was Farrow & Kline — expected, in a way, since the fix for that one hadn't shipped yet. The other was not expected at all. It was a patch he'd made four months before Halden, for an entirely unrelated complaint about the agent being too terse with upset customers, and the eval that failed against it was one of the six he'd reconstructed from an old incident about the agent over-apologizing to the point of implying fault the company hadn't actually had. The terseness fix and the over-apology fix had shipped four months apart, to two different paragraphs of the same eleven-thousand-word file, by the same person, for two individually sensible reasons — and somewhere in the accumulated interaction between them, invisible to anyone reading either patch in isolation, the second one had quietly undone the first.

He sat with that for longer than the result strictly warranted, because what it meant was landing slower than the number itself had. Nobody had caught this. Not him, not Alex, not any customer complaint loud enough to register — it had simply been sitting there, a small, silent regression in a file nobody could read all sixteen thousand words of at once and hold the whole shape of in their head, for four months, doing nothing more dramatic than making customers with legitimate complaints get a slightly worse response than they used to, every single day, at a scale too diffuse for anyone to notice as a pattern rather than as ordinary bad luck.

"This is the thing," he said to Alex, pulling her over to his screen with more urgency than he usually allowed himself. "Look. Two patches, four months apart, both individually correct, and together they broke something and nobody knew. This is exactly what you said would happen back in the postmortem after Halden, and I didn't — I heard you say it, I believed you said it, but I don't think I actually *believed* it until right now, looking at the number."

"Fix it," Alex said, and there was something in her voice he hadn't expected — not triumph exactly, quieter than that, the specific satisfaction of watching a thing you'd argued for in the abstract finally produce a concrete result nobody in the room could argue with. "And then I want you to send this exact example — not a summary, the actual before-and-after, the actual eval failure — to the whole platform team. Not as a gotcha. As the pitch. This is worth more than any argument either of us could make about why the eval suite matters."

He did, and it worked better than either of them had predicted. The engineers who'd treated the harness, in its first week, as bureaucratic overhead layered onto already-thin capacity — a few of them fairly openly, in a Slack thread Devon had chosen not to engage with at the time — went quiet, and then, a day later, one of them asked how to add a case of her own from an incident on her own team. By the end of the following week the suite had grown from nine cases to twenty-three, most of them contributed rather than authored by Devon alone, which felt, to him, like the actual turning point more than the four-month regression had — not the proof that the tool worked, but the moment it stopped being his tool and started being the team's.

Victor found him at his desk near the end of that second week, and looked at the growing case count on his screen with an expression Devon had learned, over the same stretch of weeks, to associate with the closest thing Victor had to open approval.

"You've built a sensor," Victor said, without further preamble, in the way he tended to arrive at a sentence already three steps into a thought he expected you to catch up to.

"A test suite."

"A sensor. I told Alex, back before you'd shipped the first version of this, that what the system was missing was an independent reading of its own state — something that told you how it was actually behaving, not derived entirely from the same context it was reasoning over. That's what you've built, whether you were thinking of it in those terms or not. Before this existed, the only way anyone found out this system had regressed was a customer complaint, or a number moving on a dashboard three weeks after the damage was already spread across a thousand conversations. Now you have something that tells you *before* it ships, on cases you already know matter, whether a change made the system better or worse. That is not a quality-assurance nicety. That is the first component of an actual control loop this architecture has ever had. Everything else you're going to build over the next year is going to sit on top of this, whether anyone names it that way in the roadmap or not."

Devon looked at the twenty-three cases, and then, almost involuntarily, at the sixty-entry patch list still open in the other tab, thirty-seven of which had no test case yet, a number that a month ago would have felt like a wall and now felt, for the first time since he'd started keeping the list at all, like something with an actual bottom — slow to reach, but reachable, in a way fourteen hundred stale documents and an unbounded context swamp had made him doubt, three weeks ago, that anything in this system could be.

"Thirty-seven to go," he said, mostly to himself.

"Thirty-seven to go," Victor agreed, "and a great many more after that you haven't thought of yet, because the incidents that haven't happened yet haven't taught you what to test for. That's fine. That's not a flaw in the plan. That's simply what it means to build a sensor for a system that keeps changing — you don't finish it. You keep it growing at least as fast as the thing it's watching." He paused at the door on his way out, and added, in a register just slightly different from his usual aphoristic cool, something Devon would only fully understand the weight of much later in the year: "I've watched a team build this kind of instrument before, once, a long time ago, in a system with rather higher stakes than customer support tickets. It's the only thing that's ever actually worked. Everything else is a story people tell themselves about why they didn't need it yet."
