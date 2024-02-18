import { hasLength, useForm } from '@mantine/form';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmit } from '@/lib/hooks';

export interface ProductVariantProps {
  images: string[];
  details: {
    key: string;
    value: string;
  }[];
  SKU: string;
  price: {
    regularPrice: number;
    discountedPrice?: number;
    specialOffers?: {
      name: string;
      price: number;
    }[];
  };
  inStock: number;
  soldAmount: number;
  availability: boolean;
  rating: number;
  reviews: {
    rating: number;
    comment?: string;
    user: string;
  }[];
}

export interface ProductEntityProps {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: {
    short: string;
    full: string;
  };
  variants: ProductVariantProps[];
  relatedProducts: string[];
  creator: string;
  sharedDetails: {
    key: string;
    value: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductGenerator({
  ProductData,
  editFlag,
}: {
  ProductData?: ProductEntityProps;
  editFlag: boolean;
}) {
  const ProductGeneratorForm = useForm({
    initialValues: {
      name: ProductData?.name || '',
      slug: ProductData?.slug || '',
      category: ProductData?.category || '',
      description: ProductData?.description || {
        short: '',
        full: '',
      },
      variants: ProductData?.variants || [],
      relatedProducts: ProductData?.relatedProducts || [],
      creator: ProductData?.creator || '',
      sharedDetails: ProductData?.sharedDetails || [],
    },
    validate: {
      name: hasLength({ min: 3, max: 255 }, 'Name must be 3-255 characters long'),
      slug: hasLength({ min: 2, max: 255 }, 'Slug must be 3-255 characters long'),
      category: hasLength({ min: 3, max: 255 }, 'Category must be 3-255 characters long'),
      description: {
        short: hasLength({ min: 3, max: 255 }, 'Short Description must be 3-255 characters long'),
        full: hasLength({ min: 3, max: 255 }, 'Full Description must be 3-255 characters long'),
      },
      variants: (value: ProductVariantProps[]) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      relatedProducts: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      creator: hasLength({ min: 3, max: 255 }, 'Creator must be 3-255 characters long'),
      sharedDetails: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
    },
  });
  const FormActions = useSubmit();
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (editFlag) {
      FormActions.sendRequest(
        `/product/${ProductData?._id}`,
        ProductGeneratorForm,
        'put',
        'Product Edited Successfully!',
        'Failed to edit product! Please try again.',
        () => navigate('/admin/dashboard/products')
      );
    } else {
      FormActions.sendRequest(
        '/product',
        ProductGeneratorForm,
        'post',
        'Product Created Successfully!',
        'Failed to create product! Please try again.',
        () => navigate('/admin/dashboard/products')
      );
    }
  };
  return <div>ProductGenerator</div>;
}
