import store from "../redux/store";
import { signInWithRedirect } from 'firebase/auth';
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { redirect } from 'react-router-dom';
import { setIsLoggedIn, setUser } from "../redux/features/authSlice";



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

export async function signOut() {
    try {
        const signOutSuccess = await auth.signOut()
        if (signOutSuccess) {
            const userRef = doc(db, "users", user.uid)
            const updateSuccess = await updateDoc(userRef, {
                status: "offline"
            })

            if (updateSuccess) {
                store.dispatch(setUser({ displayName: null, avatar: null, uid: null, createdAt: null }))
                store.dispatch(setIsLoggedIn(false))
                redirect("/")
            }
        }
    } catch (error) {
        store.dispatch(setError("signOut", error))
        console.error("Sign out Error", error)
    }
}

export async function changeStatus(status) {
    const user = store.getState().auth.user;
    store.dispatch(setUser({ ...user, status: status }))

    const updateSuccess = await updateDoc(doc(db, "users", user.id), {
        status: status
    })

}
