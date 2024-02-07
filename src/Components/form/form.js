import { FormControl, TextField } from "@mui/material";

export const Form = () => {
  return (
    <FormControl>
      <TextField label="Email" type={"email"} />
      <TextField
        id="outlined-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
      />
    </FormControl>
  );
};
