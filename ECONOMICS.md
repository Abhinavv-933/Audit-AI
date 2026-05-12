# Economics

## What a converted lead is worth to Credex

Credex sells discounted AI credits at 20–40% below retail. A startup spending
$500/mo on AI tools that switches to Credex credits saves ~$150/mo. Credex
captures a margin on the discount arbitrage.

Assumptions:
- Average credit purchase: $2,000 (a startup buying 4 months of AI credits upfront)
- Credex margin on credits: ~15%
- Revenue per converted customer: $300
- If customer renews every 4 months: $900/year LTV

Conservative estimate: **$300 per converted customer, $900 LTV over 12 months**

## CAC at each channel

| Channel | Effort | Estimated CAC |
|---------|--------|---------------|
| Warm network DMs | 2 hours | $0 |
| Reddit posts | 1 hour per post | $0 |
| Hacker News Show HN | 2 hours | $0 |
| Content marketing | 4 hours per post | $0 |
| Credex vendor co-marketing | Partnership | $0 |

All channels in the GTM plan are zero paid budget. CAC is measured in time, not
money. At a founder's time value of $100/hour, acquiring 100 users across 4
weeks at ~20 hours of effort = $2,000 in time cost = $20 CAC per user.

## Conversion funnel math

Assumptions based on similar B2B lead-gen tools:

| Stage | Rate | Numbers |
|-------|------|---------|
| Visitors who complete the audit | 40% | 1000 visitors → 400 audits |
| Audit completers who enter email | 25% | 400 audits → 100 leads |
| Leads with >$200/mo savings | 30% | 100 leads → 30 high-value leads |
| High-value leads who book Credex consult | 20% | 30 leads → 6 consultations |
| Consultations that convert to purchase | 50% | 6 consults → 3 customers |

**Blended conversion: 0.3% of visitors become paying Credex customers**

At $300 revenue per customer: 1000 visitors = $900 revenue

## What makes this profitable

The tool itself costs near zero to run:
- Vercel hosting: free tier
- Supabase: free tier (up to 50,000 rows)
- Anthropic API: ~$0.002 per summary (negligible)
- Resend email: free tier (100 emails/day)

Total infrastructure cost at 1,000 audits/month: under $5

Profit margin is essentially 100% on the tool itself. The only cost is the
time to acquire users and follow up on leads.

## What would have to be true to drive $1M ARR in 18 months

$1M ARR = ~$83,000/month in revenue
At $900 LTV per customer: need ~1,100 active customers
At 0.3% visitor-to-customer conversion: need ~370,000 total visitors over 18 months
= ~20,000 visitors per month

That is achievable through:
- A viral coefficient > 1 on the shareable URLs (each audit shared reaches 5+
  new potential users)
- One Hacker News front page appearance (~50,000 visitors in 24 hours)
- SEO on "AI tool cost" and "AI spend audit" queries building over 6–12 months
- Credex vendor partnerships driving referral traffic

The math works if the shareable URL feature drives organic growth. Every
shared audit is a free impression to exactly the right audience — founders
and engineers who pay for AI tools.

## Key risk

The biggest risk is low email capture rate. If fewer than 15% of audit
completers enter their email, the lead pipeline dries up regardless of
traffic volume. The modal timing (shown after 3 seconds, after value is
demonstrated) and the copy ("We found $X/mo — enter your email to save
this audit") are designed to maximize this rate. A/B testing the modal
copy is the first optimization to run after launch.