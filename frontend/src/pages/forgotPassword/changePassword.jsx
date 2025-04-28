import React from "react";
import "../forgotPassword/changePassword.css";

const ResetPassword = () => {
  return (
    <div className="container">
      <h2>Reset your password</h2>
      <p>Please enter your new password</p>
      <div className="input-group">
        <input type="password" placeholder="New password" />
        <span className="eye-icon">👁️</span>
      </div>
      <div className="requirements">
        <p>Your Password must contain:</p>
        <ul>
          <li>At least 6 characters</li>
          <li>Contains a number</li>
        </ul>
      </div>
      <button className="btn">Done</button>
    </div>
  );
};

export default ResetPassword;
