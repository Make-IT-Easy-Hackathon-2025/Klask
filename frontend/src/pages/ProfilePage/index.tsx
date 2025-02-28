import React, { useState } from "react";
import { Box, Typography, Avatar, Divider, Button, Card, CardContent, Fab, Dialog, DialogTitle, TextField, Box as MuiBox } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/Navbar";

// Interface for Group (excluding users and shopItems)
export interface IGroup {
  _id: string; // MongoDB ObjectId as string
  name: string;
  profilePic: string; // URL to the profile picture
  description: string;
  coin: {
    name: string;
    image: string;
  };
}

// Sample data for user's profile
const userProfile = {
  name: "John Doe",
  email: "johndoe@example.com",
  avatarUrl: "https://i.pravatar.cc/300", // You can replace this with a real image URL or placeholder
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
};

const ProfilePage: React.FC = () => {
  const [groups, setGroups] = useState<IGroup[]>([
    {
      _id: "1",
      name: "Study Group",
      profilePic: "https://via.placeholder.com/50",
      description: "Group for discussing topics",
      coin: { name: "GroupCoin", image: "https://via.placeholder.com/20" },
    },
    {
      _id: "2",
      name: "Gaming Squad",
      profilePic: "https://via.placeholder.com/50",
      description: "Casual weekend gaming",
      coin: { name: "GameCoin", image: "https://via.placeholder.com/20" },
    },
  ]);

  const [open, setOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupCoin, setNewGroupCoin] = useState("");
  const [newGroupCoinImage, setNewGroupCoinImage] = useState<File | null>(null);
  const [newGroupProfilePic, setNewGroupProfilePic] = useState<File | null>(null);

  // Function to handle adding a new group
  const handleAddGroup = () => {
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
    };

    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupCoin("");
    setNewGroupCoinImage(null);
    setNewGroupProfilePic(null);
    setOpen(false);
  };

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
          src={userProfile.avatarUrl}
          alt={userProfile.name}
          sx={{ width: 120, height: 120, marginBottom: 2 }}
        />
        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1 }}>
          {userProfile.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
          {userProfile.email}
        </Typography>

        {/* Bio Section */}
        <Divider sx={{ width: "100%", marginBottom: 2 }} />
        <Typography variant="body2" sx={{ textAlign: "center", marginBottom: 3 }}>
          {userProfile.bio}
        </Typography>

        {/* Buttons for user actions */}
        <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
          Edit Profile
        </Button>
        <Button variant="outlined" color="secondary">
          Log Out
        </Button>

        {/* My Groups Section */}
        <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
          My Groups
        </Typography>
        {groups.map((group) => (
          <Card key={group._id} sx={{ mb: 2, width:'100%' }}>
            <CardContent>
              <MuiBox sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={group.profilePic} sx={{ mr: 2 }} />
                <Typography variant="h6">{group.name}</Typography>
              </MuiBox>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {group.description}
              </Typography>
              <MuiBox sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Avatar src={group.coin.image} sx={{ width: 20, height: 20, mr: 1 }} />
                <Typography variant="body2">{group.coin.name}</Typography>
              </MuiBox>
            </CardContent>
          </Card>
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
