export type BusinessType =
  | "restaurant"
  | "cafe"
  | "retail"
  | "salon"
  | "gym"
  | "grocery"
  | "bar"
  | "bakery";

export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface IdealCustomerProfile {
  ageRange: [number, number];
  incomeRange: [number, number];
  interests: string[];
  visitFrequency: "daily" | "weekly" | "monthly" | "occasional";
  priceSensitivity: "low" | "medium" | "high";
}

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  websiteUrl: string;
  description: string;
  tagline: string;
  location: GeoLocation;
  address: string;
  products: Product[];
  priceRange: PriceRange;
  icp: IdealCustomerProfile;
  rating: number;
  establishedYear: number;
  monthlyRevenue: number;
  avgCustomersPerDay: number;
}
