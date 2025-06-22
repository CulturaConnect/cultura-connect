import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import RegisterType from './pages/register-type';
import RegisterPerson from './pages/register-person';
import RegisterCompany from './pages/register-company';
import RecoveryPassword from './pages/recovery-password';
import Login from './pages/login';
import SuccessScreen from './components/auth/SuccessScreen';
import { AuthProvider } from './contexts/auth';
import NewProject from './pages/new-project';
import ProfileScreen from './pages/profile';
import ProjectDetails from './pages/project-details';
import PrivateRoute from './components/auth/PrivateRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/project/new"
              element={
                <PrivateRoute>
                  <NewProject />
                </PrivateRoute>
              }
            />
            <Route path="/project/:projectId" element={<ProjectDetails />} />

            <Route
              path="/me"
              element={
                <PrivateRoute>
                  <ProfileScreen />
                </PrivateRoute>
              }
            />

            <Route path="/auth/register-type" element={<RegisterType />} />
            <Route path="/auth/register/person" element={<RegisterPerson />} />
            <Route
              path="/auth/register/company"
              element={<RegisterCompany />}
            />
            <Route path="/auth/register/success" element={<SuccessScreen />} />

            <Route path="/auth/recover" element={<RecoveryPassword />} />
            <Route path="/auth/login" element={<Login />} />

            {/* ADD ALL CUSTOM ROUTES BELOW THE CATCH-ALL "*" ROUTE */}

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
