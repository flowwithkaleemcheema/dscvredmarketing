/**
 * Everything you'll want to change before launch lives here.
 * Values wrapped in [square brackets] are placeholders. Replace them with real details.
 * The build prints a warning for every placeholder that is still present.
 */
export const site = {
  name: 'Dscvred Marketing',
  url: 'https://dscvredmarketing.com', // [your domain]
  email: '[hello@yourdomain.com]',

  offer: {
    name: 'The Booked-Out Remodeler System',
    guaranteeCount: 20,
    guaranteeDays: 90,
    launchDays: 14,
    minBudget: 30000, // default minimum homeowner budget for a "qualified" consultation
    minAdSpend: 3000,
  },

  // Founding Partner program. Keep this honest: update as spots are taken.
  founding: {
    totalSpots: 3,
    spotsLeft: 3,
  },

  // Markets already claimed by a client (one remodeler per market).
  // Matching is a simple case-insensitive "contains" on the service area someone types.
  // e.g. ['Plano', 'Frisco', 'Austin']
  claimedMarkets: [] as string[],

  integrations: {
    // Google Apps Script web app URL (see integrations/google-apps-script/README.md)
    formEndpoint: '',
    // Cal.com event link, e.g. 'your-name/pipeline-audit'
    calLink: '',
    // Your Cal.com brand colour (matches the site)
    calBrandColor: '#14302a',
  },

  tracking: {
    ga4Id: '', // e.g. 'G-XXXXXXXXXX'
    metaPixelId: '', // e.g. '123456789012345'
  },

  founder: {
    name: '[Your Name]',
    title: 'Founder, Dscvred Marketing',
    photo: '', // e.g. '/images/founder.jpg' (put the file in site/public/images/)
    initials: '[YN]',
    yearsExperience: '[X]',
  },

  // Results from other industries. Only ever use real, verifiable numbers.
  results: [
    { value: '[X]%', label: 'lower cost per lead', context: '[Industry] client, [timeframe]' },
    { value: '[X]×', label: 'more booked appointments', context: '[Industry] client, [timeframe]' },
    { value: '$[X]', label: 'in tracked client revenue', context: 'across [N] clients' },
  ],
};

export type Site = typeof site;
