import { memo } from "react";
import LoginForm from "../../../features/authentication/components/login-form";

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  )
}

export default memo(LoginPage);