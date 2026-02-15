import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance"; 
import Active from "./pages/Active"; 
import NotActive from "./pages/NotActive";  
import SocietyExpenses from "./pages/SocietyExpenses";   
import Profile from "./pages/Profile";   


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />   
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/active-page" element={<Active />} />
      <Route path="/not-active-page" element={<NotActive />} />
      <Route path="/expenses" element={<SocietyExpenses />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Dashboard />} />
      <Route path="/security" element={<div>Security Page (Coming Soon)</div>} />




    </Routes>
  );
}

export default App;
