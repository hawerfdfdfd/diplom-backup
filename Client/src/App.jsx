import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import WorkerPage from "./Components/WorkerPage/WorkerPage";
import "../../css.main.css"; //imp3

function PageTransition({ children }) {
  return (
    <motion.div
      className="page"
      style={{ position: "absolute", width: "100%", height: "100%" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div
      className="app-container"
      style={{ position: "relative", width: "100%", height: "100vh" }}
    >
      {/* Фон, который остаётся неизменным */}
      <div className="background">
        <div className="stars">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="/workerPage"
            element={
              <PageTransition>
                <WorkerPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
