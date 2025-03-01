import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Avatar,
  Box,
  Paper,
  useTheme,
  Chip,
} from "@mui/material";
import Navbar from "../../../components/Navbar";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useParams } from "react-router-dom";
import { getGroupUsers } from "../../../api";

interface GroupUser {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: "admin" | "moderator" | "user" | "guest";
  coins: number;
}

const GroupPageLeaderBoard: React.FC = () => {
  const theme = useTheme();
  const { id: groupId } = useParams<{ id: string }>();
  const [users, setUsers] = useState<GroupUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const sortedUsers = usersData.sort((a: GroupUser, b: GroupUser) => b.coins - a.coins);
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
              sx={{
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
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
                  src={user.profilePicture}
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
                    icon={<MonetizationOnIcon />} 
                    label={`${user.coins} coins`}
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
        </Container>
      </Navbar>
    </>
  );
};

export default GroupPageLeaderBoard;