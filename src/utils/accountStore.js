import { auth } from "@/firebase";
import { signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const ACCOUNTS_KEY = "savedAccounts";
const ACTIVE_UID_KEY = "activeUid";

// ── 读取 ─────────────────────────────────────────────────────

export const getSavedAccounts = () => {
    try {
        const raw = localStorage.getItem(ACCOUNTS_KEY);
        const accounts = raw ? JSON.parse(raw) : null;
        if (!accounts || typeof accounts !== "object") return {};
        return accounts;
    } catch (e) {
        return {};
    }
};

export const getActiveUid = () => {
    try {
        return localStorage.getItem(ACTIVE_UID_KEY) || "";
    } catch (e) {
        return "";
    }
};

// ── 写入 ─────────────────────────────────────────────────────

// 登录成功后调用，保存当前用户信息
export const saveAccount = (firebaseUser) => {
    try {
        const accounts = getSavedAccounts();
        // 取第一个 provider 的 id
        const providerId = firebaseUser.providerData?.[0]?.providerId || "password";

        accounts[firebaseUser.uid] = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
            refreshToken: firebaseUser.refreshToken,
            providerId, // ← 新增
        };
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
        localStorage.setItem(ACTIVE_UID_KEY, firebaseUser.uid);
    } catch (e) {
        // ignore
    }
};

export const removeAccount = (uid) => {
    try {
        const accounts = getSavedAccounts();
        delete accounts[uid];
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
        if (getActiveUid() === uid) {
            localStorage.removeItem(ACTIVE_UID_KEY);
        }
    } catch (e) {
        // ignore
    }
};

// ── 切换账户 ─────────────────────────────────────────────────

export const switchAccount = async (targetUid) => {
    try {
        const accounts = getSavedAccounts();
        const target = accounts[targetUid];
        if (!target) throw new Error("Account not found");

        await signOut(auth);

        // 根据 provider 分别处理
        switch (target.providerId) {
            case "google.com": {
                const provider = new GoogleAuthProvider();
                provider.setCustomParameters({ login_hint: target.email });
                await signInWithPopup(auth, provider);
                break;
            }
            case "github.com": {
                const provider = new GithubAuthProvider();
                await signInWithPopup(auth, provider);
                break;
            }
            case "password": {
                // email 登录需要密码，无法静默切换
                // 跳转到登录页让用户重新输入
                localStorage.setItem("pendingSwitchEmail", target.email);
                window.location.href = "/";
                return;
            }
            default:
                throw new Error(`Unknown provider: ${target.providerId}`);
        }

        localStorage.setItem(ACTIVE_UID_KEY, targetUid);
    } catch (e) {
        console.error("switchAccount failed:", e);
    }
};
