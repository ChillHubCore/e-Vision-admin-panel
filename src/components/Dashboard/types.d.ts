export interface ProductVariantProps {
  id?: string;
  images: string[];
  details: {
    key: string;
    value: string;
  }[];
  SKU: string;
  price: {
    regularPrice: number;
    discountedPrice?: number;
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
