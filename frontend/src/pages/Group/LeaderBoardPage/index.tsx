import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Avatar,
  Box,
  Paper,
  useTheme,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Grid,
  Fade,
  CircularProgress,
} from "@mui/material";
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from "../../../components/Navbar";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useParams } from "react-router-dom";
import { getGroupUsers, getUserDetailsWithChallenges } from "../../../api";
import LoadingPage from "../../LoadingPage";
import CustomCoin from "../../../components/CustomCoin";
import placeholderProfilePicture from '../../../assets/placeholder_profile.png';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  coinsValue: number;
  status: "active" | "completed";
}

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  desc: string;
  profilePicture: string;
  challenges: Challenge[];
}

interface GroupUser {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: "admin" | "moderator" | "user" | "guest";
  coins: number;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GroupPageLeaderBoard: React.FC = () => {
  const theme = useTheme();
  const { id: groupId } = useParams<{ id: string }>();
  const [users, setUsers] = useState<GroupUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      if (!groupId) {
        setError("No group ID provided");
        setLoading(false);
        return;
      }

      try {
        const usersData = await getGroupUsers(groupId);
        // Sort users by coins (descending)
        const filteredUsers = usersData.filter((user: GroupUser) => user.role !== 'admin');
        const sortedUsers = filteredUsers.sort((a: GroupUser, b: GroupUser) => b.coins - a.coins);
        setUsers(sortedUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching group users:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [groupId]);

  // Get medal color based on position
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return 'transparent';
    }
  };

  const handleUserClick = async (userId: string) => {
    try {
      setLoadingDetails(true);
      setModalOpen(true);
      const details = await getUserDetailsWithChallenges(userId, groupId || "");
      setSelectedUser(details);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  if(loading){
    return       <Navbar isGroupPage={true} activeTab="leaderboard">
      <LoadingPage/>
      </Navbar>

  }
  return (
    <>
      <Navbar isGroupPage={true} activeTab="leaderboard">
        {/* Main Content: Leaderboard */}
        <Container sx={{ mt: 4, pb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4
            }}
          >
            Leaderboard
          </Typography>
          
          {users.map((user, index) => (
          <Paper
            key={index}
            elevation={3}
            onClick={() => handleUserClick(user._id)}
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
              borderLeft: index < 3 ? `6px solid ${getMedalColor(index)}` : 'none',
            }}
          >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2,
                background: index < 3 ? `linear-gradient(90deg, ${theme.palette.background.paper} 80%, ${getMedalColor(index)}22 100%)` : theme.palette.background.paper,
              }}>
                {/* Ranking */}
                <Box sx={{ 
                  mr: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                }}>
                  {index < 3 ? (
                    <EmojiEventsIcon sx={{ color: getMedalColor(index), fontSize: 32 }} />
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
                      #{index + 1}
                    </Typography>
                  )}
                </Box>

                {/* Avatar */}
                <Avatar 
                  alt={user.name} 
                  src={user.profilePicture || placeholderProfilePicture}
                  sx={{ 
                    width: 50, 
                    height: 50,
                    border: index < 3 ? `2px solid ${getMedalColor(index)}` : 'none',
                  }}
                />

                {/* User info */}
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                  <Chip 
                    icon={<CustomCoin size={36}/>} 
                    label={`${user.coins} Sapienthium`}
                    size="small"
                    sx={{ 
                      backgroundColor: index < 3 ? `${getMedalColor(index)}22` : theme.palette.action.selected,
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>

                {/* Position for non-podium places */}
                {index >= 3 && (
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: theme.palette.text.secondary,
                      backgroundColor: theme.palette.action.hover,
                      p: 1,
                      borderRadius: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    #{index + 1}
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
          <Dialog
          open={modalOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 1
          }}>
            <Typography variant="h5" component="div" fontWeight="bold">
              User Profile
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {loadingDetails ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
              </Box>
            ) : selectedUser ? (
              <Fade in timeout={500}>
                <Box>
                  <Box display="flex" alignItems="center" mb={4}>
                    <Avatar
                      src={selectedUser.profilePicture || placeholderProfilePicture}
                      alt={selectedUser.name}
                      sx={{ width: 100, height: 100, mr: 3 }}
                    />
                    <Box>
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {selectedUser.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Challenges
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {selectedUser.challenges.map((challenge) => (
                      <Grid item xs={12} key={challenge._id}>
                        <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: theme.palette.background.default,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        {challenge.status === 'completed' ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <PlayArrowIcon color="primary" />
                        )}
                        <Box flexGrow={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {challenge.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {challenge.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${challenge.coinsValue} coins`}
                          color={challenge.status === 'completed' ? "success" : "primary"}
                          size="small"
                        />
                      </Paper>
                    </Grid>
                  ))}
                  {selectedUser.challenges.length === 0 && (
                      <Grid item xs={12}>
                        <Typography color="text.secondary" textAlign="center">
                          No active or completed challenges
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Fade>
            ) : null}
          </DialogContent>
        </Dialog>
        </Container>
      </Navbar>
    </>
  );
};

export default GroupPageLeaderBoard;