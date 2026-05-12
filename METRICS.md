# Metrics

## North Star metric

**Audits completed per week**

This is the right North Star for this stage because everything else flows from
it — leads captured, Credex consultations booked, and revenue are all
downstream of audits completed. An audit completed means a user got real value
from the product. DAU would be wrong here — this is a tool people use once
every few months when their stack changes, not daily.

## Three input metrics that drive the North Star

**1. Visitor to audit completion rate**
Target: >35%
Why it matters: measures whether the form is clear and trustworthy enough for
cold visitors to complete. If this drops below 20%, the form has a friction
problem.

**2. Shareable URL click-through rate**
Target: >15% of shared links result in a new audit
Why it matters: this is the viral loop. If shared links do not convert to new
audits, organic growth stalls and every new user requires active acquisition
effort.

**3. Email capture rate among audit completers**
Target: >20%
Why it matters: an audit without an email is an anonymous interaction — no
lead for Credex, no way to follow up, no retained user. This metric directly
drives the lead pipeline.

## What to instrument first

1. Audit completion event — fired when runAudit() returns results
2. Email capture event — fired when lead is saved to Supabase
3. Shareable URL visit event — fired when /audit/[id] page loads
4. Credex CTA click event — fired when "Book a free Credex consultation" is clicked

These four events give the full funnel: visitor → audit → lead → Credex intent.

## What number triggers a pivot decision

If email capture rate falls below 10% after 200 audits, the value proposition
is not landing — users are completing the audit but not trusting us with their
email. At that point, either the modal copy needs a full rewrite or the audit
results are not compelling enough to justify sharing contact details.

If the shareable URL click-through rate is below 5% after 50 shares, the
viral loop is broken. The shared page needs a stronger hook — better OG
preview image, more compelling headline, clearer CTA.