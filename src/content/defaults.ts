import type { SiteContent } from './types';

const img = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}&h=${h}`;

/**
 * Built-in content. The public site shows this whenever the content store is
 * empty, unreachable, or returns something that fails validation.
 * Text wrapped in *asterisks* is emphasised (accent colour in headings, bold in text).
 */
export const DEFAULT_CONTENT: SiteContent = {
  site: {
    name: '057 Cafè',
    tagline: 'Grill & Lounge',
    fullName: '057 Cafè Grill & Lounge',
    footerName: '057 Cafe & Lounge',
    footerBlurb: 'The heart of Welkom’s social scene. Morning meetings, afternoon meals, and late-night memories.',
    street: '368 Stateway, Doorn',
    city: 'Welkom',
    province: 'Free State',
    postalCode: '9459',
    phone: '+27722230708',
    phoneDisplay: '+27 72 223 0708',
    email: 'bookings@057cafe.co.za',
    hours: [
      { id: 'mon-thu', label: 'Mon-Thu', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '10:00', closes: '22:00' },
      { id: 'fri-sat', label: 'Fri-Sat', days: ['Friday', 'Saturday'], opens: '10:00', closes: '02:00' },
      { id: 'sun', label: 'Sun', days: ['Sunday'], opens: '11:00', closes: '20:00' },
    ],
    contactTitle: 'VISIT THE 057',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=057+Caf%C3%A9+Grill+and+Lounge,+368+Stateway,+Doorn,+Welkom,+9459',
    mapEmbedUrl:
      'https://maps.google.com/maps?q=057%20Caf%C3%A9%20Grill%20and%20Lounge,%20368%20Stateway,%20Doorn,%20Welkom,%209459&t=&z=15&ie=UTF8&iwloc=&output=embed',
    facebookUrl: 'https://www.facebook.com/p/057Caf%C3%A8-61564211750260/',
    instagramUrl: '',
    socialHeading: 'Connect with the Culture',
    socialText: 'Follow us on social media for daily specials and event announcements.',
  },
  home: {
    heroDay: {
      heading: 'AUTHENTIC *GRILL* VIBES.',
      text: 'Experience the authentic taste of Mzansi with our slow-cooked African cuisines and signature grilled meats.',
      image: img('photo-1554118811-1e0d58224f24', 1920, 1080),
      imageAlt: 'Cafe interior',
    },
    heroNight: {
      heading: 'ELITE *LOUNGE* LUXURY.',
      text: 'Stateway’s premier destination for sophisticated nights, chilled vibes, and premium cocktails.',
      image: img('photo-1514362545857-3bc16c4c7d1b', 1920, 1080),
      imageAlt: 'Lounge bar at night',
    },
    aboutHeading: 'THE HEART OF *STATEWAY.* BY THE 057.',
    aboutText1:
      'Named after our local area code, *057 Cafè Grill & Lounge* is deep-rooted in Welkom culture. We aren’t just a place to eat; we are a lifestyle destination where the fire of the grill meets the chill of the lounge.',
    aboutText2:
      'From our famous “Recovery Ka Mogodu” on Mondays to our “Babalas BlowOut” Sundays, we provide an authentic Mzansi experience that evolves from a vibrant day-spot to a sophisticated night lounge.',
    pillars: [
      { id: 'grill', title: 'Grill', text: 'Traditional Cuisines' },
      { id: 'lounge', title: 'Lounge', text: 'Elite Lifestyle' },
    ],
    aboutImage: img('photo-1555939594-58d7cb561ad1', 800, 800),
    aboutImageAlt: 'Premium grilled meats',
    aboutQuote: 'Welkom’s ultimate grill experience.',
  },
  menu: {
    title: 'THE TASTE OF 057',
    items: [
      { id: 'mogodu-mon', name: 'Recovery Ka Mogodu (Mon)', price: 'R70', description: 'Slow-cooked Mala Mohodu served with pap and fresh salsa.', category: 'african' },
      { id: 'lamb-curry-tue', name: 'Lamb Curry Tuesday', price: 'R120', description: 'Hearty lamb curry served with spinach and your choice of samp or pap.', category: 'african' },
      { id: 'chicken-mix-wed', name: 'Chicken Mix Wednesday', price: 'R60', description: 'Mixed chicken portions served with pap, spinach, and chakalaka.', category: 'african' },
      { id: 'wings-thu', name: 'Wings Thursday Special', price: 'R100', description: 'Flame-grilled succulent wings served with creamy potato salad.', category: 'lunch' },
      { id: 'mohodu-fri', name: 'Mala Mohodu Friday', price: 'Contact us', description: 'Chef’s special tripe served with dombolo, spinach, and chakalaka.', category: 'african' },
      { id: 'hardbody-sun', name: 'Hardbody Chicken (Sun)', price: 'R90', description: 'Traditional hardbody chicken dish, slow-cooked to perfection.', category: 'african' },
      { id: 'babalas-sun', name: 'Babalas BlowOut (Sun)', price: 'R60', description: 'The ultimate hangover cure served with pap and a cool drink.', category: 'african' },
      { id: 'signature-wings', name: '057 Signature Wings', price: 'R110', description: 'A full portion of our famous Mzansi-style grilled wings.', category: 'lunch' },
      { id: 'cocktails', name: 'Cocktail Selection', price: 'From R65', description: 'Expertly crafted cocktails for the ultimate lounge experience.', category: 'drinks' },
      { id: 'mimosa', name: 'Mimosa Special (Fri-Sun)', price: 'R200', description: 'Bottomless Mimosas between 13:00 and 17:00.', category: 'drinks' },
    ],
    barNote:
      '*Full Bar Available:* We offer a wide range of beverages including crisp ciders, local & international beers, artisanal cocktails, fine wines, and premium bottle service.',
    pdfUrl: '',
    featureHeading: 'Authentic African Flavors',
    featureText:
      'Our specialty menu celebrates the rich culinary heritage of Africa. From traditional pap and mogodu to firewood-grilled brisket, we bring the authentic taste of the ancestors to a modern plate.',
    featureImage: img('photo-1574484284002-952d92456975', 800, 600),
    featureImageAlt: 'African cuisine',
    featureLinkLabel: 'Explore Culinary Heritage',
    featureLinkUrl: '',
  },
  events: {
    title: 'THE WEEKEND VIBE',
    items: [
      { id: 'cocktail-thursday', day: 'Every Thursday', title: 'Cocktail Thursday', time: '18:00 - Late', description: 'Exotic cocktails and smooth lounge beats to start the weekend early.' },
      { id: 'mimosa-weekend', day: 'Friday to Sunday', title: 'Mimosa Weekend', time: '13:00 - 17:00', description: 'Sip and socialise with our bottomless mimosa special.' },
      { id: 'authentic-sundays', day: 'Sunday', title: 'Authentic Sundays', time: '12:00 - 20:00', description: 'The ultimate lifestyle experience with the authentic taste of Mzansi.' },
    ],
    hireHeading: 'Planning a Private Celebration?',
    hireText: 'Convert our space into your sanctuary. We host birthdays, corporate mixers, and traditional festivities.',
    brochureUrl: '',
  },
  gallery: {
    title: 'THE VIBE',
    images: [
      { id: 'g1', url: img('photo-1544148103-0773bf10d330', 600, 600), alt: 'Plated dish at 057 Cafè' },
      { id: 'g2', url: img('photo-1414235077428-338989a2e8c0', 600, 600), alt: 'Restaurant table setting' },
      { id: 'g3', url: img('photo-1514362545857-3bc16c4c7d1b', 600, 600), alt: 'Cocktail bar' },
      { id: 'g4', url: img('photo-1560624052-449f5ddf0c31', 600, 600), alt: 'Grilled food' },
      { id: 'g5', url: img('photo-1551218808-94e220e084d2', 600, 600), alt: 'Chef preparing food' },
      { id: 'g6', url: img('photo-1516961642265-531546e84af2', 600, 600), alt: 'Lounge atmosphere' },
    ],
  },
  booking: {
    heading: 'BOOK THE *LIFESTYLE.*',
    intro: 'From intimate dinners to grand celebrations, we set the stage for your memories.',
    privateNote:
      'Venue hire and large bookings require a 48-hour lead time. Our team will contact you within 24 hours to confirm availability and discuss catering options.',
    tableNote:
      'Table reservations for weekend events are held for a maximum of 30 minutes past the booked time. Early arrival is recommended.',
    successHeading: 'Request Received!',
    successText:
      'Thank you for considering 057 Cafè. Our team will review your request and get back to you shortly to confirm your booking.',
  },
};
