import { Route } from 'react-router-dom';
import {
  CreateUserPage,
  EditUserPage,
  HomePage,
  ListUsersPage,
  LoginForm,
  ShowUserPage,
} from './pages';
import { AdminProtected } from './components/Authentication';
import SignupPage from './pages/Signup.page';

export const PublicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignupPage />} />
  </>
);

export const AdminRoutes = (
  <>
    <Route
      path="/user"
      element={
        <AdminProtected>
          <ListUsersPage />
        </AdminProtected>
      }
    />
    <Route
      path="/user/create"
      element={
        <AdminProtected>
          <CreateUserPage />
        </AdminProtected>
      }
    />
    <Route
      path="/user/show/:id"
      element={
        <AdminProtected>
          <ShowUserPage />
        </AdminProtected>
      }
    />
    <Route
      path="/user/edit/:id"
      element={
        <AdminProtected>
          <EditUserPage />
        </AdminProtected>
      }
    />
  </>
);
