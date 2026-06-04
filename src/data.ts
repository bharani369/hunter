import { Product, Review } from './types';

export const WA_PHONE = '917200255999';
export const WA_PHONE_ALT = '919994466031';
export const INSTAGRAM_HANDLE = '@hunter_tamilnadu_';
export const INSTAGRAM_URL = 'https://instagram.com/hunter_tamilnadu_';
export const YOUTUBE_URL = 'https://youtube.com/@hunter_tamilnadu_';

export const CATEGORIES = [
  { id: 'shirts', name: 'Shirts', icon: '👔' },
  { id: 't-shirts', name: 'T-Shirts', icon: '👕' },
  { id: 'hoodies', name: 'Hoodies', icon: '🧥' },
  { id: 'trousers', name: 'Trousers', icon: '👖' },
  { id: 'juniors', name: 'Juniors', icon: '👦' },
  { id: 'caps', name: 'Caps', icon: '🧢' },
  { id: 'watches', name: 'Watches', icon: '⌚' },
  { id: 'shoes', name: 'Shoes', icon: '👟' },
  { id: 'combo', name: 'Combo Offers', icon: '🎁' },
  { id: 'new', name: 'New Arrivals', icon: '💥' }
];

export const PRODUCTS: Product[] = [];

export const REVIEWS: Review[] = [
  { id: '1', text: "One of the best hubs for men's clothing. Great collection of shirts, tees, hoodies, pants, accessories and perfumes at nominal prices. The best quality products — trendy and innovative collections. Worldwide shipping available.", rating: 5, author: "Rajesh Kumar", date: "Oct 2023" },
  { id: '2', text: "Nice shop for men's clothing. Dresses are of good quality and reasonable price. Shipping available all over India. Not only dress — caps, shoes, watches, deodorants are also available.", rating: 5, author: "Suresh Menon", date: "Jan 2024" },
  { id: '3', text: "Clothes are nice and have good material. Staff is friendly and helpful. Great collection of trendy and affordable clothing.", rating: 4, author: "Karthik R.", date: "Mar 2024" }
];
