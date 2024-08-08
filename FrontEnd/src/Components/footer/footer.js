import React from "react";
import logo from "./../../assets/logoHitTasks.png";
import { Link } from "react-router-dom";
import "./../../Pages/styles/footer.css";
export const Footer = () => {
  return (
    <div className="footerBloc">
      <h2>Hit Tasks</h2>
      <img className="logo" src={logo} alt="logo" />
      <Link className="PrivacyPolicy" to="/privacyPolicy">
        Privacy Policy
      </Link>
      <p>© 2024 Hit Tasks</p>
    </div>
  );
};
