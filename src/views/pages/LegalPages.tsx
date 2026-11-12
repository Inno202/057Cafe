import type { ReactNode } from 'react';
import { useContent } from '../../content/ContentProvider';
import { BOOKING_RETENTION_DAYS } from '../../bookings/validate';
import { pathFor, type Route } from '../../router';
import { PageShell, type PageProps } from './PageShell';

export const LEGAL_UPDATED = '12 November 2026';

const LegalShell = ({ title, children, ...props }: PageProps & { title: string; children: ReactNode }) => (
  <PageShell {...props} page="inner" label={title}>
    <article className="wrap prose-legal max-w-3xl pt-28 pb-20">
      <h1 className="section-title">{title}</h1>
      <p className="mt-3">Last updated {LEGAL_UPDATED}</p>
      {children}
    </article>
  </PageShell>
);

const useLegal = (navigate: PageProps['navigate']) => {
  const { site, booking } = useContent();
  const page = (route: Route, label: string) => (
    <a href={pathFor(route)} onClick={(event) => { event.preventDefault(); navigate(route); }} className="link">{label}</a>
  );
  const contact = (
    <p>
      {site.fullName}, {site.street}, {site.city}, {site.postalCode}. Phone{' '}
      <a href={`tel:${site.phone}`} className="link">{site.phoneDisplay}</a>, email{' '}
      <a href={`mailto:${site.email}`} className="link">{site.email}</a>.
    </p>
  );
  return { site, booking, page, contact };
};

export const PrivacyPage = (props: PageProps) => {
  const { site, page, contact } = useLegal(props.navigate);
  return (
    <LegalShell {...props} title="Privacy Policy">
      <p className="mt-6">
        This policy explains what personal information {site.fullName} (“we”) collects through this website, why, and
        what you can do about it. It is written to meet the Protection of Personal Information Act (POPIA).
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Booking requests.</strong> When you send the booking form we store your name, phone number, the date
          and time you asked for, the number of guests, the event you chose and anything you write about your occasion.
        </li>
        <li>
          <strong>Staff accounts.</strong> Staff who sign in to manage the website are identified by their email address.
        </li>
        <li>
          <strong>Technical data.</strong> Like any website, the services that deliver this site receive your IP address
          and browser details when your browser requests a page. We do not use this to identify you.
        </li>
      </ul>
      <p>We do not use analytics, advertising or tracking tools, and we do not sell or rent your information.</p>

      <h2>Why we use it</h2>
      <p>
        We use booking details only to confirm, arrange or decline your booking and to contact you about it. We do not
        add you to a marketing list.
      </p>

      <h2>Who can see it</h2>
      <p>
        Only signed-in staff of {site.name} can read booking requests. Nobody else, including other visitors, can read
        them once they are sent.
      </p>
      <p>These service providers process data on our behalf:</p>
      <ul>
        <li><strong>Google Firebase</strong> stores the website content, booking requests and staff sign-in. Google may store this on servers outside South Africa.</li>
        <li><strong>GitHub Pages</strong> hosts the website files.</li>
        <li><strong>Unsplash</strong> serves some of the photographs.</li>
        <li><strong>Google Maps</strong> is loaded only if you choose “Show map”.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        We keep booking requests for no longer than {BOOKING_RETENTION_DAYS} days and delete them sooner once they
        are no longer needed. You can ask us to delete yours at any time.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask us what information we hold about you, ask us to correct or delete it, or object to how we use it.
        Contact us using the details below. If you are not satisfied you may complain to the Information Regulator
        (South Africa) at inforeg.org.za.
      </p>

      <h2>Cookies and storage</h2>
      <p>See our {page('cookies', 'Cookie Policy')}.</p>

      <h2>Contact</h2>
      {contact}
    </LegalShell>
  );
};

export const TermsPage = (props: PageProps) => {
  const { site, booking, page, contact } = useLegal(props.navigate);
  return (
    <LegalShell {...props} title="Terms of Use">
      <p className="mt-6">These terms apply to your use of the {site.fullName} website.</p>

      <h2>Menu and prices</h2>
      <p>
        The menu, prices, specials and event times on this website are shown for information and can change without
        notice. The menu and prices at the venue on the day apply. Nothing is sold or paid for through this website.
      </p>

      <h2>Bookings</h2>
      <p>
        Sending the booking form is a request, not a confirmed reservation. A booking is confirmed only once our team
        has contacted you to confirm it.
      </p>
      <ul>
        <li><strong>Private events and venue hire.</strong> {booking.privateNote}</li>
        <li><strong>Weekend tables.</strong> {booking.tableNote}</li>
      </ul>
      <p>Please give accurate contact details so that we can reach you, and tell us if your plans change.</p>

      <h2>Your information</h2>
      <p>How we handle booking details is set out in our {page('privacy', 'Privacy Policy')}.</p>

      <h2>Website content</h2>
      <p>
        We take care to keep this website accurate but provide it as is, and it may at times be unavailable or out of
        date. The {site.name} name and logo belong to us. Links to other websites are provided for convenience and we
        are not responsible for their content.
      </p>

      <h2>Law</h2>
      <p>These terms are governed by the laws of South Africa. Nothing in them limits your rights under the Consumer Protection Act.</p>

      <h2>Contact</h2>
      {contact}
    </LegalShell>
  );
};

export const CookiesPage = (props: PageProps) => {
  const { site, page, contact } = useLegal(props.navigate);
  return (
    <LegalShell {...props} title="Cookie Policy">
      <p className="mt-6">
        This website does not set advertising, analytics or tracking cookies. It uses a small amount of storage in your
        browser so that it works well, as described below.
      </p>

      <h2>Storage we use</h2>
      <ul>
        <li>
          <strong>Website content copy.</strong> Your browser keeps a copy of the menu, events and business details so
          the site opens quickly and still works on a poor connection. It holds no personal information.
        </li>
        <li>
          <strong>Staff sign-in.</strong> If you are a member of staff and sign in, Google Firebase keeps you signed in
          using storage in your browser. Visitors who do not sign in are not affected.
        </li>
      </ul>

      <h2>Other services</h2>
      <ul>
        <li>
          <strong>Google Maps.</strong> The map is not loaded until you choose “Show map”. If you do, Google may set its
          own cookies and receives your IP address.
        </li>
        <li>
          <strong>Spam protection.</strong> To protect the booking form from abuse we may use Google reCAPTCHA, which can
          set its own cookies.
        </li>
        <li><strong>Links.</strong> Facebook, Instagram and Google Maps directions open on their own websites, which have their own policies.</li>
      </ul>

      <h2>Your choices</h2>
      <p>
        You can clear or block cookies and site storage in your browser settings. The website will still show the menu
        and contact details, and you can always book by phone.
      </p>
      <p>More detail is in our {page('privacy', 'Privacy Policy')}.</p>

      <h2>Contact</h2>
      {contact}
    </LegalShell>
  );
};
