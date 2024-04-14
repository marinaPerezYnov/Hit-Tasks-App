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
  const registerToAccount = () => {
    setShowLoader(true);
    // Fonctionnalité de transmission de données email et password au back pour création d'un compte
    fetch("http://localhost:8081/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // J'enregistre le token dans le sessionStorage pour le conserver
        // Modifier son stockage pour une meilleure sécurité
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.userId);
        setShowLoader(false);
        return navigate("/");
      })
      .catch((error) => console.log("error", error));
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
