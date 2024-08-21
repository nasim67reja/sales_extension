import React, { useState } from "react";
import axios from "axios";
import {
  API,
  PUBLIC_API,
  REFRESH_TOKEN,
  TOKEN,
} from "../../../config/apiConfig";
import ApiUrls from "../../../config/ApiUrls";
import Loader from "../../utils/Loader";

interface SignInProps {
  onSignUpClick: () => void; // Callback to switch to SignUp form
  onSignInSuccess: (profile: any) => void; // Callback for successful sign-in
}

const SignIn: React.FC<SignInProps> = ({ onSignUpClick, onSignInSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    let isValid = true;
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
    return isValid;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    setLoading(true);

    try {
      const response = await PUBLIC_API.post(ApiUrls.SIGN_IN, {
        emailOrPhone: email,
        password: password,
      });
      if (response.status === 200) {
        // onSignInSuccess(response.data.profile);
        const { idToken, refreshToken, user } = response.data.data;

        // Store tokens and user info in local storage

        localStorage.setItem(TOKEN, idToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        // localStorage.setItem("user", JSON.stringify(user));

        // Notify parent component about the successful sign-in
        onSignInSuccess(idToken);
      } else {
        setError("Invalid credentials, please try again.");
      }
    } catch (error) {
      setError("An error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const forgotPasswordUrl =
      "https://hr-assistant.shadhin.ai/auth/forget-password";
    window.open(forgotPasswordUrl, "_blank");
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // required
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // required
          />
          {passwordError && <p className="error">{passwordError}</p>}
        </div>
        {/* <button type="submit">Sign In</button> */}
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
            "Sign In"
          )}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Don't have an account?{" "}
        <span
          onClick={onSignUpClick}
          style={{ color: "#007afe", cursor: "pointer" }}
        >
          Sign Up
        </span>
      </p>
      <p>
        <span
          onClick={handleForgotPassword}
          style={{ color: "#007afe", cursor: "pointer" }}
        >
          Forgot Password?
        </span>
      </p>
    </div>
  );
};

export default SignIn;
