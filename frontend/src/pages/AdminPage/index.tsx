import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Paper,
  Divider,
  ListItemSecondaryAction,
  Tooltip,
  Checkbox,
} from "@mui/material";
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ModeratorIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import NavBar from "../../components/Navbar";
import { getGroupUsers, getUserByEmail, sendNotification, updateRoles } from "../../api";
interface GroupUser {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: "admin" | "moderator" | "user" | "guest";
  coins: number;
}

const GroupManagePage: React.FC = () => {
  const theme = useTheme();
  const { id: groupId } = useParams<{ id: string }>();
  
  // State variables
  const [users, setUsers] = useState<GroupUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<GroupUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [roleToChange, setRoleToChange] = useState<"moderator" | "user">("user");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const [confirmKickDialogOpen, setConfirmKickDialogOpen] = useState(false);
  const [userToKick, setUserToKick] = useState<GroupUser | null>(null);

  useEffect(() => {
    const fetchGroupUsers = async () => {
      if (!groupId) {
        setError("No group ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getGroupUsers(groupId);
        setUsers(response);
        setLoading(false);
        
      } catch (err) {
        console.error("Error fetching group users:", err);
        setError("Failed to load group users");
        setLoading(false);
      }
    };

    fetchGroupUsers();
  }, [groupId]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Handle user selection for role change
  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle role change for selected users
  const handleRoleChange = async () => {
    try {
      // Replace with your actual API call
      if (groupId) {
        await updateRoles(selectedUsers, groupId, roleToChange);
      } else {
        setSnackbar({
          open: true,
          message: "Group ID is not defined",
          severity: "error",
        });
      }
    
      // For now just update the state
      const updatedUsers = users.map((user) => {
        if (selectedUsers.includes(user._id)) {
          return { ...user, role: roleToChange };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSelectedUsers([]);
      setSnackbar({
        open: true,
        message: `Role updated successfully for ${selectedUsers.length} user(s)`,
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating roles:", err);
      setSnackbar({
        open: true,
        message: "Failed to update roles",
        severity: "error",
      });
    }
  };

  // Handle adding a new user
  const handleAddUser = async () => {
    try {
      
      const user = await getUserByEmail(userEmail);
      if(!groupId){
        setError("No group ID provided");
        setLoading(false);
        return;
      }
      const response = await sendNotification(user._id, groupId);
      console.log(response);
      if(response.message === "User is already a member of this group"){
        //already in group
        setSnackbar({ open: true, message: "User already in group", severity: "error" });
        return;
      }
      setUserEmail("");
      setAddUserOpen(false);
      setSnackbar({
        open: true,
        message: "User added successfully",
        severity: "success",
      });
    } catch (err) {
      console.error("Error adding user:", err);
      setSnackbar({
        open: true,
        message: "Failed to add user",
        severity: "error",
      });
    }
  };

  // Handle kicking a user
  const handleKickUser = async () => {
    if (!userToKick) return;
    
    try {
      // Replace with your actual API call
      // await axios.delete(`/api/groups/${groupId}/users/${userToKick._id}`);
      
      // For now just update the state
      const updatedUsers = users.filter((user) => user._id !== userToKick._id);
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setConfirmKickDialogOpen(false);
      setUserToKick(null);
      setSnackbar({
        open: true,
        message: "User removed from the group",
        severity: "success",
      });
    } catch (err) {
      console.error("Error removing user:", err);
      setSnackbar({
        open: true,
        message: "Failed to remove user",
        severity: "error",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <AdminIcon color="primary" />;
      case "moderator":
        return <ModeratorIcon color="secondary" />;
      default:
        return <UserIcon />;
    }
  };

  return (
    <NavBar isGroupPage={true} activeTab="manage">

      {/* Main Content: User Management */}
      <Container sx={{ mt: 4, pb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: theme.palette.text.primary }}
          >
            Group Management
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => setAddUserOpen(true)}
          >
            Add User
          </Button>
        </Box>

        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2 }}
            />
          </Box>

          {selectedUsers.length > 0 && (
            <Box display="flex" alignItems="center" mb={2}>
              <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel>Change Role To</InputLabel>
                <Select
                  value={roleToChange}
                  onChange={(e) => setRoleToChange(e.target.value as "moderator" | "user")}
                  label="Change Role To"
                >
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleRoleChange}
              >
                Save Changes
              </Button>
              
              <Typography variant="body2" sx={{ ml: 2, color: theme.palette.text.secondary }}>
                {selectedUsers.length} user(s) selected
              </Typography>
            </Box>
          )}
          
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" variant="h6" align="center" my={4}>
              {error}
            </Typography>
          ) : filteredUsers.length === 0 ? (
            <Typography variant="body1" align="center" my={4}>
              No users found
            </Typography>
          ) : (
            <List>
              {filteredUsers.map((user) => (
                <ListItem
                  key={user._id}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    ...(selectedUsers.includes(user._id) && {
                      bgcolor: `${theme.palette.primary.main}22`, // semi-transparent primary color
                    }),
                  }}
                >
                  {user.role !== "admin" && (
                    <Tooltip title="Select for role change">
                      <Checkbox
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                        color="primary"
                      />
                    </Tooltip>
                  )}
                  
                  <ListItemAvatar>
                    <Avatar alt={user.name} src={user.profilePicture} />
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1">
                          {user.name}
                        </Typography>
                        <Box 
                          component="span" 
                          sx={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            ml: 1,
                            bgcolor: theme.palette.background.default,
                            borderRadius: 1,
                            px: 1,
                            py: 0.5
                          }}
                        >
                          {getRoleIcon(user.role)}
                          <Typography 
                            variant="caption" 
                            sx={{ ml: 0.5, textTransform: 'capitalize' }}
                          >
                            {user.role}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={user.email}
                    sx={{ color: theme.palette.text.primary }}
                  />
                  
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, mr: 2 }}
                  >
                    {user.coins} coins
                  </Typography>
                  
                  <ListItemSecondaryAction>
                    {user.role !== "admin" && (
                      <Tooltip title="Remove user from group">
                        <IconButton 
                          edge="end" 
                          color="error"
                          onClick={() => {
                            setUserToKick(user);
                            setConfirmKickDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onClose={() => setAddUserOpen(false)}>
        <DialogTitle>Add User to Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="User Email"
            type="email"
            fullWidth
            variant="outlined"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained" 
            color="primary"
            disabled={!userEmail || !userEmail.includes('@')}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Kick Dialog */}
      <Dialog open={confirmKickDialogOpen} onClose={() => setConfirmKickDialogOpen(false)}>
        <DialogTitle>Remove User</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to remove {userToKick?.name} from this group?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmKickDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleKickUser} variant="contained" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NavBar>
  );
};

export default GroupManagePage;