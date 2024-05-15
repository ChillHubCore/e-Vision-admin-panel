import { DateValue } from '@mantine/dates';

export interface ProductVariantProps {
  _id?: string;
  images: string[];
  details: {
    key: string;
    value: string;
  }[];
  SKU: string;
  price: {
    regularPrice: number;
    discountedPrice?: false | number;
  };
  inStock: number;
  availability: boolean;
  soldAmount: number;
}

export interface ProductEntityProps {
  _id: string;
  metaTitle: string;
  metaDescription: string;
  metaTags: string[];
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: {
    short: string;
    full: string;
  };
  variants: ProductVariantProps[];
  relatedProducts?: string[];
  creator: string;
  sharedDetails: {
    key: string;
    value: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderEntityProps {
  _id: string;
  cartItems: {
    quantity: number;
    product: ProductEntityProps;
    variant: ProductVariantProps;
  }[];
  shippingAddress: {
    receiverName: string;
    receiverPhone: string;
    address: string;
    country: string;
    province: string;
    city: string;
    postalCode: string;
    shippingMethod: string;
    shippingPrice: number;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  notes?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  paymentMethod: 'Card-To-Card';
  itemsPrice: number;
  taxPrice: number;
  user: string | { _id: string; username: string };
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  isRecived: boolean;
  deliveredAt?: Date;
  promotions?: string[];
  totalDiscount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionEntityProps {
  _id: string;
  user: { _id: string; username: string };
  creator: { _id: string; username: string };
  updatedBy: { _id: string; username: string };
  order: string;
  status: 'pending' | 'in-process' | 'success' | 'failed';
  description: string;
  paymentResult?: object;
  createdAt: string;
  updatedAt: string;
}

export interface BlogEntityProps {
  _id: string;
  metaTitle: string;
  metaDescription: string;
  metaTags: string[];
  title: string;
  slug: string;
  content: string;
  author: {
    username: string;
    _id: string;
  };
  updatedAt: string;
  createdAt: string;
}

export interface ShopSettingsProps {
  name: string;
  primaryCurrency: string;
  extraCurrenciesSupported: string[];
  description: string;
  logo: string;
  version: string;
  userStatus: string[];
  contactAddresses: {
    physical: string;
    email: string;
    countryCode: string;
    phone: string;
    postalCode: string;
  };
  postalOptions: string[];
  paymentOptions: string[];
}
export interface PromotionEntityProps {
  _id: string;
  promotionIdentifier: string;
  applicableProducts: {
    product: ProductEntityProps;
    variant: ProductVariantProps;
    quantity: number;
  }[];
  creator: string;
  minTotalOrder: {
    active: boolean;
    price: number;
  };
  accessibleRoles: string[];
  maximumDiscount: {
    active: boolean;
    price: number;
  };
  description: string;
  active: boolean;
  activeFrom: Date;
  activeUntil: Date;
  usageCap: {
    isCaped: boolean;
    timesUsed: number;
    maxTimesToUse: number;
  };
  percentageDiscount: {
    active: boolean;
    percentage: number;
  };
  fixedDiscount: {
    active: boolean;
    price: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserEntityProps {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string;
  email: string;
  birthDate: string;
  loyaltyPoints: number;
  shopTokenBalance: number;
  role: {
    label: string;
    value: number;
  };
  countryCode: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  addresses: AddressProps[];
  watchList: string[];
  telegramInfo?: {
    chatUsername: string;
    chatId?: string;
    verified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddressProps {
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary: boolean;
}

export interface TicketEntityProps {
  _id: string;
  title: string;
  description: string;
  attachments: string[];
  status: 'Open' | 'Closed' | 'In-Progress' | 'Pending';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  ticketType:
    | 'Bug/Error'
    | 'Feature Request'
    | 'Product Consultation'
    | 'Order Issue'
    | 'Transaction Issue'
    | 'Feedback'
    | 'Other';
  createdBy: string;
  assignedTo:
    | string
    | {
        _id: string;
        username: string;
      };
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  closedBy?: string;
  closedNote?: string;
}

export interface WorkSampleEntityProps {
  name: string;
  description: string;
  url: string;
  image: string;
  technologies: string[];
}

export interface ResumeEntityProps {
  _id: string;
  user: string;
  title: string;
  workExperience: {
    company: string;
    position: string;
    startDate: DateValue;
    endDate: DateValue;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    startDate: DateValue;
    endDate: DateValue;
    description: string;
  }[];
  skills: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }[];
  certifications: {
    name: string;
    institution: string;
  }[];
  languages: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
  }[];
  hobbies: string[];
  active: boolean;
  workSamples: WorkSampleEntityProps[];
  socials: {
    username: string;
    url: string;
    platform:
      | {
          name: 'Gmail';
          icon: 'https://res.cloudinary.com/dn16ti55j/image/upload/v1714924609/icons/gmail_jnqb0o.png';
        }
      | {
          name: 'LinkedIn';
          icon: 'https://res.cloudinary.com/dn16ti55j/image/upload/v1714924612/icons/linkedin_olt9r1.webp';
        }
      | {
          name: 'GitHub';
          icon: 'https://res.cloudinary.com/dn16ti55j/image/upload/v1714924624/icons/github_jbvpvf.png';
        }
      | {
          name: 'YouTube';
          icon: 'https://res.cloudinary.com/dn16ti55j/image/upload/v1714924618/icons/youtube_bmnxle.jpg';
        }
      | {
          name: 'Telegram';
          icon: 'https://res.cloudinary.com/dn16ti55j/image/upload/v1714924615/icons/telegram_g5xfqx.png';
        }
      | {
          name: 'Discord';
          icon: 'https://res.cloudinary.com/dn16ti55j/image/upload/v1714924621/icons/discord_m68ils.png';
        };
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PageEntityProps {
  title: string;
  slug: string;
  description: string;
  keywords: string[];
}
