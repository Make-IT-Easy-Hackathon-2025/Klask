import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
  useTheme,
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../../components/Navbar';

interface Challenge {
  id: string;
  title: string;
  description: string;
  status: string;
  coinWorth: number;
  dueDate?: string;
  participants?: number;
}

const dummyChallenges: { [key: string]: Challenge } = {
  '1': { 
    id: '1', 
    title: 'Daily Exercise', 
    description: 'Complete a 30-minute workout session. Regular physical activity can help improve your health and reduce the risk of developing chronic diseases. This challenge encourages you to make exercise a daily habit. Track your progress and see how you improve over time.',
    status: 'Active', 
    coinWorth: 100,
    dueDate: '2025-03-10',
    participants: 12
  },
  '2': { 
    id: '2', 
    title: 'Read a Book Chapter', 
    description: 'Read at least one chapter from an educational book. Reading regularly helps expand your knowledge base and improve comprehension skills. Choose a book that interests you or challenges your thinking.',
    status: 'Completed', 
    coinWorth: 200,
    dueDate: '2025-03-08',
    participants: 8
  },
  '3': { 
    id: '3', 
    title: 'Meditation Session', 
    description: 'Complete a 15-minute guided meditation session. Meditation can help reduce stress and improve mental clarity. Find a quiet space where you can sit comfortably without distractions.',
    status: 'Pending', 
    coinWorth: 150,
    dueDate: '2025-03-15',
    participants: 5
  },
  '4': { 
    id: '4', 
    title: 'Learn a New Skill', 
    description: 'Spend 1 hour learning something new related to your field. Continuous learning is essential for personal and professional growth. Choose a skill that will benefit your career or personal interests.',
    status: 'Active', 
    coinWorth: 250,
    dueDate: '2025-03-20',
    participants: 7
  },
  '5': { 
    id: '5', 
    title: 'Networking Event', 
    description: 'Attend a virtual or in-person networking event. Building and maintaining professional relationships can open up new opportunities. Prepare a brief introduction and set a goal for how many new connections you want to make.',
    status: 'Pending', 
    coinWorth: 300,
    dueDate: '2025-03-25',
    participants: 15
  },
};

const ChallengeDetailPage: React.FC = () => {
  const { id: groupId, challengeId } = useParams<{ id: string, challengeId: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        // Simulate API call with dummy data
        setTimeout(() => {
          if (challengeId && dummyChallenges[challengeId]) {
            setChallenge(dummyChallenges[challengeId]);
            setError(null);
          } else {
            setError("Challenge not found");
          }
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError("Failed to load challenge details");
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  const handleGoBack = () => {
    navigate(`/groups/${groupId}/challenges`);
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return theme.palette.success.main;
      case 'completed':
        return theme.palette.info.main;
      case 'pending':
        return theme.palette.warning.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusBackground = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return `${theme.palette.success.main}22`; // 22 for opacity
      case 'completed':
        return `${theme.palette.info.main}22`;
      case 'pending':
        return `${theme.palette.warning.main}22`;
      default:
        return `${theme.palette.text.secondary}22`;
    }
  };

  return (
    <NavBar isGroupPage={true} activeTab="challenges">
      <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
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
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                  {challenge.title}
                </Typography>
                <Chip 
                  label={challenge.status} 
                  sx={{ 
                    color: getStatusColor(challenge.status),
                    bgcolor: getStatusBackground(challenge.status),
                    fontWeight: 'bold'
                  }} 
                />
              </Box>

              {challenge.dueDate && (
                <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                  Due: {new Date(challenge.dueDate).toLocaleDateString()}
                </Typography>
              )}

              {challenge.participants && (
                <Typography variant="subtitle2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                  {challenge.participants} participants
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary }}>
                Description
              </Typography>

              <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                {challenge.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mt: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrophyIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    {challenge.coinWorth} coins
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                >
                  Complete Challenge
                </Button>
              </Box>
            </Paper>
          </>
        ) : null}
      </Box>
    </NavBar>
  );
};

export default ChallengeDetailPage;