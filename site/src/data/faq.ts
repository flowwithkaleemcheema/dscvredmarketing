import { site } from '../config/site';
const { guaranteeCount: n, guaranteeDays: d, minAdSpend } = site.offer;

export const faq: { q: string; a: string }[] = [
  {
    q: 'I’ve been burned by agencies before. Why is this different?',
    a: `Three things. We report signed projects, not clicks. We work with one remodeler per market, so we’re never splitting our attention with your competitor. And there’s a guarantee: ${n} qualified consultations in ${d} days, or we keep working without a management fee until you get them.`,
  },
  {
    q: 'We already get plenty of referrals. Why do we need this?',
    a: 'Referrals are the best leads you’ll ever get, and you can’t turn them up when the schedule thins out. We build a second stream you control, so referrals become a bonus instead of the whole plan.',
  },
  {
    q: 'We’re busy right now. Shouldn’t we wait?',
    a: 'Remodeling pipelines run 60–120 days from first click to start date. The consultations we book this month are next quarter’s projects. The best time to build the pipeline is while you’re busy, not once the calendar goes quiet.',
  },
  {
    q: 'Are these leads shared with other contractors?',
    a: 'Never. The ads run under your brand, the homeowners contact you, and nobody else gets their details. That’s the whole point.',
  },
  {
    q: 'How do you keep out price shoppers and tire-kickers?',
    a: 'At three levels: the keywords we bid on (and the ones we block), the qualifying questions on your funnel (project type, budget, timeline), and the definition of “qualified” we agree with you before launch. Homeowners below your budget minimum don’t count toward the guarantee.',
  },
  {
    q: 'What does it cost?',
    a: `A flat monthly management fee, a small bonus only when you sign a $40k+ project from one of our consultations, and your ad budget (minimum $${minAdSpend.toLocaleString('en-US')}/month) paid directly to Google and Meta. Founding partners pay no setup fee. We’ll show you exact numbers on your audit call, measured against your own project values.`,
  },
  {
    q: 'Do I own the ad accounts and the data?',
    a: 'Yes. The ad accounts, the leads, the tracking and the reviews are all yours. If we ever part ways, everything stays with you.',
  },
  {
    q: 'What’s the contract?',
    a: `A ${d}-day initial term, matching the guarantee window. After that it’s month-to-month with 30 days’ notice. No long lock-in.`,
  },
  {
    q: 'How much of my time does this take?',
    a: 'A 60-minute kickoff call and a few quick approvals in the first two weeks. After that: answer the lead alerts, show up to your consultations, and join a 30-minute strategy call once a month.',
  },
  {
    q: 'You don’t have remodeling case studies. Why should I trust you?',
    a: 'Fair question. Our founder has 10+ years in growth marketing, including taking a high-ticket cosmetic clinic in Dubai from 150 to 1,500 leads a month. We’re upfront that remodeling is new for us. That’s why the risk sits with us: the guarantee, no setup fee for founding partners, and no long contract.',
  },
  {
    q: 'What happens on the Pipeline Audit call?',
    a: 'Thirty minutes, no pressure. We show you how many homeowners in your area search for remodels each month, which competitors are advertising and what they’re saying, where your current leads are leaking, and a projected plan for your budget. If it’s a fit, we’ll tell you how we’d work together. If not, you keep the audit.',
  },
  {
    q: 'Do you work outside the US?',
    a: 'We’re launching in the US first, with Australia and the UK next. If you’re there, check your market anyway; we’ll let you know when founding spots open.',
  },
];
