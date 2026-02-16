import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ScrollToTop } from './components/ScrollToTop.tsx';
import { LanguageProvider } from './lib/language/LanguageContext.tsx';

// ===============================
// Stripe Configuration
// ===============================

const STRIPE_PUBLIC_KEY = "pk_live_51SUQhnPk759VRZDkA4gfOVKmk9pCkOB39Shy9fB4wiyvOvCuM2B3eBi5TFCFQjfavFDB34T5OQZfu9QRAs2hrau400vr7VBNLB";

// Protection : avertit si jamais la clé est manquante
if (!STRIPE_PUBLIC_KEY) {
  console.error("Aucune clé Stripe définie !");
}

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// ===============================
// React App
// ===============================

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <LanguageProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Elements>
  </StrictMode>
);
