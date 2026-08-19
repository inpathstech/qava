#!/usr/bin/env python3
"""Generate termsofuse-body.html from structured terms text."""

import html
import re
from pathlib import Path

CONTENT = r"""
These Terms of Use govern your access to and use of www.theclubnyc.com, including our website, applications, platform, marketplace, communications, tools, content, software, artificial intelligence features, and related services.

By accessing or using www.theclubnyc.com, you agree to these Terms. If you do not agree, you may not access or use www.theclubnyc.com.

1. About The Club

www.theclubnyc.com, together with its owners, officers, directors, employees, contractors, advisors, affiliates, agents, successors, and assigns, is referred to in these Terms as "The Club," "we," "us," or "our."

The Club is a marketplace and technology platform that helps connect companies, founders, startups, nonprofits, institutions, project sponsors, and other organizations with students, graduates, professionals, operators, advisors, consultants, and other talent.

The Club may support opportunities including, but not limited to, projects, jobs, internships, fellowships, consulting engagements, advisory work, workshops, team formation, research, strategy work, financial analysis, legal-adjacent support, operational support, and other professional opportunities.

The Club is not a staffing agency, employer, university, law firm, accounting firm, investment adviser, broker-dealer, fiduciary, or guarantor of any outcome.

2. Eligibility

You may use The Club only if you are legally able to enter into a binding agreement.

By using The Club, you represent that:

You are at least 18 years old, or the age of majority in your jurisdiction.
You have authority to agree to these Terms.
If using The Club on behalf of an organization, you have authority to bind that organization.
Your use of The Club will comply with all applicable laws, rules, and regulations.
You are not prohibited from using The Club under applicable law.

We may refuse access to The Club, suspend accounts, remove content, or terminate use at any time, with or without notice, where we believe it is appropriate.

3. Accounts and Registration

To access certain features, you may need to create an account.

You agree to provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.

You may not:

Create an account using false information.
Impersonate another person or organization.
Share, sell, transfer, or assign your account without our permission.
Allow another person to use your account in a way that misleads others.
Create multiple accounts to evade rules, reviews, fees, suspensions, or restrictions.

You must notify us promptly if you believe your account has been compromised.

4. Platform License

Subject to your compliance with these Terms, The Club grants you a limited, revocable, non-exclusive, non-transferable, non-sublicensable license to access and use The Club for its intended purposes.

We may modify, suspend, discontinue, restrict, or remove any part of The Club at any time without liability to you.

This license does not give you ownership of The Club or The Club intellectual property.

5. The Club Intellectual Property

The Club owns or licenses all rights in the platform, including The Club name, brand, logo, design, software, workflows, databases, matching systems, AI tools, interfaces, copy, graphics, code, templates, insights, business processes, and proprietary content.

You may not copy, reproduce, modify, distribute, sell, lease, reverse engineer, scrape, frame, mirror, benchmark, or create derivative works from The Club or its technology without our prior written permission.

Nothing in these Terms grants you rights to The Club's trademarks, logos, branding, software, data, proprietary methods, or intellectual property.

6. User Content

"User Content" means anything you upload, submit, post, display, send, create, share, or make available through The Club, including profiles, resumes, biographies, portfolios, work samples, project descriptions, job listings, internship listings, messages, reviews, ratings, documents, images, videos, files, prompts, outputs, comments, feedback, and other materials.

You retain ownership of your User Content, subject to the license you grant The Club below.

You are solely responsible for your User Content. You represent and warrant that:

You have all rights needed to submit the User Content.
Your User Content is accurate and not misleading.
Your User Content does not infringe anyone's intellectual property, privacy, publicity, contractual, confidentiality, employment, academic, or other rights.
Your User Content does not contain unlawful, defamatory, discriminatory, harassing, obscene, fraudulent, deceptive, or harmful material.
Your User Content does not contain confidential information you are not authorized to share.
Your User Content complies with these Terms and all applicable laws.

7. License to User Content

By submitting User Content to The Club, you grant The Club a worldwide, non-exclusive, royalty-free, sublicensable, transferable license to host, store, reproduce, display, publish, distribute, modify, format, excerpt, analyze, index, use, and otherwise process your User Content as reasonably necessary to operate, improve, protect, market, and provide The Club.

This includes using User Content to:

Display talent profiles to clients.
Display opportunities to talent.
Facilitate matching, recommendations, search, and discovery.
Operate AI-enabled tools and platform features.
Communicate opportunities, applications, or project information.
Promote The Club, subject to applicable law and your privacy settings.
Improve safety, quality, fraud detection, and platform performance.

You also grant other users a limited license to access and use your User Content only as permitted through The Club and only for legitimate platform purposes.

We may remove, edit, restrict, or decline to display User Content at any time.

8. Feedback and Suggestions

If you send The Club ideas, suggestions, concepts, improvements, product feedback, feature requests, business ideas, or other recommendations, you agree that The Club may use them without restriction, compensation, attribution, or obligation to you.

You waive any claim that The Club's use of your feedback infringes your rights or requires payment.

9. Talent Responsibilities

If you use The Club as talent, applicant, student, graduate, professional, consultant, advisor, freelancer, contractor, intern, or candidate, you represent and agree that:

Your profile, education, credentials, experience, skills, work authorization status, availability, location, compensation expectations, and portfolio are accurate.
You will not misrepresent degrees, university affiliation, grades, awards, certifications, employment history, clients, publications, references, or prior work.
You will not submit work samples you do not have permission to share.
You will not plagiarize, fabricate, or misrepresent work product.
You will disclose material AI use when required by The Club, a client, a project sponsor, or applicable law.
You will comply with any confidentiality, IP, academic, employment, or professional obligations that apply to you.
You will perform any accepted work professionally, lawfully, and in accordance with the relevant agreement.
You are responsible for your own taxes, insurance, licenses, equipment, tools, and compliance obligations unless otherwise agreed in writing with a client.

The Club does not guarantee that you will receive interviews, projects, internships, jobs, compensation, offers, or any specific outcome.

10. Client Responsibilities

If you use The Club as a client, employer, company, founder, nonprofit, institution, recruiter, sponsor, or organization, you represent and agree that:

You have authority to post opportunities and communicate on behalf of your organization.
Your opportunity descriptions are accurate, lawful, and not misleading.
You will clearly describe compensation, expected work, location requirements, timing, deliverables, employment classification, internship structure, and other material terms.
You will not post fake, misleading, discriminatory, exploitative, or unlawful opportunities.
You will not request free work, unpaid speculative work, or work product outside a fair and lawful process.
You will not collect candidate data for unrelated purposes.
You will comply with applicable employment, labor, wage, hour, internship, tax, immigration, anti-discrimination, privacy, and hiring laws.
You are solely responsible for selection, hiring, supervision, payment, classification, onboarding, termination, and compliance decisions.
You will honor agreed payment terms and contractual commitments.
You will not use The Club to avoid fees, circumvent the platform, or poach users in violation of these Terms.

The Club does not guarantee the identity, suitability, availability, credentials, performance, or reliability of any talent.

11. No Employment Relationship with The Club

The Club is a marketplace and technology provider only.

The Club is not the employer, joint employer, agent, partner, manager, supervisor, fiduciary, representative, or guarantor of any user.

No user is an employee, contractor, partner, agent, franchisee, or representative of The Club merely by using the platform.

Clients are solely responsible for determining the proper legal classification of talent, including employee, independent contractor, intern, volunteer, advisor, consultant, or other status.

Talent are solely responsible for understanding the nature of any opportunity before accepting it.

12. No Guarantee of Outcomes

The Club does not guarantee:

That any user will find work, talent, candidates, interviews, jobs, internships, clients, investors, grants, revenue, or opportunities.
That any project will be completed.
That any candidate will be hired.
That any client will pay unless separately covered by a written payment product or agreement from The Club.
That any profile, listing, credential, review, rating, or representation is accurate.
That any user will perform as expected.
That use of The Club will produce any academic, professional, financial, hiring, operational, or business result.

You use The Club at your own risk.

13. AI Usage and Disclosure

The Club may include AI-enabled features, including search, matching, recommendations, summarization, profile assistance, project scoping, opportunity drafting, ranking, messaging support, and other tools.

AI outputs may be incomplete, inaccurate, biased, outdated, or inappropriate. You are responsible for reviewing and validating AI-assisted content before relying on it.

Users must not use AI to deceive others.

Talent must disclose material use of AI where required by the client, project sponsor, The Club, applicable law, academic rules, professional obligations, or the terms of a specific opportunity.

Clients must clearly state any restrictions or expectations regarding AI use in applications, interviews, deliverables, projects, internships, or employment processes.

Users may not submit AI-generated work as wholly human-created where that would be misleading, prohibited, or inconsistent with the applicable opportunity terms.

The Club may use automated tools to support matching, moderation, safety, ranking, quality control, fraud detection, and platform improvement. The Club does not guarantee that automated recommendations are accurate, complete, fair, or suitable for your needs.

14. Credential Verification

The Club may, but is not required to, verify user credentials, educational history, employment history, identity, references, work samples, skills, licenses, or organizational authority.

If The Club offers verification badges, labels, or indicators, they are limited to the specific information reviewed and do not guarantee a user's overall honesty, suitability, skill, availability, or performance.

You authorize The Club to take reasonable steps to verify information you provide, including contacting institutions, employers, references, third-party providers, or other sources where legally permitted.

You agree to cooperate with verification requests. Failure to cooperate may result in removal, suspension, or termination.

15. Reviews, Ratings, Testimonials, and Endorsements

Users must provide honest, accurate, and good-faith reviews, ratings, testimonials, and endorsements.

You may not:

Submit fake reviews.
Pay for positive reviews.
Trade reviews for value.
Threaten negative reviews to obtain concessions.
Review yourself or your own organization.
Manipulate ratings, rankings, testimonials, or feedback.
Misrepresent your experience with another user.

The Club may remove, moderate, suppress, or decline to publish reviews or testimonials at any time.

If testimonials or endorsements are used in marketing, users must comply with applicable advertising and disclosure rules.

16. Prohibited Content

You may not post, upload, transmit, request, support, facilitate, or promote content that:

Is illegal, fraudulent, deceptive, or misleading.
Is defamatory, threatening, harassing, abusive, hateful, violent, or discriminatory.
Promotes unlawful discrimination or exclusion.
Infringes intellectual property, privacy, publicity, confidentiality, contractual, employment, or academic rights.
Contains confidential information you are not authorized to share.
Contains personal data of others without permission.
Contains sexually explicit, exploitative, or abusive material.
Involves child exploitation or abuse.
Encourages violence, self-harm, terrorism, or illegal activity.
Contains malware, spyware, viruses, harmful code, or security exploits.
Promotes scams, phishing, pyramid schemes, spam, or fraudulent opportunities.
Requests fake engagement, fake reviews, fake references, fake credentials, or fake work history.
Violates another platform's terms, school policies, employer policies, professional rules, or applicable law.
Misrepresents AI-generated media, deepfakes, synthetic identities, or manipulated content.
Is otherwise harmful to The Club, users, or the integrity of the marketplace.

17. Prohibited Conduct

You may not:

Use The Club for unlawful, fraudulent, misleading, harmful, or abusive purposes.
Misrepresent yourself, your organization, credentials, authority, affiliation, identity, or intentions.
Circumvent The Club fees, processes, rules, or safeguards.
Contact users outside The Club to avoid The Club fees or restrictions where prohibited by The Club.
Scrape, crawl, harvest, copy, or extract platform data without written permission.
Use bots, spiders, scripts, automation, or other non-approved tools to access The Club.
Reverse engineer, decompile, modify, or attempt to discover The Club source code or systems.
Interfere with The Club's security, infrastructure, operations, or user experience.
Overload, disrupt, attack, or impair The Club.
Upload malware or harmful code.
Use The Club to build, train, benchmark, or improve a competing product or service without written permission.
Collect, sell, rent, or misuse user data.
Spam users.
Harass, intimidate, discriminate against, or exploit users.
Request unpaid work in a deceptive or unfair manner.
Fail to pay amounts owed.
Manipulate search, ranking, matching, reviews, applications, or recommendations.
Use another user's account.
Create accounts to evade enforcement.
Violate any law, contract, policy, or third-party right.

18. Anti-Circumvention

The Club invests substantial resources in building the marketplace, attracting users, matching parties, and facilitating opportunities.

You may not use The Club to identify, solicit, contact, engage, hire, contract with, or transact with another user outside The Club in order to avoid The Club fees, subscriptions, commissions, platform rules, or payment processes.

Unless otherwise agreed in writing, if you meet, discover, source, identify, or engage a user through The Club, any resulting work, hire, project, internship, consulting relationship, advisory engagement, or paid opportunity during the applicable restricted period must be processed in accordance with The Club's then-current commercial terms.

The Club may charge circumvention fees, suspend accounts, remove users, or pursue available remedies if we believe users have attempted to avoid The Club fees or misuse marketplace access.

19. Payments, Fees, and Subscriptions

The Club may charge fees for access, subscriptions, listings, placements, projects, jobs, internships, premium features, verification, promotion, transactions, success fees, commissions, or other products.

You agree to pay all applicable fees disclosed to you.

Fees may be non-refundable unless otherwise stated in writing.

You are responsible for taxes, duties, levies, exchange fees, bank fees, card fees, and other charges associated with your use of The Club.

The Club may change fees at any time, subject to applicable law and any written agreement then in effect.

If payments fail, The Club may suspend access, remove listings, pause services, charge late fees where permitted, recover collection costs, or terminate your account.

The Club may use third-party payment processors. Your use of payment services may be subject to additional third-party terms.

20. Taxes

The Club does not provide tax advice.

Users are solely responsible for determining and satisfying their own tax obligations, including income taxes, payroll taxes, withholding, sales taxes, VAT, GST, reporting, filings, and related obligations.

The Club may collect tax information or issue tax forms where required by law, but The Club is not responsible for a user's tax compliance.

21. Confidentiality

Users may receive confidential or proprietary information through The Club, including business plans, financial data, customer information, strategy documents, product roadmaps, technical materials, personal information, compensation information, and other sensitive materials.

You agree not to disclose or misuse confidential information unless authorized.

You may not upload confidential information to The Club unless you have authority to do so.

The Club is not responsible for unauthorized disclosure by users.

Clients and talent should enter separate confidentiality, invention assignment, data protection, or services agreements where appropriate.

22. Intellectual Property in Work Product

The Club does not automatically own work product created between users unless separately agreed in writing.

Ownership of work product, deliverables, inventions, materials, data, code, designs, research, or other outputs should be addressed in a separate agreement between the relevant client and talent.

If users do not enter a separate written agreement, disputes over ownership are between those users and not The Club.

The Club is not responsible for determining, enforcing, or adjudicating ownership of user-created work product.

23. Third-Party Agreements Between Users

Users may enter separate agreements for projects, jobs, internships, consulting work, employment, advisory roles, confidentiality, intellectual property, payment, compliance, or other matters.

The Club is not a party to those agreements unless The Club expressly signs them.

Users are solely responsible for reviewing, negotiating, and complying with agreements they enter.

The Club does not provide legal advice or guarantee that any user agreement is valid, enforceable, complete, or appropriate.

24. Compliance with Employment, Labor, and Internship Laws

Clients are solely responsible for compliance with employment, labor, wage and hour, internship, contractor classification, workplace safety, immigration, tax, benefits, anti-discrimination, background check, and hiring laws.

Talent are responsible for confirming that they are legally authorized to perform work they accept.

The Club does not determine whether an opportunity is properly classified as a job, internship, project, contractor role, volunteer role, fellowship, or other arrangement.

Clients must not publish opportunities that unlawfully prefer or discourage applicants based on protected characteristics.

25. Equal Opportunity and Non-Discrimination

The Club is committed to lawful, fair, and professional marketplace access.

Users may not discriminate, harass, exclude, or retaliate unlawfully based on race, color, religion, sex, pregnancy, sexual orientation, gender identity, national origin, age, disability, genetic information, veteran status, citizenship status, or any other characteristic protected by applicable law.

Users may not post opportunities or requirements that unlawfully express preferences or limitations based on protected characteristics.

26. Privacy

Your use of The Club is also governed by our Privacy Policy.

You agree that The Club may collect, use, disclose, store, and process information as described in the Privacy Policy.

Users must comply with all applicable privacy and data protection laws when using information obtained through The Club.

You may not use The Club to collect, process, store, sell, or disclose personal information for unrelated, unauthorized, unlawful, or deceptive purposes.

27. Communications

By using The Club, you agree that The Club may send you service messages, transactional messages, platform notices, security alerts, opportunity updates, product updates, marketing communications, and other communications.

You may opt out of certain marketing communications where legally required, but we may still send important service-related messages.

You agree that electronic communications satisfy any legal requirement that communications be in writing.

28. Third-Party Services and Links

The Club may contain links to third-party websites, services, tools, content, payment processors, identity verification providers, communication tools, analytics tools, AI providers, or integrations.

The Club does not control and is not responsible for third-party services.

Your use of third-party services is at your own risk and may be governed by separate terms and privacy policies.

The Club does not endorse, guarantee, or assume liability for third-party services.

29. Copyright Complaints

The Club respects intellectual property rights.

If you believe content on The Club infringes your copyright, you may send a notice to The Club's designated copyright contact at:

Copyright Agent: [Insert Name]
Email: [Insert Email]
Address: [Insert Address]

Your notice should include:

Your physical or electronic signature.
Identification of the copyrighted work claimed to be infringed.
Identification of the material claimed to be infringing and information sufficient for The Club to locate it.
Your contact information.
A statement that you have a good-faith belief the disputed use is not authorized.
A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner.

The Club may remove or disable content and may terminate repeat infringers where appropriate.

30. Monitoring and Enforcement

The Club may, but has no obligation to, monitor, review, investigate, moderate, remove, restrict, or disable access to content or accounts.

We may take action if we believe, in our sole discretion, that a user has violated these Terms, created risk, harmed the marketplace, infringed rights, violated law, or acted inconsistently with The Club's interests.

Actions may include:

Warning the user.
Removing content.
Restricting features.
Suspending or terminating accounts.
Removing listings or applications.
Withholding, reversing, or delaying transactions where legally permitted.
Reporting conduct to authorities.
Cooperating with investigations.
Pursuing legal remedies.

Failure to enforce any provision does not waive The Club's right to enforce it later.

31. Availability and Platform Changes

The Club may change, suspend, restrict, or discontinue any part of the platform at any time.

We do not guarantee uninterrupted, secure, error-free, or available access.

The Club is not liable for downtime, data loss, interruptions, delays, errors, bugs, security incidents, or platform changes, except where liability cannot be excluded by law.

32. Beta Features

The Club may release beta, experimental, pilot, or early-access features.

Beta features are provided "as is," may change or disappear at any time, may contain errors, and may not work as intended.

You use beta features at your own risk.

33. Disclaimers

The Club is provided "as is" and "as available."

To the fullest extent permitted by law, The Club disclaims all warranties, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, availability, reliability, security, and course of dealing.

The Club does not warrant that:

The platform will meet your needs.
Users are who they claim to be.
Listings are accurate.
Talent are qualified.
Clients will pay.
Work will be completed.
Opportunities are legitimate.
AI outputs are accurate.
The platform will be uninterrupted or error-free.
Defects will be corrected.

34. Limitation of Liability

To the fullest extent permitted by law, The Club and its owners, officers, directors, employees, contractors, advisors, affiliates, agents, successors, and assigns will not be liable for indirect, incidental, consequential, special, exemplary, punitive, or enhanced damages, including lost profits, lost revenue, lost business, lost opportunity, lost data, reputational harm, emotional distress, business interruption, or cost of substitute services.

To the fullest extent permitted by law, The Club's total liability for any claim arising out of or relating to these Terms, The Club, the platform, or any user interaction will not exceed the greater of:

The amount you paid to The Club in the three months before the claim arose; or
One hundred U.S. dollars.

These limitations apply whether the claim is based on contract, tort, negligence, strict liability, statute, warranty, or any other legal theory, even if The Club has been advised of the possibility of damages.

35. Indemnification

You agree to defend, indemnify, and hold harmless The Club and its owners, officers, directors, employees, contractors, advisors, affiliates, agents, successors, and assigns from and against any claims, demands, actions, damages, losses, liabilities, judgments, settlements, costs, and expenses, including reasonable attorneys' fees, arising out of or relating to:

Your use of The Club.
Your User Content.
Your violation of these Terms.
Your violation of law.
Your violation of another person's rights.
Your misrepresentation.
Your relationship, contract, dispute, or transaction with another user.
Your hiring, employment, internship, contractor, tax, payment, classification, or compliance decisions.
Your AI use or failure to disclose AI use where required.
Your infringement or alleged infringement of intellectual property, privacy, publicity, confidentiality, or other rights.

The Club may control the defense of any matter subject to indemnification, and you agree to cooperate with us.

36. Release of The Club

You release The Club and its owners, officers, directors, employees, contractors, advisors, affiliates, agents, successors, and assigns from claims, demands, damages, losses, and liabilities arising out of disputes with other users, including disputes over payment, performance, hiring, firing, interviews, internships, employment, classification, work product, intellectual property, confidentiality, reviews, ratings, discrimination, harassment, or user conduct.

If you are a California resident, you waive California Civil Code Section 1542 to the extent permitted by law.

37. Disputes Between Users

The Club may, but is not required to, assist with disputes between users.

The Club has no obligation to mediate, arbitrate, investigate, resolve, pay, refund, enforce, or otherwise participate in user disputes.

Any dispute between users is solely between those users.

38. Governing Law

These Terms are governed by the laws of the State of New York, without regard to conflict-of-law principles.

39. Arbitration and Class Action Waiver

To the fullest extent permitted by law, you and The Club agree to resolve disputes through binding individual arbitration rather than in court, except for claims that may be brought in small claims court or claims seeking injunctive relief for misuse of intellectual property, confidential information, or platform technology.

You and The Club waive the right to a jury trial.

You and The Club agree that disputes must be brought only on an individual basis and not as a class, collective, consolidated, representative, or private attorney general action.

The arbitration will be administered by [AAA/JAMS] under its applicable rules. The seat of arbitration will be New York, New York, unless otherwise required by law.

40. Injunctive Relief

You agree that misuse of The Club's intellectual property, confidential information, platform data, users, marketplace relationships, or technology may cause irreparable harm.

The Club may seek injunctive or equitable relief without posting bond or proving actual damages.

41. Termination

You may stop using The Club at any time.

The Club may suspend, restrict, or terminate your access at any time, with or without notice, if we believe it is appropriate.

After termination, provisions that by their nature should survive will survive, including intellectual property, User Content licenses, payment obligations, disclaimers, limitations of liability, indemnification, releases, dispute resolution, and enforcement rights.

42. Changes to These Terms

The Club may update these Terms from time to time.

If we make material changes, we may provide notice by posting the updated Terms, emailing you, or using another reasonable method.

Your continued use of The Club after changes become effective means you accept the updated Terms.

If you do not agree, you must stop using The Club.

43. Assignment

You may not assign or transfer these Terms without The Club's prior written consent.

The Club may assign or transfer these Terms, in whole or in part, without restriction, including in connection with a merger, acquisition, financing, restructuring, sale of assets, or transfer of business.

44. Severability

If any provision of these Terms is found unenforceable, the remaining provisions will remain in full force and effect.

The unenforceable provision will be modified to the minimum extent necessary to make it enforceable.

45. Entire Agreement

These Terms, together with any policies, agreements, or additional terms incorporated by reference, constitute the entire agreement between you and The Club regarding your use of the platform.

46. No Waiver

The Club's failure to enforce any provision does not waive our right to enforce it later.

47. Contact

Questions about these Terms may be sent to:

www.theclubnyc.com
Email: legal@qava.ai
"""

SECTION_RE = re.compile(r"^(\d+)\.\s+(.+)$")
LIST_INTRO_RE = re.compile(r":\s*$")


def esc(text: str) -> str:
    return html.escape(text.strip(), quote=False)


def render_block(lines: list[str]) -> str:
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        if line.endswith(":"):
            out.append(f"<p>{esc(line)}</p>")
            i += 1
            while i < len(lines) and not lines[i].strip():
                i += 1
            items: list[str] = []
            while i < len(lines):
                candidate = lines[i].strip()
                if not candidate:
                    break
                if SECTION_RE.match(candidate):
                    break
                items.append(candidate)
                i += 1
            if items:
                out.append("<ul>")
                for item in items:
                    out.append(f"<li>{esc(item)}</li>")
                out.append("</ul>")
            continue

        out.append(f"<p>{esc(line)}</p>")
        i += 1

    return "\n".join(out)


def build_body() -> str:
    raw = CONTENT.strip()
    chunks = re.split(r"\n(?=\d+\.\s+)", raw)
    intro = chunks[0].strip().splitlines()
    sections_html: list[str] = []

    intro_html = render_block(intro)
    sections_html.append(f'<div class="qava-legal-intro">{intro_html}</div>')

    for chunk in chunks[1:]:
        lines = chunk.strip().splitlines()
        match = SECTION_RE.match(lines[0].strip())
        if not match:
            continue
        num, title = match.groups()
        body = render_block(lines[1:])
        sections_html.append(
            f'<section class="qava-legal-section" id="section-{num}">'
            f'<h2 class="qava-legal-heading">{esc(num + ". " + title)}</h2>'
            f"{body}</section>"
        )

    return "\n".join(sections_html)


if __name__ == "__main__":
    out = Path(__file__).resolve().parents[1] / "termsofuse-body.html"
    out.write_text(build_body(), encoding="utf-8")
    print(f"Wrote {out}")
