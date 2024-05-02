import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { DatesProvider } from '@mantine/dates';
import { theme } from './theme';
import 'react-toastify/dist/ReactToastify.css';
import { AppLayout } from './components/common';
import { AdminRoutes, CreatorRoutes, PublicRoutes, TeamRoutes } from './Router';
import store from './lib/redux/Store';
import '@/lib/styles/global.module.scss';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <DatesProvider settings={{ consistentWeeks: true }}>
            <Provider store={store}>
              <AppLayout>
                <main>
                  <Routes>
                    {PublicRoutes}
                    {AdminRoutes}
                    {CreatorRoutes}
                    {TeamRoutes}
                  </Routes>
                </main>
                <ToastContainer />
              </AppLayout>
            </Provider>
          </DatesProvider>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}
