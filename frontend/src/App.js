// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ManageEmployees from "./components/ManageEmployees";
import ManageSupervisor from "./components/ManageSupervisor";
import SupervisorDashboard from "./components/SupervisorDashboard"; // Add this import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employees" element={<EmployeeDashboard />} />
        <Route path="/supervisors" element={<SupervisorDashboard />} />
        <Route path="/manage-supervisor" element={<ManageSupervisor />} />
        <Route path="/admins" element={<AdminDashboard />} />
        <Route path="/manage-employees" element={<ManageEmployees />} />
      </Routes>
    </Router>
  );
};

export default App;
