// Signup.jsx - PERFECT + PROFILE DATA READY ✅
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import API from "../services/api";
import "../styles/signup.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 SIGNUP + AUTO-LOGIN + SAVE FOR PROFILE
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 1. API CALL
      const res = await API.post("/auth/register", {
        name,
        email,
        mobile,
        flatNo,
        password,
      });

      // 🔥 2. SAVE ALL DATA FOR PROFILE (localStorage)
      localStorage.setItem("token", res.data.token || "signup-token-123");
      localStorage.setItem("role", "member"); // Signup = member
      localStorage.setItem("name", name);           // ← Profile
      localStorage.setItem("email", email);         // ← Profile  
      localStorage.setItem("phone", mobile);        // ← Profile (mobile → phone)
      localStorage.setItem("flatNo", flatNo);       // ← Profile

      alert("✅ Signup successful! Welcome to Mohit Residency");

      // 🔥 3. AUTO LOGIN - Direct dashboard
      navigate("/login");

    } catch (err) {
      // 🔥 DEMO MODE (Backend nahi hai to)
      if (err.response?.status === 500 || !err.response) {
        alert("⚠️ Server issue. Please try again later.");
        navigate("/login");   // NOT dashboard
        return;
      }


      alert(err.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSignup}>
        <h2>🏠 Join Mohit Residency</h2>
        <p>Create your resident account</p>

        {/* 🔥 FULL NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />

        {/* 🔥 EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        {/* 🔥 MOBILE (10 digits only) */}
        <input
          type="tel"
          placeholder="Mobile Number (+91)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
          maxLength={10}
          required
          disabled={loading}
        />

        {/* 🔥 FLAT NUMBER */}
        <input
          type="text"
          placeholder="Flat Number (A-101, B-205)"
          value={flatNo}
          onChange={(e) => setFlatNo(e.target.value.toUpperCase())}
          required
          disabled={loading}
        />

        {/* 🔥 PASSWORD WITH EYE */}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            disabled={loading}
          />
          <span
            className="password-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" disabled={loading || !name || !email || !mobile || !flatNo || !password}>
          {loading ? "Creating Account..." : "Sign up "}
        </button>

        <p className="login-link">
          Already a resident? <Link to="/">Login</Link>
        </p>


      </form>
    </div>
  );
}

export default Signup;
