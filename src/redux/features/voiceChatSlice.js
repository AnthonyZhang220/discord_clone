import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { batch } from "react-redux";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase";
import { setCurrVoiceChannel } from "@/redux/features/channelSlice";
import AgoraConfig from "@/contexts/agora/config";
import fetchRTCToken from "@/utils/fetchToken";

const VOICE_CHAT_SESSION_KEY = "voiceChat.lastSession";

const saveVoiceChatSession = (session) => {
    try {
        localStorage.setItem(VOICE_CHAT_SESSION_KEY, JSON.stringify(session));
    } catch (error) {
        // ignore if storage unavailable
    }
};

export const loadVoiceChatSession = () => {
    try {
        const raw = localStorage.getItem(VOICE_CHAT_SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
};

const clearVoiceChatSession = () => {
    try {
        localStorage.removeItem(VOICE_CHAT_SESSION_KEY);
    } catch (error) {
        // ignore
    }
};

export const joinVoiceChannel = createAsyncThunk(
    "voiceChat/joinVoiceChannel",
    async ({ name, channelId }, { dispatch, getState, rejectWithValue }) => {
        const state = getState();
        const currUser = state.auth.user;
        const currServerName = state.server.currServer?.name || "";

        if (!currUser?.id) {
            return rejectWithValue("User is not authenticated");
        }
        if (!channelId) {
            return rejectWithValue("Voice channel ID is required");
        }

        dispatch(setIsVoiceChatLoading(true));

        const participant = {
            id: currUser.id,
            avatar: currUser.avatar,
            displayName: currUser.displayName,
        };

        const channelRef = doc(db, "voicechannels", channelId);
        try {
            await updateDoc(channelRef, {
                participants: arrayUnion(participant),
            });
        } catch (error) {
            dispatch(setIsVoiceChatLoading(false));
            dispatch(setIsVoiceChatPageOpen(false));
            return rejectWithValue(error.message || "Failed to add participant to voice channel");
        }

        saveVoiceChatSession({ name, id: channelId, serverName: currServerName });

        let token;
        try {
            token = await fetchRTCToken(AgoraConfig, channelId);
        } catch (error) {
            dispatch(setIsVoiceChatLoading(false));
            dispatch(setIsVoiceChatPageOpen(false));
            return rejectWithValue(error.message || "Failed to fetch Agora token");
        }

        if (!token) {
            dispatch(setIsVoiceChatLoading(false));
            dispatch(setIsVoiceChatPageOpen(false));
            return rejectWithValue("Failed to fetch Agora token");
        }

        batch(() => {
            dispatch(setCurrVoiceChannel({ name, id: channelId, serverName: currServerName }));
            dispatch(
                setAgoraConfig({
                    appid: AgoraConfig.appId,
                    channel: channelId,
                    uid: currUser.id,
                    token,
                })
            );
            dispatch(setIsVoiceChatPageOpen(true));
            dispatch(setIsVoiceChatLoading(false));
        });

        return token;
    }
);

export const leaveVoiceChannel = createAsyncThunk(
    "voiceChat/leaveVoiceChannel",
    async (_, { dispatch, getState }) => {
        dispatch(setIsVoiceChatLoading(true));
        dispatch(setIsVoiceChatConnected(false));
        dispatch(setIsVoiceChatPageOpen(false));

        const state = getState();
        const voiceChannel = state.channel.currVoiceChannel;
        const currUser = state.auth.user;

        if (voiceChannel?.id && currUser?.id) {
            const participant = {
                id: currUser.id,
                avatar: currUser.avatar,
                displayName: currUser.displayName,
            };
            const channelRef = doc(db, "voicechannels", voiceChannel.id);
            try {
                await updateDoc(channelRef, {
                    participants: arrayRemove(participant),
                });
            } catch (error) {
                // Ignore participant cleanup failure; continue with local disconnect.
            }
        }

        dispatch(setCurrVoiceChannel({}));
        dispatch(setAgoraConfig({}));
        dispatch(setRemoteUsers([]));
        clearVoiceChatSession();
        dispatch(setIsVoiceChatLoading(false));
    }
);

const voiceChatSlice = createSlice({
    name: "voiceChat",
    initialState: {
        isMicOn: true,
        isDeafen: false,
        isCameraOn: false,
        isScreenSharingOn: false,
        isScreenSharingActive: false,
        isVoiceChatConnected: false,
        isVoiceChatLoading: false,
        isVoiceChatPageOpen: false,
        agoraConfig: {},
        remoteUsers: [],
        connectionState: "",
        latency: null,
    },
    reducers: {
        setIsMicOn: (state, action) => {
            state.isMicOn = action.payload;
        },
        setIsDeafen: (state, action) => {
            state.isDeafen = action.payload;
        },
        setIsCameraOn: (state, action) => {
            state.isCameraOn = action.payload;
        },
        setIsScreenSharingOn: (state, action) => {
            state.isScreenSharingOn = action.payload;
        },
        setIsScreenSharingActive: (state, action) => {
            state.isScreenSharingActive = action.payload;
        },
        setIsVoiceChatConnected: (state, action) => {
            state.isVoiceChatConnected = action.payload;
        },
        setAgoraConfig: (state, action) => {
            state.agoraConfig = action.payload;
        },
        setIsVoiceChatPageOpen: (state, action) => {
            state.isVoiceChatPageOpen = action.payload;
        },
        setRemoteUsers: (state, action) => {
            state.remoteUsers = action.payload;
        },
        setConnectionState: (state, action) => {
            state.connectionState = action.payload;
        },
        setLatency: (state, action) => {
            state.latency = action.payload;
        },
        setIsVoiceChatLoading: (state, action) => {
            state.isVoiceChatLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(joinVoiceChannel.pending, (state) => {
                state.isVoiceChatLoading = true;
            })
            .addCase(joinVoiceChannel.fulfilled, (state) => {
                state.isVoiceChatLoading = false;
            })
            .addCase(joinVoiceChannel.rejected, (state) => {
                state.isVoiceChatLoading = false;
                state.isVoiceChatPageOpen = false;
            })
            .addCase(leaveVoiceChannel.pending, (state) => {
                state.isVoiceChatLoading = true;
            })
            .addCase(leaveVoiceChannel.fulfilled, (state) => {
                state.isVoiceChatLoading = false;
            })
            .addCase(leaveVoiceChannel.rejected, (state) => {
                state.isVoiceChatLoading = false;
            });
    },
});

export const {
    setIsCameraOn,
    setIsMicOn,
    setIsDeafen,
    setIsScreenSharingOn,
    setIsScreenSharingActive,
    setIsVoiceChatConnected,
    setAgoraConfig,
    setIsVoiceChatPageOpen,
    setRemoteUsers,
    setConnectionState,
    setLatency,
    setIsVoiceChatLoading,
} = voiceChatSlice.actions;

export default voiceChatSlice.reducer;
