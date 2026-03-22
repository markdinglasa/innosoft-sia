import { Button, Paper, TextField, Typography } from "@mui/material";
import { AppDispatch } from "@shared/types";
import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setActivePage } from "../../../store/manager";
import { POSPages } from "../../../types/pages";
import { useAuth } from "../hooks/use-auth";

function LoginForm() {
    const dispatch = useDispatch<AppDispatch>()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    }
  };

  const handleDatabaseLink = () => {
    try {
      dispatch(setActivePage(POSPages.DATABASE_LINK))
    } catch(error:unknown) {
      toast.error((error as Error).message || "Sorry, Something went wrong.");
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%", mx: "auto", mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom color="primary" fontWeight="bold">
        iPOS Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={isLoading}
          sx={{ mt: 3, py: 1.5 }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <Button onClick={handleDatabaseLink}>Database Link</Button>
    </Paper>
  );
}

export default memo(LoginForm);
