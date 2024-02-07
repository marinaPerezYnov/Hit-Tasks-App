import { Button } from "@mui/material";
import Form from "../Components/form/form";
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

  return (
    <div>
      <h1>Login</h1>
      <Form />
      <Button variant="contained" onClick={loginToAccount}>
        Login
      </Button>
    </div>
  );
};
