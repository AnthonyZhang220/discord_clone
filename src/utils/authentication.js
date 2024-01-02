import store from "../redux/store";
import { onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { redirect } from 'react-router-dom';
import { getSelectStore } from "./userSelectStore";
import { setIsLoggedIn, setUser } from "../redux/features/authSlice";
import { getBannerColor } from "./getBannerColor";


const GoogleProvider = new GoogleAuthProvider();
const FacebookProvider = new FacebookAuthProvider();
const TwitterProvider = new TwitterAuthProvider();
const GithubProvider = new GithubAuthProvider();

export const signInWithOAuth = (provider) => async () => {
    try {
        switch (provider) {
            case "google":
                await signInWithRedirect(auth, GoogleProvider);
                break;
            case "facebook":
                await signInWithRedirect(auth, FacebookProvider);
                break;
            case "twitter":
                await signInWithRedirect(auth, TwitterProvider);
                break;
            case "github":
                await signInWithRedirect(auth, GithubProvider);
                break;
            default:
                console.log("Provider not supported!")
        }
    } catch (error) {
        console.error(`Error signing in with ${provider}`, error)
    }
}

export async function listenToAuthStateChange() {
    try {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("userData", userData)
                    store.dispatch(setUser(userData))
                } else {
                    const userDoc = await setDoc(userRef, {
                        displayName: user.displayName,
                        email: user.email ? user.email : "",
                        profileURL: user.photoURL,
                        id: user.uid,
                        createdAt: Timestamp.fromDate(new Date()),
                        status: "online",
                        friends: [],
                        bannerColor: await getBannerColor(user.photoURL)
                    })
                    if (userDoc) {
                        store.dispatch(setUser(userDoc))
                    }
                }
                getSelectStore(user.uid)
                store.dispatch(setIsLoggedIn(true))
                return redirect("/channels")
            } else {
                updateDoc(doc(db, "users", user.uid))
                store.dispatch(setUser(null))
                store.dispatch(setIsLoggedIn(false))
                return redirect("/")
            }
        })
    } catch (error) {
        store.dispatch(setError("Auth", error))
        console.error("Auth Slice", error)
    }
}

export async function signOut() {
    try {
        const signOutSuccess = await auth.signOut()
        if (signOutSuccess) {
            const userRef = doc(db, "users", user.uid)
            const updateSuccess = await updateDoc(userRef, {
                status: "offline"
            })

            if (updateSuccess) {
                store.dispatch(setUser({ displayName: null, profileURL: null, uid: null, createdAt: null }))
                store.dispatch(setIsLoggedIn(false))
                return redirect("/")
            }
        }
    } catch (error) {
        store.dispatch(setError("signOut", error))
        console.error("Sign out Error", error)
    }
}

export async function changeStatus(status, user) {
    const userObj = JSON.parse(localStorage.getItem(`${user.uid}`))

    localStorage.setItem(`${user.uid}`, JSON.stringify({ ...userObj, status: status }))

    const updateSuccess = await updateDoc(doc(db, "users", user.uid), {
        status: status
    })
    if (updateSuccess) {
        store.dispatch(setUser({ ...user, status: status }))
    }
}
