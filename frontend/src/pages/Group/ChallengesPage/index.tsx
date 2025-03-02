import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  Zoom,
  Grow,
  Paper
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../components/Navbar";
import { useAuth } from "../../../context/AuthProvider";
import { createChallenge, getCreatedChallenges, getGroupById, getJoinedChallenges, joinChallenge } from "../../../api";
import { IChallenge } from "../../../utils/types/dataTypes";

interface IChallengeJoined extends IChallenge {
  status: string;
}

const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<IChallenge[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<IChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [challengeCode, setChallengeCode] = useState("");
  const [coinRewardError, setCoinRewardError] = useState<string | null>(null);
  const [newChallengeTitle, setNewChallengeTitle] = useState("");
  const [newChallengeDescription, setNewChallengeDescription] = useState("");
  const [newChallengeCoinReward, setNewChallengeCoinReward] = useState("");
  
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: groupId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isAuthorized = user?.groups.find((group) => group.GID === groupId)?.role === "admin" 
    || user?.groups.find((group) => group.GID === groupId)?.role === "moderator";
  
  const [coin, setCoin] = useState<{name: string, img: string}>();

  useEffect(() => {
    const fetchCoin = async () => {
      if(!groupId) return;
      setLoading(true);
      try{
        if(!groupId) return;
        const response = await getGroupById(groupId);

        setCoin(response.coin);
      } catch (error) {
        console.error("Error fetching coin:", error);

      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [ groupId]);

  // In the fetchChallenges function, update the data mapping:
  useEffect(() => {
    const fetchChallenges = async () => {
      if (!user || !groupId) return;

      try {
        setLoading(true);
        const group = user.groups.find((g) => g.GID === groupId);

        if (!group) {
          setError("Group not found");
          return;
        }

        const challengesData = await getCreatedChallenges(user._id, groupId)
        const formattedChallenges: IChallenge[] = challengesData.map(
          (challenge: IChallenge) => ({
            _id: challenge._id,
            title: challenge.title,
            description: challenge.description,
            coinsValue: challenge.coinsValue,
            creator: challenge.creator,
            users: challenge.users,
            code: challenge.code,
          })
        );

        setChallenges(formattedChallenges);
      
        setError(null);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };

    const fetchJoinedChallenges = async () => {
      if (!user || !groupId) return;

      try {
        setLoading(true);
        const group = user.groups.find((g) => g.GID === groupId);

        if (!group) {
          setError("Group not found");
          return;
        }

        const challengesData = await getJoinedChallenges(user._id, groupId);
        const formattedChallenges: IChallengeJoined[] = challengesData.map(
        (item: { challengeID: IChallenge; status: string }) => ({
          _id: item.challengeID._id,
          title: item.challengeID.title,
          description: item.challengeID.description,
          coinsValue: item.challengeID.coinsValue,
          creator: item.challengeID.creator,
          users: item.challengeID.users,
          code: item.challengeID.code,
          status: item.status, // Include the status from the response
        })
      );
      setJoinedChallenges(formattedChallenges);
      setError(null);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    }
    isAuthorized ? fetchChallenges() : fetchJoinedChallenges();
  }, [user, groupId]);



  const handleJoinChallenge = async () => {
    if (!user || !groupId) return;
    try{
      const response = await joinChallenge(user._id, challengeCode, groupId);
      const newChallenge: IChallenge = {
        _id: response.data._id,
        title: response.data.title,
        description: response.data.description,
        coinsValue: response.data.coinsValue,
        creator: response.data.creator,
        users: response.data.users,
        code: response.data.code,
      };
      setChallenges((prev) => [...prev, newChallenge]);
    } catch (error) {
      console.error("Error joining challenge :", error);
    }
    setChallengeCode("");
    setJoinModalOpen(false);
  };

  const handleCreateChallenge = async () => {
    if (!user || !groupId) return;

    try {
      const response = await createChallenge(
        newChallengeTitle,
        newChallengeDescription,
        parseInt(newChallengeCoinReward),
        user._id,
        groupId
      );

      const newChallenge: IChallenge = {
        _id: response.data._id,
        title: response.data.title,
        description: response.data.description,
        coinsValue: response.data.coinsValue,
        creator: response.data.creator,
        users: response.data.users,
        code: response.data.code,
      };

      setChallenges((prev) => [...prev, newChallenge]);

      setNewChallengeTitle("");
      setNewChallengeDescription("");
      setNewChallengeCoinReward("");
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  const handleChallengeClick = (challengeId: string) => {
    navigate(`/groups/${groupId}/challenges/${challengeId}`);
  };

  const handleCoinRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value < 0) {
      setCoinRewardError("Coin reward cannot be negative");
    } else {
      setCoinRewardError(null);
    }
    setNewChallengeCoinReward(e.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return theme.palette.success.main;
      case "completed":
        return theme.palette.info.main;
      case "pending":
        return theme.palette.warning.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  const capitalize = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <NavBar isGroupPage={true} activeTab="challenges">
      <Box sx={{ p: 3, minHeight: "85vh", position: "relative" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, color: theme.palette.text.primary }}
        >
          Group Challenges
        </Typography>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" variant="h6" align="center">
            {error}
          </Typography>
        ) : (isAuthorized ? challenges : joinedChallenges).length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              py: 6,
              px: 4,
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'transparent',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <EmojiEventsIcon
              sx={{
                fontSize: 80,
                mb: 2,
                color: theme.palette.text.secondary,
                opacity: 0.5
              }}
            />
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
                fontWeight: 'medium'
              }}
            >
              No Active Challenges
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: theme.palette.text.secondary,
                maxWidth: '500px'
              }}
            >
              {isAuthorized
                ? "Start by creating your first challenge. Click the + button below to get started!"
                : "There are no challenges available for you at the moment. Join a challenge using a challenge code!"}
            </Typography>
            <Button
              variant="contained"
              color={isAuthorized ? "secondary" : "primary"}
              startIcon={isAuthorized ? <AddCircleIcon /> : <AddIcon />}
              onClick={() => isAuthorized ? setCreateModalOpen(true) : setJoinModalOpen(true)}
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              {isAuthorized ? "Create First Challenge" : "Join a Challenge"}
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {(isAuthorized ? challenges : joinedChallenges).map((challenge, index) => (
              <Grid item xs={12} sm={6} md={4} key={challenge._id}>
                <Grow in={true} timeout={300 * (index + 1)}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 6,
                      },
                      height: "100%",
                    }}
                    onClick={() => handleChallengeClick(challenge._id)}
                  >
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {challenge.title}
                        </Typography>
                        { !isAuthorized && <Box
                          sx={{
                            bgcolor: getStatusColor((challenge as IChallengeJoined).status),
                            color: "#fff",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                         {capitalize((challenge as IChallengeJoined).status)} 
                        </Box>}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          flexGrow: 1,
                          mb: 2,
                        }}
                      >
                        {challenge.description}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            color: theme.palette.primary.main,
                          }}
                        >
                          {challenge.coinsValue} {coin?.name}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        )}

{     !isAuthorized &&  <Zoom in={!loading}>
          <Fab
            color="primary"
            aria-label="join challenge"
            sx={{ position: "fixed", bottom: 24, right: 24, boxShadow: 3 }}
            onClick={() => setJoinModalOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>
}
        {isAuthorized && (
          <Zoom in={!loading}>
            <Fab
              color="secondary"
              aria-label="create challenge"
              sx={{ position: "fixed", bottom: 24, right: 24, boxShadow: 3 }}
              onClick={() => setCreateModalOpen(true)}
            >
              <AddCircleIcon />
            </Fab>
          </Zoom>
        )}

        { !isAuthorized && <Dialog
          open={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          PaperProps={{ sx: { borderRadius: 2, maxWidth: "400px" } }}
        >
          <DialogTitle>Join Challenge</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter the challenge code to join a new challenge.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Challenge Code"
              type="text"
              fullWidth
              value={challengeCode}
              onChange={(e) => setChallengeCode(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setJoinModalOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleJoinChallenge}
              disabled={!challengeCode.trim()}
            >
              Join
            </Button>
          </DialogActions>
        </Dialog>
        }

        <Dialog
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          PaperProps={{ sx: { borderRadius: 2, maxWidth: "500px" } }}
        >
          <DialogTitle>Create New Challenge</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Create a new challenge for your group members.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Challenge Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newChallengeTitle}
              onChange={(e) => setNewChallengeTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={newChallengeDescription}
              onChange={(e) => setNewChallengeDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Coin Reward"
              type="number"
              fullWidth
              variant="outlined"
              value={newChallengeCoinReward}
              onChange={handleCoinRewardChange}
              error={!!coinRewardError}
              helperText={coinRewardError}
              inputProps={{
                min: 0,
                step: 1,
                onKeyDown: (e) => {
                  if (e.key === "-") {
                    e.preventDefault();
                  }
                },
              }}
              sx={{ mb: 2 }}
            />
          </DialogContent>
        {  isAuthorized && <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreateChallenge}
              disabled={
                !newChallengeTitle ||
                !newChallengeDescription ||
                !newChallengeCoinReward ||
                parseInt(newChallengeCoinReward) <= 0 ||
                !!coinRewardError
              }
            >
              Create Challenge
            </Button>
          </DialogActions> 
}
        </Dialog>
      </Box>
    </NavBar>
  );
};

export default ChallengesPage;
