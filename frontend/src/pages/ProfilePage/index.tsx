import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Divider, Button, Fab, Dialog, DialogTitle, TextField, Box as MuiBox, Badge, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/Navbar";
import { IGroup } from "../../utils/types/dataTypes";
import { useAuth } from "../../context/AuthProvider";
import { createGroup, getCreatedGroups, updateUser} from "../../api";
import LoadingPage from "../LoadingPage";
import { useNavigate } from "react-router-dom";
import GroupCard from "../../components/GroupCard"
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedProfilePic, setEditedProfilePic] = useState<File | null>(null);
  const [previewProfilePic, setPreviewProfilePic] = useState<string | null>(null);

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
    if (user) {
      setEditedName(user.name);
    }
  }, [user]);

  useEffect(() => {

    const fetchGroups = async () => {
      if(!user) {
          return;
      }
      try{
        setLoading(true);
      const userGroups = await getCreatedGroups(user._id);
      console.log(userGroups);
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
  console.log("Group clicked:", groupId
  );
  navigate(`/groups/${groupId}/leaderboard`);
}

const handleLogout = () => {
    logout();
    navigate("/");
};

 // Handle profile image selection
 const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setEditedProfilePic(file);
    setPreviewProfilePic(URL.createObjectURL(file));
  }
};

const handleSaveChanges = async () => {
  if (!user) return;
  
  try {
    let profilePicUrl = user.profilePicture;
    
    // Here you would typically upload the image file to your storage service
    // and get back a URL. For now, we'll use the preview URL as a placeholder.
    if (editedProfilePic && previewProfilePic) {
      profilePicUrl = previewProfilePic;
      // In a real implementation, you would:
      // 1. Upload the image to storage
      // 2. Get back the URL
      // 3. Use that URL for updating the user
    }
    
    await updateUser(user._id, editedName, profilePicUrl);
    
    // Update the user in context/state
    if (user) {
      const updatedUser = {
        ...user,
        name: editedName,
        profilePicture: profilePicUrl
      };
      // For now, refresh the page to see changes
      window.location.reload();
    }
    
    setEditMode(false);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

// Toggle edit mode
const toggleEditMode = () => {
  if (editMode) {
    // Save changes
    handleSaveChanges();
  } else {
    // Enter edit mode
    setEditMode(true);
  }
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
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: theme.palette.background.default,
                border: `2px solid ${theme.palette.text.primary}`,
                '&:hover': { bgcolor: theme.palette.background.paper}
              }}
              onClick={toggleEditMode}
            >
              {editMode ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
            </IconButton>
          }
        >
          {editMode && (
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-pic-upload"
              type="file"
              onChange={handleProfilePicChange}
            />
          )}
          <label htmlFor={editMode ? "profile-pic-upload" : undefined}>
            <Avatar
              src={previewProfilePic || user?.profilePicture}
              alt={user?.name}
              sx={{ 
                width: 120, 
                height: 120, 
                marginBottom: 2,
                cursor: editMode ? 'pointer' : 'default' 
              }}
            />
          </label>
        </Badge>
        {editMode ? (
          <TextField
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              sx: { 
                typography: 'h4', 
                fontWeight: 'bold', 
                textAlign: 'center',
                marginBottom: 1
              }
            }}
          />
        ) : (
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1 }}>
            {user?.name}
          </Typography>
        )}
        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
          {user?.email}
        </Typography>

        {/* Bio Section */}
        <Divider sx={{ width: "100%", marginBottom: 2 }} />
        <Typography variant="body2" sx={{ textAlign: "center", marginBottom: 3 }}>
          {user?.desc}
        </Typography>

        <Button
          onClick={handleLogout}
          variant="outlined"
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
          }}
        >
          Logout
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
