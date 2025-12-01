import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { FundThesisOnboarding } from "./components/FundThesisOnboarding";
import { LoginPage } from "./components/LoginPage";
import { AnimatePresence, motion } from "framer-motion";

/**
 * App wiring kept intact but wrapped so animated transitions between
 * top-level states are smoother.
 */
export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    const fundThesis = localStorage.getItem("fundThesis");

    if (authStatus === "true") {
      setIsAuthenticated(true);
      if (!onboardingComplete || !fundThesis) {
        setShowOnboarding(true);
      }
    } else {
      setShowLogin(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
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

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setShowDashboard(false);
    setShowOnboarding(false);
    setShowLogin(true);
  };

  if (isLoading) {
    return null;
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
