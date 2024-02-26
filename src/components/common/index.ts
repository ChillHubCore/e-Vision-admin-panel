import { lazy } from 'react';
import AppLayout from './AppLayout';

const ProductCard = lazy(() => import('./ProductCard'));
const VariantCard = lazy(() => import('./VariantCard'));

export { AppLayout, ProductCard, VariantCard };
