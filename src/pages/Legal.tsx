import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Kicker } from '../components/ui';

type Section = { h: string; p: string[]; list?: string[]; after?: string };
type Doc = { title: string; heading: string; intro: string; sections: Section[] };

// Template privacy and USA PATRIOT Act notices. Have counsel review before launch.
const PRIVACY: Doc = {
  title: 'Privacy Policy',
  heading: 'Northstead Trust and Your Right to Financial Privacy',
  intro:
    'At Northstead Trust we have established policies and practices that respect the financial privacy of all individuals who use our trust company. We believe it is critical to comply with the laws and regulations designed to secure your financial privacy. Your relationship with us as our client is very important to us, and we want you to understand our policies and practices about handling your information.',
  sections: [
    { h: 'This Policy applies to you', p: ['This Policy applies to our relationships with individual clients who inquire about or obtain products or services from us for personal, family and household purposes.'] },
    {
      h: 'Strict security measures',
      p: ['We take the security of information very seriously. We have established security standards and procedures to prevent access to client information. We maintain physical, electronic and procedural safeguards to guard client information.'],
    },
    {
      h: 'Limited employee access',
      p: [
        'We have established procedures to limit employee access to information to only those employees with a business reason for accessing such information. We educate our employees about the importance of confidentiality and client privacy. We take appropriate disciplinary measures to enforce employee responsibilities regarding client information.',
      ],
    },
    {
      h: 'Why we collect information',
      p: ['We collect information about you to:'],
      list: [
        'accurately identify you;',
        'protect and administer your records, accounts and funds;',
        'help us design or improve our products and services;',
        'understand your financial needs;',
        'save you time when you apply for new products and services; offer you quality products and services; and comply with certain laws and regulations;',
      ],
    },
    {
      h: 'We collect information',
      p: ['We collect and maintain your personal information so that we can provide investment management and other services to you. The types and categories of information that we collect and maintain about you include:'],
      list: [
        'Information we receive from you to open an account or provide investment advice or other services to you (such as your home address, social security number, telephone, financial information and investment objectives).',
        'Information that we generate to service your account or from our transactions with you (such as account statements and other financial information).',
        'Information on your transactions with nonaffiliated third parties.',
      ],
      after: 'We have established procedures so that the financial information we collect is accurate, current and complete. We are committed to work with you to promptly correct any inaccurate information.',
    },
    {
      h: 'Our selective sharing of information',
      p: ['In order for us to provide investment management and other services to you, we do disclose your personal information in very limited instances, which include:'],
      list: [
        'Disclosures to nonaffiliated companies as permitted by law, including those who help us service your account (such as providing account information to brokers and custodians).',
        'Other limited disclosures as permitted by law, for example, required reports to government entities.',
      ],
      after: 'We do not share your information with third parties for marketing purposes. We do not sell your information.',
    },
    { h: 'Former clients', p: ['If you end your relationship with us, we will continue to adhere to the privacy policies and practices described in this notice.'] },
  ],
};

const PATRIOT: Doc = {
  title: 'USA PATRIOT Act',
  heading: 'Important Information About Procedures For Opening A New Account',
  intro:
    'To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify and record information that identifies each person who opens an account.',
  sections: [
    {
      h: 'What this means for you',
      p: [
        'When you open an account, we will ask for your name, address, date of birth and other information that will allow us to identify you. We may also ask to see your driver’s license or other identifying documents.',
        'We apologize for any inconvenience this may cause; however, federal law prohibits us from waiving these requirements.',
      ],
    },
  ],
};

export default function Legal({ kind }: { kind: 'privacy' | 'patriot' }) {
  const d = kind === 'privacy' ? PRIVACY : PATRIOT;
  return (
    <Page key={kind} title={d.title} description={d.intro.slice(0, 155)}>
      <div className="shell pb-[var(--section-y)] pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: d.title }]} />
        <div className="grid-12 mt-10 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <Kicker>Legal</Kicker>
              <h1 data-reveal="words" className="t-h1 mt-6">
                {d.title}
              </h1>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <h2 className="t-h3">{d.heading}</h2>
            <p className="t-lede mt-6">{d.intro}</p>
            <div className="mt-10 border-t border-line">
              {d.sections.map((s) => (
                <section key={s.h} className="border-b border-line py-8">
                  <h3 className="t-h4">{s.h}</h3>
                  {s.p.map((p) => (
                    <p key={p.slice(0, 24)} className="t-body mt-3">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="t-body mt-4 list-disc space-y-2 pl-5 marker:text-taupe">
                      {s.list.map((l) => (
                        <li key={l.slice(0, 24)}>{l}</li>
                      ))}
                    </ul>
                  )}
                  {s.after && <p className="t-body mt-4">{s.after}</p>}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
