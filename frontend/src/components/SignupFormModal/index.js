import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from "../../store/session";
import { useModal } from '../../context/Modal';
import "./SignupForm.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const [ email, setEmail ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ errors, setErrors ] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    return (
        <div className="signup-modal">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Email</span>
                    <input
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <p className="signup-modal__errors">{errors.email}</p>}
                <label>
                    <span>Username</span>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {errors.username && <p className="signup-modal__errors">{errors.username}</p>}
                <label>
                    <span>First Name</span>
                    <input
                        type='text'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {errors.firstName && <p className="signup-modal__errors">{errors.firstName}</p>}
                <label>
                    <span>Last Name</span>
                    <input
                        type='text'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {errors.lastName && <p className="signup-modal__errors">{errors.lastName}</p>}
                <label>
                    <span>Password</span>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.password && <p className="signup-modal__errors">{errors.password}</p>}
                <label>
                    <span>Confirm Password</span>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.confirmPassword && (
                    <p className="signup-modal__errors">{errors.confirmPassword}</p>
                )}
                <button disabled={!(username.length >= 4) || !(password.length >= 6) || !(confirmPassword.length >= 6) || !(email.length > 0) || !(firstName.length > 0) || !(lastName.length > 0)} type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupFormModal;
