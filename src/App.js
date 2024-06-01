import React, { lazy, useEffect, useState, Suspense } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthenticationPage from "./pages/AuthenticationPage";
import HomePage from "./pages/HomePage";
import MarketPlacePage from "./pages/MarketPlacePage";
import SearchPage from "./pages/SearchPage";

const ErrorPage = lazy(() => import("./pages/ErrorPage"));

function App() {
  const [isApiAlive, setIsApiAlive] = useState(true); // Initialize state with null

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BASE_URL + "/api/status"
        );
        if (response.ok) {
          setIsApiAlive(true);
        } else {
          setIsApiAlive(false);
        }
      } catch (error) {
        setIsApiAlive(false);
      }
    };

    checkApiStatus();
  }, []);

  return (
    <BrowserRouter>
      {isApiAlive ? ( // Check for null instead of undefined
        <Routes>
          <Route
            path="/authentication/:param"
            element={<AuthenticationPage />}
          />
          <Route path="/" element={<HomePage />} />
          <Route path="/MarketPlace" element={<MarketPlacePage />} />
          <Route path="/s/:search" element={<SearchPage />} />
          <Route
            path="*"
            element={
              <Suspense
                fallback={
                  <div className="w-[100%] h-[100vh] items-center justify-center flex">
                    Loading...
                  </div>
                }
              >
                <ErrorPage status={"404"} />
              </Suspense>
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="*"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ErrorPage status={"505"} />
              </Suspense>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
