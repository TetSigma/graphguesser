import { useState } from "react";
import axios from "axios";

const useSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        email,
        password,
        name,
        surname,
        profilePhoto,
      });
      setSuccess("User created successfully!");
      setEmail("");
      setPassword("");
      setName("");
      setSurname("");
      setProfilePhoto("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data?.error || "Failed to sign up";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    surname,
    setSurname,
    profilePhoto,
    setProfilePhoto,
    error,
    success,
    handleSignup,
  };
};

export default useSignup;
