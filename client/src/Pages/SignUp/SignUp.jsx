import SignUpForm from "../../Components/SignUpForm/SignUpForm.jsx";
import "./SignUp.scss";

const SignUp = () => {
  return (
    <div className="signup-page-container">
      <h1 className="signup-header">Create free account</h1>
      <span className="signup-subheader">
        ReelBot is your trusted movie guide
      </span>
      <SignUpForm />
    </div>
  );
};

export default SignUp;
