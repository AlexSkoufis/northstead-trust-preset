import { Page } from '../components/Page';
import { ButtonLink, ArrowLink } from '../components/ui';

export default function NotFound() {
  return (
    <Page title="Page not found" description="This page could not be found.">
      <div className="shell flex min-h-[80svh] flex-col justify-center pb-24 pt-[calc(var(--header-h)+4rem)]">
        <p className="t-num text-[clamp(5rem,3rem+8vw,10rem)] leading-none text-oxblood">404</p>
        <h1 className="t-h1 mt-6 max-w-[18ch]">
          This page has moved on, <em className="italic-accent">but we haven&rsquo;t.</em>
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink to="/">Return home</ButtonLink>
          <ArrowLink to="/contact">Contact us</ArrowLink>
        </div>
      </div>
    </Page>
  );
}
