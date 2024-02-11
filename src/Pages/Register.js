/* REACT */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* MUI */
import { Button } from "@mui/material";

/* UTILS */
import { Form } from "../Components/form/form";
import { Link } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const registerToAccount = () => {
    console.log("email", email);
    console.log("password", password);

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
        console.log("data");
        // J'enregistre le token dans le sessionStorage pour le conserver
        // Modifier son stockage pour une meilleure sécurité
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.userId);
        console.log(data)
        navigate("/");
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
    </div>
  );
};
