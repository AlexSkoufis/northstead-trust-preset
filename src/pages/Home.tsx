import { Page } from '../components/Page';
import { Opening } from '../sections/home/Opening';
import { Journey } from '../sections/home/Journey';
import { Disciplines } from '../sections/home/Disciplines';
import { Independence } from '../sections/home/Independence';
import { People } from '../sections/home/People';
import { Perspectives } from '../sections/home/Perspectives';
import { Conversation } from '../sections/home/Conversation';

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Northstead Trust',
  url: 'https://northstead.example/',
  telephone: '+1-000-000-0000',
  email: 'hello@northstead.example',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '700 Lakefront Plaza, Suite 1800',
    addressLocality: 'Milwaukee',
    addressRegion: 'WI',
    postalCode: '53202',
    addressCountry: 'US',
  },
};

export default function Home() {
  return (
    <Page
      title=""
      description="Northstead Trust is an independent trust company in Milwaukee, Wisconsin, providing investment management, trustee services, wealth planning and family office services."
    >
      <script type="application/ld+json">{JSON.stringify(ORG)}</script>
      <Opening />
      <Journey />
      <Disciplines />
      <Independence />
      <People />
      <Perspectives />
      <Conversation />
    </Page>
  );
}
