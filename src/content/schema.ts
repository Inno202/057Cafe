import { MENU_CATEGORIES, WEEKDAYS, type SectionKey } from './types';

/**
 * One description of every editable field. The same descriptors drive
 * validation (admin saves and public loads) and the admin forms.
 */
interface Base { key: string; label: string; help?: string }
export interface TextField extends Base { kind: 'text'; max: number; required?: boolean; multiline?: boolean }
export interface UrlField extends Base { kind: 'url'; required?: boolean; image?: boolean; hosts?: readonly string[] }
export interface PhoneField extends Base { kind: 'phone' }
export interface EmailField extends Base { kind: 'email' }
export interface TimeField extends Base { kind: 'time' }
export interface DaysField extends Base { kind: 'days' }
export interface SelectField extends Base { kind: 'select'; options: readonly { value: string; label: string }[] }
export interface GroupField extends Base { kind: 'group'; fields: Field[] }
export interface ListField extends Base { kind: 'list'; itemName: string; titleKey: string; max: number; fields: Field[] }
export type Field =
  | TextField | UrlField | PhoneField | EmailField | TimeField | DaysField | SelectField | GroupField | ListField;

export interface SectionSchema { label: string; description: string; fields: Field[] }

const EMPHASIS = 'Wrap words in *asterisks* to highlight them.';
const OPTIONAL_LINK = 'Optional. The button only appears on the site once a link is set.';

export const CATEGORY_LABELS: Record<(typeof MENU_CATEGORIES)[number], string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', african: 'African', drinks: 'Drinks',
};

const heroFields: Field[] = [
  { kind: 'text', key: 'heading', label: 'Heading', max: 60, required: true, help: EMPHASIS },
  { kind: 'text', key: 'text', label: 'Text', max: 240, required: true, multiline: true },
  { kind: 'url', key: 'image', label: 'Photo link', required: true, image: true },
  { kind: 'text', key: 'imageAlt', label: 'Photo description', max: 120, required: true, help: 'Read aloud to visitors who cannot see the photo.' },
];

export const SCHEMA: Record<SectionKey, SectionSchema> = {
  menu: {
    label: 'Menu',
    description: 'Dishes, drinks and prices shown in the menu section.',
    fields: [
      { kind: 'text', key: 'title', label: 'Section heading', max: 60, required: true },
      {
        kind: 'list', key: 'items', label: 'Menu items', itemName: 'menu item', titleKey: 'name', max: 150,
        fields: [
          { kind: 'text', key: 'name', label: 'Name', max: 80, required: true },
          { kind: 'text', key: 'price', label: 'Price', max: 20, required: true, help: 'For example R70, From R65 or Contact us.' },
          { kind: 'text', key: 'description', label: 'Description', max: 200, multiline: true },
          { kind: 'select', key: 'category', label: 'Category', options: MENU_CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] })) },
        ],
      },
      { kind: 'text', key: 'barNote', label: 'Bar note', max: 400, multiline: true, help: EMPHASIS },
      { kind: 'url', key: 'pdfUrl', label: 'PDF menu link', help: OPTIONAL_LINK },
      { kind: 'text', key: 'featureHeading', label: 'Feature heading', max: 80, required: true },
      { kind: 'text', key: 'featureText', label: 'Feature text', max: 500, required: true, multiline: true },
      { kind: 'url', key: 'featureImage', label: 'Feature photo link', required: true, image: true },
      { kind: 'text', key: 'featureImageAlt', label: 'Feature photo description', max: 120, required: true },
      { kind: 'text', key: 'featureLinkLabel', label: 'Feature link text', max: 40 },
      { kind: 'url', key: 'featureLinkUrl', label: 'Feature link', help: OPTIONAL_LINK },
    ],
  },
  events: {
    label: 'Events',
    description: 'Weekly events and the private venue hire block. Events also appear in the booking form.',
    fields: [
      { kind: 'text', key: 'title', label: 'Section heading', max: 60, required: true },
      {
        kind: 'list', key: 'items', label: 'Events', itemName: 'event', titleKey: 'title', max: 30,
        fields: [
          { kind: 'text', key: 'title', label: 'Event name', max: 80, required: true },
          { kind: 'text', key: 'day', label: 'Day', max: 40, required: true, help: 'For example Every Thursday.' },
          { kind: 'text', key: 'time', label: 'Time', max: 40, required: true, help: 'For example 18:00 - Late.' },
          { kind: 'text', key: 'description', label: 'Description', max: 240, multiline: true },
        ],
      },
      { kind: 'text', key: 'hireHeading', label: 'Venue hire heading', max: 80, required: true },
      { kind: 'text', key: 'hireText', label: 'Venue hire text', max: 300, required: true, multiline: true },
      { kind: 'url', key: 'brochureUrl', label: 'Event brochure link', help: OPTIONAL_LINK },
    ],
  },
  gallery: {
    label: 'Gallery',
    description: 'Photos shown in the gallery grid.',
    fields: [
      { kind: 'text', key: 'title', label: 'Section heading', max: 60, required: true },
      {
        kind: 'list', key: 'images', label: 'Photos', itemName: 'photo', titleKey: 'alt', max: 24,
        fields: [
          { kind: 'url', key: 'url', label: 'Photo link', required: true, image: true },
          { kind: 'text', key: 'alt', label: 'Photo description', max: 120, required: true, help: 'Read aloud to visitors who cannot see the photo.' },
        ],
      },
    ],
  },
  home: {
    label: 'Home page',
    description: 'The opening banner for day and night mode, and the about section.',
    fields: [
      { kind: 'group', key: 'heroDay', label: 'Banner, day mode', fields: heroFields },
      { kind: 'group', key: 'heroNight', label: 'Banner, night mode', fields: heroFields },
      { kind: 'text', key: 'aboutHeading', label: 'About heading', max: 80, required: true, help: EMPHASIS },
      { kind: 'text', key: 'aboutText1', label: 'About, first paragraph', max: 600, required: true, multiline: true, help: EMPHASIS },
      { kind: 'text', key: 'aboutText2', label: 'About, second paragraph', max: 600, multiline: true, help: EMPHASIS },
      {
        kind: 'list', key: 'pillars', label: 'Highlights', itemName: 'highlight', titleKey: 'title', max: 4,
        fields: [
          { kind: 'text', key: 'title', label: 'Title', max: 30, required: true },
          { kind: 'text', key: 'text', label: 'Text', max: 60, required: true },
        ],
      },
      { kind: 'url', key: 'aboutImage', label: 'About photo link', required: true, image: true },
      { kind: 'text', key: 'aboutImageAlt', label: 'About photo description', max: 120, required: true },
      { kind: 'text', key: 'aboutQuote', label: 'Line under the photo', max: 120 },
    ],
  },
  site: {
    label: 'Business details',
    description: 'Name, address, contact details, trading hours and social links. Used on every page and in search-engine data.',
    fields: [
      { kind: 'text', key: 'name', label: 'Short name', max: 40, required: true },
      { kind: 'text', key: 'tagline', label: 'Tagline', max: 40 },
      { kind: 'text', key: 'fullName', label: 'Full name', max: 80, required: true },
      { kind: 'text', key: 'footerName', label: 'Name in the copyright line', max: 80, required: true },
      { kind: 'text', key: 'footerBlurb', label: 'Footer text', max: 240, multiline: true },
      { kind: 'text', key: 'street', label: 'Street address', max: 120, required: true },
      { kind: 'text', key: 'city', label: 'Town', max: 60, required: true },
      { kind: 'text', key: 'province', label: 'Province', max: 60, required: true },
      { kind: 'text', key: 'postalCode', label: 'Postal code', max: 10, required: true },
      { kind: 'phone', key: 'phone', label: 'Phone number, international format', help: 'Starts with + and the country code, no spaces. For example +27722230708.' },
      { kind: 'text', key: 'phoneDisplay', label: 'Phone number as shown', max: 24, required: true },
      { kind: 'email', key: 'email', label: 'Email address' },
      {
        kind: 'list', key: 'hours', label: 'Trading hours', itemName: 'hours row', titleKey: 'label', max: 7,
        fields: [
          { kind: 'text', key: 'label', label: 'Label', max: 20, required: true, help: 'For example Mon-Thu.' },
          { kind: 'days', key: 'days', label: 'Days covered' },
          { kind: 'time', key: 'opens', label: 'Opens' },
          { kind: 'time', key: 'closes', label: 'Closes' },
        ],
      },
      { kind: 'text', key: 'contactTitle', label: 'Contact section heading', max: 60, required: true },
      { kind: 'url', key: 'directionsUrl', label: 'Directions link', required: true },
      { kind: 'url', key: 'mapEmbedUrl', label: 'Embedded map link', hosts: ['maps.google.com', 'www.google.com'], help: 'Google Maps embed link. Leave empty to hide the map.' },
      { kind: 'url', key: 'facebookUrl', label: 'Facebook link', help: OPTIONAL_LINK },
      { kind: 'url', key: 'instagramUrl', label: 'Instagram link', help: OPTIONAL_LINK },
      { kind: 'text', key: 'socialHeading', label: 'Social heading', max: 60 },
      { kind: 'text', key: 'socialText', label: 'Social text', max: 200, multiline: true },
    ],
  },
  booking: {
    label: 'Booking page',
    description: 'Text on the booking page. The two notes are also quoted in the Terms.',
    fields: [
      { kind: 'text', key: 'heading', label: 'Heading', max: 60, required: true, help: EMPHASIS },
      { kind: 'text', key: 'intro', label: 'Intro', max: 200, multiline: true },
      { kind: 'text', key: 'privateNote', label: 'Note for private events', max: 400, required: true, multiline: true },
      { kind: 'text', key: 'tableNote', label: 'Note for weekend tables', max: 400, required: true, multiline: true },
      { kind: 'text', key: 'successHeading', label: 'Confirmation heading', max: 60, required: true },
      { kind: 'text', key: 'successText', label: 'Confirmation text', max: 400, required: true, multiline: true },
    ],
  },
};

export const WEEKDAY_OPTIONS = WEEKDAYS;
