import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
  useTheme,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../../components/Navbar";
import { approveChallenge, getChallengeById, getGroupById } from "../../../api";
import { IChallenge } from "../../../utils/types/dataTypes";
import { useAuth } from "../../../context/AuthProvider";
import { group } from "console";
import LoadingPage from "../../LoadingPage";

interface IChallengeDetailPage {
  _id: string; // MongoDB ObjectId as string
  title: string;
  description: string;
  coinsValue: number;
  creator: {
    name: string;
  }; // User ObjectId
  users: {
    _id: string;
    name: string;
    email: string;
    challengeStatus: string;
  }[]; // Array of user ObjectIds
  code: string;
}

const ChallengeDetailPage: React.FC = () => {
  const { id: groupId, challengeId } = useParams<{
    id: string;
    challengeId: string;
  }>();
  const [challenge, setChallenge] = useState<IChallengeDetailPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isAdmin =
    user?.groups.find((group) => group.GID === groupId)?.role === "admin" ||
    user?.groups.find((group) => group.GID === groupId)?.role === "moderator";
  const theme = useTheme();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<{ name: string; img: string }>();

  useEffect(() => {
    const fetchCoin = async () => {
      if (!groupId) return;
      setLoading(true);
      try {
        if (!groupId) return;
        const response = await getGroupById(groupId);

        setCoin(response.coin);
      } catch (error) {
        console.error("Error fetching coin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [groupId]);
  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challengeId) {
        setError("No challenge ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getChallengeById(challengeId);
        if (response.success) {
          setChallenge(response.data);
          setError(null);
        } else {
          setError("Failed to load challenge");
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError("Failed to load challenge details");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  const handleGoBack = () => {
    navigate(`/groups/${groupId}/challenges`);
  };
  interface User {
    name: string;
    _id: string;
    email: string;
    challengeStatus: string;
  }
  const [updatedUsers, setUpdatedUsers] = useState<User[]>([]);
  const [loadingApprove, setLoadingApprove] = useState(false);
  useEffect(() => {
    if (challenge) {
      setUpdatedUsers(challenge.users);
    }
  }, [challenge]);
  const handleApprove = async (userID: string, challangeID : string) => {
    try {
      if(!groupId) return;
      setLoadingApprove(true);
      const response = await approveChallenge(challangeID,userID,groupId);  
      setUpdatedUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userID ? { ...u, challengeStatus: "completed" } : u
        )
      );

      // Also update the challenge object to maintain consistency
      if (challenge) {
        setChallenge({
          ...challenge,
          users: challenge.users.map((u) =>
            u._id === userID? { ...u, challengeStatus: "approved" } : u
          ),
        });
      }
    } catch (error) {
      console.error("Error approving user:", error);
      // Handle error (show notification, etc)
    } finally{
      setLoadingApprove(false);
    }
  };

  return (
    <NavBar isGroupPage={true} activeTab="challenges">
      <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
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
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ mt: 2 }}
            >
              Back to Challenges
            </Button>
          </Paper>
        ) : challenge ? (
          <>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ mb: 3 }}
            >
              Back to Challenges
            </Button>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}
                >
                  {challenge.title}
                </Typography>
                {isAdmin && (
                  <Chip
                    label={`Code: ${challenge.code}`}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Created by: {challenge.creator.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Participants: {challenge.users.length}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="h6"
                sx={{ mb: 1, color: theme.palette.text.primary }}
              >
                Description
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: theme.palette.text.secondary,
                  lineHeight: 1.7,
                }}
              >
                {challenge.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TrophyIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                    }}
                  >
                    {challenge.coinsValue} {coin?.name}
                  </Typography>
                </Box>

                { !isAdmin && <Button variant="contained" color="primary" size="medium">
                  Quit Challenge
                </Button>}
              </Box>
            </Paper>
          </>
        ) : null}
        {isAdmin && challenge && challenge.users.length > 0 && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: theme.palette.text.primary }}
            >
              Participants
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {updatedUsers.map((user) => (
                <Box
                  key={user.email}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    p: 2,
                    borderRadius: 1,
                    bgcolor: theme.palette.background.default,
                    border: "1px solid",
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Typography variant="body1" fontWeight="medium">
                    {user.name}
                  </Typography>
                  {loadingApprove ? ( 
                    <CircularProgress size={20} />
                    ) : 
                    user.challengeStatus === "completed" ? (
                      <Chip
                        label="Completed"
                        color="primary"
                        sx={{ fontWeight: "medium" }}
                      />
                    ) : user.challengeStatus === "activ" ? (
                      <Chip
                        label="Approved"
                        color="success"
                        sx={{ fontWeight: "medium" }}
                      />
                    ) : user.challengeStatus === "active" ? (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleApprove(user._id, challenge._id)}
                        sx={{
                          minWidth: "100px",
                          fontWeight: "medium",
                        }}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Chip
                        label={user.challengeStatus || "Joined"}
                        color="default"
                        variant="outlined"
                        sx={{ fontWeight: "medium" }}
                      />
                    )
                  }
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Box>
    </NavBar>
  );
};

export default ChallengeDetailPage;
