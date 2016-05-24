---
title:      Understanidng Time Zones
subtitle: 
draft:      true
date:       2015-10-30 12:00 -0800
author:     mattly
template:   article
---

◊banner-header{
# ◊val#page/title
# ◊val#page/subtitle
}

§ Main

It's that time of the year again -- for programmers around the world to complain about Daylight Saving Time. Twice a year, every year, our clocks change and we hear the same tired bellyaching about not just daylight time, but against time zones in general. _The world should standardize on a single clock time_, I hear quite frequently from my colleagues. Not long ago, I was among them:

> when the programmers take over, timezones will be the first against the wall.  
> -- [mattly, Feb 19 2013](https://twitter.com/mattly/status/303659660769116160)

I've since changed my tune. Programmers who complain about dealing with local clock time are entitled and lazy. I'm going to explain why time zones aren't going anywhere anytime soon, why complaining about them is a symptom of entitlement, and lay out the domain knowledge of local clock time in a way that even someone who doesn't sling code for a living can understand.

---

Programmers think of time as a number. _We can do math with it._ The very notion of clock _changes_, let alone _corrections_ rub that ideology the wrong way. If you think a [Leap Second][leap-second] is bad, try coordinating something like the [Julian or Gregorian reforms][jg-reform] today. The logical next step from thinking _time is a number_ is [metric time][metric-time], and if you think the current system is problematic, imagine trying to convert years into units of _31.536 megaseconds_. 

While most programmers generally are aware of the [Time Zone Database][], in my experience few actually understand its relationship to the libraries they rely on. Like a lot of people, they think that because time _seems_ simple, they know what they need to know about it and never bother correcting bad assumptions.

The first thing you must understand about time zones is that they are a legal solution to solving the problem of coordination in a distributed system. Like most legal solutions, they are an imperfect compromise reflecting the history and nature of the self-interested people they govern. Like most legal solutions, they stem from political ideology, and fortunately it's comparatively begnign.

◊with-aside{
Before distance was collapsed by the locomotive and the telegraph, _clock time_ was measured by the sun: wherever you were, when a sundial said the sun was directly overhead, it was noon. The next town over might be a few minutes different, but getting there took a while, so it didn't matter. Every town kept their own time. Thanks to axial tilt and the Earth's elliptical orbit, the [time of solar noon will vary throughout the year][equation-of-time]. You think time zones are bad? Imagine programming for that world.

◊aside{
If you lack imagination, then try programatically figuring out how to collect the appropriate sales tax for any given municipality in the United States. It's not dissimilar.
}}

Disruptive technologists came along and laid train tracks and telegraph wires, and all of a sudden travel got faster and communication got _much_ faster. Distance collapsed. Trains were the first to use a coordinated clock time that was disconnected from an exact solar time. They had a schedule to keep, and it was easier to measure against an arbitrary standard, initially called _[raleway time][tz-history]_. 

Decades pass, and the practice is enshrined in law. Boundaries are drawn by region and nation, and in the rare case the next town over wasn't setting their clock by the same standard as yours, it was an hour different. The trains run on time, business is coordinated by wire, and people adjust. Here's where the programmers nod their heads and think _yeah, that's what I'm talkin' about_.

The second thing you must understand about time zones is that they aren't going anywhere anytime soon. Imagine you're the most influential programmer in the world:

> You weren't expecting the call from the United Nations, but they wanted to know: what one policy change would help software improve the world. They offered you an unprecedented level of [political capital][], but the decision was easy -- convert the entire global economy to [UTC][]. The recommendation passes, a schedule is drawn up, and every person on the planet has five years to prepare for the transition.

> The Conversion proved to be a bigger deal than Y2K -- it turns out this was far more involved than simply "change everyone's local clock time to UTC". Businesses have to update their hours, schedules have to be redrawn, records and pland re-written. The cost is staggering, and no nation is ready to make the cut-over by the dealine, except Iceland, who it turned out was already observing UTC year-round anyway and didn't have to do anything. 

> Several nations attempt to back out of The Conversion, but sanctions are threatened. The Conversion was cited as the cause for a war in the Middle East and the rise of authoritarian dictatorships in Southeast Asia, but no one knows for sure. In continental Europe, the change of just one hour during winter and two during summer was enough to provoke riots and a hate group that lynches programmers, calling themselves the NeoLuddites. Apparently they've abandonned clock time altogether in favor of meeting _at the last light of the day_ or some such folksy malarkey.

> In the North America, people accepted The Conversion with less violence, but it turns out that communication between people with different daylight schedules still requires a context for understanding the phase of the day they're in. Here on the west coast, you say you're _a thirdday behind_, a subtle way of indicating to your London colleagues that the meeting they scheduled for Hour 13 is before sunrise where you are. 

> NeoLudditism hasn't caught on here the way it has in Europe, but after all the bugs caused by The Conversion -- failures of traffic control and life support systems, years of chaos trying to get things right -- things seem back to normal. Perhaps the best thing to come out of it is that no one wants to buy smart lightbulbs anymore. A century and a half of old records still have to be converted, and recent ones caused quite a bit of trouble -- you've heard horror stories of evidence in criminal trials thrown out, contracts mis-interpreted, even people who legally no longer exist. Half the relevant old records hadn't been digitized yet, and a booming industry developed around helping businesses and municipalities comply with clock time regulations.

>  You've caught a lot of flack for forcing this upon the world, and your name has become a curse. Bill Gates is busy working on [malaria][] and the [energy crisis][] and isn't returning your calls anymore. People who used to be your friends asked _Why time zones? Why not climate change or human trafficking? Why not economic disparity, genocide or religious fundamentalism or any of a dozen other problems people consider more worthy of that kind of worldwide herculean coordination?_

> _It was worth it,_ you tell yourself, _because programmers no longer have to think about time localities except when working on juicy contracts for legacy systems_.

My dystopian story may be hyperbolic, but I want to illustrate that any proposal to abandon local clock time is ludicrously complex and will create greater problems than the one it fixes to solve. This is why when otherwise reasonable people say things like _local time is arbitrary, people can just have different schedules based on where they are in the world_ or _abolishing time zones would make our lives so much easier_, I say they act entitled. Especially if these self-same connoisseurs of simplicity then celebrate [baroque object and class hierarchies][oop], [tag soup template systems][tag soup], and [concurrency models][callbacks] that even [HP Lovecraft][lovecraft] would recoil from in horror.

◊with-aside{
If you work in software and think the world serves to make your life easier, consider a different career. The world and the people who pay you will remind you time and again that you serve to make _other peoples lives_ easier, not the other way around. You're treating a human problem like a math problem, and by doing so, creating subtle bugs in your work that will at best frustrate your users. If they're not so lucky, you'll kill them, and then complain that _people_ are the problem, not your inept understanding. It's no wonder people fear us and use us as [scapegoats][].

◊aside{
Some time ago I organized a party on Facebook, scheduled immediately after a daylight time transition. Every time I edited the event it shifted the start time in the direction of the transition by an hour, and people ended up thinking it started at 4 in the morning.

I've heard hushed stories about time zone related bugs resulting in the loss of life. It's sad, it's horrifying, and it's entirely preventable.
}}

If it's your thing, campaign to repeal daylight savings time. Personally, I believe there are greater problems in the world deserving of attention. If you understand the domain of local clock time well and program defensively, you'll get daylight saving time handling almost for free.

[Time Zone Database]: https://www.iana.org/time-zones
[leap-second]: https://en.wikipedia.org/wiki/Leap_second
[jg-reform]: https://en.wikipedia.org/wiki/Calendar_reform#Julian.2FGregorian_reforms
[UTC]: https://en.wikipedia.org/wiki/Coordinated_Universal_Time
[lovecraft]: https://en.wikipedia.org/wiki/H._P._Lovecraft
[metric-time]: https://en.wikipedia.org/wiki/Metric_time
[scapegoats]: http://blog.cleancoder.com/uncle-bob/2015/10/14/VW.html
[political capital]: https://en.wikipedia.org/wiki/Political_capital
[oop]: https://en.wikipedia.org/wiki/Object-oriented_programming
[tag soup]: http://blog.codinghorror.com/web-development-as-tag-soup/
[callbacks]: https://en.wikipedia.org/wiki/Callback_(computer_programming)
[dst-energy]: http://www.ucei.berkeley.edu/PDF/csemwp163.pdf
[tz-history]: https://en.wikipedia.org/wiki/Time_zone#History
[tzdb-rfc]: http://tools.ietf.org/html/rfc6557
[malaria]: http://www.gatesfoundation.org/What-We-Do/Global-Health/Malaria
[energy crisis]: http://www.wired.com/2011/06/mf_qagates/
[equation-of-time]: http://www.timeanddate.com/astronomy/equation-of-time.html



---
The third thing you need to know about time zones is they are fundamentally a locale problem. In North America we write the date `10/30/2015` where most of the rest of the world would write `30/10/2015`. Some countries use a [12 hour clock][] while others use [24 hours][], while some start counting at midnight, others [start counting at dawn][Ethiopia], and a few indicate times [past 24 hours][]. Time zones are a locale-dependent method for setting clock time.

[12 hour clock]: https://en.wikipedia.org/wiki/12-hour_clock
[24 hours]: https://en.wikipedia.org/wiki/24-hour_clock
[Ethiopia]: https://en.wikipedia.org/wiki/Date_and_time_notation_in_Ethiopia
[past 24 hours]: https://en.wikipedia.org/wiki/24-hour_clock#Times_after_24:00

The fourth thing you need to know about time zones is the domain terminology. The terms and their meanings straightforward, but I've met a lot of people who've held misconceptions about what means what.

**UTC** stands for _Coorindated Universal Time_. The abbreviation is a compromise against the French _Temps Universel Coordonné_ so that the abbreviation is the same in all languages. You should always store time in UTC, and time specified in UTC is the only time you can reliably perform math on.

*UTC is not equivalent to GMT*. It is the successor to GMT, which is no longer precisely defined for scientific purposes. GMT can vary from UTC by up to 0.9 seconds. I have never heard someone use _GMT_ when they did not mean to use _UTC_ instead. Historical records in GMT prior to 1925 follow historical astronomic convention and treat noon as hour 0 instead of 12. Greenwich itself observes _Western European Time_, which includes _British Summer Time_.

A **UTC Offset** is the difference in hours and minutes a place observes local clock time for a particular date. For any given location, the offset is subject to change throughout the year, and the rules for describing when the offset changes are subject to change as well.

*UTC Offsets are not time zones*. If you have a local clock time and its offset, you may cast that time into UTC with the offset and then do math on it in UTC -- but you may _not_ then re-use the same offset to re-cast it to local clock time.

*UTC Offsets may exceed twelve hours, and may be at intervals other than per-hour or half-hour*. Don't try to validate an offset value with a regex, when you can check for membership in [the canonical list][utc-offset-list]. There are a handful of islands with UTC offsets greater than `+12:00`, the furthest east of which are the [Line Islands][line-islands] at `+14:00`, observing the same clock time as Hawai'i, but one day ahead, and a part of the nation of [Kiribati][], most of which is on the other side of 180 degrees longitude.

[utc-offset-list]: https://en.wikipedia.org/wiki/List_of_UTC_time_offsets
[line-islands]: https://en.wikipedia.org/wiki/Line_Islands
[Kiribati]: https://en.wikipedia.org/wiki/Line_Islands

**Standard Time** is the setting of a local clock time to a particular offset from UTC. Because of the close relationship between time and longitude, it is possible to [line up standard times on a map][standard-offset-map] and pretend *Daylight Saving Time* doesn't exist. 

[standard-offset-map]: https://en.wikipedia.org/wiki/Standard_time#/media/File:Standard_World_Time_Zones.png

A **time zone** is a geographic area that observes a standard time and observed and historical offsets to that standard time. For the purposes of dealing with time zones in computers, you want to use names from the [IANA TZ Database][tz-list], that is `America/Los_Angeles` instead of _Pacific Time_ or _PST_. If you look at that list and blanche, I can't blame you. Its size is largely the result of legacy.

Colloquially, people will refer to time zones by their common names, such as _Eastern Time_, but in a global context this is ambiguous -- _Eastern Time_ may refer to `America/New_York` or `America/Toronto`, both of which observe the same local clock time most of the year, but who observe daylight saving time for different periods. It might refer to `Austrailia/Brisbane` or `Australia/Melbourne`, only one of which observes daylight saving time. Or it might mean _Eastern European Time_, _Eastern Indoneasian Time_, or any number of time zones under _Eastern African Time_.

[Abbreviations are no less ambiguous][tz-abbr-list] -- while in the United States, you can reliably convey meaning with _CST_ and _CDT_, the prior can refer to _Cuba Standard Time_ and _China Standard Time_, and the latter _Cuba Daylight Time_.  These are used for localization when you are displaying time to people who can interpret them unabiguously with context.

Because time zones are political creations, their rules for observing local clock time are subject to change. For example, in the United States, daylight saving time was extended by five weeks in 2007 via the [Energy Policy Act of 2005][dst-energy].

If you're not concerned with historical records, the distinction between `America/Indiana/Indianapolis` and most other `America/Indiana/` -prefixed time zones won't concern you. Before the [Uniform Time Act of 1966][dst-uta-1966], municipalities were allowed to define their own rules for observing daylight saving time. 

Different countries have different rules. The People's Republic of China had [7 time zones][China], each of which now offically observe _Beijing Time_, though in the western region of Xinjiang most people observe Ürümqi Time, two hours behind. [Argentina][] decides yearly if it should observe daylight saving time, and provinces may opt-out of the federal decision.

[tz-list]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[tz-abbr-list]: http://www.timeanddate.com/time/zones/
[dst-energy]: https://en.wikipedia.org/wiki/Energy_Policy_Act_of_2005
[dst-uta-1966]: https://en.wikipedia.org/wiki/Uniform_Time_Act
[Argentina]: https://en.wikipedia.org/wiki/Time_in_Argentina
[China]: https://en.wikipedia.org/wiki/Time_in_China

The **daylight saving transition** transition is the hour lost or gained by observing daylight saving time. For the fall transition when an hour is gained, if you want to be precise, you _must_ include some indicator of offset in your display. For example, here in `America/Los_Angeles`, on November 1, 2015, `02:59:00 PDT` is two minutes before `02:01:00 PST`. 

Thus in civialian terms, a **day** is period of time between `00:00:00` and `23:59:59` measured by local clock time, because a day containing a daylight saving transition may contain 23 or 25 hours. You can't just hard-code `86400` as a [magic number][] and call it a day. Remember -- math on dates must be done in UTC.

[magic number]: http://c2.com/cgi/wiki?MagicNumber

Thankfully, as with most complicated problems that can be automated, people have written libraries to help work with clock time. It's simply up to you to learn how to use them correctly. Personally, I am most fond of [JodaTime][], [Moment Timezone][], [pytz][], [ezic][], and [PostgreSQL's built-in support][PostgreSQL-tz]. A good, well-documented library and a firm understanding of the domain of clock time will go a long way to solving many problems. If you'll humor me for a few more paragraphs, I'll describe how to solve a few of the trickier ones.

[JodaTime]: http://www.joda.org/joda-time/
[Moment Timezone]: http://momentjs.com/timezone/
[pytz]: https://pypi.python.org/pypi/pytz
[ezic]: https://github.com/drfloob/ezic
[PostgreSQL-tz]: http://www.postgresql.org/docs/9.4/static/functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT

Let's say you need to **determine the user's time zone in a browser**. Whatever your opinion of JavaScript, its lack of built-in support for time zones is problematic. JavaScript was designed to run on end-user computers, which are perhaps less homogenous than the people who operate those computers. A `Date` object provides a `getTimezoneOffset` method that returns a number of minutes the instance is before (negative) or after (positive) UTC. The printed string format _may_ contain the local abbreviation, but abbreviations have duplicate uses. Nowhere can you get the IANA Timezone name.

noscript tk
For example, you're reading this in a browser, and your current offset is `(tk)` minutes. How do I determine that you're in `(tk)`? 

The long answer I have a factory for `Date` instances, a way to determine the offset for each, and a knowledge of when various time zones that observe that offset also observe daylight saving time, so I looked at various dates' offsets strategically to determine the pattern. The short answer is I used [jsTimezoneDetect][].

[jsTimezoneDetect]: http://pellepim.bitbucket.org/jstz/

Let's say you need to **make computations based on clock time boundaries**, such as summarize all the hits I've gotten to this article on a daily basis as determined by _Pacific Time_, aka `America/Los_Angeles`. While you could simply follow a bad pattern and calculate the offset into the timestamp while you're recording the time (thus making your times evenly divisible by `86400`), you want to be able to query against arbitrary time zones -- as set by the user at the time of the query.

If you're using [PostgreSQL][] 8.0 or later this is pretty straightforward. Use the [`timestamp` type][pg-tstz][^pg-tzfn], insert your timestamp values in UTC and cast the date into the desired time zone using [`AT TIME ZONE`][pg-attz] at query time, and use `date_trunc` to to aggregate. 

Given this table and data describing a timestamp at each hour and a value of 1 for that hour:

``` 
\d events
+-----------+-----------------------------+-------------+
| Column    | Type                        | Modifiers   |
|-----------+-----------------------------+-------------|
| timestamp | timestamp without time zone |             |
| value     | integer                     |             |
+-----------+-----------------------------+-------------+
```

``` sql
select   timestamp as utc,
         timezone('america/los_angeles', timezone('utc', timestamp)) as pacific,
         value
from     events
where    timezone('america/los_angeles', timezone('utc', timestamp)) 
         >= timestamptz '2015-10-31T00:00:00 america/los_angeles'
and      timezone('america/los_angeles', timezone('utc', timestamp)) 
         < timestamptz '2015-11-03T00:00:00 america/los_angeles'
order by timestamp asc;
+---------------------+---------------------+---------+
| utc                 | pacific             |   value |
|---------------------+---------------------+---------|
| 2015-10-31 07:00:00 | 2015-10-31 00:00:00 |       1 |
| 2015-10-31 08:00:00 | 2015-10-31 01:00:00 |       1 |
| 2015-10-31 09:00:00 | 2015-10-31 02:00:00 |       1 |
| 2015-10-31 10:00:00 | 2015-10-31 03:00:00 |       1 |
| 2015-10-31 11:00:00 | 2015-10-31 04:00:00 |       1 |
| 2015-10-31 12:00:00 | 2015-10-31 05:00:00 |       1 |
| 2015-10-31 13:00:00 | 2015-10-31 06:00:00 |       1 |
| 2015-10-31 14:00:00 | 2015-10-31 07:00:00 |       1 |
| 2015-10-31 15:00:00 | 2015-10-31 08:00:00 |       1 |
| 2015-10-31 16:00:00 | 2015-10-31 09:00:00 |       1 |
| 2015-10-31 17:00:00 | 2015-10-31 10:00:00 |       1 |
| 2015-10-31 18:00:00 | 2015-10-31 11:00:00 |       1 |
| 2015-10-31 19:00:00 | 2015-10-31 12:00:00 |       1 |
| 2015-10-31 20:00:00 | 2015-10-31 13:00:00 |       1 |
| 2015-10-31 21:00:00 | 2015-10-31 14:00:00 |       1 |
| 2015-10-31 22:00:00 | 2015-10-31 15:00:00 |       1 |
| 2015-10-31 23:00:00 | 2015-10-31 16:00:00 |       1 |
| 2015-11-01 00:00:00 | 2015-10-31 17:00:00 |       1 |
| 2015-11-01 01:00:00 | 2015-10-31 18:00:00 |       1 |
| 2015-11-01 02:00:00 | 2015-10-31 19:00:00 |       1 |
| 2015-11-01 03:00:00 | 2015-10-31 20:00:00 |       1 |
| 2015-11-01 04:00:00 | 2015-10-31 21:00:00 |       1 |
| 2015-11-01 05:00:00 | 2015-10-31 22:00:00 |       1 |
| 2015-11-01 06:00:00 | 2015-10-31 23:00:00 |       1 |
| 2015-11-01 07:00:00 | 2015-11-01 00:00:00 |       1 |
| 2015-11-01 08:00:00 | 2015-11-01 01:00:00 |       1 |
| 2015-11-01 09:00:00 | 2015-11-01 01:00:00 |       1 |
| 2015-11-01 10:00:00 | 2015-11-01 02:00:00 |       1 |
| 2015-11-01 11:00:00 | 2015-11-01 03:00:00 |       1 |
| 2015-11-01 12:00:00 | 2015-11-01 04:00:00 |       1 |
| 2015-11-01 13:00:00 | 2015-11-01 05:00:00 |       1 |
| 2015-11-01 14:00:00 | 2015-11-01 06:00:00 |       1 |
| 2015-11-01 15:00:00 | 2015-11-01 07:00:00 |       1 |
| 2015-11-01 16:00:00 | 2015-11-01 08:00:00 |       1 |
| 2015-11-01 17:00:00 | 2015-11-01 09:00:00 |       1 |
| 2015-11-01 18:00:00 | 2015-11-01 10:00:00 |       1 |
| 2015-11-01 19:00:00 | 2015-11-01 11:00:00 |       1 |
| 2015-11-01 20:00:00 | 2015-11-01 12:00:00 |       1 |
| 2015-11-01 21:00:00 | 2015-11-01 13:00:00 |       1 |
| 2015-11-01 22:00:00 | 2015-11-01 14:00:00 |       1 |
| 2015-11-01 23:00:00 | 2015-11-01 15:00:00 |       1 |
| 2015-11-02 00:00:00 | 2015-11-01 16:00:00 |       1 |
| 2015-11-02 01:00:00 | 2015-11-01 17:00:00 |       1 |
| 2015-11-02 02:00:00 | 2015-11-01 18:00:00 |       1 |
| 2015-11-02 03:00:00 | 2015-11-01 19:00:00 |       1 |
| 2015-11-02 04:00:00 | 2015-11-01 20:00:00 |       1 |
| 2015-11-02 05:00:00 | 2015-11-01 21:00:00 |       1 |
| 2015-11-02 06:00:00 | 2015-11-01 22:00:00 |       1 |
| 2015-11-02 07:00:00 | 2015-11-01 23:00:00 |       1 |
| 2015-11-02 08:00:00 | 2015-11-02 00:00:00 |       1 |
| 2015-11-02 09:00:00 | 2015-11-02 01:00:00 |       1 |
| 2015-11-02 10:00:00 | 2015-11-02 02:00:00 |       1 |
| 2015-11-02 11:00:00 | 2015-11-02 03:00:00 |       1 |
| 2015-11-02 12:00:00 | 2015-11-02 04:00:00 |       1 |
| 2015-11-02 13:00:00 | 2015-11-02 05:00:00 |       1 |
| 2015-11-02 14:00:00 | 2015-11-02 06:00:00 |       1 |
| 2015-11-02 15:00:00 | 2015-11-02 07:00:00 |       1 |
| 2015-11-02 16:00:00 | 2015-11-02 08:00:00 |       1 |
| 2015-11-02 17:00:00 | 2015-11-02 09:00:00 |       1 |
| 2015-11-02 18:00:00 | 2015-11-02 10:00:00 |       1 |
| 2015-11-02 19:00:00 | 2015-11-02 11:00:00 |       1 |
| 2015-11-02 20:00:00 | 2015-11-02 12:00:00 |       1 |
| 2015-11-02 21:00:00 | 2015-11-02 13:00:00 |       1 |
| 2015-11-02 22:00:00 | 2015-11-02 14:00:00 |       1 |
| 2015-11-02 23:00:00 | 2015-11-02 15:00:00 |       1 |
| 2015-11-03 00:00:00 | 2015-11-02 16:00:00 |       1 |
| 2015-11-03 01:00:00 | 2015-11-02 17:00:00 |       1 |
| 2015-11-03 02:00:00 | 2015-11-02 18:00:00 |       1 |
| 2015-11-03 03:00:00 | 2015-11-02 19:00:00 |       1 |
| 2015-11-03 04:00:00 | 2015-11-02 20:00:00 |       1 |
| 2015-11-03 05:00:00 | 2015-11-02 21:00:00 |       1 |
| 2015-11-03 06:00:00 | 2015-11-02 22:00:00 |       1 |
| 2015-11-03 07:00:00 | 2015-11-02 23:00:00 |       1 |
+---------------------+---------------------+---------+
```

You can then count the number of hours in the day like so:

``` sql
select date_trunc('day', timezone('america/los_angeles', timezone('utc', timestamp))) as day, sum(value) as hours from time_series_thi
ngs where timezone('america/los_angeles', timezone('utc', timestamp)) >= timestamptz '2015-10-31T00:00:00 america/los_angeles' and timezone('a
merica/los_angeles', timezone('utc', timestamp))
         < timestamptz '2015-11-03T00:00:00 america/los_angeles' group by day order by day asc;
```
```
+---------------------+---------+
| day                 |   hours |
|---------------------+---------|
| 2015-10-31 00:00:00 |      24 |
| 2015-11-01 00:00:00 |      25 |
| 2015-11-02 00:00:00 |      24 |
+---------------------+---------+
```

[^pg-tzfn]: Because I'm using `timestamp without time zone` -- I _must_ cast the timestamp into UTC before re-casting it into the one I want to query against -- hence the nested `timezone` calls. Depending on your needs, it might be better to use a `timestamp with time zone` field, store the data explicitly as UTC, and then only cast once at query time.

The `date_trunc` function leverages PostgreSQL's knowledge about time -- it also knows about week and month boundaries. Letting PostgreSQL do the heavy lifting is much easier than storing the timestamp as an integer and attempting to modulo math with `86400` seconds. 

If you're using another data store that doesn't have rich time zone facilities available, I'm sure you have your reasons. The best advice I can give in this case is to consider the target timezone and relevant phase-in-day information and store that alongside the data at write-time. You may find some inspriation in the next example.

[PostgreSQL]: http://www.postgresql.org
[pg-tstz]: http://www.postgresql.org/docs/9.4/static/datatype-datetime.html
[pg-attz]: http://www.postgresql.org/docs/9.4/static/functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT

Another possibly thorny case is the need to **display data on a time scale in a browser for a specific time zone**. Browsers make it relatively easy to display things in the user's time zone, but sometimes organizations want to standardize on a particular time zone, or that time zone has domain-specific meaning, such as the importance of _Eastern Time_ to the world of New York City-centric world of finance. Here's how you would do that with the popular [d3][] library.

D3 provides two [time scales][]


[d3]: http://d3js.org/
[time scales]: https://github.com/mbostock/d3/wiki/Time-Scales
