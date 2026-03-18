import { Button, Paper, TextField, Typography } from "@mui/material";
import { memo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/use-auth";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ username, password });
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

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
    </Paper>
  );
}

export default memo(LoginForm);
