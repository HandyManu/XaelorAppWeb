import React from "react";
import "../pages/signUp.css"; 

export default function SignUp() {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Be limitless</h2>

        <form className="signup-form">
          <input type="text" placeholder="Your name" className="signup-input" />
          <input type="email" placeholder="example@gmail.com" className="signup-input" />
          <input type="password" placeholder="Enter password" className="signup-input" />

          <label className="signup-checkbox-label">
            <input type="checkbox" />
            <span>
              I agree to the <a href="#" className="highlight-link">Platform’s Terms of Service</a> and
              <a href="#" className="highlight-link"> Privacy Policies</a>
            </span>
          </label>

          <button className="signup-button">Create account</button>

          <div className="signup-or">or sign up with</div>

          <div className="signup-socials">
            <button className="signup-social-btn">G</button>
            <button className="signup-social-btn">f</button>
          </div>
        </form>
      </div>
    </div>
  );
}
