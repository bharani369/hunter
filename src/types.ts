export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock?: number;
  rating: number;
  reviews: number;
  sizes: string[];
  colours?: string[];
  tag: string;
  image: string;
  additionalImages?: string[];
}

export interface Review {
  id: string;
  text: string;
  rating: number;
  author?: string;
  date?: string;
}
