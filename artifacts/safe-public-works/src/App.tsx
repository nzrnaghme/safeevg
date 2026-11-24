import PageSeo from '@/components/page-seo';
import SiteLoading from "@/components/site-loading";
import { lazy, Suspense, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
const Admin = lazy(() => import("@/pages/admin"));
const Solution = lazy(() => import('@/pages/charging-pages'));
const queryClient = new QueryClient();
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
 const [location] = useLocation();
 return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><PageSeo /><RoutedErrorBoundary><Suspense fallback={<SiteLoading />}><Switch><Route path="/" component={Home}/><Route path="/ev-charging" component={Solution}/><Route path="/solutions/home" component={Solution}/><Route path="/solutions/apartments" component={Solution}/><Route path="/solutions/commercial" component={Solution}/><Route path="/solutions/public-dc" component={Solution}/><Route path="/solutions/fleets" component={Solution}/><Route path="/equipment" component={Solution}/><Route path="/funding" component={Solution}/><Route path="/approach" component={Solution}/><Route path="/solar" component={Solution}/><Route path="/resources" component={Solution}/><Route path="/faq" component={Solution}/><Route path="/about" component={Solution}/><Route path="/contact" component={Solution}/><Route path="/economics" component={Solution}/><Route path="/privacy" component={Solution}/><Route path="/equipment/:model" component={Solution}/><Route path="/admin" component={import.meta.env.VITE_STATIC_HOSTING === 'true' ? NotFound : Admin}/><Route path="/how-we-help" component={Solution}/><Route path="/property-owners" component={Solution}/><Route path="/ownership-financing" component={Solution}/><Route path="/operations-maintenance" component={Solution}/><Route component={NotFound}/></Switch></Suspense></RoutedErrorBoundary></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>; }
export default App;
