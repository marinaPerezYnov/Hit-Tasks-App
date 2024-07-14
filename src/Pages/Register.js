/* REACT */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* MUI */
import { Button } from "@mui/material";
import LinearBuffer from "./../Components/loader/loader";
/* UTILS */
import { Form } from "../Components/form/form";
import { Link } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const urlPath = window.location.pathname;
  console.log("urlPath", urlPath, Number(urlPath.split("/family_key=")[1]));
  const familyKey = Number(urlPath.split("/family_key=")[1]);

  const registerToAccount = () => {
    setShowLoader(true);
    console.log("familyKey", familyKey);
    if(!(familyKey?.length > 0) && familyKey === null) {
      // Fonctionnalité de transmission de données email et password au back pour création d'un compte
      fetch("http://localhost:8081/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((response) => response.json())
        .then((data) => {
          // J'enregistre le token dans le sessionStorage pour le conserver
          // Modifier son stockage pour une meilleure sécurité
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userId", data.userId);
          // sessionStorage.setItem("familyKey", familyKey);
          setShowLoader(false);
          return navigate("/");
        })
        .catch((error) => console.log("error", error));
    } else {
      fetch("http://localhost:8081/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password, familyKey: familyKey }),
      })
        .then((response) => response.json())
        .then((data) => {
          // J'enregistre le token dans le sessionStorage pour le conserver
          // Modifier son stockage pour une meilleure sécurité
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userId", data.userId);
          sessionStorage.setItem("familyKey", familyKey);
          setShowLoader(false);
          // return navigate("/");
        })
        .catch((error) => console.log("error", error));
    }
  };

  return (
    <div className="registerForm">
      <h3>Register</h3>
      <Form setEmail={setEmail} setPassword={setPassword} />
      <Button  sx={{
        margin: "2%",
        backgroundColor: "black",
        color: "wheat",
        fontSize: "unset"
      }} onClick={registerToAccount}>
        Register
      </Button>
      <h4>Déjà un compte? 
        <Link to="/login">Connectez vous à votre compte</Link>
      </h4>
      {showLoader && <LinearBuffer />}
    </div>
  );
};
