This article describes a type of account takeover attack against
many online services that allow a user to associate several
email addresses with a single account.  

**Disclosure Notice** When I became aware of this attack vector,
I inventoried all services I use for vulnerability, with a 95%
hit rate.  I sent vulnerability reports to each, and received
responses ranging from lukewarm to "who cares?" 

# Mistrusting Email Addresses

## Stop Confusing the Role of Email Addresses in Communication, Identification, and Authentication

Some projects I have worked on demand observing security procedures
ensuring that all email communication for the project happen through
a project-specific email account assigned to me on the domain specific
to the project, under control of the project's operations.  Considering
the sensitive nature of these projects, that's reasonable.

A problem arises when you work in many of these contexts and want to
switch between them easily.  Many online services demand that you set up
entirely separate accounts for each email address, and for those,
switching between them ranges from inconvenience to outright frustration.
Some allow adding several accounts to the same account, but most of these
make a bad assumption about the trust level their users have with
individual email addresses, that opens their users' accounts to a 
specific kind of attack.

This attack is the result of an architectural flaw than any problem with
a technical product or protocol.  There's no CVE.

I'm going to cover three ways in which networked services use email
addresses: Identification, Communication, and Authentication, and how
conflating them can risk users' security.

## All Messages Have an Audience

The most obvious thing to do with an email address is to send it messages.
Email isn't going away anytime soon, no matter how much some of us wish it
might.  Despite all its flaws, email is still the most convenient channel
to send messages to any other person on the internet.

This especially holds true for automated communication.  Anyone can setup
`sendmail` and at least have a go at email delivery[^email-delivery], and the
instructions for doing so are as old as most of the internet.  Push
Notifications may be the new hip darling, but the overhead is much
greater, it generally only works with the end-users' mobile
devices, and even then isn't reliable.

If anything a service does involves sending a message, it's probably collecting an email address.

[^email-delivery]: Yes, I know this isn't advisable, and that email deliverability is its own specialization.  That's not the point.

## For Identification Purposes Also

Once a service collects an email address and associates it with an
account, an obvious use of it is to uniquely identify that
account for login purposes[^amazon].

[^amazon]: I'm pretty sure Amazon is the only well-known service that
allows [multiple accounts for the same email
address](http://www.experimentgarden.com/2009/11/why-does-amazoncom-allows-multiple.html)

For some services, the domain name of the email address plays
a significant part in identifying the entity as belonging to a group -- If
for example I wanted to create a [Slack Team][slack][^slack-email] for my
family, I could specify anyone with a `@lyonheart.us` email address could
automatically join the team -- as the administrator of that domain, I have
given those email addresses out only to trusted people.

[slack]: https://slack.com

[^slack-email]: Slack is the only service I use that has sufficient
controls in place to prevent this type of attack, and they don't even
support multi-factor authentication.

Identity verification is typically done by sending a secret token to the
email address, and asking the user to prove they received it by clicking
a link.  The assumption is that if you have access to the email account,
you are the account owner.  This is a flawed assumption. 

## In SysOps We Trust

Technical people generally understand that protecting access to their
email is highly important -- it is the gateway to resetting passwords and
taking over accounts on every service associated with that email address,
which is why the most important thing to protect with [Multi-Factor
Authentication][mfa] is [your email account][2fa-google], though you
should [use it everywhere][2fa-everywhere].

[mfa]: https://en.wikipedia.org/wiki/Multi-factor_authentication
[2fa-google]: https://support.google.com/accounts/answer/180744?hl=en
[2fa-everywhere]: https://twofactorauth.org/

It's bad enough that we send sensitive information such as account verification
tokens in plain-text over the open internet where anyone in the
middle can read them.  Even ignoring that possibility, there's still
another problem: A rogue administrator can still read their users' email
and gain access to those tokens.

Perhaps the [Bastard Operator From Hell][bofh] is just a collection
of stories based on stereotypes and myths.  While I have been personally
comfortable trusting my email to Google, whenever I gain a new address for
work reasons, I'm also trusting the people who administrate that email
address not to read the mail that goes there.

[bofh]: http://www.bofh.net/

I've worked at companies in the past where I wouldn't put it past the
Google domain administrator to read my email, but who cares?  It's all company business, right?

Right?

## Unauthorized Authentication

Finally, the flaw: nearly any service that uses email addresses as an
identification mechanism is *also* using them as an authentication
mechanism.  

If I associate several email addresses with an account, I could use any
of those email addresses to reset the password for that account -- and
typically the service only sends the password reset email to the supplied
email address.  A rogue administrator could send a password reset to my
project-specific email address, get the necessary link, change my password
on the service, delete the email, and I'd never know.

If the service offers multi-factor authentication and I'm using it, the
rogue administrator is at least denied login access, but the password
change is still allowed and the service disables any open sessions.

For the services that don't offer multi-factor authentication, a rogue
administrator could then take over my account, remove other email
addresses from it, and gain access to information from and about other
contexts in which I work.  I'm fairly certain that the company behind
Project A wouldn't like the administrator for the company from Project
B gaining access to their private content.

In theory, protecting yourself is easy: just don't add email addresses to
your accounts unless you can trust the mail administrator.  Unless of
course, your project's security policies dictate that all project-related
email go to the project-specific address.

## Convenience Trade-offs and Self-Protection

This is where many technically-proficient security-minded readers will
suggest I simply setup per-project accounts for each service.  I believe
that response is user-hostile, and for some services it would mean jumping
through a series of complex hoops that any good user experience person
would recoil from in horror.

Many services only allow a single email address per person[^email-table],
but this doesn't reflect an economy where people work across several
contexts.  If a service wanted to disingenuously bolster its user count,
it could do this, which might explain why I have had six Google+ accounts.

[^email-table]: Generally due to laziness or poor planning.  It is really
easy to just make a `users` table with an `email` column, and slap
a unique index on that column.  Transitioning to a seperate `emails` table
joined to users is more of a headache than it seems like it should be.

For web-apps, this is often dismissed by service companies as a mere
nuisance -- changing contexts means logging out from one account and
re-logging in from another.  Password managers certainly speed up the
process, but keeping track of which account you're logged into adds
mental overhead and disrupts workflow.  The growing adoption of
multi-factor authentication disrupts it even more.

Many services are moving beyond mere web interfaces.  A growing number
have native apps, where changing account contexts by logging-out and
logging-back in is not only much more of a hassle, but can also break
integration with things like push notifications or background refresh.  

Source Control services often have an ssh interface, allowing
authentication by ssh key, which must be unique per-user[^ssh-key] unless
the service involves another distinguishing element that allows accounts
to share an ssh key, but no mainstream SCM tool does that
anyway[^ssh-user].  

[^ssh-key]: Debian's ssh-keygen had a [flawed random number generator that led to identical key pairs](https://lists.debian.org/debian-security-announce/2008/msg00152.html), and having a large [database of SSH public keys](https://github.com/blog/63-ssh-keys-generated-on-debian-ubuntu-compromised) helps in finding such problems.

[^ssh-user]: For example, most Git-hosting services use `git+ssh://git@hostname.com:reponame.git` as the pattern for end-users accessing repositories.  The service managing access to the repositories runs as the `git` system user.  If the service created a separate system user for each end-user, ssh keys could be shared across accounts, however the overhead involved in maintaining such a setup (both in programming and documentation effort) isn't worth the paltry number of use-cases that require such a setup.

If I wanted to have more than one GitHub account, for example, I'd need an
SSH key for each, and that means a careful configuration of
[ssh_config][ssh-config-man] to specify custom-hostnames with the keys to
use for each, and then mentally re-writing all my `@github.com` urls to
the hostname that matches the key I want to use.  This breaks assumptions
made by many tools aside from the actual `git` binary.  In the case of
GitHub, The path of least-resistance is simply associate your
project-specific email addresses with your primary account[^ssh-config].

[ssh-config-man]: https://support.google.com/accounts/answer/180744?hl=en

[^ssh-config]: One could make the argument that if a project has such a tight security controls that this poses a problem, perhaps the project should be using private source hosting, and it's a valid argument that lost against real-world constraints for each of the projects I've been involved with.  Besides, in this piece I'm interested in helping protect users from their project managers.

Cloud storage services that sync files between computers are mostly worse
-- there is simply no way to associate more than one account with the same
computer, and often no way to associate more than one email address with
the same account. So, if I need files synced to my computer from
a project's Google Drive, I have to setup [separate user accounts on my
computer][gdrive-multiple], or with Dropbox, to tell the project manager
to invite my personal email[^dropbox].

[gdrive-multiple]: https://plus.google.com/+JoshEstelle/posts/1mYzdE5KKgv

[^dropbox]: I know one agency manager who laments telling his clients to invite something like `necrowizard56351@hotmail.com` to their shared Dropbox folders.

In some cases, despite [stated policies][lp-acct-link] or just as
a [matter or poorly-thought-out logic][box-acct-link], once you associate
your personal account with an organization's account, the organization
owns the personal account[^lastpass].

[lp-acct-link]: https://enterprise.lastpass.com/getting-started/link-personal-account/

[box-acct-link]: http://www.itworld.com/article/2833267/it-management/how-box-com-allowed-a-complete-stranger-to-delete-all-my-files.html

[^lastpass]: Lastpass is the only service I have entirely abandonned as a result of researching this problem.  Multiple friends and acquaintances have reported that through the end of 2013, their personal LastPass accounts were compromised as a result of associating them with an organization's LastPass Enterprise account.  Perhaps LastPass's policies have changed since, but I've abandonned cloud-synced password managers entirely at this point.

## A Simple Solution

If your service allows multiple email addresses to be associated with an account, allow users to specify an email should be a "login email" or not.  Default to true for the email address the account was created with, and false for subsequent ones, and let them change those at any time, provided there is at least one "login email" at any time.

Don't allow login attempts from, or send password-reset emails to email addresses that aren't login emails.

It's a boolean column on your email table and a checkbox in your email address management interface, and you can educate people about the role of login emails and security while they're waiting for your verification email.

Alternately, require multi-factor authentication before allowing a user to associate multiple email addresses with their account.

As contemporary work becomes more decentralized from intranets, company-managed services and single-person, single-project patterns, good information security is crucial.  I believe it is the responsibility of the cloud services that are taking over the role of intranets to pro-actively protect their users from situations like this.
