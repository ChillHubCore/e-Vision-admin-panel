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
  title: string;
  content: string;
  author: {
    username: string;
    _id: string;
  };
  updatedAt: string;
  createdAt: string;
}
