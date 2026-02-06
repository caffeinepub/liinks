import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import PhoneVerificationPage from './pages/PhoneVerificationPage';
import TemplateGalleryPage from './pages/TemplateGalleryPage';
import TemplateDetailPage from './pages/TemplateDetailPage';
import TemplateEditorPage from './pages/TemplateEditorPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import UploadTemplatePage from './pages/UploadTemplatePage';
import SharedBioPage from './pages/SharedBioPage';
import AboutPage from './pages/AboutPage';
import BrandHeader from './components/BrandHeader';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BrandHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left text-sm text-muted-foreground">
              Built with <Heart className="inline h-4 w-4 text-primary fill-primary mx-1" /> for creators who want more than just links.
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </div>
          </div>
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
  const { data: userProfile, isLoading: profileLoading, isFetched, error } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to home
    if (!authInitializing && !identity) {
      navigate({ to: '/' });
      return;
    }

    // If profile query has completed and returned null, or if there's an authorization error
    if (identity && isFetched && (userProfile === null || error)) {
      // Redirect to signup with a reason parameter
      navigate({ 
        to: '/signup',
        search: { reason: 'registration-required' }
      });
    }
  }, [identity, authInitializing, isFetched, userProfile, error, navigate]);

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
    return null;
  }

  // If profile hasn't loaded yet or is null, don't render children
  if (!isFetched || userProfile === null || error) {
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
  validateSearch: (search: Record<string, unknown>): { reason?: string } => {
    return {
      reason: typeof search.reason === 'string' ? search.reason : undefined,
    };
  },
});

const verifyPhoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify-phone',
  component: () => (
    <RequireAuth>
      <PhoneVerificationPage />
    </RequireAuth>
  ),
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: TemplateGalleryPage,
});

const templateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates/$templateId',
  component: TemplateDetailPage,
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
  component: PricingPage,
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

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  verifyPhoneRoute,
  galleryRoute,
  templateDetailRoute,
  editorRoute,
  pricingRoute,
  checkoutRoute,
  uploadRoute,
  shareRoute,
  aboutRoute,
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
