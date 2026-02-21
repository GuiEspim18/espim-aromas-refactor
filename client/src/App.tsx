import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import React, { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Loader2 } from "lucide-react";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Promocoes from "./pages/Promocoes";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProdutos from "./pages/AdminProdutos";
import AdminEssencias from "./pages/AdminEssencias";
import AdminBanners from "./pages/AdminBanners";
import AdminPedidos from "./pages/AdminPedidos";
import AdminUsuarios from "./pages/AdminUsuarios";

// Protected Route Component
function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { user, loading } = useFirebaseAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useFirebaseAuth();
  const [location, navigate] = useLocation();

  // Redirect /admin/login to dashboard if already authenticated
  useEffect(() => {
    if (!loading && user && location === '/admin/login') {
      navigate('/admin/dashboard');
    }
  }, [user, loading, location, navigate]);

  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/produtos"} component={Produtos} />
      <Route path={"/promocoes"} component={Promocoes} />
      <Route path={"/carrinho"} component={Carrinho} />
      <Route path={"/checkout"} component={Checkout} />

      {/* Admin Routes */}
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin/dashboard"} component={() => <ProtectedAdminRoute component={AdminDashboard} />} />
      <Route path={"/admin/produtos"} component={() => <ProtectedAdminRoute component={AdminProdutos} />} />
      <Route path={"/admin/essencias"} component={() => <ProtectedAdminRoute component={AdminEssencias} />} />
      <Route path={"/admin/banners"} component={() => <ProtectedAdminRoute component={AdminBanners} />} />
      <Route path={"/admin/pedidos"} component={() => <ProtectedAdminRoute component={AdminPedidos} />} />
      <Route path={"/admin/usuarios"} component={() => <ProtectedAdminRoute component={AdminUsuarios} />} />

      {/* Error Routes */}
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
