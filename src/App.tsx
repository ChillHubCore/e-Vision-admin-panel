import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { theme } from './theme';
import 'react-toastify/dist/ReactToastify.css';
import { AppLayout } from './components/common';
import { AdminRoutes, PublicRoutes } from './Router';
import store from './lib/redux/Store';
import '@/lib/styles/global.module.scss';

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <Provider store={store}>
            <AppLayout>
              <main>
                <Routes>
                  {PublicRoutes}
                  {AdminRoutes}
                </Routes>
              </main>
              <ToastContainer />
            </AppLayout>
          </Provider>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}
