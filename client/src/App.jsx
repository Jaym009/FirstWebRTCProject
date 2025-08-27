import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";
import IsLogin from "./pages/auth/PrivateLogin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<IsLogin />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="/signup" element={<Auth type="signup" />} />
        <Route path="/login" element={<Auth type="login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
