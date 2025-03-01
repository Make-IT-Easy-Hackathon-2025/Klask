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
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../components/Navbar";
import { useAuth } from "../../../context/AuthProvider";
import { createChallenge, getCreatedChallenges } from "../../../api";
import { IChallenge } from "../../../utils/types/dataTypes";

const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<IChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [challengeCode, setChallengeCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [coinRewardError, setCoinRewardError] = useState<string | null>(null);
  const [newChallengeTitle, setNewChallengeTitle] = useState("");
  const [newChallengeDescription, setNewChallengeDescription] = useState("");
  const [newChallengeCoinReward, setNewChallengeCoinReward] = useState("");

  const theme = useTheme();
  const navigate = useNavigate();
  const { id: groupId } = useParams<{ id: string }>();
  const { user } = useAuth();

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

        const challengesData = await getCreatedChallenges(user._id, groupId);
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

    fetchChallenges();
  }, [user, groupId]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user || !groupId) return;
      const groupData = user.groups.find((g) => g.GID === groupId);
      setIsAdmin(groupData?.role === "admin");
    };

    checkAdminStatus();
  }, [user, groupId]);

  const handleJoinChallenge = () => {
    console.log(`Joining challenge with code: ${challengeCode}`);
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
        ) : (
          <Grid container spacing={3}>
            {challenges.map((challenge, index) => (
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
                        <Box
                          sx={{
                            bgcolor: getStatusColor("active"),
                            color: "#fff",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          Active
                        </Box>
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
                          {challenge.coinsValue} coins
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        )}

        <Zoom in={!loading}>
          <Fab
            color="primary"
            aria-label="join challenge"
            sx={{ position: "fixed", bottom: 24, right: 24, boxShadow: 3 }}
            onClick={() => setJoinModalOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>

        {isAdmin && (
          <Zoom in={!loading}>
            <Fab
              color="secondary"
              aria-label="create challenge"
              sx={{ position: "fixed", bottom: 24, left: 24, boxShadow: 3 }}
              onClick={() => setCreateModalOpen(true)}
            >
              <AddCircleIcon />
            </Fab>
          </Zoom>
        )}

        <Dialog
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
          <DialogActions sx={{ px: 3, pb: 3 }}>
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
        </Dialog>
      </Box>
    </NavBar>
  );
};

export default ChallengesPage;
