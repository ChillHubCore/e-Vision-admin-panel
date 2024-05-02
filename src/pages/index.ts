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
export const GeneralSettingsPage = lazy(() => import('./shop/GeneralSettings.page'));
export const EditOrderPage = lazy(() => import('./order/EditOrder.page'));
export const ListOrdersPage = lazy(() => import('./order/ListOrders.page'));
export const ShowOrderPage = lazy(() => import('./order/ShowOrder.page'));
export const CreateOrderPage = lazy(() => import('./order/CreateOrder.page'));
export const CreateTransactionPage = lazy(() => import('./transaction/CreateTransaction.page'));
export const EditTransactionPage = lazy(() => import('./transaction/EditTransaction.page'));
export const ListTransactionsPage = lazy(() => import('./transaction/ListTransactions.page'));
export const ShowTransactionPage = lazy(() => import('./transaction/ShowTransaction.page'));
export const CreateBlogPage = lazy(() => import('./blog/CreateBlog.page'));
export const EditBlogPage = lazy(() => import('./blog/EditBlog.page'));
export const ListBlogsPage = lazy(() => import('./blog/ListBlogs.page'));
export const ShowBlogPage = lazy(() => import('./blog/ShowBlog.page'));
export const CreatePromotionPage = lazy(() => import('./promotion/CreatePromotion.page'));
export const EditPromotionPage = lazy(() => import('./promotion/EditPromotion.page'));
export const ListPromotionsPage = lazy(() => import('./promotion/ListPromotions.page'));
export const ShowPromotionPage = lazy(() => import('./promotion/ShowPromotion.page'));
export const CreateTicketPage = lazy(() => import('./ticket/CreateTicket.page'));
export const EditTicketPage = lazy(() => import('./ticket/EditTicket.page'));
export const ListTicketsPage = lazy(() => import('./ticket/ListTickets.page'));
export const ShowTicketPage = lazy(() => import('./ticket/ShowTicket.page'));
export const TeamDashboardPage = lazy(() => import('./dashboard/TeamDashboard.page'));
