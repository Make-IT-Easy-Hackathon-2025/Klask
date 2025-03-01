import React, { useState, useEffect } from "react";
import { 
  Container, Box, List, ListItem, ListItemText, 
  Avatar, Typography, Button, Paper, 
  IconButton, Chip, Badge, Divider, Tooltip 
} from "@mui/material";
import { 
  CheckCircle as AcceptIcon, 
  Cancel as DeclineIcon,
  Notifications as NotificationIcon,
  Email as InviteIcon
} from "@mui/icons-material";
import NavBar from "../../components/Navbar";
import { getUserNotifications, acceptNotification, deleteNotification } from "../../api";
import { useAuth } from "../../context/AuthProvider";
import LoadingPage from "../LoadingPage";

// Updated Notification type to match the new schema
interface Notification {
  _id: string;
  message: string;
  isInvite: boolean;
  groupID: string;
  read?: boolean; // Frontend tracking for read status
  createdAt: string;
}

const InboxPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get user notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await getUserNotifications(user._id);
        setNotifications(response);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Handle click on a notification
  const handleNotificationClick = (notificationId: string) => {
    setSelectedNotification(prevId => 
      prevId === notificationId ? null : notificationId
    );
    
    // Mark notification as read
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Handle accept invitation
  const handleAcceptInvitation = async (notificationId: string) => {
    try {
      setLoading(true);
      const notification = notifications.find(n => n._id === notificationId);
      if (!notification || !notification.groupID) {
        setError("Invalid invitation");
        return;
      }
      if(!user?._id) {
        setError("User not found");
        return;
      }
      await acceptNotification(notificationId, user._id);
      
      // Remove the notification from the list
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
      
      setSelectedNotification(null);
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError("Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  // Handle decline invitation
  const handleDeclineInvitation = async (notificationId: string) => {
    try {
      setLoading(true);
      await deleteNotification(notificationId);
      
      // Remove the notification from the list
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
      
      setSelectedNotification(null);
    } catch (err) {
      console.error("Error declining invitation:", err);
      setError("Failed to decline invitation");
    } finally {
      setLoading(false);
    }
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // Get icon based on notification type
  const getNotificationIcon = (isInvite: boolean) => {
    return isInvite ? <InviteIcon color="primary" /> : <NotificationIcon />;
  };

  if (loading && notifications.length === 0) {
    return <LoadingPage />;
  }

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
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto"
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 3 }}>
          Notifications
        </Typography>

        {notifications.length === 0 ? (
          <Paper sx={{ p: 4, width: "100%", textAlign: "center" }}>
            <Typography variant="body1">No notifications yet</Typography>
          </Paper>
        ) : (
          <List sx={{ width: "100%" }}>
            {notifications.map((notification) => (
              <Paper 
                key={notification._id}
                elevation={2}
                sx={{ mb: 2, overflow: 'hidden' }}
              >
                <ListItem
                  onClick={() => handleNotificationClick(notification._id)}
                  sx={{
                    padding: 2,
                    backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    cursor: 'pointer',
                    borderLeft: notification.read ? 'none' : '4px solid #1976d2',
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ mr: 2, mt: 0.5 }}>
                    {getNotificationIcon(notification.isInvite)}
                  </Box>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {notification.isInvite ? 'Group Invitation' : 'Notification'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {notification.message}
                    </Typography>
                    
                    {notification.groupID && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        
                      </Box>
                    )}
                    
                    {notification.isInvite && (
                      <Box sx={{ display: 'flex', mt: 2 }}>
                        <Tooltip title="Accept Invitation">
                          <IconButton 
                            color="success" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptInvitation(notification._id);
                            }}
                          >
                            <AcceptIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Decline Invitation">
                          <IconButton 
                            color="error" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeclineInvitation(notification._id);
                            }}
                          >
                            <DeclineIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </ListItem>
                
                {selectedNotification === notification._id && !notification.isInvite && (
                  <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      size="small"
                      onClick={() => handleDeclineInvitation(notification._id)}
                    >
                      Dismiss
                    </Button>
                  </Box>
                )}
              </Paper>
            ))}
          </List>
        )}
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </NavBar>
  );
};

export default InboxPage;