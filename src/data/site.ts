// Demo content for a fictional independent trust company. Every name, figure,
// address and story is invented; replace it all before launch.

export const CONTACT = {
  phone: '000.000.0000',
  phoneHref: 'tel:+10000000000',
  fax: '000.000.0001',
  email: 'hello@northstead.example',
  careersEmail: 'careers@northstead.example',
  street: '700 Lakefront Plaza, Suite 1800',
  city: 'Milwaukee, WI 53202',
  mapHref: '#',
  clientLogin: '#',
  linkedin: '#',
  original: '#',
};

export const ABOUT_LINE =
  'Northstead Trust is a Milwaukee based wealth management and trust company that helps families across the United States with specialised, tailored financial planning and wealth management.';

export const MISSION =
  'Our mission is to help families build what lasts, with trusted advice that takes the weight and worry out of financial decisions.';

export type ServiceSlug = 'investment-management' | 'trustee-services' | 'wealth-planning' | 'family-office';

export type Service = {
  slug: ServiceSlug;
  n: string;
  name: string;
  /** concept headline */
  line: string;
  summary: string;
  image: string;
  imagePosition?: string;
  brochure?: string;
  people: string[];
  audiences: AudienceSlug[];
};

export const FAMILY_OFFICE_SERVICES = [
  'Bill Payment Services',
  'Comprehensive Client Reporting',
  'Strategic Tax Consulting',
  'Cash Management',
  'Generational Education',
  'Philanthropic Services',
  'Real Estate Services',
  'Coordinated Investment Management',
  'Financial Planning',
  'Fiduciary and Custodian Services',
];

export const SERVICES: Service[] = [
  {
    slug: 'investment-management',
    n: '01',
    name: 'Investment Management',
    line: 'A disciplined, thoughtful approach to growing what you have built.',
    summary:
      'We help you grow your legacy using a disciplined, thoughtful approach that emphasizes transparency, tax efficiency and simplicity. You can rely on us to construct a strategic, long-term asset allocation plan based on your unique goals instead of engaging in market timing or costly tactical shifts. We build sophisticated portfolios by investing in high-quality businesses across the globe.',
    image: 'photo/team-desk',
    imagePosition: '46% 50%',
    brochure: '#',
    people: ['thomas-reinholt', 'owen-castillo', 'rebecca-tran', 'marcus-delaney'],
    audiences: ['business-owners', 'corporate-executives', 'retirees', 'multi-generational-families', 'foundations-endowments'],
  },
  {
    slug: 'trustee-services',
    n: '02',
    name: 'Trustee Services',
    line: 'Stewardship that protects your family long after the documents are signed.',
    summary:
      'We help you manage your wealth and secure your legacy for future generations. Our experienced Wealth Advisors work seamlessly with your estate planning attorney and other advisors to minimize taxes and fees, and ensure your assets are protected and able to provide for your family.',
    image: 'photo/careers',
    imagePosition: '62% 50%',
    brochure: '#',
    people: ['james-whitcombe', 'claire-ashdown', 'samuel-okoye'],
    audiences: ['business-owners', 'multi-generational-families', 'special-needs-families'],
  },
  {
    slug: 'wealth-planning',
    n: '03',
    name: 'Wealth Planning',
    line: 'In matters of wealth, details matter.',
    summary:
      'In matters of wealth, details matter. Your personal income and tax-planning needs are different from the next client. We turn your unique variables into a personal Wealth Plan with a strategy we’re confident will deliver repeatable outcomes.',
    image: 'photo/wealth-planning',
    imagePosition: '50% 60%',
    brochure: '#',
    people: ['marcus-delaney', 'hannah-lindqvist'],
    audiences: ['corporate-executives', 'retirees', 'multi-generational-families'],
  },
  {
    slug: 'family-office',
    n: '04',
    name: 'Family Office',
    line: 'When family wealth meets the family dynamic.',
    summary:
      'When family wealth meets the family dynamic, you need specialized support services. A family office can do more than just unify your financial affairs. From coordinating your business, real estate, insurance, legal and financial teams to building financial fluency and philanthropic values across generations, we can help you ensure a meaningful and lasting legacy.',
    image: 'photo/lake-sunset',
    imagePosition: '62% 40%',
    people: ['james-whitcombe'],
    audiences: ['business-owners', 'multi-generational-families'],
  },
];

export type AudienceSlug =
  | 'business-owners'
  | 'corporate-executives'
  | 'retirees'
  | 'multi-generational-families'
  | 'special-needs-families'
  | 'foundations-endowments';

export type Audience = {
  slug: AudienceSlug;
  n: string;
  name: string;
  /** concept: a short question that opens the chapter */
  prompt: string;
  body: string;
  image: string;
  imagePosition?: string;
  alt: string;
  services: ServiceSlug[];
  insights: string[];
};

export const AUDIENCES: Audience[] = [
  {
    slug: 'business-owners',
    n: '01',
    name: 'Business Owners',
    prompt: 'You built something. Now make it work for you.',
    body:
      'You have worked hard. Now how can you make all of that work hard to support you and the rest of your aspirations? For many, a closely-held business functions as their primary source of wealth. At Northstead Trust, we can partner with you prior to and during a business transition or sale. Through the process, we’ll provide what’s needed, including investment services, trust counsel, even Family Office services.',
    image: 'photo/studio-walk',
    imagePosition: '48% 50%',
    alt: 'A small team working around a table in a bright office with tall windows.',
    services: ['investment-management', 'trustee-services', 'family-office'],
    insights: ['when-the-money-arrives-all-at-once', 'funding-your-trust'],
  },
  {
    slug: 'corporate-executives',
    n: '02',
    name: 'Corporate Executives',
    prompt: 'You already have a full-time job.',
    body:
      'Managing wealth is a full-time job. And since you already have one of those, we’re here to lessen the burden of time and stress. Our team is comprised of bright minds that understand corporate compensation packages, from 401K and pension plans to corporate stock, stock options and other deferred compensation, and can advise on tax-efficient transitions as you near retirement.',
    image: 'photo/executive',
    imagePosition: '42% 30%',
    alt: 'A smiling professional woman in a striped jacket standing in a glass-walled office.',
    services: ['wealth-planning', 'investment-management'],
    insights: ['when-the-money-arrives-all-at-once', 'bonds-are-back'],
  },
  {
    slug: 'retirees',
    n: '03',
    name: 'Retirees',
    prompt: 'After a successful career, what comes next?',
    body:
      'After a successful career comes retirement. But what comes after that? If you’re already retired, Northstead Trust can help solidify your generational wealth transfer strategies and actively manage the risk in your portfolio through wealth and investment management, estate planning, insurance needs for medical care and other support services.',
    image: 'photo/lake-sunset',
    imagePosition: '62% 45%',
    alt: 'Glasses of wine on a terrace table at sunset, looking out over the sea.',
    services: ['wealth-planning', 'investment-management'],
    insights: ['bonds-are-back', 'the-estate-documents-that-matter-most'],
  },
  {
    slug: 'multi-generational-families',
    n: '04',
    name: 'Multi-Generational Families',
    prompt: 'Wealth that lasts beyond one lifetime.',
    body:
      'Your wealth has the potential to build over generations. Our team works with you and your children to ensure your wealth lasts, through our investment management, insurance counsel, trust administration and philanthropic planning services. For some families, utilizing our specialized Family Office services provides an additional level of planning and control.',
    image: 'photo/family-table',
    imagePosition: '45% 60%',
    alt: 'A long table set for dinner outdoors in warm evening light.',
    services: ['family-office', 'trustee-services', 'investment-management'],
    insights: ['donor-advised-funds-a-flexible-way-to-give', 'funding-your-trust'],
  },
  {
    slug: 'special-needs-families',
    n: '05',
    name: 'Special Needs Families',
    prompt: 'Care, expertise, and a relationship close to home.',
    body:
      'We understand the complexity and delicacy of administering a special needs trust, not only through expertise, but also through personal experience. Our team takes care to assess the requirements, resources and desires of the beneficiary. We do this locally, knowing a close relationship with the family is imperative to meeting each member’s long-term needs.',
    image: 'photo/advisor-meeting',
    imagePosition: '58% 40%',
    alt: 'Hands signing a document at a desk.',
    services: ['trustee-services', 'wealth-planning'],
    insights: ['funding-your-trust', 'the-estate-documents-that-matter-most'],
  },
  {
    slug: 'foundations-endowments',
    n: '06',
    name: 'Foundations & Endowments',
    prompt: 'Serving today’s mission while building for tomorrow’s.',
    body:
      'Foundations and Endowments must balance the dual obligations to accumulate a pool of assets sufficient to build capital for future use while also providing a sufficient cash flow to support current needs. At Northstead Trust, we have extensive experience working alongside organizations in pursuit of this goal. As this balancing act has grown more challenging in recent years due to the low return environment, we believe that it is critical to apply a disciplined approach to develop a strategic investment plan that will put our Foundation clients in the best position to reach their goals without taking on unnecessary risk.',
    image: 'photo/boardroom',
    imagePosition: '60% 55%',
    alt: 'An empty boardroom with a long wooden table and a city view.',
    services: ['investment-management'],
    insights: ['donor-advised-funds-a-flexible-way-to-give', '2026-market-and-economic-outlook'],
  },
];

/** The Northstead Difference page content. */
export const DIFFERENCE = {
  headline: 'At Northstead Trust, we concentrate on three things: you, your family and the generations that follow.',
  intro: 'Each family is unique and your wealth management strategy should be too.',
  independence:
    'That’s why we remain an entirely independent trust-only bank. This independence gives us the ability to build programs and seize opportunities that are tailored to you and your family’s unique, personal situations.',
  pillars: [
    {
      title: 'The team you can trust.',
      body:
        'We don’t have a B team; every member is an experienced and proven contributor. Our people have earned the industry’s most prestigious certifications and designations, from Certified Financial Planners and Chartered Financial Analysts to JDs and MBAs, and they all come together to provide the best and most robust wealth management services the industry has to offer.',
    },
    {
      title: 'We’re built on independence.',
      body:
        'We recognize that there are no one-size-fits-all solutions when it comes to wealth planning, and we personalize our offerings and recommendations based on a client’s unique goals and objectives. Our independence allows our experienced advisors to provide fast and convenient decisions.',
    },
    {
      title: 'Integrity is the essential foundation of Northstead Trust.',
      body:
        'We do what’s right, and we do it to the highest standards of excellence and transparency. Every decision we make is weighed against the measure of integrity. Northstead Trust adheres to stringent capital adequacy standards and is guided by a highly distinguished Board of Directors who provide oversight and governance on a local level.',
    },
  ],
  story: [
    'Helen Marsh and David Okonkwo founded Northstead Trust in 2004 with a simple idea: families deserve the depth of a large trust department and the attention of a firm that knows them by name.',
    'For Helen and David, close client relationships were both the reward of the work and the way to do it well. Whether a family needed help managing wealth, protecting it for the next generation or administering a difficult trust, the answer started with listening.',
    'They also wanted the firm to stay independent. So they chartered Northstead as a trust company, held to the highest standards of fiduciary duty and governed by a local board of directors. To this day the management team and board live and work in the region, so decisions are made here, not handed down from elsewhere.',
    'Those founding principles still guide us. Every relationship matters, because helping you build something that lasts is how we build our own.',
  ],
  anniversary:
    'Twenty years on, Northstead has grown from five founding members to a full team of advisors, portfolio managers and trust officers, with the same commitment to personal service.',
  bestAndBrightest:
    'We are proud to be recognised as a great place to work, with people who stay for decades and a culture built around clients and colleagues alike.',
};

export const SERVICES_INTRO =
  'We manage investments, administer trusts, and provide wealth management strategies designed to benefit families for generations. Our group is comprised of an unmatched combination of experts in wealth planning, investment management, trust services, and family office. And, we’re all right here, under one roof.';

export type NavItem = { label: string; to: string; children?: { label: string; to: string; note?: string }[] };

export const NAV: NavItem[] = [
  {
    label: 'About',
    to: '/about/the-northstead-difference',
    children: [
      { label: 'The Northstead Difference', to: '/about/the-northstead-difference', note: 'Independent by design' },
      { label: 'Our Team', to: '/about/our-team', note: 'The people behind the promise' },
      { label: 'Board of Directors', to: '/about/board-of-directors', note: 'Local oversight and governance' },
      { label: 'Careers', to: '/about/careers', note: 'Build a career with us' },
    ],
  },
  {
    label: 'Services',
    to: '/services',
    children: [
      { label: 'All Services', to: '/services', note: 'Four disciplines, one relationship' },
      ...SERVICES.map((s) => ({ label: s.name, to: `/services/${s.slug}` })),
    ],
  },
  {
    label: 'Who We Serve',
    to: '/who-we-serve',
    children: AUDIENCES.map((a) => ({ label: a.name, to: `/who-we-serve/${a.slug}` })),
  },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
];

export const AUTHORS: Record<string, string> = {
  'when-the-money-arrives-all-at-once': 'Marcus Delaney, CFP®',
  'funding-your-trust': 'Claire Ashdown and Hannah Lindqvist',
  'the-estate-documents-that-matter-most': 'Claire Ashdown, JD',
  '2026-market-and-economic-outlook': 'Thomas Reinholt and Owen Castillo',
  'bonds-are-back': 'Owen Castillo, CFA',
  'donor-advised-funds-a-flexible-way-to-give': 'Hannah Lindqvist, CFP®',
};
