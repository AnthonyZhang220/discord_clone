import React, { useState } from "react";
import { Form } from "radix-ui";

import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

import { Link, createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    confirmPasswordReset,
} from "firebase/auth";
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
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
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

export function ResetSuccessPage() {
    const [searchPrams] = useSearchParams();
    const email = searchPrams.get("email");
    return (
        <main className="reset-success-page">
            <Form.Root className="form-container">
                <div className="form-wrapper">
                    <div className="form-center">
                        <div className="primary-title">
                            <h3>Check your email</h3>
                            <p className="reset-subtitle">A reset email has been sent to</p>
                            <p className="reset-email">{email}</p>
                            <p className="reset-subtitle">
                                Please check your email and follow the instructions to reset your
                                password.
                            </p>
                        </div>
                        <Link to="/" className="btn" style={{ textDecoration: "none" }}>
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </Form.Root>
        </main>
    );
}

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [emailSignInInfo, setEmailSignInInfo] = useState({ email: "", password: "" });

    const handleEmailSignInForm = (e) => {
        e.preventDefault();

        const { name, value } = e.target;
        setEmailSignInInfo({ ...emailSignInInfo, [name]: value });
    };

    const handleResetPassword = () => {
        const actionCodeSettings = {
            url: "https://discordclone.antxz.com/reset/confirm",
            handleCodeInApp: false,
        };
        sendPasswordResetEmail(auth, emailSignInInfo.email, actionCodeSettings).then(() => {
            // Password reset email sent!
            navigate({
                pathname: "/reset/success",
                search: createSearchParams({ email: emailSignInInfo.email }).toString(),
            });
        });
    };

    return (
        <main className="reset-page">
            <Form.Root className="form-container">
                <div className="form-wrapper">
                    <div className="form-center">
                        <div className="primary-title">
                            <h3>Password Reset</h3>
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
                                        value={emailSignInInfo.email}
                                        onChange={(e) => handleEmailSignInForm(e)}
                                        style={{ marginBottom: "20px" }}
                                    />
                                </Form.Control>
                                <Link to="/" className="link">
                                    Sign In instead
                                </Link>
                            </Form.Field>
                            <button type="button" className="btn" onClick={handleResetPassword}>
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </Form.Root>
        </main>
    );
}

export function ResetConfirmPage() {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const oobCode = searchParams.get("oobCode");

    const handleConfirm = async () => {
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="reset-success-page">
            <Form.Root className="form-container">
                <div className="form-wrapper">
                    <div className="form-center">
                        <div className="primary-title">
                            <h3>Reset your password</h3>
                        </div>
                        <div className="input-position">
                            <Form.Field className="form-group" name="password">
                                <Form.Label className="input-placeholder">New Password</Form.Label>
                                <Form.Control asChild>
                                    <input
                                        className="form-style"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Form.Control>
                            </Form.Field>
                        </div>
                        <button className="btn" onClick={handleConfirm}>
                            Reset Password
                        </button>
                    </div>
                </div>
            </Form.Root>
        </main>
    );
}

const OAUTH_PROVIDERS = [
    {
        provider: "google",
        label: "Sign in with Google",
        icon: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    },
    {
        provider: "github",
        label: "Sign in with Github",
        icon: "https://github.githubassets.com/favicons/favicon.svg",
    },
];

export const OAuthButton = ({ icon, label, provider, iconBg }) => (
    <button type="button" className="social-button" onClick={() => signInWithOAuth(provider)}>
        <span className="social-icon-wrapper" style={{ background: iconBg }}>
            <img src={icon} alt={label} className="social-icon" />
        </span>
        <span>{label}</span>
    </button>
);

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [emailSignInInfo, setEmailSignInInfo] = useState({
        email: "",
        password: "",
    });

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
                            <Link className="link" to="/reset">
                                Forgot your password?
                            </Link>
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
                    <div className="horizontalSeparator"></div>
                    <div className="social-login">
                        {OAUTH_PROVIDERS.map((provider) => (
                            <OAuthButton
                                key={provider.provider}
                                icon={provider.icon}
                                label={provider.label}
                                provider={provider.provider}
                            />
                        ))}
                    </div>
                </div>
            </Form.Root>
        </main>
    );
}
