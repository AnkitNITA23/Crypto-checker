import React from "react";
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const Login = ({ setUser }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // Save user info in state or context
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="login">
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
