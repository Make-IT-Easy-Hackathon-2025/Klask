import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Avatar, Divider, Button, Fab, Dialog, DialogTitle, TextField, Box as MuiBox, Badge, useTheme, Grid, Card, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/Navbar";
import { IGroup, ShopItem } from "../../utils/types/dataTypes";
import { useAuth } from "../../context/AuthProvider";
import { createGroup, getCreatedGroups, getPurchasedItems, updateUser} from "../../api";
import LoadingPage from "../LoadingPage";
import { useNavigate } from "react-router-dom";
import GroupCard from "../../components/GroupCard"
import { IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { ThemeContext } from "../../ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CustomAvatar from "../../components/CustomAvatar";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import placeholderimage from '../../assets/sap.png';


interface PurchasedItem {
  item: ShopItem;
  quantity: number;
}


const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const {toggleTheme} = useContext(ThemeContext);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedProfilePic, setEditedProfilePic] = useState<File | null>(null);
  const [previewProfilePic, setPreviewProfilePic] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupCoin, setNewGroupCoin] = useState("");
  const [newGroupCoinImage, setNewGroupCoinImage] = useState<File | null>(null);
  const [newGroupProfilePic, setNewGroupProfilePic] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }
      try {
        setLoading(true);
        const [userGroups, items] = await Promise.all([
          getCreatedGroups(user._id),
          getPurchasedItems(user._id),
        ]);
        setGroups(userGroups);
        setPurchasedItems(items);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
          <CustomAvatar
            src={previewProfilePic || user?.profilePicture}
            alt={user?.name}
            size={120}
            sx={{ 
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

        <Button
          onClick={toggleTheme}
  
        sx={{
          position: "absolute",
          top: 80,
          right: 16,
        }}
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </Button>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
        <Box>
            <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
              Purchased Items
            </Typography>
            <Box
              sx={{
                height: 400, // Fixed height
                overflowY: 'auto', // Enable vertical scrolling
              }}
            >
              {loading ? (
                <Typography>Loading purchased items...</Typography>
              ) : error ? (
                <Typography>{error}</Typography>
              ) : (
                <Box>
                  {purchasedItems.length === 0 ? (
                    <Typography>No purchased items found.</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {purchasedItems.map((item, index) => (
                        <Grid item xs={12} key={index}>
                          <Card>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                  <CustomAvatar
                                  src={item.item.image}
                                  alt={item.item.name}
                                  sx={{ width: 56, height: 56 }}
                                  />
                                </Grid>
                                <Grid item xs>
                                  <Typography variant="h6">{item.item.name}</Typography>
                                </Grid>
                                <Grid item>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ShoppingCartIcon sx={{ marginRight: 1 }} />
                                  <Typography>{item.quantity}</Typography>
                                  </Box>
                                </Grid>
                                <Grid item>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AttachMoneyIcon sx={{ marginRight: 1 }} />
                                  <Typography>{item.item.price * item.quantity}</Typography>
                                  </Box>
                                </Grid>
                                </Grid>
                        
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>
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
