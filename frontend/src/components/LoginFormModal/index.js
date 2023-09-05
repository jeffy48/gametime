import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './LoginFormModal.css';

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
    <div className="login">
      <h1>Log In</h1>
      {errors.message && (
          <p className="login__errors">{errors.message}</p>
        )}
      <form className="login__input" onSubmit={handleSubmit}>
        <label>
          <span>Username or Email</span>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button disabled={!(credential.length >= 4) || !(password.length >= 6)} type="submit">Log In</button>
      </form>
      <form className="login__demo" onSubmit={handleSubmitDemo}>
        <button type="submit">Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
