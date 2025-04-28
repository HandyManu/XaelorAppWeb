import React from "react";
import "./insertCode.css";

const CheckPhone = () => {
  return (
    <div className="container">
      <h2>Check your phone</h2>
      <p>We've sent the code to your phone</p>
      <div className="code-inputs">
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
        <input type="text" maxLength="1" />
      </div>
      <p className="timer">Code expires in: 03:12</p>
      <button className="btn">Verify</button>
      <button className="btn-secondary">Send again</button>
    </div>
  );
};

export default CheckPhone;
