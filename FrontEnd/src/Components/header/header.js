/* REACT */
import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

/* UTILS */
import logo from "./../../assets/logoHitTasks.png";
import HeaderMobile from "./headerMobile";

export default function Header() {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setIsAuth(true);
      return navigate("/");
    }
  }, [sessionStorage.getItem("token")]);

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
              <Link to="/tasksOrganisators">Organisateur de temps</Link>
            </li>
            <li>
              <Link to="/history">Historique</Link>
            </li>
            <li>
              <Link to="/accountSubscription">Subscribe</Link>
            </li>
            {sessionStorage.getItem("subscriptionKey") === "2" && (
              <li>
                <Link to="/addNewMember">Ajouter un membre</Link>
              </li>
            )}
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
