/* REACT */
import React, { useEffect, useState } from "react";
/* UTILS */
/* MUI */
import { Link } from "react-router-dom";

export default function Header() {
  return (
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
  );
}
