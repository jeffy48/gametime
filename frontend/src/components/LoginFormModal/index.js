import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        // console.log(data);
        if (data) {
          setErrors(data);
        }
      });
  };

  const handleSubmitDemo = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.demoLogin("Demo-lition", "password"))
      .then(closeModal)
  };

  return (
    <>
      <h1>Log In</h1>
      {errors.message && (
          <p>{errors.message}</p>
        )}
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button disabled={!(credential.length >= 4) || !(password.length >= 6)} type="submit">Log In</button>
      </form>
      <form onSubmit={handleSubmitDemo}>
        <button type="submit">Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
