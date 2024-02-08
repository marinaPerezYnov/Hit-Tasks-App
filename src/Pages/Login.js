/* MUI */
import { Button } from "@mui/material";

/* UTILS */
import { Form } from "../Components/form/form";

export const Login = () => {
  const loginToAccount = () => {
    // Fonctionnalité de transmission de données email et password au back pour sa connexion
    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: " ", password: " " }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
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
      <Form />
      <Button sx={styles.button} onClick={loginToAccount}>
        Login
      </Button>
    </div>
  );
};
