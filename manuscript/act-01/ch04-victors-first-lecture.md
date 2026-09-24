---
status: draft
pov: Alex
---

# Chapter 4 — Victor's First Lecture

![Chapter 4 — Victor's First Lecture](artwork/chapters/ch04-victors-first-lecture.png){.chapter-plate}

Victor Aldana's office was the only one on the fourth floor with an actual whiteboard instead of a glass wall someone occasionally wiped down with a rag that never fully removed the ghost of the last three meetings, and Alex had come to understand, over the six months since he'd been brought on as "special advisor" — a title vague enough that HR had visibly struggled to write his offer letter — that the whiteboard was not incidental to how he thought. He did not think in sentences first and diagrams second. It went the other way.

She found him at 6 p.m., post-incident review finally behind her, standing in front of a diagram that had nothing to do with Halden: three boxes, a handful of arrows, a Greek letter she didn't recognize written twice with a line through the second instance.

"You look like a person who sat in a room today and got asked to explain a probability distribution to people who wanted a number," Victor said, without turning around. He had a way of doing this — observing something true and mildly uncomfortable and stating it as though it were simply weather.

"I sat in a room today and mostly succeeded at that, actually. Claire moved off the board number without me having to fight her for it."

"That's not what your face is doing."

She let out a breath that was almost a laugh. "The post-incident review just now. Devon's fine, the fix is good, the customer's contained. What's bothering me is that everyone in that room — smart people, good engineers — kept asking the same question in six different phrasings, and it took me most of an hour to realize the question itself was the problem."

"What was the question."

"Why did the model do that."

Victor turned around at that, and something in his face did the thing she'd come to recognize as his version of enthusiasm — not a smile exactly, more a sharpening, the look of a man who has been waiting patiently for someone to arrive at a door he already knows the other side of. "Erase that question," he said. "Not softened. Erased. It is the wrong question, and it will keep generating wrong answers no matter how carefully you ask it, because it presupposes an *it* with intentions you can interrogate. Sit down. I'm going to draw you something, and I want you to tell me if it looks familiar."

He turned back to the board, wiped the Greek-lettered diagram without ceremony, and drew three boxes in a loop: a rectangle labeled **PLANT**, a rectangle labeled **CONTROLLER**, an arrow from Controller to Plant labeled *actuation*, an arrow from Plant back to Controller labeled *sensor reading*, and a small circle at the top where a fourth arrow entered from outside the loop, labeled *reference input*.

"This is a thermostat," he said. "Also a cruise control system. Also, not coincidentally, an autopilot, a power grid frequency regulator, and — if you squint, which is the entire craft of this conversation — your agent loop. A controller takes a reference input, some target state, compares it to a sensor reading of the actual state, computes an error, and actuates to reduce the error. That's it. That's the whole idea. It's a hundred years old in engineering terms and about three hundred if you count the flyball governor on a steam engine, and the reason it survived a hundred years is that it does not care what's inside the controller box. Mechanical linkage, electronic circuit, PID algorithm, a large language model reasoning over a context window — doesn't matter. What matters is whether the *loop* is stable."

"You're saying last night's incident was a control-loop problem, not a model problem."

"I'm saying your framing last night's incident as a *model* problem is exactly the mistake I'm asking you to stop making. Tell me what actually happened. Strip out every word that implies the model has an inner life doing something to it, and just describe the mechanism."

Alex thought about it — really thought, not just reached for the version of the story she'd already told twice today. "An ambiguous lookup produced an ambiguous result. The system's response to ambiguity was to gather more context. The additional context didn't resolve the ambiguity — it compounded it, because the new query was built partly from the first ambiguous result. That produced a result that was ambiguous in a new, larger way. Which triggered another context-gathering step. Each iteration's output became a larger fraction of the next iteration's input."

"Now you're an engineer describing a system, not a psychologist describing a mind. What you just described — an output that feeds back into an input, with a gain greater than one at each pass — has a name that predates transformer architectures by seventy years. It's called positive feedback without a governor. You built a loop, Alex, actual closed-loop control architecture, whether you meant to or not, the moment you let an agent's output become part of its own future input. And then you left the loop ungoverned — no bound on gain, no rate limit, no independent sensor telling you the error was growing instead of shrinking — and you're surprised it did what every ungoverned positive-feedback loop in the history of engineering does, which is run away until something external stops it."

"The step limit Devon shipped last night is exactly that governor."

"Good. That's real engineering, and I'd bet money it's the single highest-value line of logic anyone at this company has written this quarter, because it converts an unbounded loop into a bounded one — worst case is now *known*, which is the entire game. But notice what you had to do to get there. You had to stop asking 'why did the model decide to keep gathering context' — a question about the interior state of something you cannot fully inspect and, more importantly, do not need to inspect — and start asking 'what is the gain of this loop, and where is the limiter.' One question sends you chasing an explanation you'll never fully verify. The other sends you to a fix you can test."

Alex looked at the diagram, at the small circle where the reference input entered the loop. "What's the reference input, in our case? The thermostat has a target temperature. What's the model's equivalent?"

"Now you're asking the good version of the question," Victor said, and there was real warmth in it, the particular pleasure of a teacher whose student has skipped a step he'd expected to walk them through. "That's precisely the gap. A thermostat's reference input is external, fixed, legible — seventy-two degrees, set by a human, unambiguous. Your system's closest analog to a reference input is *whatever the model currently believes the task is*, which is not external, not fixed, and not fully legible — it's reconstructed, moment to moment, from a context window that the loop itself is writing into. You don't have an external reference input at all. You have a system that is, in a meaningful sense, setting its own thermostat based on a room it's also actively heating. That is not a metaphor for instability. That is a mechanical description of where instability comes from."

"So the fix isn't just circuit breakers."

"Circuit breakers are necessary and nowhere near sufficient. They're the equivalent of a thermal cutoff switch — they stop the fire, they don't prevent the room from ever getting too hot in the first place. What you actually want, eventually, is instrumentation that gives you an *independent sensor reading* — some measure of task progress or correctness that isn't derived entirely from the same context the model is reasoning over, so you have a way of detecting drift before it becomes a runaway. Ashby called this requisite variety — a controller needs at least as much variety in its sensing and response as the disturbances it's trying to regulate, or it will, provably, fail to hold the target against a sufficiently varied environment. Halden's invoice quirk from 2019 was a disturbance your system had never seen. Your control loop had exactly one strategy for handling novel disturbance — gather more context — and no independent way of noticing that the strategy itself had stopped working. That's not a training problem. That's a missing sensor."

Alex found herself, not for the first time in a Victor conversation, reaching for a pen without having decided to. "The eval suite Devon and I keep talking about building. That's the sensor."

"That's *part* of the sensor — a pre-deployment one, run offline, telling you whether a change to the controller made the loop more or less likely to run away on cases you already know about. You'll also want an online one eventually — something watching live behavior for the *shape* of drift, not just the content of any one response, so you catch the next Halden before it's forty minutes deep instead of after. But yes. Broadly. You are, whether the vocabulary feels natural yet or not, building instrumentation for a control system. Every conversation you have about this for the next two years will go better if you keep translating it back to that frame every time someone in a meeting reaches for a word like 'decided' or 'wanted' or 'thought,' because every one of those words is doing work to make an engineered system sound like a colleague, and colleagues are not what you're debugging."

"Claire's going to hate this framing."

"Claire is going to need a different translation of the same idea, and that's your job, not mine — I only have one register, and it happens to work on engineers." A pause, and for a moment something crossed his face that Alex couldn't fully place, gone before she could ask about it — not quite the sharpness from before, something older underneath it. "Tell her the loop doesn't need to promise it never gets disturbed. No control system promises that; disturbance is the whole reason the discipline exists. Tell her it needs to promise it always returns toward the target, and how fast, and within what bound, when it does get disturbed. That's a sellable claim. It has the added advantage, over the number on her slide, of being one you can actually keep."

Alex looked back at the three boxes, the loop, the small unlabeled circle where — she understood now, in the specific way an idea sometimes reorganizes an entire day's frustration into a shape you can finally hold — the entire unexamined assumption of the last fourteen months had been quietly sitting the whole time, mistaken for something that didn't need examining at all.

"I'm going to want you in the room for more of these conversations than a title like 'special advisor' usually implies," she said.

"I've been waiting for someone at this company to want that for slightly longer than you'd probably find comfortable to hear," Victor said, and turned back to the whiteboard, and did not elaborate, and Alex — for reasons she couldn't fully name yet, and wouldn't be able to until much later in the year, when the shape of Victor's own history finally surfaced — decided not to push.
