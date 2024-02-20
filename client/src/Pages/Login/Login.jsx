import LoginForm from "@components/LoginForm/LoginForm";
import "./Login.scss";

const Login = () => {
  return (
    <div className="login-page-container">
      <h1 className="login-header">Welcome Back!</h1>
      <span className="login-subheader">Login to your account</span>
      <LoginForm />
    </div>
  );
};

export default Login;
