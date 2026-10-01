export type Step =
  | { id: string; kind: 'text'; title: string; sub?: string; placeholder: string; autocomplete?: string }
  | { id: string; kind: 'single' | 'multi'; title: string; sub?: string; options: { value: string; label: string; hint?: string }[] }
  | { id: 'contact'; kind: 'contact'; title: string; sub?: string };

export const steps: Step[] = [
  {
    id: 'area',
    kind: 'text',
    title: 'Where’s your main service area?',
    sub: 'City and state, or the metro you cover.',
    placeholder: 'e.g. Plano, TX',
    autocomplete: 'address-level2',
  },
  {
    id: 'projects',
    kind: 'multi',
    title: 'What kind of projects do you mainly do?',
    sub: 'Pick all that apply.',
    options: [
      { value: 'kitchens', label: 'Kitchens' },
      { value: 'bathrooms', label: 'Bathrooms' },
      { value: 'whole_home', label: 'Whole-home remodels' },
      { value: 'basements', label: 'Basements' },
      { value: 'additions', label: 'Additions' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'project_size',
    kind: 'single',
    title: 'What’s your average project size?',
    options: [
      { value: 'under_25k', label: 'Under $25k' },
      { value: '25k_50k', label: '$25k – $50k' },
      { value: '50k_100k', label: '$50k – $100k' },
      { value: '100k_plus', label: '$100k+' },
    ],
  },
  {
    id: 'revenue',
    kind: 'single',
    title: 'Roughly what did you do in revenue last year?',
    sub: 'Ballpark is fine. This stays between us.',
    options: [
      { value: 'under_1m', label: 'Under $1M' },
      { value: '1m_3m', label: '$1M – $3M' },
      { value: '3m_5m', label: '$3M – $5M' },
      { value: '5m_plus', label: '$5M+' },
    ],
  },
  {
    id: 'lead_sources',
    kind: 'multi',
    title: 'Where do most of your jobs come from today?',
    sub: 'Pick all that apply.',
    options: [
      { value: 'referrals', label: 'Referrals & word of mouth' },
      { value: 'angi_homeadvisor', label: 'Angi / HomeAdvisor' },
      { value: 'houzz', label: 'Houzz' },
      { value: 'thumbtack_porch', label: 'Thumbtack / Porch' },
      { value: 'paid_ads', label: 'Google or Facebook ads' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'ad_budget',
    kind: 'single',
    title: 'How much could you invest in ads each month?',
    sub: 'Paid directly to Google & Meta, separate from our fee.',
    options: [
      { value: 'under_3k', label: 'Under $3,000' },
      { value: '3k_5k', label: '$3,000 – $5,000' },
      { value: '5k_10k', label: '$5,000 – $10,000' },
      { value: '10k_plus', label: '$10,000+' },
    ],
  },
  {
    id: 'capacity',
    kind: 'single',
    title: 'How many more projects a month could you take on?',
    options: [
      { value: '1', label: '1 more' },
      { value: '2_3', label: '2 – 3 more' },
      { value: '4_plus', label: '4 or more' },
      { value: 'not_sure', label: 'Not sure yet' },
    ],
  },
  {
    id: 'contact',
    kind: 'contact',
    title: 'Last step. Where can we reach you?',
    sub: 'We’ll use this to confirm your market and send your audit details.',
  },
];
