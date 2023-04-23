import { stunServers } from "./stunServerList";
import { db } from "./firebase";
import { collection, doc, onSnapshot, getDoc, updateDoc, arrayUnion, query, where, arrayRemove } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
import { FirebaseApp } from "firebase/app";


export const joinVoiceChatRoom = async (roomId, user) => {
    const peerConnection = new RTCPeerConnection();
    const roomRef = doc(db, "voicechannels", roomId);

    getDoc(roomRef).then((doc) => {
        if (!doc.exists()) {
            // Display an error message if the room does not exist
            console.log(`Room ${roomId} does not exist`);
            return;
        }
        const roomData = doc.data();
        // Create a new WebRTC peer connection object
        // Add the user's audio stream to the peer connection object
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            console.log("stream", stream)
            stream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, stream);
            });
            // onStream(stream);
        }).catch((error) => {
            console.log(`Failed to get user media: ${error}`);
        });


        // Listen for new ICE candidates and send them to other users in the room
        peerConnection.onicecandidate = (event) => {
            console.log('onicecandidate event:', event);
            if (event.candidate) {
                const candidateData = {
                    from: user.uid,
                    displayName: user.displayName,
                    profileURL: user.profileURL,
                    candidate: event.candidate.toJSON()
                };

                console.log("joinVoice")
                updateDoc(roomRef, {
                    liveUser: arrayUnion(candidateData)
                }).then(() => {
                    console.log("Succues! Add User to VoiceChannel")
                })
            }
        };

        // Listen for new remote streams from other users in the room
        peerConnection.ontrack = (event) => {
            // Play the remote stream in the user interface
            const remoteStream = event.streams[0];
            onStream(remoteStream);
        };

        function onStream(stream) {
            const audioElement = document.createElement('audio');
            audioElement.srcObject = stream;
            audioElement.play();
            document.body.appendChild(audioElement);
        }

        getPing(peerConnection);


        // const collectionRef = collection(db, "voicechannels").doc(roomId).collection("candidates")
        const q = query(collection(db, "voicechannels"), where("serverRef", "==", roomId))
        // Listen for new ICE candidates from other users in the room
        onSnapshot(q, (QuerySnapshot) => {
            QuerySnapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidateData = change.doc.data();
                    if (candidateData.from !== user.uid) {
                        peerConnection.addIceCandidate(new RTCIceCandidate(candidateData.candidate));
                    }
                }
            });
        });



    });
}

export const leaveVoiceChatRoom = (roomId, user) => {
    const roomRef = doc(db, "voicechannels", roomId);

    const candidateData = {
        from: user.uid,
        displayName: user.displayName,
        profileURL: user.profileURL,
        candidate: null // sending null as candidate data to indicate user leaving the room
    };

    // Remove ICE candidate of the leaving user from the room's live users array
    updateDoc(roomRef, {
        liveUser: arrayRemove(candidateData)
    }).then(() => {
        console.log("User successfully removed from room");
    }).catch((error) => {
        console.error("Error removing user from room: ", error);
    });

    // Close the WebRTC peer connection
    peerConnection.close();
}

export const getPing = () => {
    setInterval(() => {
        peerConnection.getStats(null).then(stats => {
            stats.forEach(report => {
                if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                    const rtt = report.currentRoundTripTime;
                    return rtt
                }
            });
        });
    }, 1000);
}

export const mute = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const audioTrack = stream.getAudioTracks()[0];

        audioTrack.enabled = false;
        console.log("mic off")
        // onStream(stream);
    }).catch(error => {
        console.error('Error getting user media:', error)
    })
}

export const unmute = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const audioTrack = stream.getAudioTracks()[0];

        audioTrack.enabled = true;
        console.log("mic on")
        // onStream(stream);
    }).catch(error => {
        console.error('Error getting user media:', error)
    })
}