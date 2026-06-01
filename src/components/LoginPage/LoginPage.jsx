import React, { useState } from "react";
import { Form } from "radix-ui";

import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

import { Link, createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";

import GoogleButton from "./google.svg";
import FacebookButton from "./facebook.svg";
import TwitterButton from "./twitter.svg";
import GithubButton from "./github.svg";

import { useDispatch } from "react-redux";
import { signInWithOAuth } from "@/utils/authentication";
import { setUser } from "@/redux/features/authSlice";
import { clearError } from "@/utils/showError";
import { showError } from "@/utils/showError";
import "./LoginPage.scss";

export function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [newUser, setNewUser] = useState({
        email: "",
        username: "",
        password: "",
    });

    const handleNewUserFormSubmit = (e) => {
        const { name, value } = e.target;

        setNewUser({
            ...newUser,
            [name]: value,
        });
    };

    const createNewUser = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                newUser.email,
                newUser.password
            );
            const user = userCredential.user;
            const createdAt = Timestamp.fromDate(new Date());

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                displayName: newUser.username,
                email: newUser.email,
                avatar: "",
                id: user.uid,
                createdAt,
                status: "online",
                friends: [],
            });

            dispatch(
                setUser({
                    displayName: newUser.username,
                    avatar: "",
                    id: user.uid,
                    createdAt: createdAt.seconds,
                    status: "online",
                    email: newUser.email,
                    friends: [],
                })
            );

            clearError();
            navigate("/channels");
        } catch (error) {
            showError(error?.name || "Register", error?.code || error?.message);
        }
    };

    //create a new account
    React.useEffect(() => {}, [newUser.username]);

    return (
        <main className="register-page">
            <Form.Root
                className="form-container"
                onSubmit={(event) => {
                    event.preventDefault();
                    createNewUser();
                }}
            >
                <div className="form-wrapper">
                    <div className="form-center">
                        <div className="primary-title">
                            <h3>Create an account</h3>
                        </div>
                        <div className="input-position">
                            <Form.Field className="form-group" name="email">
                                <Form.Label className="input-placeholder">Email</Form.Label>
                                <Form.Control asChild>
                                    <input
                                        required
                                        className="form-style"
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={(e) => handleNewUserFormSubmit(e)}
                                        style={{ marginBottom: "20px" }}
                                    />
                                </Form.Control>
                            </Form.Field>
                            <Form.Field className="form-group" name="username">
                                <Form.Label className="input-placeholder">username</Form.Label>
                                <Form.Control asChild>
                                    <input
                                        required
                                        className="form-style"
                                        type="text"
                                        name="username"
                                        value={newUser.username}
                                        onChange={(e) => handleNewUserFormSubmit(e)}
                                        style={{ marginBottom: "20px" }}
                                    />
                                </Form.Control>
                            </Form.Field>
                            <Form.Field className="form-group" name="password">
                                <Form.Label className="input-placeholder" htmlFor="password">
                                    Password
                                </Form.Label>
                                <Form.Control asChild>
                                    <input
                                        required
                                        className="form-style"
                                        type="password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={(e) => handleNewUserFormSubmit(e)}
                                        style={{ marginBottom: "20px" }}
                                    />
                                </Form.Control>
                            </Form.Field>
                        </div>
                        <div className="btn-position">
                            <Form.Submit asChild>
                                <button type="submit" className="btn">
                                    Continue
                                </button>
                            </Form.Submit>
                        </div>
                        <span className="register-container">
                            <Link to="/" className="link">
                                Already have an account?
                            </Link>
                        </span>
                    </div>
                </div>
            </Form.Root>
        </main>
    );
}

export function ResetPasswordPage() {
    const [searchparams] = useSearchParams();
    const navigate = useNavigate();

    return (
        <main className="reset-page">
            <Form.Root className="form-container">
                <div className="form-wrapper">
                    <div className="form-center">
                        <h4>
                            {`A reset email has been sent to ${searchparams.get("email")}. Please check your email and follow the instructions to reset your password.`}
                        </h4>
                        <button type="button" className="btn" onClick={() => navigate("/")}>
                            Sign In
                        </button>
                    </div>
                </div>
            </Form.Root>
        </main>
    );
}

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [emailSignInInfo, setEmailSignInInfo] = useState({ email: "", password: "" });

    const handleResetPassword = () => {
        sendPasswordResetEmail(auth, emailSignInInfo.email).then(() => {
            // Password reset email sent!
            navigate({
                pathname: "/reset",
                search: createSearchParams({ email: emailSignInInfo.email }).toString(),
            });
        });
    };
    const emailSignIn = async () => {
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                emailSignInInfo.email,
                emailSignInInfo.password
            );
            const userRef = doc(db, "users", result.user.uid);
            getDoc(userRef).then((doc) => {
                dispatch(
                    setUser({
                        displayName: doc.data().displayName,
                        avatar: doc.data().avatar,
                        id: doc.data().id,
                        createdAt: doc.data().createdAt.seconds,
                        status: doc.data().status,
                    })
                );
                clearError();
                navigate("/channels");
            });
        } catch (error) {
            setEmailSignInInfo({ ...emailSignInInfo, password: "" });
            showError(error.name, error.code);
        }
        // ...
    };

    const handleEmailSignInForm = (e) => {
        e.preventDefault();

        const { name, value } = e.target;

        setEmailSignInInfo({
            ...emailSignInInfo,
            [name]: value,
        });
    };

    return (
        <main className="login-page">
            <Form.Root
                className="form-container"
                onSubmit={(event) => {
                    event.preventDefault();
                    emailSignIn();
                }}
            >
                <div className="form-wrapper">
                    <div className="form-center">
                        <div className="primary-title">
                            <h3>Welcome back!</h3>
                        </div>
                        <div className="secondary-title">
                            <p>We&apos;re so excited to see you again!</p>
                        </div>
                        <div className="input-position">
                            <Form.Field className="form-group" name="email">
                                <Form.Label className="input-placeholder" htmlFor="email">
                                    Email
                                </Form.Label>
                                <Form.Control asChild>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        className="form-style"
                                        style={{ marginBottom: "20px" }}
                                        value={emailSignInInfo.email}
                                        onChange={(e) => handleEmailSignInForm(e)}
                                    />
                                </Form.Control>
                            </Form.Field>
                            <Form.Field className="form-group" name="password">
                                <Form.Label className="input-placeholder" htmlFor="password">
                                    Password
                                </Form.Label>
                                <Form.Control asChild>
                                    <input
                                        required
                                        type="password"
                                        name="password"
                                        className="form-style"
                                        value={emailSignInInfo.password}
                                        onChange={(e) => handleEmailSignInForm(e)}
                                    />
                                </Form.Control>
                            </Form.Field>
                        </div>
                        <div className="password-container">
                            <button type="button" className="link" onClick={handleResetPassword}>
                                Forgot your password?
                            </button>
                        </div>
                        <div className="btn-position">
                            <Form.Submit asChild>
                                <button type="submit" className="btn">
                                    login
                                </button>
                            </Form.Submit>
                        </div>
                        <span className="register-container">
                            Need an account?{" "}
                            <Link to="/register" className="link">
                                Register
                            </Link>
                        </span>
                    </div>
                    <div className="verticalSeparator"></div>
                    <div className="social-login">
                        <GoogleButton
                            className="social-button"
                            onClick={() => signInWithOAuth("google")}
                        />
                        <FacebookButton
                            className="social-button"
                            onClick={() => signInWithOAuth("facebook")}
                        />
                        <TwitterButton
                            className="social-button"
                            onClick={() => signInWithOAuth("twitter")}
                        />
                        <GithubButton
                            className="social-button"
                            onClick={() => signInWithOAuth("github")}
                        />
                    </div>
                </div>
            </Form.Root>
        </main>
    );
}
