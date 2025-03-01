import React, { useEffect, useState } from 'react';
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
  Grow
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../../components/Navbar';

interface Challenge {
  id: string;
  title: string;
  description: string;
  status: string;
  coinWorth: number;
}

const dummyChallenges: Challenge[] = [
  { 
    id: '1', 
    title: 'Daily Exercise', 
    description: 'Complete a 30-minute workout session',
    status: 'Active', 
    coinWorth: 100 
  },
  { 
    id: '2', 
    title: 'Read a Book Chapter', 
    description: 'Read at least one chapter from an educational book',
    status: 'Completed', 
    coinWorth: 200 
  },
  { 
    id: '3', 
    title: 'Meditation Session', 
    description: 'Complete a 15-minute guided meditation session',
    status: 'Pending', 
    coinWorth: 150 
  },
  { 
    id: '4', 
    title: 'Learn a New Skill', 
    description: 'Spend 1 hour learning something new related to your field',
    status: 'Active', 
    coinWorth: 250 
  },
  { 
    id: '5', 
    title: 'Networking Event', 
    description: 'Attend a virtual or in-person networking event',
    status: 'Pending', 
    coinWorth: 300 
  },
];

const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [challengeCode, setChallengeCode] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: groupId } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        // Simulate an API call with dummy data
        setTimeout(() => {
          setChallenges(dummyChallenges);
          setError(null);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError("Failed to load challenges");
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleJoinChallenge = () => {
    // Logic to join challenge with the provided code
    console.log(`Joining challenge with code: ${challengeCode}`);
    setChallengeCode('');
    setJoinModalOpen(false);
    
    // Here you would typically make an API call to join the challenge
    // For now, just show a success message
    alert(`Successfully joined challenge with code: ${challengeCode}`);
  };

  const handleChallengeClick = (challengeId: string) => {
    navigate(`/groups/${groupId}/challenges/${challengeId}`);
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

  return (
    <NavBar isGroupPage={true} activeTab="challenges">
      <Box sx={{ p: 3, minHeight: '85vh', position: 'relative' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ mb: 4, color: theme.palette.text.primary }}
        >
          Group Challenges
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" variant="h6" align="center">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {challenges.map((challenge, index) => (
              <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                <Grow
                  in={true}
                  timeout={300 * (index + 1)}
                >
                  <Card 
                    sx={{ 
                      cursor: 'pointer', 
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                      height: '100%'
                    }}
                    onClick={() => handleChallengeClick(challenge.id)}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                          {challenge.title}
                        </Typography>
                        <Box 
                          sx={{ 
                            bgcolor: getStatusColor(challenge.status),
                            color: '#fff',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {challenge.status}
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          flexGrow: 1,
                          mb: 2
                        }}
                      >
                        {challenge.description.length > 80 
                          ? `${challenge.description.substring(0, 80)}...` 
                          : challenge.description}
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'flex-end',
                          mt: 'auto'
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: theme.palette.primary.main 
                          }}
                        >
                          {challenge.coinWorth} coins
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button */}
        <Zoom in={!loading}>
          <Fab 
            color="primary" 
            aria-label="join challenge"
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24,
              boxShadow: 3
            }}
            onClick={() => setJoinModalOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>

        {/* Join Challenge Modal */}
        <Dialog 
          open={joinModalOpen} 
          onClose={() => setJoinModalOpen(false)}
          PaperProps={{ 
            sx: { 
              borderRadius: 2,
              maxWidth: '400px'
            } 
          }}
        >
          <DialogTitle>Join Challenge</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter the challenge code to join a new challenge.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="challengeCode"
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
              onClick={handleJoinChallenge} 
              variant="contained" 
              disabled={!challengeCode.trim()}
            >
              Join
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </NavBar>
  );
};

export default ChallengesPage;