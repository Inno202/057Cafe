export type Theme = 'day' | 'night';

export interface MenuItem {
  name: string;
  price: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'african';
}

export interface EventItem {
  day: string;
  title: string;
  time: string;
  description: string;
}
