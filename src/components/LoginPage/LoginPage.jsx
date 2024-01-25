import React, { useState } from 'react'
import { Box, Typography, FormHelperText, Button, SvgIcon, FormLabel } from '@mui/material'

import { auth, db } from '../../firebase'
import { doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore'

import { Link, createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'

import GoogleButton from "./google.svg"
import FacebookButton from "./facebook.svg"
import AppleButton from "./apple.svg"
import TwitterButton from "./twitter.svg"
import GithubButton from "./github.svg"

import './LoginPage.scss'
import { useDispatch, useSelector } from 'react-redux'
import { signInWithOAuth } from '../../utils/authentication'
import { setUser } from '../../redux/features/authSlice'
import { setError } from '../../redux/features/errorSlice'

export function RegisterPage() {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState(
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
                    displayName: newUser.username,
                    email: newUser.email,
                    avatar: "",
                    id: user.uid,
                    createdAt: Timestamp.fromDate(new Date()),
                    status: "online",
                    friends: [],
                }).then((doc) => {
                    dispatch(setUser({ displayName: doc.data().displayName, avatar: doc.data().avatar, id: doc.data().id, createdAt: doc.data().createdAt.seconds, status: doc.data().status }))

                    navigate("../channels")
                })
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
                            <Typography variant="h3">
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
    const [searchparams] = useSearchParams();
    const navigate = useNavigate();

    return (
        <Box component="main" className="reset-page">
            <Box component="form" className="form-container">
                <Box className="form-wrapper">
                    <Box className="form-center">
                        <Typography variant='h4'>
                            {
                                `A reset email has been sent to ${searchparams.get("email")}. Please check your email and follow the instructions to reset your password.`
                            }
                        </Typography>
                        <Button onClick={() => navigate("/")}>
                            Sign In
                        </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}



export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [emailSignInInfo, setEmailSignInInfo] = useState({ email: "", password: "" })

    const handleResetPassword = () => {
        sendPasswordResetEmail(auth, emailSignInInfo.email)
            .then(() => {
                // Password reset email sent!
                navigate({ pathname: "/reset", search: createSearchParams({ email: emailSignInInfo.email }).toString() })
            })
    }
    const emailSignIn = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, emailSignInInfo.email, emailSignInInfo.password)
            const userRef = doc(db, "users", result.user.uid);
            getDoc(userRef).then((doc) => {
                dispatch(setUser({ displayName: doc.data().displayName, avatar: doc.data().avatar, id: doc.data().id, createdAt: doc.data().createdAt.seconds, status: doc.data().status }))
                dispatch(setError(null))
                navigate("/channels")
            })

        } catch (error) {
            setEmailSignInInfo({ ...emailSignInInfo, password: "" })
            dispatch(setError({ type: error.name, reason: error.code }))
        }
        // ...
    }

    const handleEmailSignInForm = (e) => {
        e.preventDefault();

        const { name, value } = e.target;

        setEmailSignInInfo({
            ...emailSignInInfo,
            [name]: value,
        })
    }

    return (
        <Box component="main" className="login-page">
            <Box component="form" className="form-container">
                <Box className="form-wrapper">
                    <Box className="form-center">
                        <Box className="primary-title">
                            <Typography variant="h3">
                                Welcome back!
                            </Typography>
                        </Box>
                        <Box className="secondary-title">
                            <Typography variant="h5">
                                We're so excited to see you again!
                            </Typography>
                        </Box>
                        <Box className="input-position">
                            <Box className="form-group">
                                <FormLabel component="div" className="input-placeholder" required={true}>Email</FormLabel>
                                <input required={true} type="email" name="email" className="form-style" style={{ marginBottom: "20px" }} value={emailSignInInfo.email} onChange={e => handleEmailSignInForm(e)} />
                            </Box>
                            <Box className="form-group">
                                <FormLabel component="div" required={true} id="outlined-weight-helper-text" className="input-placeholder">Password</FormLabel>
                                <input required={true} type="password" name="password" className="form-style" value={emailSignInInfo.password} onChange={e => handleEmailSignInForm(e)} />
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
                        <SvgIcon className="social-button" component={GoogleButton} inheritViewBox onClick={() => dispatch(signInWithOAuth("google"))}></SvgIcon>
                        <SvgIcon className="social-button" component={FacebookButton} inheritViewBox onClick={() => dispatch(signInWithOAuth("facebook"))}></SvgIcon>
                        <SvgIcon className="social-button" component={TwitterButton} inheritViewBox onClick={() => dispatch(signInWithOAuth("twitter"))}></SvgIcon>
                        <SvgIcon className="social-button" component={GithubButton} inheritViewBox onClick={() => dispatch(signInWithOAuth("github"))}></SvgIcon>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}




