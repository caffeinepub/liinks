import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import TemplateGalleryPage from './pages/TemplateGalleryPage';
import TemplateDetailPage from './pages/TemplateDetailPage';
import TemplateEditorPage from './pages/TemplateEditorPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import UploadTemplatePage from './pages/UploadTemplatePage';
import SharedBioPage from './pages/SharedBioPage';
import BrandHeader from './components/BrandHeader';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BrandHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026. Built with <span className="text-primary">♥</span> using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  return <>{children}</>;
}

function RequireRegistered({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing: authInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  if (authInitializing || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  if (isFetched && userProfile === null) {
    navigate({ to: '/signup' });
    return null;
  }

  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => (
    <RequireAuth>
      <SignupPage />
    </RequireAuth>
  ),
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: () => (
    <RequireRegistered>
      <TemplateGalleryPage />
    </RequireRegistered>
  ),
});

const templateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates/$templateId',
  component: () => (
    <RequireRegistered>
      <TemplateDetailPage />
    </RequireRegistered>
  ),
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor/$templateId',
  component: () => (
    <RequireRegistered>
      <TemplateEditorPage />
    </RequireRegistered>
  ),
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: () => (
    <RequireRegistered>
      <PricingPage />
    </RequireRegistered>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/$tier',
  component: () => (
    <RequireRegistered>
      <CheckoutPage />
    </RequireRegistered>
  ),
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: () => (
    <RequireRegistered>
      <UploadTemplatePage />
    </RequireRegistered>
  ),
});

const shareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/share/$shareId',
  component: SharedBioPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  galleryRoute,
  templateDetailRoute,
  editorRoute,
  pricingRoute,
  checkoutRoute,
  uploadRoute,
  shareRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
