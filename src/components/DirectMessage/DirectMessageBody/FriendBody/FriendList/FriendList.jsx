import React, { Fragment, useMemo, useEffect } from 'react'
import { Box, FormControl, InputBase, FormHelperText, List, ListItemButton, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Typography, Divider, Badge } from '@mui/material'
import { query, collection, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../../../../firebase'
import FriendTab from '../FriendTab/FriendTab'
import { setFriendIdList, setFriendList } from '../../../../../redux/features/directMessageSlice'
import { useDispatch, useSelector } from 'react-redux'

import "./FriendList.scss"

export default function FriendList() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { friendFilter, friendList, friendIdList } = useSelector(state => state.directMessage)

    useEffect(() => {
        if (user.id) {
            // const docRef = doc(collectionRef, user.uid)
            const docRef = query(collection(db, "users"), where("id", "==", user.id))

            const unsub = onSnapshot(docRef, (QuerySnapshot) => {
                let data = [];
                QuerySnapshot.forEach((doc) => {
                    data = doc.data().friends
                })
                dispatch(setFriendIdList(data));
            })

            // return unsub
        }

    }, [user.id])
    //get user's friend list
    useEffect(() => {
        if (friendIdList.length > 0) {
            const q = query(collection(db, "users"), where("id", "in", friendIdList))
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const friendList = [];
                snapshot.forEach((doc) => {
                    friendList.push({
                        displayName: doc.data().displayName,
                        profileURL: doc.data().profileURL,
                        status: doc.data().status,
                        id: doc.data().id
                    })
                })
                dispatch(setFriendList(friendList))
            })
            // return unsubscribe
        }
    }, [friendIdList.length])
    return (
        <Box className="friend-list-container">
            <List dense>
                {
                    friendFilter == "all" ?
                        <Fragment>
                            <Box sx={{ p: 1 }}>
                                <Typography variant="h6">
                                    All - {friendList.length}
                                </Typography>
                            </Box>
                            {
                                friendList.map(({ displayName, status, profileURL, id }) => (
                                    <FriendTab displayName={displayName} profileURL={profileURL} status={status} key={id} />
                                ))
                            }
                        </Fragment>
                        :
                        <Fragment>
                            <Box sx={{ p: 1 }}>
                                <Typography variant="h6">
                                    Online - {friendList.filter(obj => obj.status !== "offline").length}
                                </Typography>
                            </Box>
                            {
                                friendList.filter(obj => obj.status !== "offline").map(({ displayName, status, profileURL, id }) => (
                                    <FriendTab displayName={displayName} profileURL={profileURL} status={status} key={id} />
                                ))
                            }
                        </Fragment>
                }
            </List>
        </Box>
    )
}
