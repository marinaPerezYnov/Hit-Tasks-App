/* REACT */
import React from "react";
import { Link } from "react-router-dom";

/* UTILS */
import logo from "./../../assets/logoHitTasks.png";
import HeaderMobile from "./headerMobile";

export default function Header() {
  return (
    <div className="headerBloc">
      <img className="logo" src={logo} alt="logo" />
      <h1>Hit Tasks</h1>
        <HeaderMobile />
        <ul className="App-header">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/listTasks">ListTasks</Link>
          </li>
          <li>
            <Link to="/history">Historique</Link>
          </li>
        </ul>
    </div>
  );
}
