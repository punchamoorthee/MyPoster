// src/App.js
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthProvider"; // Import the provider component
import { useAuth } from "./hooks/useAuth"; // Hook to check auth status easily

import MainNavigation from "./navigation/MainNavigation"; // Adjust path
import LoadingSpinner from "./components/UI/LoadingSpinner"; // Central loading spinner
import styles from "./App.module.css"; // App specific styles

// Lazy load pages
const UsersPage = React.lazy(() => import("./features/users/pages/UsersPage"));
const AuthPage = React.lazy(() => import("./features/auth/pages/AuthPage"));
const NewPosterPage = React.lazy(() =>
  import("./features/posters/pages/NewPosterPage")
);
const UpdatePosterPage = React.lazy(() =>
  import("./features/posters/pages/UpdatePosterPage")
);
const UserPostersPage = React.lazy(() =>
  import("./features/posters/pages/UserPostersPage")
);

// Helper component for protected routes
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/auth" replace />;
};

// Helper component for public routes (redirect if logged in) - Optional
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  const { isLoggedIn } = useAuth(); // Use hook inside component needing auth status

  // Define routes based on login status
  let routes;
  if (isLoggedIn) {
    routes = (
      <>
        <Route path="/" element={<UsersPage />} />
        <Route
          path="/users/:userId/posters"
          element={<UserPostersPage />}
        />{" "}
        {/* Match backend route param */}
        <Route
          path="/posters/new"
          element={
            <ProtectedRoute>
              <NewPosterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posters/edit/:posterId"
          element={
            <ProtectedRoute>
              <UpdatePosterPage />
            </ProtectedRoute>
          }
        />{" "}
        {/* Use a clear edit path */}
        <Route path="/auth" element={<Navigate to="/" replace />} />{" "}
        {/* Redirect logged-in users from /auth */}
        <Route path="*" element={<Navigate to="/" replace />} />{" "}
        {/* Catch all */}
      </>
    );
  } else {
    routes = (
      <>
        <Route path="/" element={<UsersPage />} />
        <Route
          path="/users/:userId/posters"
          element={<UserPostersPage />}
        />{" "}
        {/* Publicly viewable */}
        {/* Use PublicRoute helper if desired */}
        {/* <Route path="/auth" element={ <PublicRoute><AuthPage /></PublicRoute> } /> */}
        <Route path="/auth" element={<AuthPage />} />
        {/* Redirect unauthenticated users trying to access protected routes */}
        <Route path="/posters/new" element={<Navigate to="/auth" replace />} />
        <Route
          path="/posters/edit/:posterId"
          element={<Navigate to="/auth" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </>
    );
  }

  return (
    <main className={styles.mainContent}>
      <Suspense
        fallback={
          <div className={styles.suspenseFallback}>
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>{routes}</Routes>
      </Suspense>
    </main>
  );
}

// Main App component wraps everything with Router and AuthProvider
function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Provides auth context to entire app */}
      <Router>
        <MainNavigation /> {/* Navigation is always visible */}
        <AppRoutes /> {/* Renders the routes based on auth state */}
      </Router>
    </AuthProvider>
  );
}

export default App;
