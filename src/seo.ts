import type { SiteContent } from './content/types';

/** Search-engine data for the business, built from the same content as the pages. */
export function businessJsonLd(content: SiteContent) {
  const { site, home } = content;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: site.fullName,
    image: home.heroDay.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      addressLocality: site.city,
      addressRegion: site.province,
      postalCode: site.postalCode,
      addressCountry: 'ZA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -27.9702, longitude: 26.7461 },
    url: 'https://057cafe.co.za',
    telephone: site.phone,
    email: site.email,
    servesCuisine: 'African, Grill, South African',
    openingHoursSpecification: site.hours.map((row) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: row.days,
      opens: row.opens,
      closes: row.closes,
    })),
    menu: 'https://057cafe.co.za/#menu',
    priceRange: '$$',
  };
}

/** JSON for a <script> block: "<" is escaped so content can never close the tag. */
export const jsonForScript = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
