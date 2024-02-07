import { Button } from "@mui/material";
import Form from "../Components/form/form";

export const Register = () => {
  const registerToAccount = () => {
    // Fonctionnalité de transmission de données email et password au back pour création d'un compte
    fetch("http://localhost:3001/register", {
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
      <h1>Register</h1>
      <Form />
      <Button variant="contained" onClick={registerToAccount}>
        Login
      </Button>
    </div>
  );
};
