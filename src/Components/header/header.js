/* REACT */
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

/* UTILS */
import logo from "./../../assets/logoHitTasks.png";
import HeaderMobile from "./headerMobile";

export default function Header() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setIsAuth(true);
      console.log("isAuth", isAuth);
      console.log("token", sessionStorage.getItem("token"));
    }
  });

  return (
    <div className="headerBloc">
      <img className="logo" src={logo} alt="logo" />
      <h1>Hit Tasks</h1>
      <HeaderMobile />
      <ul className="App-header">
        {isAuth ? (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/listTasks">ListTasks</Link>
            </li>
            <li>
              <Link to="/history">Historique</Link>
            </li>
            <li>
              <Link to="/logout" onClick={()=>{
                sessionStorage.clear();
              }}>Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
