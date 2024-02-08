/* MUI */
import { FormControl, TextField } from "@mui/material";

export const Form = () => {
  const styles = {
    email : {
      margin: "2%"
    },
    password : {
      margin: "2%"
    }
  }

  return (
    <FormControl>
      <TextField sx={styles.email} label="Email" type={"email"} />
      <TextField
        id="outlined-password-input"
        label="Password"
        type="password"
        sx={styles.password}
        autoComplete="current-password"
      />
    </FormControl>
  );
};
