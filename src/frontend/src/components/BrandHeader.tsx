import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, Upload } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function BrandHeader() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isPro = userProfile?.subscription === 'pro';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/assets/generated/liinks-logo.dim_512x512.png" alt="Liinks" className="h-10 w-10 transition-transform group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                Liinks
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">link to your content and social accounts</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/templates"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            {isAuthenticated && userProfile && isPro && (
              <Link
                to="/upload"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="hidden md:flex"
            >
              {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link
                    to="/templates"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Templates
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  {isAuthenticated && userProfile && isPro && (
                    <Link
                      to="/upload"
                      className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2 flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Template
                    </Link>
                  )}
                  <Button
                    onClick={() => {
                      handleAuth();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isLoggingIn}
                    variant={isAuthenticated ? 'outline' : 'default'}
                    className="w-full"
                  >
                    {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
