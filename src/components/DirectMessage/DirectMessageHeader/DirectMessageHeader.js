




export default function DirectMessageHeader() {
    return (
        <>
            {isDirectMessageChatSelected ?
                <PrivateChannelHeader /> : <FriendHeader />
            }
        </>
    )
}


export const FriendHeader = () => {

    return (
        <Box className="friend-main-header" component="section">
            <Box className="friend-main-header-name">
                <SvgIcon component={FriendIcon} inheritViewBox sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                <Typography variant="h3" className="friend-main-header-text">Friends</Typography>
                <Divider orientation='vertical' variant='fullWidth' sx={{ backgroundColor: "#3e4046", m: "0 8px", width: "1px", flex: "0 0 auto", height: "24px" }} />
                <Box className="friend-main-header-button">
                    <Stack direction="row" spacing={1}>
                        <Button className={`${category === "online" ? "active" : ""}`} onClick={() => setCategory("online")} disableRipple>
                            Online
                        </Button>
                        <Button className={`${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")} disableRipple>
                            All
                        </Button>
                        <Button className={`${category === "pending" ? "active" : ""}`} onClick={() => setCategory("pending")} disableRipple>
                            Pending
                        </Button>
                        <Button className={`${category === "blocked" ? "active" : ""}`} onClick={() => setCategory("blocked")} disableRipple>
                            Blocked
                        </Button>
                        <Button className={`addfriend-button ${category === "addfriend" ? "active" : ""}`} variant='contained' onClick={() => setCategory("addfriend")} disableRipple>
                            Add Friend
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <Box className="friend-main-header-feature">
                <Box className="friend-main-header-feature-icon">
                    <FunctionTooltip title={
                        <React.Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >New Group DM</Typography>
                        </React.Fragment>} placement="bottom">
                        <Box>
                            <SvgIcon inheritViewBox component={GroupDMIcon} />
                        </Box>
                    </FunctionTooltip>
                </Box>
                <Box className="friend-main-header-feature-icon">
                    <FunctionTooltip title={
                        <React.Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >Inbox</Typography>
                        </React.Fragment>} placement="bottom">
                        <Box>
                            <InboxIcon />
                        </Box>
                    </FunctionTooltip>
                </Box>
            </Box>
        </Box>
    )
}

export const PrivateChannelHeader = () => {
    return (
        <Box className="friend-main-header" component="section">
            <Box className="friend-main-header-name">
                <AlternateEmailSharp sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                <Box component="span" variant="h3" className="friend-main-header-hashtag">
                    {currentPrivateChannel.name}
                </Box>
                <Box>
                    <StatusList status={currentPrivateChannel.status} size={15} />
                </Box>
            </Box>
            <Box className="friend-main-header-feature">
                <FunctionTooltip title={
                    <React.Fragment>
                        <Typography variant="body1" sx={{ m: 0.5 }} >More</Typography>
                    </React.Fragment>} placement="bottom">
                    <PeopleAltIcon color="white" onClick={() => setUserSideBar(!userSideBar)} />
                </FunctionTooltip>
            </Box>
        </Box>
    )
}