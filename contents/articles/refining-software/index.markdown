---
title:          Refining Software
subtitle:       Include Quality in 'Minimum Viable'
summary:        Either you ship a prototype or you ship something worthwhile
date:           2014-02-25 14:30 Z-0200
author:         mattly
category:       building software
locations:
  - Buenos Aires, Argentina
  - Montevideo, Uruguay
  - Punta del Diablo, Uruguay
updated:        true
template: "article.jade"
infoClass: 'white-text'
headerStyle:
  font-size: 400%

---

~~~ Lead
In [Making Time For Quality][mtfq], I argued for spending a bit more time in the refinement stage of the creative process, regardless of what's being created. It was borne from this piece on building software, when I realized it better stood alone. Consider reading it first -- it's short.

[mtfq]: http://lyonheart.us/articles/making-time-for-quality.html

~~~ Body
I once worked with a project manager who loved to throw the famous Steve Jobs quote "Real Artists Ship" at me whenever I voiced objections about the software we were working on not being entirely ready to ship yet.  If what we had worked well enough for a functionality demo, it worked well enough to ship to our customers.  

The project manager worked under a philosophy gaining popularity in our industry, the idea of **[Minimum Viable Product][mvp]**, but due to a lack of focus put more emphasis on minimal than viable.

[mvp]: https://en.wikipedia.org/wiki/Minimum_viable_product

Whatever the development team found lacking, the excuse was *"We'll iterate on it later, right now we just want to see if it resonates"*.  Later often never came.

We were a startup, hungry and eager to meet a rapidly growing market.  But our priorities were driven towards experimentation on what would attract more customers instead of refining the functionality we already had, and our paying customers noticed.  Without the underlying quality the development team pushed for, what we created never resonated in the way any of us had hoped.

Instead, in our drive to create the minimum viable product with minimally viable features, we shipped prototypes with a host of unresolved problems our customers didn't want, and the product wasn't viable with those problems.  The bar for quality was set too low, because we were chasing minimum rather than viable.

## Figure Out What You're Building

Prototypes are great for software.  Software begins as an abstract idea, often a sketch on a napkin or diagrams on a whiteboard, but when there's a real thing you can play with, you can test your assumptions about how it should work.  Sending a prototype into the world betrays both laziness and a lack of faith in the idea -- and you're wasting the opportunity to refine your idea.

Creating a software prototype can be an expensive gamble of time, so hopefully you've gauged the demand for what you're building before you even start.  Consider your target audience: How savvy are they?  How will they to respond to ambiguity?  These considerations hold regardless of the type of software you're building -- libraries have many of the same concerns, even if the audience is other developers.

Your prototype might be adequate to someone who is a domain expert and thoroughly familiar with your software, but mainstream users are probably neither[^early-adopters].  A closed group of savvy, trusted colleagues can be far more valuable with their feedback than random strangers from the internet.

Before embarking on a new software project, it's worth asking and writing down: What will this idea do better than incumbent solutions?  Keep the answer short -- a sentence at most -- and you'll have a basis for evaluating your "Minimum Viable", and how you will approach the two main problems of building software:

One half of building software is primarily technical, and is in the realm we call *programming*: Answering **"how can I help people save time and/or money through automation?"**  When you set out to create new software, the answer to this question is how you will sell people on what you're building.

The other half of the building software is more humanitarian, and given lesser importance by many engineers[^nerds]: **"how can I delight people through automation?"**  When building software, how you approach this question is the difference between a product people hate but use because they have to[^user-customers] and a product so great people will recommend to their friends and colleagues.

The latter question is often harder; it's where a lot of the *art* in building software comes into play.  There's a line to be drawn between unacceptably raw and impossibly perfect -- and if you value **minimum** over **viable** you'll end up shipping a prototype.

[^early-adopters]: If you're building a product for technical users, you can let in savvy early-adopter types for a beta period, but don't make the mistake of thinking these people epitomize mainstream users.  Perhaps by definition, early adopters have a much higher tolerance for the irregularities mainstream users don't.  Their voices, complaints and suggestions are biased towards this tolerance.

[^nerds]: Sometimes I think this tendency is malicious, a *revenge of the nerds* against those who tormented them in High School.

[^user-customers]: If you've ever been forced by circumstance (work, governmental, et cetera) to use a software product you didn't want, welcome to the experience of most users of enterprise software.

## Setting the Bar

Refinement is where **real** iteration happens.  It demands a strong vision of the final product, and when you add more people into the mix, sharing the vision becomes increasingly difficult.  Any unvoiced disagreements or hidden assumptions about what you are building will become clear when you have a mostly-working product and a deadline in front of you.

This is where the true potential of automation tools comes forth: building and shipping prototypes.  By rapidly iterating over ideas, trying things out to see what works and what doesn't, by playing with something real instead of arguing about something abstract, a lot of friction goes away.  I believe this is the real meaning of **code wins arguments** -- something real wins over something abstract.

Knowing when to say something is done is difficult.  Trouble is found chasing perfectionist tendencies, laziness, or valuing speed and time-to-market.  People react differently to a product where the line for *good enough to ship* didn't include enough polish, when that line was too close to *good enough to demo*.

This is the real value of a "minimum viable": it helps you figure out when something is *viable enough to ship*.  This is why it's important to define what is *viable* for your product -- it guides how much refining is needed to get to *minimal*.  If too much value is put on producing something minimal, then what is created might not be viable enough.

Careful project management can get away with lowering the bar towards minimal for a brief beta period among early-adopters, but if the bar isn't raised when the product grows it will gain a reputation for rough edges and poor quality.  Such a reputation takes years to overcome -- think of Twitter's Failwhale or Apple Maps[^apple-maps].

A poor reputation among your customers is one thing, but a poor reputation internally is worse.  A lack of time for quality will cause code problems to grow exponentially, talent will stop caring and find a new job or burn out, and hiring standards will drop when the team's enthusiasm wanes.  This is death to software.

[^apple-maps]: Services have not been Apple's strong suit, but [John Gruber's theory](http://daringfireball.net/2012/09/timing_of_apples_map_switch) on the timing of the Apple Maps release makes a lot of sense to me.

## Make the Time

It's difficult to justify the time for this process, especially when deadlines loom and shipping outwardly becomes easier.  But it's crucial to building a quality product people will love instead of tolerate.

An irony of the "Real Artists Ship" quote being used to justify shipping poor-quality software: Apple is notoriously methodical about how they ship.  Apple Maps aside, they don't rush a prototype to market to see if it resonates.  Their *"Minimum Viable iPhone"* was the original iPhone.  It famously [wasn't created overnight][behind-iphone], and they have continued to iterate on the design, shipping updates every year.

It is sometimes difficult enough to get functionality working, and no one wants their project to become another behind-schedule horror story.  Similar to any skill, navigating the refinement stage comes easier with practice.  Don't chase perfection, but if your goal is to create software people will love, do set your bar a bit higher.

Another lesser-paraded [Steve Jobs quote goes][steve-quote-2], "Details matter, it's worth waiting to get it right".

[behind-iphone]: http://www.nytimes.com/2013/10/06/magazine/and-then-steve-said-let-there-be-an-iphone.html?pagewanted=all
[steve-quote-2]: https://twitter.com/tim_cook/status/437966914170540032

~~~ Further Reading
**[An Interview with Andy Budd][mvpizza]**.  A great read both for the **Minimum Viable Pizza** and a perspective on how the design process helps with prototyping and quality.

[mvpizza]: http://insideintercom.io/an-interview-with-andy-budd/

**[GitHub: Repository Next][gh-reponext]**.  GitHub occasionally does in-depth write-ups of new features on their blog, and this one by @[kneath][kyle] is particularly notable because at the end he mentions how long it took to finish: over a year.  From talking with friends who work at GitHub, I think this attention to detail is not uncommon.

[gh-reponext]: https://github.com/blog/1529-repository-next
[kyle]: http://warpspire.com/

**[And Then Steve Said, 'Let There Be An iPhone'][behind-iphone]**.  Linked in the above body text, it's a fascinating story leading up to the announcement of the original iPhone in January, 2007.

[behind-iphone]: http://www.nytimes.com/2013/10/06/magazine/and-then-steve-said-let-there-be-an-iphone.html?pagewanted=all

**[Why It Took a Year to Make and Then Break Down an Amazing Puzzle Game][behind-threes]: Behind [threes][]**.  A cute puzzle game my wife and I both have a hard time putting down.

[behind-threes]: http://www.polygon.com/2014/2/6/5386200/why-it-took-a-year-to-make-and-then-break-down-an-amazing-puzzle-game
[threes]: http://asherv.com/threes/

