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

### All Messages Have an Audience

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

## I Need Two Forms of ID, and an Email Addresses

Since an email address is needed for use as a communication channel, it's
really easy to give it double-duty as a way to uniquely identify someone.  I'm pretty sure [Amazon is the only service that allows multiple accounts for the same email address][amazon].

[amazon]: http://www.experimentgarden.com/2009/11/why-does-amazoncom-allows-multiple.html

Any service that uses an email address to identify you instead of
a username uses this pattern.  Source control tools use email addresses to
identify the author or signer of work records.

In many cases, the domain name of the email address plays a significant
part in identifying the entity as belonging to a group -- If I for example
wanted to create a [Slack Team][slack] for my family, I could specify
anyone with a `@lyonheart.us` email address could automatically join the
team -- since as the administrator of that domain, I have given those
email addresses out only to family members.

[slack]: https://slack.com

Verifying this identity is most often done by sending a secret token to
the email address, and asking the user to click a link, or copy and paste
it into the website.  The assumption is that if you have access to the email
account, you must be the person in question.  This is a flawed assumption
that will become important later.

## One User, One Address

Many services only allow a single email address per person[^email-table],
however this doesn't reflect an economy where people operate in multiple
contexts.  If a service wanted to disingenuously bolster its user count, it
could leverage this patten, which might explain why I have four Google+
accounts.

[^email-table]: Probably due of laziness.  It is really easy to just make a `users` table with an `email` column with a unique index on it, and transitioning to a seperate `emails` table joined to users is more of a headache than it seems like it should be.

I've been on the internet since 1993, have about a dozen email addresses across
ten domains, and five of those are distinctly necessary based on different
contexts in which I operate.  Several of these belong to domains I administer,
but not all.

Sometimes, I'll receive an invitation to a service I already have an
account on, but the inviting party sent it to an email address not
associated with the account.  For collaboration tools that follow the
pattern of allowing only a single email per account, this often requires
setting up another login account just for that context.  

For web-apps, this is often dismissed by service providers as a mere
nuisance -- changing contexts requires logging out from one account and
re-logging in from another, and password managers certainly accelerate
that process -- but keeping track of which account you're logged into
requires mental overhead that disrupts workflow, and the growing adoption
of multi-factor authentication disrupts it even more.

Many services are moving beyond mere web interfaces.  A growing number have
native mobile apps, and changing account contexts by logging-out and
logging-back in is not only much more of a hassle, but can also break
integration with things like push notifications or background refresh services.  

Source Control services often have an ssh interface, allowing authentication by
ssh key, which must be unique per-user[^ssh-key] unless another distinguishing factor is given, but no mainstream SCM tool implements that anyway[^ssh-user].
If I wanted to have multiple GitHub accounts, for example, I'd need multiple SSH keys, which requires a careful configuration of [ssh_config](http://linux.die.net/man/5/ssh_config) to specify custom-hostnames with the keys to use for each, and then mentally re-writing all my `@github.com` urls to the hostname that matches the key I want to use.  In many cases, this would break third-party tools that integrate with the SCM service.  In the case of GitHub, The path of least-resistance is simply associate your project-specific email addresses with your primary account[^ssh-config].

[^ssh-key]: Debian's ssh-keygen had a [flawed random number generator that led to identical key pairs](https://lists.debian.org/debian-security-announce/2008/msg00152.html), and having a large [database of SSH public keys](https://github.com/blog/63-ssh-keys-generated-on-debian-ubuntu-compromised) helps in finding such problems.

[^ssh-user]: For example, most Git-hosting services use `git+ssh://git@hostname.com:reponame.git` as the pattern for end-users accessing repositories.  The service managing access to the repositories runs as the `git` system user.  If the service created a separate system user for each end-user, ssh keys could be shared across accounts, however the overhead involved in maintaining such a setup (both in programming and documentation effort) isn't worth the paltry number of use-cases that require such a setup.

[^ssh-config]: One could make the argument that if a project has such a tight security controls that this poses a problem, perhaps the project should be using private source hosting, and it's a valid argument that lost against real-world constraints for each of the projects I've been involved with.  Besides, in this piece I'm interested in helping protect users from their project managers.

Cloud storage services that sync files between multiple computers are mostly worse -- there is simply no way to associate multiple accounts with the same computer, and often no way to associate multiple email accounts with the same address. So, if I need files synced to my computer from a project's Google Drive, I have to setup [multiple user accounts on my computer][gdrive-multiple], or with Dropbox, to tell the project manager to invite my personal email[^dropbox].

[gdrive-multiple]: https://plus.google.com/+JoshEstelle/posts/1mYzdE5KKgv

[^dropbox]: I know one agency manager who laments telling his clients to invite something like `necrowizard56351@hotmail.com` to their shared Dropbox folders.

In some cases, despite [stated policies][lp-acct-link] or just as a [matter or poorly-thought-out logic][box-acct-link], once you associate your personal account with an organization's account, the personal account is owned by the organization[^lastpass].

[lp-acct-link]: https://enterprise.lastpass.com/getting-started/link-personal-account/

[box-acct-link]: http://www.itworld.com/article/2833267/it-management/how-box-com-allowed-a-complete-stranger-to-delete-all-my-files.html

[^lastpass]: Lastpass is the only service I have entirely abandonned as a result of researching this problem.  Multiple friends and acquaintances have reported that, through the end of 2013, their personal LastPass accounts were compromised as a result of associating them with an organization's LastPass Enterprise account.  Perhaps LastPass's policies have changed since, but I've abandonned cloud-synced password managers entirely at this point.

## In SysOps We Trust

Unfortunately a bad assumption is made, calling back to the
earlier description of verifying identity by email address -- the
assumption that if you can read an email sent to an address, you are the
person for whom the email is intended.  Technical people generally
understand that protecting access to their email is highly important -- it
is the gateway to resetting passwords and taking over accounts on just
about every other service associated with that email address, but many
non-technical people don't grasp the implications of a rogue entity
gaining access to their email.

It's bad enough that most email is plain-text and few services bother to
encrypt, let alone sign, their outgoing email containing sensitive
material -- though this shoves most of the eavesdropping risk onto the
network between the sender's server and the receiver's server.  But even
an email account with a strong password and multi-factor authentication is
still vulnerable to a rogue administrator.

Perhaps the [Bastard Operator From Hell][bofh] is just a collection
of stories based on stereotypes and myths.  While I have been personally
comfortable trusting my email to google, whenever I gain a new address for
work reasons -- I'm also trusting the people who administrate that email
address not to read the mail that goes there.  I've worked at companies in
the past where I wouldn't put it past the admin to read my email, but who
cares?  It's all company business, right?  Right?

[bofh]: http://www.bofh.net/

## Unauthorized Authentication

Finally, I'll get to the flaw: nearly any service that uses email addresses
as identification and communication mechanisms is *also* using them as an
authentication mechanism.  Knowing the correct password, I can log into
these services using any associated email address as an identifier.  Not
knowing the correct password, I can send a password reset token to any
associated email address, where anyone who can read the email (and
presumably delete it) can then change my password.  

Every service that offers multi-factor authentication, at least, prevents
the attacker/rogue administrator from at least logging in, but every
service will authorize the password change and then disable all other open
sessions for the account.

It would be easy to again assume that, who cares, the rogue administrator
is only getting access to company resources, even if they are
impersonating me.  Except that for all of these services that I do have
multiple email addresses listed on, I also have things related to other
contexts in which I work.  I'm fairly certain the administrator for Project A wouldn't like the administrator for Project B getting access to their private information through my account.

In theory, protecting yourself is easy: just don't add email addresses to
your accounts unless you can trust the mail administrator.  Unless of
course, your project's security requirements dictate that all
project-related email go to the project-specific address.

## A Simple Solution

If your service allows multiple email addresses to be associated with an account, allow users to specify an email should be a "login email" or not.  Default to true for the email address the account was created with, and false for subsequent ones, and let them change those at any time, provided there is at least one "login email" at any time.

Don't allow login attempts from, or send password-reset emails to email addresses that aren't login emails.

It's a boolean column on your email table and a checkbox in your email address management interface, and you can educate people about the role of login emails and security while they're waiting for your verification email.

Alternately, require multi-factor authentication before allowing a user to associate multiple email addresses with their account.

As contemporary work becomes more decentralized from intranets, company-managed services and single-person, single-project patterns, good information security is crucial.  I believe it is the responsibility of the cloud services that are taking over the role of intranets to pro-actively protect their users from situations like this.
