import React, { useEffect, Fragment } from "react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import Chat from "./components/Chat/Chat";
import ServerList from "./components/ServerList/ServerList";
import Channel from "./components/Channel/Channel";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoginPage, { ResetPasswordPage } from "./components/LoginPage/LoginPage";
import { RegisterPage } from "./components/LoginPage/LoginPage";
import { db, auth } from "./firebase";
import { Outlet } from "react-router-dom";
// import { RtcRole } from "agora-token"
import VoiceChat from "./components/VoiceChat/VoiceChat";
import { useDispatch, useSelector } from "react-redux";
import ThemeContextProvider from "./contexts/ThemeContextProvider";
import CssBaseline from "@mui/material/CssBaseline";
import DirectMessageMenu from "./components/DirectMessage/DirectMessageMenu/DirectMessageMenu";
import DirectMessageBody from "./components/DirectMessage/DirectMessageBody/DirectMessageBody";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { getSelectStore } from "./utils/userSelectStore";
import { setUser, setIsLoggedIn } from "./redux/features/authSlice";
import { setIsDirectMessagePageOpen } from "./redux/features/directMessageSlice";
import { getBannerColor } from "./utils/getBannerColor";
import Error from "./components/Error/Error";
import "./App.scss";

function App() {
    const dispatch = useDispatch();
    // user state is not used in this component
    const { isVoiceChatPageOpen } = useSelector((state) => state.voiceChat);
    const { currVoiceChannel } = useSelector((state) => state.channel);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        try {
            /* eslint-disable no-console */
            console.info("initial location:", window.location.href);
            console.info(
                "initial localStorage keys:",
                Object.keys(localStorage).filter((k) =>
                    /firebase|redirect|PENDING_REDIRECT|redirectUser/i.test(k)
                )
            );
            /* eslint-enable no-console */
        } catch (e) {
            // ignore non-browser
        }
        // Handle OAuth redirect results (optional: access tokens, credentials)
        (async () => {
            try {
                const result = await getRedirectResult(auth).catch(() => null);
                // eslint-disable-next-line no-console
                console.info("getRedirectResult:", result);
                if (result && result.user) {
                    // If redirect returned a user, ensure app state is populated the same way
                    try {
                        const user = result.user;
                        const userRef = doc(db, "users", user.uid);
                        const userDoc = await getDoc(userRef);

                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            dispatch(
                                setUser({
                                    displayName: userData.displayName,
                                    avatar: userData.avatar,
                                    id: userData.id,
                                    createdAt: userData.createdAt?.seconds
                                        ? userData.createdAt.seconds
                                        : null,
                                    status: userData.status,
                                    email: userData.email,
                                    bannerColor: userData.bannerColor,
                                    friends: userData.friends || [],
                                })
                            );
                        } else {
                            const newUser = {
                                displayName: user.displayName,
                                email: user.email ? user.email : "",
                                avatar: user.photoURL,
                                id: user.uid,
                                createdAt: Timestamp.fromDate(new Date()),
                                status: "online",
                                friends: [],
                                bannerColor: await getBannerColor(user.photoURL),
                            };

                            await setDoc(userRef, newUser);

                            dispatch(
                                setUser({
                                    displayName: newUser.displayName,
                                    avatar: newUser.avatar,
                                    id: newUser.id,
                                    createdAt: newUser.createdAt.seconds,
                                    status: newUser.status,
                                    email: newUser.email,
                                    bannerColor: newUser.bannerColor,
                                    friends: newUser.friends,
                                })
                            );
                        }

                        getSelectStore();
                        dispatch(setIsLoggedIn(true));
                        try {
                            const cur = window.location.pathname || "";
                            if (!cur.startsWith("/channels")) {
                                navigate("/channels");
                            }
                        } catch (e) {
                            navigate("/channels");
                        }
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error("Error processing redirect user", e);
                    }
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn("getRedirectResult failed", err);
            }
        })();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // eslint-disable-next-line no-console
            console.info("onAuthStateChanged user:", user);
            try {
                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        dispatch(
                            setUser({
                                displayName: userData.displayName,
                                avatar: userData.avatar,
                                id: userData.id,
                                createdAt: userData.createdAt?.seconds
                                    ? userData.createdAt.seconds
                                    : null,
                                status: userData.status,
                                email: userData.email,
                                bannerColor: userData.bannerColor,
                                friends: userData.friends || [],
                            })
                        );
                    } else {
                        const newUser = {
                            displayName: user.displayName,
                            email: user.email ? user.email : "",
                            avatar: user.photoURL,
                            id: user.uid,
                            createdAt: Timestamp.fromDate(new Date()),
                            status: "online",
                            friends: [],
                            bannerColor: await getBannerColor(user.photoURL),
                        };

                        await setDoc(userRef, newUser);

                        dispatch(
                            setUser({
                                displayName: newUser.displayName,
                                avatar: newUser.avatar,
                                id: newUser.id,
                                createdAt: newUser.createdAt.seconds,
                                status: newUser.status,
                                email: newUser.email,
                                bannerColor: newUser.bannerColor,
                                friends: newUser.friends,
                            })
                        );
                    }

                    getSelectStore();
                    dispatch(setIsLoggedIn(true));
                    try {
                        const cur = window.location.pathname || "";
                        if (!cur.startsWith("/channels")) {
                            navigate("/channels");
                        }
                    } catch (e) {
                        navigate("/channels");
                    }
                } else {
                    dispatch(setUser(null));
                    dispatch(setIsLoggedIn(false));
                    try {
                        const cur = window.location.pathname || "";
                        if (cur !== "/") {
                            navigate("/");
                        }
                    } catch (e) {
                        navigate("/");
                    }
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error fetching user data", error);
            }
        });

        return unsubscribe;
    }, [dispatch, navigate]);

    useEffect(() => {
        try {
            const path = location.pathname || "";
            if (path.includes("/channels/@me")) {
                dispatch(setIsDirectMessagePageOpen(true));
            } else if (path.startsWith("/channels")) {
                dispatch(setIsDirectMessagePageOpen(false));
            }
        } catch (e) {
            // ignore in non-browser environments
        }
    }, [location.pathname, dispatch]);

    return (
        <ThemeContextProvider>
            <CssBaseline />
            <Error />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/reset" element={<ResetPasswordPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    element={
                        <div className="app-mount">
                            <div className="app-container">
                                <Outlet />
                            </div>
                        </div>
                    }
                >
                    <Route
                        path="/channels"
                        element={
                            <Fragment>
                                <ServerList />
                                <Outlet />
                            </Fragment>
                        }
                    >
                        <Route
                            index
                            element={
                                <Fragment>
                                    <Channel />
                                    {isVoiceChatPageOpen ? (
                                        <VoiceChat currVoiceChannel={currVoiceChannel} />
                                    ) : (
                                        <Chat />
                                    )}
                                </Fragment>
                            }
                        />
                        <Route
                            path="@me"
                            element={
                                <Fragment>
                                    <DirectMessageMenu />
                                    <DirectMessageBody />
                                </Fragment>
                            }
                        />
                    </Route>
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </ThemeContextProvider>
    );
}

export default App;
