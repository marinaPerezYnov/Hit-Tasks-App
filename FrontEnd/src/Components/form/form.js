/* MUI */
import { FormControl, TextField } from "@mui/material";

export const Form = ({setEmail, setPassword}) => {

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
      <TextField sx={styles.email} label="Email" type={"email"} onChange={
        (e) => setEmail(e.target.value)} />
      <TextField
        id="outlined-password-input"
        label="Password"
        type="password"
        sx={styles.password}
        autoComplete="current-password"
        onChange={
          (e) => setPassword(e.target.value)}/>
    </FormControl>
  );
};
