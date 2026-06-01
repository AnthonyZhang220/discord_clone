import store from "@/redux/store";
import {
    signInWithRedirect,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
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
import { showError } from "@/utils/showError";

const GoogleProvider = new GoogleAuthProvider();
const FacebookProvider = new FacebookAuthProvider();
const TwitterProvider = new TwitterAuthProvider();
const GithubProvider = new GithubAuthProvider();

export const signInWithOAuth = async (provider) => {
    try {
        try {
            sessionStorage.setItem("oauthRedirectInFlight", "1");
        } catch (e) {
            // ignore storage failures
        }

        // Ensure persistence is set before redirecting so redirect result can be restored.
        try {
            await setPersistence(auth, browserLocalPersistence);
        } catch (pErr) {
            console.warn("setPersistence failed, proceeding with redirect", pErr);
        }

        let selectedProvider = null;
        switch (provider) {
            case "google":
                selectedProvider = GoogleProvider;
                break;
            case "facebook":
                selectedProvider = FacebookProvider;
                break;
            case "twitter":
                selectedProvider = TwitterProvider;
                break;
            case "github":
                selectedProvider = GithubProvider;
                break;
            default:
                showError("signInWithOAuth", "Unsupported OAuth provider.");
                return;
        }

        try {
            await signInWithPopup(auth, selectedProvider);
            try {
                sessionStorage.removeItem("oauthRedirectInFlight");
            } catch (e) {
                // ignore storage failures
            }
            return;
        } catch (popupError) {
            const code = popupError?.code || "";
            const shouldFallbackToRedirect =
                code === "auth/popup-blocked" ||
                code === "auth/popup-closed-by-user" ||
                code === "auth/cancelled-popup-request" ||
                code === "auth/operation-not-supported-in-this-environment";

            if (!shouldFallbackToRedirect) {
                throw popupError;
            }
        }

        await signInWithRedirect(auth, selectedProvider);
    } catch (error) {
        showError("signInWithOAuth", error?.message || String(error));
    }
};

// (Removed popup helpers and debug functions to restore redirect-only behavior)

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
        showError("signOut", error?.message || String(error));
    }
}

export async function changeStatus(status) {
    const user = store.getState().auth.user;
    store.dispatch(setUser({ ...user, status: status }));

    await updateDoc(doc(db, "users", user.id), {
        status: status,
    });
}
