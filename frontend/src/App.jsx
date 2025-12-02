import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { FundThesisOnboarding } from "./components/FundThesisOnboarding";
import { LoginPage } from "./components/LoginPage";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { DiscoveryProvider } from "./lib/DiscoveryContext";

/**
 * Main application content with navigation logic
 */
function AppContent() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const onboardingComplete = localStorage.getItem("onboardingComplete");

    if (isAuthenticated) {
      // Check if user has completed onboarding
      // Backend returns 'thesis' field, also check localStorage for fundThesis
      const hasThesis = user?.thesis || user?.onboarding_complete || localStorage.getItem("fundThesis");
      if (!onboardingComplete || !hasThesis) {
        setShowOnboarding(true);
        setShowLogin(false);
        setShowDashboard(false);
      } else {
        setShowDashboard(true);
        setShowLogin(false);
        setShowOnboarding(false);
      }
    } else {
      setShowLogin(true);
      setShowDashboard(false);
      setShowOnboarding(false);
    }
    setIsInitialized(true);
  }, [isAuthenticated, authLoading, user]);

  const handleLogin = () => {
    setShowLogin(false);
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    } else {
      setShowDashboard(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowDashboard(true);
  };

  const handleEnterDashboard = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    } else {
      setShowDashboard(true);
    }
  };

  const handleReconfigure = () => {
    setShowDashboard(false);
    setShowOnboarding(true);
  };

  const handleLogout = async () => {
    await logout();
    setShowDashboard(false);
    setShowOnboarding(false);
    setShowLogin(true);
  };

  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait" initial={false}>
        {showLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            <LoginPage onLogin={handleLogin} />
          </motion.div>
        ) : showOnboarding ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            <FundThesisOnboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : showDashboard ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            <Dashboard
              onBack={() => setShowDashboard(false)}
              onReconfigure={handleReconfigure}
              onLogout={handleLogout}
            />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            <LandingPage onEnterDashboard={handleEnterDashboard} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * App wrapper with AuthProvider and DiscoveryProvider
 */
export default function App() {
  return (
    <AuthProvider>
      <DiscoveryProvider>
        <AppContent />
      </DiscoveryProvider>
    </AuthProvider>
  );
}
