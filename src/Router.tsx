import { Route } from 'react-router-dom';
import { Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import {
  AdminDashboardPage,
  CreateProductPage,
  CreateUserPage,
  CreatorDashboardPage,
  EditProductPage,
  EditUserPage,
  HomePage,
  ListProductsPage,
  ListUsersPage,
  LoginForm,
  ShowProductPage,
  ShowUserPage,
} from './pages';
import { AdminProtected, CreatorProtected, NoAuth } from './components/Authentication';
import SignupPage from './pages/Signup.page';
import AdminLayout from './lib/HOC/AdminLayout';

export const PublicRoutes = (
  <>
    <Route
      path="/"
      element={
        <Suspense
          fallback={
            <Center>
              <Loader color="green" />
            </Center>
          }
        >
          <HomePage />
        </Suspense>
      }
    />
    <Route
      path="/login"
      element={
        <NoAuth>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <LoginForm />
          </Suspense>
        </NoAuth>
      }
    />
    <Route
      path="/signup"
      element={
        <NoAuth>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <SignupPage />
          </Suspense>
        </NoAuth>
      }
    />
  </>
);

export const AdminRoutes = (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <AdminProtected>
          <AdminLayout>
            <Suspense
              fallback={
                <Center>
                  <Loader color="green" />
                </Center>
              }
            >
              <AdminDashboardPage />
            </Suspense>
          </AdminLayout>
        </AdminProtected>
      }
    />
    {/* users crud */}
    <Route
      path="/admin/dashboard/users"
      element={
        <AdminProtected>
          <AdminLayout>
            <Suspense
              fallback={
                <Center>
                  <Loader color="green" />
                </Center>
              }
            >
              <ListUsersPage />
            </Suspense>
          </AdminLayout>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/users/create"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreateUserPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/users/show/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <ShowUserPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/users/edit/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <EditUserPage />
          </Suspense>
        </AdminProtected>
      }
    />
    {/* products crud */}
    <Route
      path="/admin/dashboard/products"
      element={
        <AdminProtected>
          <AdminLayout>
            <Suspense
              fallback={
                <Center>
                  <Loader color="green" />
                </Center>
              }
            >
              <ListProductsPage />
            </Suspense>
          </AdminLayout>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/products/create"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreateProductPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/products/show/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <ShowProductPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/products/edit/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <EditProductPage />
          </Suspense>
        </AdminProtected>
      }
    />
  </>
);

export const CreatorRoutes = (
  <Route
    path="/creator/dashboard"
    element={
      <CreatorProtected>
        <Suspense
          fallback={
            <Center>
              <Loader color="green" />
            </Center>
          }
        >
          <CreatorDashboardPage />
        </Suspense>
      </CreatorProtected>
    }
  />
);
