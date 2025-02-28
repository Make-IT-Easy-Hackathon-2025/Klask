import React, { useState } from "react";
import { Container, Box, List, ListItem, ListItemText, Avatar, Typography, Button } from "@mui/material";
import NavBar from "../../components/Navbar";

// Sample data for group invites
const groupInvites = [
  { id: 1, groupName: "Tech Enthusiasts", groupPic: "https://via.placeholder.com/40", inviteMessage: "Join us for exciting tech discussions!", read: false },
  { id: 2, groupName: "Fitness Warriors", groupPic: "https://via.placeholder.com/40", inviteMessage: "Stay fit and healthy with us!", read: false },
  { id: 3, groupName: "Art Lovers", groupPic: "https://via.placeholder.com/40", inviteMessage: "Explore and create art together!", read: true },
];

const InboxPage: React.FC = () => {
  const [selectedInvite, setSelectedInvite] = useState<number | null>(null);
  const [inviteList, setInviteList] = useState(groupInvites);

  // Handle click on a group invite
  const handleInviteClick = (inviteId: number) => {
    const updatedInvites = inviteList.map((invite) =>
      invite.id === inviteId ? { ...invite, read: true } : invite
    );
    setInviteList(updatedInvites);
    setSelectedInvite(inviteId);
  };

  // Handle join action
  const handleJoinGroup = (inviteId: number) => {
    const updatedInvites = inviteList.filter((invite) => invite.id !== inviteId);
    setInviteList(updatedInvites);
    setSelectedInvite(null); // Clear selection after joining
    // Here, you can add functionality to add the user to the group
    alert("You have joined the group!");
  };

  // Handle cancel action
  const handleCancelInvite = (inviteId: number) => {
    const updatedInvites = inviteList.filter((invite) => invite.id !== inviteId);
    setInviteList(updatedInvites);
    setSelectedInvite(null); // Clear selection after canceling
    alert("Invite canceled.");
  };

  return (
    <NavBar>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 3 }}>
          Group Invites
        </Typography>

        <List sx={{ width: "100%" }}>
          {inviteList.map((invite) => (
            <ListItem
              key={invite.id}
              onClick={() => handleInviteClick(invite.id)}
              sx={{
                padding: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                border: selectedInvite === invite.id ? "2px solid #00AEEF" : "none",
                transition: "0.3s",
              }}
            >
              <Avatar sx={{ backgroundColor: "#E0E0E0" }} src={invite.groupPic} />
              <ListItemText
                primary={<Typography fontWeight="bold">{invite.groupName}</Typography>}
                secondary={invite.inviteMessage}
                sx={{ textAlign: "left", marginLeft: 2 }}
              />
              <Typography fontWeight="bold">{invite.read ? "Read" : "Unread"}</Typography>
            </ListItem>
          ))}
        </List>

        {/* If an invite is selected, show the action buttons */}
        {selectedInvite !== null && (
          <Box sx={{ width: "100%", padding: 3, borderRadius: 2, marginTop: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              {inviteList.find((invite) => invite.id === selectedInvite)?.groupName}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {inviteList.find((invite) => invite.id === selectedInvite)?.inviteMessage}
            </Typography>
            <Box sx={{ marginTop: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ marginRight: 2 }}
                onClick={() => handleJoinGroup(selectedInvite!)}
              >
                Join
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleCancelInvite(selectedInvite!)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </NavBar>
  );
};

export default InboxPage;
