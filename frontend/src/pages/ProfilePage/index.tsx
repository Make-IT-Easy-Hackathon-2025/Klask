import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Divider, Button, Card, CardContent, Fab, Dialog, DialogTitle, TextField, Box as MuiBox } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/Navbar";
import { IGroup } from "../../utils/types/dataTypes";
import { useAuth } from "../../context/AuthProvider";
import { createGroup, getCreatedGroups, getUserGroups } from "../../api";
import LoadingPage from "../LoadingPage";
import { useNavigate } from "react-router-dom";
import GroupCard from "../../components/GroupCard";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState<IGroup[]>([
    {
        _id: "1",
        name: "Study Group",
        profilePic: "https://via.placeholder.com/50",
        description: "Group for discussing topics",
        coin: { name: "GroupCoin", image: "https://via.placeholder.com/20" },
        users: [],
        shopItems: []
    },
    {
        _id: "2",
        name: "Gaming Squad",
        profilePic: "https://via.placeholder.com/50",
        description: "Casual weekend gaming",
        coin: { name: "GameCoin", image: "https://via.placeholder.com/20" },
        users: [],
        shopItems: []
    },
  ]);

  useEffect(() => {

    const fetchGroups = async () => {
      if(!user) {
          return;
      }
      try{
        setLoading(true);
      const userGroups = await getCreatedGroups(user._id);
      setGroups(userGroups);
      } catch (error) {
          console.error("Error fetching groups", error);
      } finally{
          setLoading(false);
      }
    } 
    fetchGroups();
    

  }, [user]);

  const [open, setOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupCoin, setNewGroupCoin] = useState("");
  const [newGroupCoinImage, setNewGroupCoinImage] = useState<File | null>(null);
  const [newGroupProfilePic, setNewGroupProfilePic] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Function to handle adding a new group
  const handleAddGroup = async () => {
    if (newGroupName.trim() === "") return;

    const newGroup: IGroup = {
        _id: (groups.length + 1).toString(), // Generate an ID (can replace with MongoDB ObjectId)
        name: newGroupName,
        profilePic: newGroupProfilePic ? URL.createObjectURL(newGroupProfilePic) : "https://via.placeholder.com/50", // Use uploaded profilePic or default
        description: newGroupDescription,
        coin: {
            name: newGroupCoin,
            image: newGroupCoinImage ? URL.createObjectURL(newGroupCoinImage) : "https://via.placeholder.com/20", // Use uploaded coin image or default
        },
        shopItems: [],
        users: []
    };
    if(!user) {
        setError("User not found");
        return;
    }
    await createGroup(newGroup.name, newGroup.description, newGroup.coin, newGroup.profilePic, user._id);

    //setGroups([...groups, newGroup]);
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupCoin("");
    setNewGroupCoinImage(null);
    setNewGroupProfilePic(null);
    setOpen(false);
  };
const navigate = useNavigate();
const handleGroupClick = (groupId: string) => {
 
  navigate(`/groups/${groupId}/leaderboard`);
}

const handleLogout = () => {
    logout();
    navigate("/");
};

if(loading) {
  return <NavBar><LoadingPage /></NavBar>
}

  return (
    <NavBar>
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Profile Header */}
        <Avatar
          src={user?.profilePicture}
          alt={user?.name}
          sx={{ width: 120, height: 120, marginBottom: 2 }}
        />
        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1 }}>
          {user?.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
          {user?.email}
        </Typography>

        {/* Bio Section */}
        <Divider sx={{ width: "100%", marginBottom: 2 }} />
        <Typography variant="body2" sx={{ textAlign: "center", marginBottom: 3 }}>
          {user?.desc}
        </Typography>

        {/* Buttons for user actions */}
        <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
          Edit Profile
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => handleLogout()}>
          Log Out
        </Button>

        {/* My Groups Section */}
        <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
          My Groups
        </Typography>
        {groups.map((group) => (
          <GroupCard
            key={group._id}
            group={group}
            handleGroupClick={handleGroupClick}
          />
        ))}

        {/* Floating Add Button */}
        <Box position="fixed" bottom={20} right={20}>
          <Fab color="primary" onClick={() => setOpen(true)}>
            <AddIcon />
          </Fab>
        </Box>

        {/* Add Group Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add New Group</DialogTitle>
          <Box sx={{ p: 2 }}>
            <TextField
              label="Group Name"
              fullWidth
              margin="normal"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
            <TextField
              label="Coin Name"
              fullWidth
              margin="normal"
              value={newGroupCoin}
              onChange={(e) => setNewGroupCoin(e.target.value)}
            />
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
              Upload Coin Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => e.target.files && setNewGroupCoinImage(e.target.files[0])}
              />
            </Button>
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
              Upload Profile Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => e.target.files && setNewGroupProfilePic(e.target.files[0])}
              />
            </Button>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleAddGroup}>
              Add Group
            </Button>
          </Box>
        </Dialog>
      </Box>
    </NavBar>
  );
};

export default ProfilePage;
