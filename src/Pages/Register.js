/* MUI */
import { Button } from "@mui/material";

/* UTILS */
import { Form } from "../Components/form/form";

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
    <div className="registerForm">
      <h3>Register</h3>
      <Form />
      <Button  sx={{
        margin: "2%",
        backgroundColor: "black",
        color: "wheat",
        fontSize: "unset"
      }} onClick={registerToAccount}>
        Register
      </Button>
    </div>
  );
};
