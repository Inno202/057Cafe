import { MenuItem, EventItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { name: "Recovery Ka Mogodu (Mon)", price: "R70", description: "Slow-cooked Mala Mohodu served with pap and fresh salsa.", category: 'african' },
  { name: "Lamb Curry Tuesday", price: "R120", description: "Hearty lamb curry served with spinach and your choice of samp or pap.", category: 'african' },
  { name: "Chicken Mix Wednesday", price: "R60", description: "Mixed chicken portions served with pap, spinach, and chakalaka.", category: 'african' },
  { name: "Wings Thursday Special", price: "R100", description: "Flame-grilled succulent wings served with creamy potato salad.", category: 'lunch' },
  { name: "Mala Mohodu Friday", price: "Contact us", description: "Chef's special tripe served with dombolo, spinach, and chakalaka.", category: 'african' },
  { name: "Hardbody Chicken (Sun)", price: "R90", description: "Traditional hardbody chicken dish, slow-cooked to perfection.", category: 'african' },
  { name: "Babalas BlowOut (Sun)", price: "R60", description: "The ultimate hangover cure served with pap and a cool drink.", category: 'african' },
  { name: "057 Signature Wings", price: "R110", description: "A full portion of our famous Mzansi-style grilled wings.", category: 'lunch' },
  { name: "Cocktail Selection", price: "From R65", description: "Expertly crafted cocktails for the ultimate lounge experience.", category: 'drinks' },
  { name: "Mimosa Special (Fri-Sun)", price: "R200", description: "Bottomless Mimosas between 13:00 and 17:00.", category: 'drinks' },
];

export const EVENTS: EventItem[] = [
  { day: "Every Thursday", title: "Cocktail Thursday", time: "18:00 - Late", description: "Exotic cocktails and smooth lounge beats to start the weekend early." },
  { day: "Friday to Sunday", title: "Mimosa Weekend", time: "13:00 - 17:00", description: "Sip and socialise with our bottomless mimosa special." },
  { day: "Sunday", title: "Authentic Sundays", time: "12:00 - 20:00", description: "The ultimate lifestyle experience with the authentic taste of Mzansi." },
];
