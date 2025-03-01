import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
  useTheme,
  Chip,
  Avatar
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../../components/Navbar';
import { getChallengeById } from '../../../api';
import { IChallenge } from '../../../utils/types/dataTypes';

const ChallengeDetailPage: React.FC = () => {
  const { id: groupId, challengeId } = useParams<{ id: string; challengeId: string }>();
  const [challenge, setChallenge] = useState<IChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();

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
                  label={`Code: ${challenge.code}`}
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Box>

              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                  Created by:
                </Typography>
                
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                  Participants: {challenge.users.length}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary }}>
                Description
              </Typography>

              <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                {challenge.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mt: 3 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrophyIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    {challenge.coinsValue} coins
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