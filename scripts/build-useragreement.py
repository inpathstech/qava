#!/usr/bin/env python3
"""Generate useragreement.html from structured agreement text."""

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TERMS_SHELL = ROOT / "termsofuse.html"

CONTENT = r"""
IMPORTANT NOTICE

PLEASE READ THIS USER AGREEMENT CAREFULLY.

THIS AGREEMENT CONSTITUTES A LEGALLY BINDING CONTRACT BETWEEN YOU AND QAVA. BY ACCESSING, BROWSING, REGISTERING FOR, OR OTHERWISE USING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS AGREEMENT, AS WELL AS ANY OTHER POLICIES, GUIDELINES, TERMS, OR DOCUMENTS INCORPORATED HEREIN BY REFERENCE.

THIS AGREEMENT CONTAINS IMPORTANT LIMITATIONS OF LIABILITY, DISCLAIMERS OF WARRANTIES, RELEASES OF CLAIMS, INDEMNIFICATION OBLIGATIONS, ARBITRATION REQUIREMENTS, AND CLASS ACTION WAIVERS THAT AFFECT YOUR LEGAL RIGHTS.

IF YOU DO NOT AGREE TO THIS AGREEMENT, YOU MUST NOT ACCESS OR USE THE PLATFORM.

1. INTRODUCTION

This User Agreement ("Agreement") governs your access to and use of the QAVA platform, including all websites, applications, software, communications tools, artificial intelligence tools, databases, content, features, services, marketplaces, APIs, integrations, and related technologies made available by QAVA.ai ("QAVA," "we," "us," or "our").

For purposes of this Agreement, "Platform" means the entirety of the QAVA ecosystem and all related services, whether accessed through a website, mobile device, application, API, integration, email communication, messaging system, or any other means.

QAVA operates a technology-enabled marketplace designed to facilitate introductions, discovery, communication, collaboration, and professional opportunities among individuals and organizations. These opportunities may include projects, internships, jobs, fellowships, advisory engagements, consulting engagements, research initiatives, workshops, temporary assignments, permanent employment opportunities, team formation activities, educational opportunities, and other forms of professional collaboration.

The Platform is intended primarily for business, educational, professional, and career-development purposes. QAVA reserves the right to determine, in its sole discretion, whether a particular use of the Platform is consistent with its intended purposes.

2. THE ROLE OF QAVA

QAVA is a technology platform and marketplace provider. QAVA is not a party to agreements entered into between users and does not participate in negotiations, employment decisions, compensation decisions, project management, supervision, performance evaluation, disciplinary actions, termination decisions, or the delivery of services by users.

The Platform enables users to discover opportunities and connect with one another. However, QAVA does not recruit, employ, supervise, direct, manage, evaluate, endorse, certify, guarantee, or otherwise control any user, opportunity, engagement, project, internship, job, employer, educational institution, or organization.

Nothing on the Platform shall be interpreted as creating an employment relationship, staffing relationship, recruiting relationship, agency relationship, joint venture, partnership, franchise relationship, fiduciary relationship, or other similar legal relationship between QAVA and any user.

Users acknowledge and agree that QAVA's role is limited to providing access to technology, information, communication tools, matching systems, recommendation engines, AI-powered features, marketplace functionality, and related services.

All decisions regarding hiring, engagement, interviews, compensation, internships, projects, advisory relationships, consulting arrangements, employment, team formation, or business relationships are made solely by the users involved and at their own risk.

3. ACCOUNT REGISTRATION AND ELIGIBILITY

To access certain portions of the Platform, users may be required to create an account. By registering for an account, you represent and warrant that all information submitted to QAVA is complete, accurate, current, and not misleading.

You further represent and warrant that you possess the legal capacity to enter into binding agreements and that your use of the Platform complies with all applicable laws, regulations, contractual obligations, academic policies, professional obligations, and organizational requirements applicable to you.

If you register on behalf of a company, university, nonprofit organization, government agency, investment fund, startup, or other legal entity, you represent and warrant that you possess authority to bind such entity to this Agreement.

QAVA reserves the right, in its sole discretion, to approve, reject, suspend, restrict, verify, investigate, or terminate any account at any time and for any lawful reason.

QAVA may require identity verification, credential verification, educational verification, employment verification, business verification, payment verification, location verification, or other forms of authentication before permitting access to certain features of the Platform.

The failure of QAVA to verify any information does not constitute a representation, warranty, certification, endorsement, or guarantee of accuracy.

4. USER REPRESENTATIONS AND WARRANTIES

By using the Platform, you represent and warrant that all information you provide to QAVA or to other users is truthful, accurate, complete, and not misleading.

You further represent and warrant that any educational credentials, certifications, professional licenses, work history, internship experience, project experience, academic achievements, awards, publications, affiliations, references, endorsements, skills, qualifications, and other representations made by you are accurate and capable of substantiation.

You agree not to misrepresent your identity, qualifications, educational background, employment history, work authorization status, professional credentials, references, compensation history, project experience, portfolio materials, or any other information that may reasonably influence another user's decision to engage with you.

You acknowledge that QAVA and other users may rely upon the information you provide and that material misrepresentations may result in suspension, termination, legal action, or other remedies available under applicable law.

5. USER CONTENT

Users may upload, submit, publish, transmit, store, share, generate, or otherwise make available content through the Platform, including profiles, resumes, biographies, portfolios, project descriptions, job descriptions, internship postings, communications, messages, images, videos, files, documents, reviews, ratings, endorsements, comments, feedback, work product, and AI-generated content (collectively, "User Content").

You retain ownership of User Content that you lawfully own. However, by submitting User Content to the Platform, you grant QAVA a worldwide, perpetual, irrevocable, royalty-free, transferable, sublicensable, non-exclusive license to host, store, reproduce, display, distribute, modify, format, analyze, index, aggregate, process, transmit, and otherwise use such User Content as reasonably necessary to operate, improve, maintain, secure, market, and provide the Platform and related services.

This license includes the right to use User Content for platform operations, recommendations, search functionality, analytics, fraud prevention, moderation, customer support, product development, benchmarking, internal business purposes, and marketing activities related to the Platform.

Notwithstanding the foregoing, QAVA shall not intentionally disclose confidential information submitted by users except as permitted by this Agreement, the Privacy Policy, applicable law, legal process, or the user's express authorization.

You are solely responsible for all User Content submitted through your account and represent and warrant that you possess all rights necessary to grant the licenses described in this Agreement.

6. INTELLECTUAL PROPERTY RIGHTS

The Platform, including its software, technology, databases, algorithms, workflows, artificial intelligence systems, interfaces, designs, branding, trademarks, trade dress, logos, content, graphics, text, documentation, methodologies, and underlying intellectual property, is owned by QAVA, its licensors, or its affiliates and is protected by intellectual property laws throughout the world.

Except as expressly authorized in writing by QAVA, users may not reproduce, distribute, modify, create derivative works from, reverse engineer, scrape, extract, harvest, benchmark, frame, mirror, license, sublicense, sell, lease, assign, transfer, publish, or otherwise exploit any portion of the Platform.

Users further agree not to use the Platform to develop, train, benchmark, evaluate, improve, or support a competing product, service, marketplace, artificial intelligence model, database, matching engine, or business without QAVA's prior written consent.

QAVA reserves all rights not expressly granted under this Agreement.
"""

SECTION_RE = re.compile(r"^(\d+)\.\s+(.+)$")


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
    parts: list[str] = []

    notice_title = intro[0].strip() if intro else ""
    notice_lines = intro[1:] if len(intro) > 1 else []
    if notice_title:
        parts.append(
            '<div class="qava-legal-notice">'
            f'<h2 class="qava-legal-notice-title">{esc(notice_title)}</h2>'
            f"{render_block(notice_lines)}"
            "</div>"
        )

    for chunk in chunks[1:]:
        lines = chunk.strip().splitlines()
        match = SECTION_RE.match(lines[0].strip())
        if not match:
            continue
        num, title = match.groups()
        body = render_block(lines[1:])
        parts.append(
            f'<section class="qava-legal-section" id="section-{num}">'
            f'<h2 class="qava-legal-heading">{esc(num + ". " + title)}</h2>'
            f"{body}</section>"
        )

    return "\n".join(parts)


EXTRA_STYLES = """
    .qava-legal-notice {
      background: #f7f7f8;
      border: 1px solid #ececee;
      border-radius: 8px;
      padding: 24px 28px;
      margin-bottom: 28px;
    }

    .qava-legal-notice-title {
      font-family: "Inter", sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #111827;
      margin: 0 0 14px 0;
    }

    .qava-legal-notice p {
      font-family: "Inter", sans-serif;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.55;
      color: #374151;
      margin: 0 0 12px 0;
      letter-spacing: 0.01em;
    }

    .qava-legal-notice p:last-child { margin-bottom: 0; }
"""


def build_page() -> str:
    shell = TERMS_SHELL.read_text(encoding="utf-8")
    shell = shell.replace("<title>Terms of Use | Qava</title>", "<title>User Agreement | Qava</title>")
    shell = shell.replace(
        "  </style>\n</head>",
        f"{EXTRA_STYLES}\n  </style>\n</head>",
        1,
    )

    body_start = shell.find('<div class="qava-legal-body">')
    body_end = shell.find("</div>\n    </div>\n  </main>")
    if body_start == -1 or body_end == -1:
        raise RuntimeError("Could not locate legal body in termsofuse shell")

    new_body = f'<div class="qava-legal-body">\n        {build_body()}\n      '
    shell = shell[:body_start] + new_body + shell[body_end + len("</div>") :]

    hero_start = shell.find('<div class="qava-legal-hero">')
    hero_end = shell.find("</div>\n      ", hero_start)
    shell = (
        shell[:hero_start]
        + '<div class="qava-legal-hero">\n'
        + '        <h1 class="qava-legal-title">User Agreement</h1>\n'
        + '        <p class="qava-legal-meta">Last Updated: September 2025</p>\n'
        + "      </div>\n      "
        + shell[hero_end + len("</div>\n      ") :]
    )

    return shell


if __name__ == "__main__":
    out = ROOT / "useragreement.html"
    out.write_text(build_page(), encoding="utf-8")
    print(f"Wrote {out}")
