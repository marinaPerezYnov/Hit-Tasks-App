/* REACT */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
/* MUI */
import { Button } from "@mui/material";

/* UTILS */
import { Form } from "../Components/form/form";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loginToAccount = () => {
    console.log("email", email);
    console.log("password", password);

    // Fonctionnalité de transmission de données email et password au back pour sa connexion
    fetch("http://localhost:8081/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data");
        console.log(data);
        // J'enregistre le token dans le sessionStorage pour le conserver
        // Modifier son stockage pour une meilleure sécurité
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.userId);
        navigate("/");
      })
      .catch((error) => console.log("error", error));
  };
  const styles = {
    button : {
      margin: "2%",
      backgroundColor: "black",
      color: "wheat",
      fontSize: "unset"
    }
  }
  return (
    <div className="loginForm">
      <h3>Login</h3>
      <Form setEmail={setEmail} setPassword={setPassword} />
      <Button sx={styles.button} onClick={loginToAccount}>
        Login
      </Button>
    </div>
  );
};
