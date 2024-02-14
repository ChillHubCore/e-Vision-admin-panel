import { Route } from 'react-router-dom';
import {
  AdminDashboardPage,
  CreateUserPage,
  CreatorDashboardPage,
  EditUserPage,
  HomePage,
  ListUsersPage,
  LoginForm,
  ShowUserPage,
} from './pages';
import { AdminProtected, CreatorProtected, NoAuth } from './components/Authentication';
import SignupPage from './pages/Signup.page';
import AdminLayout from './lib/HOC/AdminLayout';

export const PublicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route
      path="/login"
      element={
        <NoAuth>
          <LoginForm />
        </NoAuth>
      }
    />
    <Route
      path="/signup"
      element={
        <NoAuth>
          <SignupPage />
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
            <AdminDashboardPage />
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
            <ListUsersPage />
          </AdminLayout>
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/users/create"
      element={
        <AdminProtected>
          <CreateUserPage />
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/users/show/:id"
      element={
        <AdminProtected>
          <ShowUserPage />
        </AdminProtected>
      }
    />
    <Route
      path="/admin/dashboard/users/edit/:id"
      element={
        <AdminProtected>
          <EditUserPage />
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
        <CreatorDashboardPage />
      </CreatorProtected>
    }
  />
);
