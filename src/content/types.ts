export type Theme = 'day' | 'night';

export const SECTION_KEYS = ['site', 'home', 'menu', 'events', 'gallery', 'booking'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const MENU_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'african', 'drinks'] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface HoursRow { id: string; label: string; days: Weekday[]; opens: string; closes: string }

export interface SiteSection {
  name: string;
  tagline: string;
  fullName: string;
  footerName: string;
  footerBlurb: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  hours: HoursRow[];
  contactTitle: string;
  directionsUrl: string;
  mapEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  socialHeading: string;
  socialText: string;
}

export interface HeroBlock { heading: string; text: string; image: string; imageAlt: string }
export interface Pillar { id: string; title: string; text: string }

export interface HomeSection {
  heroDay: HeroBlock;
  heroNight: HeroBlock;
  aboutHeading: string;
  aboutText1: string;
  aboutText2: string;
  pillars: Pillar[];
  aboutImage: string;
  aboutImageAlt: string;
  aboutQuote: string;
}

export interface MenuItem { id: string; name: string; price: string; description: string; category: MenuCategory }

export interface MenuSectionContent {
  title: string;
  items: MenuItem[];
  barNote: string;
  pdfUrl: string;
  featureHeading: string;
  featureText: string;
  featureImage: string;
  featureImageAlt: string;
  featureLinkLabel: string;
  featureLinkUrl: string;
}

export interface EventItem { id: string; day: string; title: string; time: string; description: string }

export interface EventsSectionContent {
  title: string;
  items: EventItem[];
  hireHeading: string;
  hireText: string;
  brochureUrl: string;
}

export interface GalleryImage { id: string; url: string; alt: string }
export interface GallerySectionContent { title: string; images: GalleryImage[] }

export interface BookingSectionContent {
  heading: string;
  intro: string;
  privateNote: string;
  tableNote: string;
  successHeading: string;
  successText: string;
}

export interface SiteContent {
  site: SiteSection;
  home: HomeSection;
  menu: MenuSectionContent;
  events: EventsSectionContent;
  gallery: GallerySectionContent;
  booking: BookingSectionContent;
}
