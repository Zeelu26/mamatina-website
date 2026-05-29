export type HeroPhoto = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
};

export type GalleryPhoto = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string;
  allergens: string;
  imageUrl: string;
  availability: "available" | "sold-out" | "coming-soon";
  featured: boolean;
  order: number;
  createdAt: string;
};

export type Review = {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  photoUrl?: string;
  date: string;
  approved: boolean;
  featured: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  productInterest?: string;
  quantity?: string;
  eventDate?: string;
  fileUrl?: string;
  read: boolean;
  createdAt: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export type Settings = {
  business: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
    socialInstagram: string;
    socialTiktok: string;
    socialFacebook: string;
  };
  hero: {
    headline: string;
    subheading: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    shuffleEnabled: boolean;
    shuffleSeconds: number;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraph: string;
    imageUrl: string;
  };
  gallery: {
    shuffleEnabled: boolean;
    shuffleSeconds: number;
  };
  announcement: {
    enabled: boolean;
    text: string;
  };
  seo: {
    title: string;
    description: string;
    socialImage: string;
    analyticsId: string;
    logoUrl: string;
    faviconUrl: string;
  };
  legal: {
    privacyPolicy: string;
    terms: string;
    cookieBannerText: string;
  };
  maintenanceMode: boolean;
  footer: {
    copyright: string;
  };
};

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type DB = {
  heroPhotos: HeroPhoto[];
  galleryPhotos: GalleryPhoto[];
  products: Product[];
  reviews: Review[];
  messages: ContactMessage[];
  subscribers: NewsletterSubscriber[];
  settings: Settings;
  admins: AdminUser[];
};
