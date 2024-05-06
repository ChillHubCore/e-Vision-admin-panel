import { Route } from 'react-router-dom';
import { Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import {
  AdminDashboardPage,
  CreateBlogPage,
  CreateOrderPage,
  CreateProductPage,
  CreatePromotionPage,
  CreateTicketPage,
  CreateTransactionPage,
  CreateUserPage,
  CreatorDashboardPage,
  EditBlogPage,
  EditOrderPage,
  EditProductPage,
  EditPromotionPage,
  EditTicketPage,
  EditTransactionPage,
  EditUserPage,
  GeneralSettingsPage,
  HomePage,
  ListBlogsPage,
  ListOrdersPage,
  ListProductsPage,
  ListPromotionsPage,
  ListTicketsPage,
  ListTransactionsPage,
  ListUsersPage,
  LoginForm,
  MyEmailsPage,
  MyResumePage,
  ShowBlogPage,
  ShowOrderPage,
  ShowProductPage,
  ShowPromotionPage,
  ShowTransactionPage,
  ShowUserPage,
  SignupPage,
  TeamDashboardPage,
} from './pages';
import {
  AdminProtected,
  CreatorProtected,
  NoAuth,
  TeamProtected,
} from './components/Authentication';
import AdminLayout from './lib/HOC/AdminLayout';
import TeamLayout from './lib/HOC/TeamLayout';

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
    <Route
      path="/admin/dashboard/shop-settings"
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
              <GeneralSettingsPage />
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
    {/* orders crud */}
    <Route
      path="/admin/dashboard/orders"
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
              <ListOrdersPage />
            </Suspense>
          </AdminLayout>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/orders/create"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreateOrderPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/orders/show/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <ShowOrderPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/orders/edit/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <EditOrderPage />
          </Suspense>
        </AdminProtected>
      }
    />
    {/* transaction crud */}
    <Route
      path="/admin/dashboard/transactions"
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
              <ListTransactionsPage />
            </Suspense>
          </AdminLayout>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/transactions/create/"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreateTransactionPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/transactions/create/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreateTransactionPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/transactions/show/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <ShowTransactionPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/transactions/edit/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <EditTransactionPage />
          </Suspense>
        </AdminProtected>
      }
    />
    {/* blogs crud */}
    <Route
      path="/admin/dashboard/blogs"
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
              <ListBlogsPage />
            </Suspense>
          </AdminLayout>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/blogs/create"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreateBlogPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/blogs/show/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <ShowBlogPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/blogs/edit/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <EditBlogPage />
          </Suspense>
        </AdminProtected>
      }
    />
    {/* promotions crud */}
    <Route
      path="/admin/dashboard/promotions"
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
              <ListPromotionsPage />
            </Suspense>
          </AdminLayout>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/promotions/create"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreatePromotionPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/promotions/show/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <ShowPromotionPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/promotions/edit/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <EditPromotionPage />
          </Suspense>
        </AdminProtected>
      }
    />
    {/* tickets crud */}
    <Route
      path="/admin/dashboard/tickets"
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
              <ListTicketsPage />
            </Suspense>
          </AdminLayout>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/tickets/create"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreateTicketPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/tickets/show/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <ShowTransactionPage />
          </Suspense>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/tickets/edit/:id"
      element={
        <AdminProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <EditTicketPage />
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

export const TeamRoutes = (
  <>
    <Route
      path="/team/dashboard"
      element={
        <TeamProtected>
          <TeamLayout>
            <Suspense
              fallback={
                <Center>
                  <Loader color="green" />
                </Center>
              }
            >
              <TeamDashboardPage />
            </Suspense>
          </TeamLayout>
        </TeamProtected>
      }
    />
    <Route
      path="/team/dashboard/myresume"
      element={
        <TeamProtected>
          <TeamLayout>
            <Suspense
              fallback={
                <Center>
                  <Loader color="green" />
                </Center>
              }
            >
              <MyResumePage />
            </Suspense>
          </TeamLayout>
        </TeamProtected>
      }
    />
    {/* blogs crud */}
    <Route
      path="/team/dashboard/blogs"
      element={
        <TeamProtected>
          <TeamLayout>
            <Suspense
              fallback={
                <Center>
                  <Loader color="green" />
                </Center>
              }
            >
              <ListBlogsPage TeamMemberFlag />
            </Suspense>
          </TeamLayout>
        </TeamProtected>
      }
    />
    <Route
      path="/team/dashboard/blogs/create"
      element={
        <TeamProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <CreateBlogPage TeamMemberFlag />
          </Suspense>
        </TeamProtected>
      }
    />
    <Route
      path="/team/dashboard/blogs/show/:id"
      element={
        <TeamProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <ShowBlogPage />
          </Suspense>
        </TeamProtected>
      }
    />
    <Route
      path="/team/dashboard/blogs/edit/:id"
      element={
        <TeamProtected>
          <Suspense
            fallback={
              <Center>
                <Loader color="green" />
              </Center>
            }
          >
            <EditBlogPage TeamMemberFlag />
          </Suspense>
        </TeamProtected>
      }
    />
    {/* emails crud */}
    <Route
      path="/team/dashboard/myemails"
      element={
        <TeamProtected>
          <TeamLayout>
            <Suspense
              fallback={
                <Center>
                  <Loader color="green" />
                </Center>
              }
            >
              <MyEmailsPage />
            </Suspense>
          </TeamLayout>
        </TeamProtected>
      }
    />
  </>
);
