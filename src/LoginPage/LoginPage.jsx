import React from 'react'
import { Box, Typography, FormHelperText, Button } from '@mui/material'

import { auth, db } from '../firebase'
import { doc, setDoc, updateDoc } from 'firebase/firestore'

import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'

import './LoginPage.scss'







export function RegisterPage() {
    const navigate = useNavigate();

    const [newUser, setNewUser] = React.useState(
        {
            email: "",
            username: "",
            password: "",
        })

    const handleNewUserFormSubmit = (e) => {

        const { name, value } = e.target;

        setNewUser({
            ...newUser,
            [name]: value,
        })
    }


    const createNewUser = () => {
        createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
            .then((userCredential) => {
                // Signed in 

                const user = userCredential.user;
                const userRef = doc(db, "users", user.uid);
                setDoc(userRef, {
                    email: newUser.email,
                    profileURL: "",
                    userId: user.uid,
                    createdAt: Timestamp.fromDate(new Date()),
                    displayName: newUser.username,
                })


                // ...
            }).then(() => {
                navigate("../channels")
            })
    }

    //create a new account
    React.useEffect(() => {


    }, [newUser.username])

    return (
        <Box component="main" className="register-page">
            <Box component="form" className="form-container">
                <Box className="form-wrapper">
                    <Box className="form-center">
                        <Box className="primary-title">
                            <Typography variant="h5">
                                Create an account
                            </Typography>
                        </Box>
                        <Box className="input-position">
                            <Box className="form-group">
                                <FormHelperText className="input-placeholder">Email</FormHelperText>
                                <input className="form-style" type="email" name='email' onChange={e => handleNewUserFormSubmit(e)} style={{ marginBottom: "20px" }} />
                            </Box>
                            <Box className="form-group">
                                <FormHelperText className="input-placeholder">username</FormHelperText>
                                <input className="form-style" type="text" name='username' onChange={e => handleNewUserFormSubmit(e)} style={{ marginBottom: "20px" }}
                                />
                            </Box>
                            <Box className="form-group">
                                <FormHelperText id="outlined-weight-helper-text" className="input-placeholder">Password</FormHelperText>
                                <input className="form-style" type="password" name="password" onChange={e => handleNewUserFormSubmit(e)}
                                    style={{ marginBottom: "20px" }}
                                />
                            </Box>
                        </Box>
                        <Box className="btn-position">
                            <Button className="btn" onClick={createNewUser}>Continue</Button>
                        </Box>
                        <Box component="span" className="register-container"><Link to="/" className="link">Already have an account?</Link></Box>
                    </Box>
                </Box>
            </Box>
        </Box>

    )
}


export function ResetPasswordPage() {
    const navigate = useNavigate();

    return (
        <Box component="main" className="reset-page">
            <Box component="form" className="form-container">
                <Box className="form-wrapper">
                    <Box className="form-center">
                        <Typography variant='h4'>
                            A reset email has been sent to . Please check your email and follow the instructions to reset your password.
                        </Typography>
                        <Button onClick={() => navigate("/")}>
                            <Link to="/">
                                Sign In
                            </Link>
                        </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}



export default function LoginPage({ googleSignIn }) {


    const navigate = useNavigate();

    const [emailSignInInfo, setEmailSignInInfo] = React.useState({ email: "", password: "" })


    const handleResetPassword = () => {

        sendPasswordResetEmail(auth, emailSignInInfo.email)
            .then(() => {
                // Password reset email sent!
                navigate("../reset")
            })

    }

    const emailSignIn = () => {
        signInWithEmailAndPassword(auth, emailSignInInfo.email, emailSignInInfo.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUserInfo({ name: user.displayName, profileURL: user.photoURL })
                navigate("/channels")
                // ...

            })
    }


    const handleEmailSignInForm = (e) => {
        e.preventDefault();

        const { name, value } = e.target;

        setEmailSignInInfo({
            ...emailSignInInfo,
            [name]: value,
        })
    }

    React.useEffect(() => {
    }, [emailSignInInfo])

    return (
        <Box component="main" className="login-page">
            <Box component="form" className="form-container">
                <Box className="form-wrapper">
                    <Box className="form-center">
                        <Box className="primary-title">
                            <Typography variant="h5">
                                Welcome back!
                            </Typography>
                        </Box>
                        <Box className="secondary-title">
                            <Typography variant="h6">
                                We're so excited to see you again!
                            </Typography>
                        </Box>
                        <Box className="input-position">
                            <Box className="form-group">
                                <FormHelperText className="input-placeholder">Email</FormHelperText>
                                <input name="email" className="form-style" style={{ marginBottom: "20px" }} onChange={e => handleEmailSignInForm(e)} />
                            </Box>
                            <Box className="form-group">
                                <FormHelperText id="outlined-weight-helper-text" className="input-placeholder">Password</FormHelperText>
                                <input name="password" className="form-style" onChange={e => handleEmailSignInForm(e)} />
                            </Box>
                        </Box>
                        <Box className="password-container"><Button className="link" onClick={handleResetPassword}>Forgot your password?</Button></Box>
                        <Box className="btn-position">
                            <Button className="btn" onClick={emailSignIn}>login</Button>
                        </Box>
                        <Box component="span" className="register-container">Need an account? <Link to="/register" className="link">Register</Link></Box>
                    </Box>
                    <Box className="verticalSeparator"></Box>
                    <Box className="social-login">
                        <Box className="google-button" component="img" src="./assets/google-sign-in/btn_google_signin_light_normal_web.png" type="button" onClick={googleSignIn} ></Box>
                        <Box className="google-button" component="img" src="./assets/google-sign-in/btn_google_signin_light_normal_web.png" type="button" onClick={googleSignIn} ></Box>
                        <Box className="google-button" component="img" src="./assets/google-sign-in/btn_google_signin_light_normal_web.png" type="button" onClick={googleSignIn} ></Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}




