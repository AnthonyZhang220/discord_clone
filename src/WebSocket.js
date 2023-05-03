import { stunServers } from "./stunServerList";
import React from "react"
import { db } from "./firebase";
import { collection, doc, onSnapshot, getDoc, updateDoc, arrayUnion, query, where, arrayRemove, QuerySnapshot, getDocs, addDoc, setDoc, onSnapshotsInSync } from "firebase/firestore";

const peerConnection = new RTCPeerConnection(stunServers);

let remoteStream;
let localStream;


let mediaConstraints = {
    "video": true,
    "audio": true
}

const makeCall = async (roomId, user) => {

    const collectionRef = collection(db, "calls")
    const callRef = doc(db, "calls", roomId);


    const offerCandidates = collection(callRef, "offerCandidates");
    const answerCandidates = collection(callRef, "answerCandidates");

    peerConnection.onicecandidate = (event) => {
        event.candidate && addDoc(offerCandidates, event.candidate.toJSON())
    }

    const offerDescription = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDescription)

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    }

    await setDoc(callRef, { offer })

    // const q1 = query(collection(db, "calls"), where(doc.id, "==", roomId))
    const q2 = query(collection(callRef, "answerCandidates"))
    const answerSnapshot = await getDocs(q2)

    onSnapshot(callRef, snapshot => {
        const data = snapshot.data();
        if (!peerConnection.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer)
            peerConnection.setRemoteDescription(answerDescription)
        }
    })

    // Listen for new ICE candidates from other users in the room
    answerSnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
            const candidateData = change.doc.data();
            if (candidateData.from !== user.uid) {
                const candidate = new RTCIceCandidate(candidateData)
                peerConnection.addIceCandidate(candidate);
            }
        }
    });
}

const answerCall = async (roomId, user) => {
    const callRef = doc(db, "calls", roomId);
    const roomRef = doc(db, "voicechannels", roomId)
    const roomDoc = await getDoc(roomRef)

    const offerCandidates = collection(callRef, "offerCandidates");
    const answerCandidates = collection(callRef, "answerCandidates");

    peerConnection.onicecandidate = event => {
        event.candidate && addDoc(answerCandidates, event.candidate.toJSON());


        const userList = roomDoc.data().liveUser
        const found = userList.some(item => item.userId == user.uid)

        if (event.candidate) {
            if (!found) {
                updateDoc(roomRef, {
                    liveUser: arrayUnion({
                        displayName: user.name,
                        userId: user.uid,
                        profileURL: user.profileURL,
                    })
                })
            } else {
                console.log("User Exists!")
            }
        }
    };

    // Fetch data, then set the offer & answer

    const callData = await getDoc(callRef);

    const offerDescription = callData.data().offer;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };

    await updateDoc(callRef, { answer });

    const q2 = query(collection(callRef, "offerCandidates"))
    const offerSnapshot = await getDocs(q2)

    offerSnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            let data = change.doc.data();
            peerConnection.addIceCandidate(new RTCIceCandidate(data))
        }
    })

}

export const joinVoiceChatRoom = async (roomId, user) => {
    const roomRef = doc(db, "voicechannels", roomId);
    //make offer
    const roomDoc = await getDoc(roomRef)
    const liveUserArray = roomDoc.data().liveUser
    if (!roomDoc.exists()) {
        // Display an error message if the room does not exist
        console.log(`Room ${roomId} does not exist`);
        return;
    }

    // Create a new WebRTC peer connection object
    // Add the user's audio stream to the peer connection object
    // localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)


    onStream()

    makeCall(roomId, user)
    answerCall(roomId, user)

    if (peerConnection.signalingState !== 'closed') {
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
            // onStream(stream);
        });
    } else {
        console.log("signaling closed")
    }

    //Collection ICE candidates
    // Listen for new ICE candidates and send them to other users in the room
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            const candidateData = {
                from: user.uid,
                displayName: user.name,
                profileURL: user.profileURL,
                candidate: event.candidate.toJSON(),
                offer: roomWithOffer.offer,
            };


            const userList = roomDoc.data().liveUser
            const found = userList.some(item => item.from === candidateData.from)

            if (found) {
                console.log("User Exists!")
            } else {
                updateDoc(roomRef, {
                    liveUser: arrayUnion(candidateData)
                }).then(() => {
                    console.log("Succues! Add User to VoiceChannel")
                })
            }

        }

    };

    // Listen for new remote streams from other users in the room
    // peerConnection.ontrack = (event) => {
    //     // Play the remote stream in the user interface
    //     [remoteStream] = event.streams;
    //     onStream(remoteStream)
    // };

    peerConnection.onconnectionstatechange = (event) => {
        if (peerConnection.connectionState === "connected") {
            console.log("connected")
        }

        if (peerConnection.connectionState === "connecting") {
            console.log("connecting")
        }
    }
};

const onStream = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    remoteStream = new MediaStream()

    localStream.getTracks().forEach((track) => {
        getPing(track)
        peerConnection.addTrack(track, localStream)
    })

    remoteStream.onaddtrack = (event) => {
        console.log('Track added to remote stream:', event.track);
    }

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            getPing(track)
            remoteStream.addTrack(track)
        })
    }

}

export const LocalVideo = () => {

    const localRef = React.useRef(null)

    React.useEffect(() => {
        console.log("local", localStream)
        localRef.current.srcObject = localStream;
    }, [localStream])


    return (
        <video autoPlay width="300" height="300" ref={localRef} />
    )
}

export const RemoteVideo = () => {

    const remoteRef = React.useRef(null)

    React.useEffect(() => {
        console.log("remote", remoteStream)
        remoteRef.current.srcObject = remoteStream;
        console.log(remoteRef.current.srcObject)
    }, [remoteStream])


    return (
        <video autoPlay width="300" height="300" ref={remoteRef} />
    )
}

// function onStream(streams) {
//     if (streams.length > 0) {
//         streams.forEach((stream) => {
//             const audioElement = document.createElement('audio');
//             audioElement.srcObject = stream;
//             audioElement.play();
//             document.body.appendChild(audioElement);
//         })
//     }
// }

export const leaveVoiceChatRoom = (roomId, user) => {
    const roomRef = doc(db, "voicechannels", roomId);

    getDoc(roomRef).then((doc) => {

        const candidateData = {
            from: user.uid,
            displayName: user.name,
            profileURL: user.profileURL,
            candidate: null // sending null as candidate data to indicate user leaving the room
        };

        const userList = doc.data().liveUser;
        const ele = userList.find(user => user.from === candidateData.from)

        if (ele) {
            // Remove ICE candidate of the leaving user from the room's live users array
            updateDoc(roomRef, {
                liveUser: arrayRemove(ele)
            }).then(() => {
                console.log("User successfully removed from room");
                // Close the WebRTC peer connection
                peerConnection.close();

            }).catch((error) => {
                console.error("Error removing user from room: ", error);
            });
        } else {
            console.log("User not in this voice channel!")
        }

    })

}

export const getPing = (mediaTrack) => {
    setInterval(() => {
        peerConnection.getStats(mediaTrack).then(stats => {
            stats.forEach(report => {
                if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                    const rtt = report.currentRoundTripTime;
                    return rtt
                }
            });
        });
    }, 1000);
}

// export const mute = async () => {
//     localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
//     remoteStream = new MediaStream()

//     localStream.getTracks().forEach((track) => {
//         const audioTrack = track.getAudioTracks()[0];
//         audioTrack.enabled = false;

//         console.log("mic off")
//         peerConnection.addTrack(audioTrack, localStream)
//     })

//     peerConnection.ontrack = (event) => {
//         event.streams[0].getTracks.forEach((track) => {
//             remoteStream.addTrack(track)
//         })
//     }

//     // onStream(stream);
// }

// export const unmute = async () => {
//     localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
//     remoteStream = new MediaStream()

//     localStream.getTracks().forEach((track) => {
//         const audioTrack = track.getAudioTracks()[0];
//         audioTrack.enabled = true;

//         console.log("mic off")
//         peerConnection.addTrack(audioTrack, localStream)
//     })

//     peerConnection.ontrack = (event) => {
//         event.streams[0].getTracks.forEach((track) => {
//             remoteStream.addTrack(track)
//         })
//     }
// }