import store from "@/redux/store";
import { signInWithRedirect } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
    FacebookAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
} from "firebase/auth";
import { redirect } from "react-router-dom";
import { setIsLoggedIn, setUser } from "@/redux/features/authSlice";
import { setError } from "@/redux/features/errorSlice";

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
            // provider not supported
        }
    } catch (error) {
        store.dispatch(setError("signInWithOAuth", error));
    }
};

export async function signOut() {
    try {
        await auth.signOut();
        const user = store.getState().auth.user;
        if (user && user.id) {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                status: "offline",
            });
        }

        store.dispatch(setUser({ displayName: null, avatar: null, uid: null, createdAt: null }));
        store.dispatch(setIsLoggedIn(false));
        redirect("/");
    } catch (error) {
        store.dispatch(setError("signOut", error));
    }
}

export async function changeStatus(status) {
    const user = store.getState().auth.user;
    store.dispatch(setUser({ ...user, status: status }));

    await updateDoc(doc(db, "users", user.id), {
        status: status,
    });
}
