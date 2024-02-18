// import HomePage from './Home.page';
// import CreateUserPage from './user/CreateUser.page';
// import EditUserPage from './user/EditUser.page';
// import ListUsersPage from './user/ListUsers.page';
// import ShowUserPage from './user/ShowUser.page';
// import LoginForm from './Login.page';
// import SignupPage from './Signup.page';
// import AdminDashboardPage from './dashboard/AdminDashboard.page';
// import CreatorDashboardPage from './dashboard/CreatorDashboard.page';
// import EditProductPage from './product/EditProduct.page';
// import CreateProductPage from './product/CreateProduct.page';
// import ShowProductPage from './product/ShowProduct.page';
// import ListProductsPage from './product/ListProducts.page';
import { lazy } from 'react';

export const HomePage = lazy(() => import('./Home.page'));
export const CreateUserPage = lazy(() => import('./user/CreateUser.page'));
export const EditUserPage = lazy(() => import('./user/EditUser.page'));
export const ListUsersPage = lazy(() => import('./user/ListUsers.page'));
export const ShowUserPage = lazy(() => import('./user/ShowUser.page'));
export const LoginForm = lazy(() => import('./Login.page'));
export const SignupPage = lazy(() => import('./Signup.page'));
export const AdminDashboardPage = lazy(() => import('./dashboard/AdminDashboard.page'));
export const CreatorDashboardPage = lazy(() => import('./dashboard/CreatorDashboard.page'));
export const EditProductPage = lazy(() => import('./product/EditProduct.page'));
export const CreateProductPage = lazy(() => import('./product/CreateProduct.page'));
export const ShowProductPage = lazy(() => import('./product/ShowProduct.page'));
export const ListProductsPage = lazy(() => import('./product/ListProducts.page'));

// export {
//   CreateUserPage,
//   EditUserPage,
//   ListUsersPage,
//   HomePage,
//   ShowUserPage,
//   LoginForm,
//   SignupPage,
//   AdminDashboardPage,
//   CreatorDashboardPage,
//   EditProductPage,
//   CreateProductPage,
//   ShowProductPage,
//   ListProductsPage,
// };
