// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import UserDetails from "./components/UserDetails";

function App() {
  return (
    <Router>
      <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>GitHub Explorer 💻✨</h1>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/user/:username" element={<UserDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
