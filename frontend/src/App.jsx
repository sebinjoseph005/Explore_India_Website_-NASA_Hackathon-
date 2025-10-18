import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import StatePage from "./pages/StatePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page with India map */}
        <Route path="/" element={<Home />} />

        {/* State-specific page */}
        <Route path="/state/:stateId" element={<StatePage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
