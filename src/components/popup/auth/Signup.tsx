import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ApiUrls from "../../../config/ApiUrls";
import { PUBLIC_API } from "../../../config/apiConfig";
import Loader from "../../utils/Loader";

interface SignUpProps {
  onSignInClick: () => void; // Callback to switch to SignIn form
}

const SignUp: React.FC<SignUpProps> = ({ onSignInClick }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    let isValid = true;
    if (!firstName) {
      setFirstNameError("First name is required");
      isValid = false;
    } else {
      setFirstNameError("");
    }
    if (!lastName) {
      setLastNameError("Last name is required");
      isValid = false;
    } else {
      setLastNameError("");
    }
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    return isValid;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    setLoading(true);

    try {
      const payload = {
        email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password2: confirmPassword,
        company_name: companyName,
        position: position,
      };

      console.log("payload", payload);
      // const response = await axios.post(
      //   "https://coreblackpigeon.shadhin.ai/users/register/",
      //   payload
      // );

      const response = await PUBLIC_API.post(ApiUrls.SIGN_UP, payload);
      if (response.status === 200) {
        setSuccess("Sign up successful. Please sign in.");
        setError("");
      } else {
        setError("Sign up failed, please try again.");
      }
    } catch (error) {
      setError("An error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {!success && <h2>Sign Up</h2>}
      {!success && (
        <form onSubmit={handleSignUp}>
          <div className="name-row">
            <div className="name-column">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {firstNameError && <p className="error">{firstNameError}</p>}
            </div>
            <div className="name-column">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {lastNameError && <p className="error">{lastNameError}</p>}
            </div>
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error">{emailError}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="error">{passwordError}</p>}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordError && (
            <p className="error">{confirmPasswordError}</p>
          )}
          <input
            type="text"
            placeholder="Company Name (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Position (optional)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          {/* <button type="submit">Sign Up</button> */}
          <button
            type="submit"
            className={loading ? "disabled" : ""}
            disabled={loading}
          >
            {loading ? (
              <>
                {" "}
                <Loader color="#fff" size={20} />
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      {success && (
        <p style={{ paddingTop: "35vh" }} className="success">
          {success}
        </p>
      )}
      <p>
        {!success && "Already have an account?"}{" "}
        <span
          onClick={onSignInClick}
          style={{ color: "#007afe", cursor: "pointer" }}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default SignUp;
