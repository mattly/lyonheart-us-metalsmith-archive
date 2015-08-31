---
title:      Mistrusting Email Addresses
subtitle:   How to Take Over Your Employees' Personal Accounts
summary:    Stop Confusing the Role of Email Addresses in Communication, Identification and Authentication
date:       2014-12-02 12:00 -0800
author:     mattly
category:   software architecture
locations:
  - New York, New York
  - Portland, Oregon
  - Yakima, Washington
template: article.jade
headerClass: mobile-banner-left-30
infoClass:
  - white-text
  - top-30
  - mobile-top-10
  - black-shadow
footerWide: true

---

~~~ Lead
This article describes a type of account takeover attack against many online services which allow a user to associate more than one email addresses with a single account.  

<span class="disclosure-notice">Disclosure Notice</span> When I became aware of this attack vector, I inventoried all services I use for vulnerability, with a 95% hit rate.  I sent vulnerability reports to each, and received responses ranging from "who cares?" to lukewarm concern.  None objected to an article on the topic.

~~~ Body
Some projects I've worked on demand observing security procedures where **all** email communication for the project happen through a project-specific email account belonging to the company's operations.  Naturally, *all* email includes notifications from web services used by the project -- source control, project management, time tracking, et cetera.  It's a reasonable requirement.

Problems arise when working across more than one of these projects with the same online services, and a few services try to make things easier on their users by allowing them to associate more than one email address with a single account -- but their implementation opens up their users to a specific type of attack derived from bad assumptions about trust relationships.

This attack is the result of an architectural flaw than any problem with a technical product or protocol.  There's no CVE, and this defect is more philisophical in nature than mathematical.

I'll cover three ways in which networked services use email addresses: Communication, Identification, and Authentication, and how conflating them risks users' security.

## Communication, Identification, and Authentication

The obvious thing to use an email address for is to send it messages.  Despite its flaws, email is still the most convenient channel to send messages to any other person on the internet.

This holds especially true for automated communication.  Anyone can setup `sendmail` and try their hand at email delivery[^email-delivery] -- the instructions for doing so are as old as most of the internet.  Push Notifications may be the new hip darling, but the overhead is greater, it generally only works with the end-users' mobile devices, and even then isn't reliable.

If anything a service does involves sending a message, it's probably collecting an email address.  Once a service collects an email address and associates it with an account, an obvious use of it is to uniquely identify that account for login purposes[^amazon].

To prevent abuse, a service will want to verify ownership of the email address, so they'll send it a secret token and ask the user to prove they received the email by clicking a link.  Password resets use a similar pattern.  The assumption: Only the account owner can read email sent to the address.  It's a flawed assumption.

[^email-delivery]: Yes, I know this isn't advisable, and that email deliverability is its own specialization.  That's not the point.

[^amazon]: I'm pretty sure Amazon is the only well-known service that allows [more than one account for the same email
address](http://www.experimentgarden.com/2009/11/why-does-amazoncom-allows-multiple.html).

## In SysOps We Trust

Technical people generally understand that protecting access to their email is crucial -- it is the gateway to resetting passwords and taking over accounts on every service associated with that email address, so the most important thing to protect with [Multi-Factor Authentication][mfa] is [your email account][2fa-google], though you should [use it everywhere][2fa-everywhere].

It's bad enough that we send sensitive information like account verification tokens in plain-text over the open internet where anyone in the middle can read them.  Even ignoring the possibility of a _man-in-the-middle_ snooper, there's another problem: A rogue administrator can still read their users' email and gain access to those tokens.

Maybe the [Bastard Operator From Hell][bofh] is just a collection of stories based on stereotypes and myths.  I'm personally comfortable trusting my email to Google, but when I'm assigned a new address for work reasons I'm also trusting the people who administrate that email address not to read my email.  In many cases, being a _sysop_ or having technical skill isn't even necessary: Google Apps for Domains lets domain adminstrators read their users' email.

I've worked at companies in the past where I wouldn't put it past the domain administrator to read my email, but who cares?  It's all company business, right?  

[mfa]: https://en.wikipedia.org/wiki/Multi-factor_authentication
[2fa-google]: https://support.google.com/accounts/answer/180744?hl=en
[2fa-everywhere]: https://twofactorauth.org/
[bofh]: http://www.bofh.net/

## Unauthorized Authentication

Finally, the flaw: nearly any service that uses email addresses as an identification mechanism is *also* using them as an authentication mechanism.  

If I associate more than one email addresses with an account, I could use any of those email addresses to reset the password for that account -- and typically the service only sends the password reset email to the supplied email address.  

A rogue administrator could send a password reset to my project-specific email address, get the necessary link, change my password on the service, delete the email, and I'd never know until I went to login again.

Given the availability and use of multi-factor authentication, the rogue administrator is at least denied login access.  But the password is still changed and the service disables any open sessions.

For the services that don't offer multi-factor authentication, a rogue administrator could then take over my account, remove other email addresses from it, and gain access to information from and about other projects on which I work.  I'm certain that the company behind Project A wouldn't like the administrator for the company from Project B gaining access to their private information.

In theory, protecting yourself is easy: just don't add email addresses to your accounts unless you can trust the mail administrator.  ...Unless your project's security policies dictate that all project-related email go to the project-specific address.

## Convenience Trade-offs and Self-Protection

This is where many technically-proficient and security-minded readers suggest I simply setup per-project accounts for each service.  I believe that response is user-hostile, and for some services it would mean jumping through a series of complex hoops that any good User Experience person would recoil from in horror.

One security team responded to my concern with: _perhaps you shouldn't work on such projects._  There is only one valid response to that, and I decided a while back not to publish vulgarities here.  I'm fortunate that I can choose the projects I want to work on, but many people aren't; and in all cases I've had to deal with this problem, the projects were ones I wanted to work on.

Some services only allow a single email address per person[^email-table], but this doesn't reflect an economy where people work across many contexts.  If a service wanted to disingenuously bolster its user count, it could do this, which might explain why I have had six Google+ accounts.

For web-apps, this is often dismissed by service companies as a mere nuisance -- changing contexts means logging out from one account and re-logging in from another.  Password managers certainly speed up the process, but keeping track of which account you're logged into adds mental overhead and disrupts workflow.  Unfortunately, the overhead of multi-factor authentication makes this problem even worse.

Many services are moving beyond mere web interfaces.  A growing number have native apps, where changing account contexts by logging-out and logging-back in is not only much more of a hassle, but can also break integration with things like push notifications or background refresh.  

Source Control services often have an ssh interface, allowing authentication by ssh key, which must be unique[^ssh-key] unless the service involves another distinguishing part that allows accounts to share an ssh key, but no mainstream SCM tool does that anyway[^ssh-user].  

For example, If I wanted more than one GitHub account, I'd need an SSH key for each, and that means a careful configuration of [ssh_config][ssh-config-man] to specify custom-hostnames with the keys to use for each, and then mentally re-writing all my `@github.com` urls to the hostname that matches the key I want to use.  This breaks assumptions made by many tools meant to augment or enhance the `git` executable.  In the case of GitHub, the path of least-resistance is simply associate your project-specific email addresses with your personal account[^ssh-config].

Worse, popular cloud storage services that sync files between computers simply don't allow you to associate more than one account with the same computer, and often no way to associate more than one email address with the same account.  If I need files synced to my computer from a project's Google Drive, I have to setup [separate user accounts on my computer][gdrive-multiple], or with Dropbox, to tell the project manager to invite my personal email[^dropbox].

In some cases, despite [stated policies][lp-acct-link] or just as a [matter or poorly-thought-out logic][box-acct-link], once you associate your personal account with an organization's account, the organization owns the personal account[^lastpass].

[ssh-config-man]: https://support.google.com/accounts/answer/180744?hl=en
[gdrive-multiple]: https://plus.google.com/+JoshEstelle/posts/1mYzdE5KKgv
[lp-acct-link]: https://enterprise.lastpass.com/getting-started/link-personal-account/
[box-acct-link]: http://www.itworld.com/article/2833267/it-management/how-box-com-allowed-a-complete-stranger-to-delete-all-my-files.html

[^ssh-key]: Debian's ssh-keygen had a [flawed random number generator that led to identical key pairs](https://lists.debian.org/debian-security-announce/2008/msg00152.html), and having a large [database of SSH public keys](https://github.com/blog/63-ssh-keys-generated-on-debian-ubuntu-compromised) helps in finding such problems.

[^ssh-user]: For example, most Git-hosting services use `git+ssh://git@hostname.com:reponame.git` as the pattern for end-users accessing repositories.  The service managing access to the repositories runs as the `git` system user.  If the service created a separate system user for each end-user, accounts could share ssh keys, but the overhead involved in maintaining such a setup (both in programming and documentation effort) isn't worth the paltry number of use-cases for this.

[^ssh-config]: One could make the argument that if a project has such a tight security controls that this poses a problem, perhaps the project should be using privately-hosted source control, and it's a valid argument that I've seen repeatedly lose against real-world constraints.  I'm more interested in helping protect users from their project managers.

[^email-table]: Generally due to laziness or poor planning.  It's easy to just make a `users` table with an `email` column, and slap a unique index on that column.  Transitioning to a separate `emails` table joined to users is a headache, but often a necessary one.

[^dropbox]: I know one agency manager who laments telling his clients to invite something like `necrowizard56351@hotmail.com` to their shared Dropbox folders.

[^lastpass]: Account ownership re-assignment happened to a few friends during a migration from using personal accounts on LastPass to LastPass Enterprise in mid-2013.  Lastpass's [stated policy on account linking][lp-acct-link] says this shouldn't happen.

## A Straightforward Solution

If your service allows a user to associate more than one email address with an account, allow users to specify an email should be a *login email* or not.  The email address given at account creation should be a *login email*, additional email addresses are not by default login-enabled, and users should be able to change the *login email* status of any of their addresses at any time, so long as they always have at least one.  

Don't allow logins with, or send password-reset emails to, email addresses not used as login emails.

It's a boolean column on your email table and a checkbox in your email address management interface, and you can educate people about the role of login emails and security while waiting for your verification email.

As contemporary work becomes more decentralized from intranets, company-managed services and single-person, single-project patterns, good information security is crucial.  I believe that cloud services bear responsibility to pro-actively protect their users from all attackers, especially ones they may have a trust relationship with.
