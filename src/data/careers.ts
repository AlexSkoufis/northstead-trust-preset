// Demo job listings for a fictional trust company. Replace with real openings.

export type Job = {
  id: string;
  title: string;
  status: string;
  hours: string;
  location: string;
  summary: string[];
  sections: { heading: string; items: string[] }[];
  closing?: string;
};

export const CAREERS_INTRO =
  'We are proud of a team where people stay for decades. Our mission is to help families build what lasts, with trusted advice that takes the weight and worry out of financial decisions, and we look for colleagues who share that philosophy.';

export const BENEFITS =
  'Northstead Trust offers an active, entrepreneurial environment focused on our clients, our colleagues and our community. Our compensation and benefits include health, dental, disability and life insurance, a 401(k) plan with company match, generous paid leave and support for professional certifications.';

export const EEO =
  'Northstead Trust provides equal employment opportunities to all employees and applicants and prohibits discrimination and harassment of any type without regard to race, color, religion, age, sex, national origin, disability status, genetics, protected veteran status, sexual orientation, gender identity or expression, or any other characteristic protected by federal, state or local laws.';

export const JOBS: Job[] = [
  {
    id: 'wealth-advisor',
    title: 'Wealth Advisor',
    status: 'Exempt',
    hours: '8:30 am to 5:00 pm',
    location: 'Milwaukee, WI',
    summary: [
      'Northstead Trust is looking for an experienced Wealth Advisor to serve as the primary advisor for a group of high net worth families.',
      'You will build wealth plans that cover retirement, risk management, tax, asset allocation and wealth transfer, and coordinate a team of specialists to deliver them.',
    ],
    sections: [
      {
        heading: 'What you will do',
        items: [
          'Lead comprehensive planning conversations and turn them into clear, written recommendations.',
          'Coordinate portfolio managers, trust officers and clients’ outside advisors.',
          'Review each relationship on a regular schedule and keep plans current as lives change.',
          'Grow the practice through referrals from clients, attorneys and accountants.',
        ],
      },
      {
        heading: 'What you bring',
        items: [
          'Five or more years advising high net worth clients.',
          'CFP®, CTFA, CPA, JD or a comparable credential, or actively pursuing one.',
          'A working knowledge of income, gift, estate and fiduciary tax.',
          'Clear writing, patient listening and sound judgement.',
        ],
      },
    ],
    closing: 'To apply, send a resume and a short note about why the role interests you.',
  },
  {
    id: 'trust-associate',
    title: 'Trust Associate',
    status: 'Non-exempt',
    hours: '8:30 am to 5:00 pm',
    location: 'Milwaukee, WI',
    summary: [
      'We are hiring a Trust Associate to support our trust officers in administering personal, family and charitable trusts.',
    ],
    sections: [
      {
        heading: 'What you will do',
        items: [
          'Process distributions, deposits and account changes accurately and on time.',
          'Prepare account reviews and help onboard new trusts.',
          'Respond to beneficiary questions with care and discretion.',
        ],
      },
      {
        heading: 'What you bring',
        items: [
          'Two or more years in trust, banking or financial services operations.',
          'Strong attention to detail and comfort with spreadsheets.',
          'Interest in growing toward a trust officer role.',
        ],
      },
    ],
    closing: 'To apply, send a resume and a short note about why the role interests you.',
  },
];
