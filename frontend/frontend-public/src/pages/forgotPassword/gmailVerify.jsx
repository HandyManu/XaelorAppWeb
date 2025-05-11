import React from "react";
import "../forgotPassword/gmailVerify.css";

const PasswordRecovery = () => {
  return (
    <div className="container">
      <h2>Password recovery</h2>
      <p>Enter your email to recover your password</p>
      <div className="input-group">
        <input type="email" placeholder="email@domain.com" />
      </div>
      <button className="btn">Recover password</button>
    </div>
  );
};

export default PasswordRecovery;
