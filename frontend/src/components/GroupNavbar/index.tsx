import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  EmojiEvents as LeaderboardIcon,
  Assignment as TasksIcon,
  Store as ShopIcon,
  MonetizationOn as CoinIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../navigation/paths";
import { getGroupById } from "../../api";
import { useAuth } from "../../context/AuthProvider";
import SettingsIcon from "@mui/icons-material/Settings";

interface Group {
  _id: string;
  name: string;
  profilePic?: string;
  description?: string;
  coin: {
    name: string;
    image: string;
  };
  users: string[];
  shopItems: string[];
}

interface GroupToolbarProps {
  activeTab?: 'leaderboard' | 'challenges' | 'shop' | 'manage';
}

const GroupNavbar: React.FC<GroupToolbarProps> = ({ 
  activeTab = 'leaderboard',
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: groupId } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();
  const [userCoins, setUserCoins] = useState<number | undefined>(0);
 
  useEffect(() => {
    if (!user) return;
    const userGroup = user.groups.find(g => g.GID === groupId);
    
    setUserCoins(userGroup?.coins);
  }, [user, groupId]);

  const isAdmin = user?.groups.find(g => g.GID === groupId)?.role === 'admin';
  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) {
        setError("No group ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await getGroupById(groupId);
        setGroup(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Failed to load group data");
        
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleTabClick = (tab: string) => {
    switch (tab) {
      case 'leaderboard':
        navigate(PATHS.GROUP_LEADERBOARD.replace(':id', groupId || ''));
        break;
      case 'challenges':
        navigate(PATHS.GROUP_CHALLENGES.replace(':id', groupId || ''));
        break;
      case 'shop':
        navigate(PATHS.GROUP_SHOP.replace(':id', groupId || ''));
        break;
      case 'manage':
        navigate(PATHS.GROUP_MANAGE.replace(':id', groupId || ''));
        break;
      default:
        navigate(PATHS.GROUP_LEADERBOARD.replace(':id', groupId || ''));
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: "none",
        bgcolor: theme.palette.secondary.main,
        mt: 0,
      }}
    >
      <Toolbar>
        {/* Left Side: Navigation Buttons */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<LeaderboardIcon />}
            onClick={() => handleTabClick('leaderboard')}
            sx={{ 
              fontWeight: activeTab === 'leaderboard' ? 'bold' : 'normal',
              borderBottom: activeTab === 'leaderboard' ? `2px solid ${theme.palette.primary.main}` : 'none'
            }}
          >
            Leaderboard
          </Button>
          <Button
            color="inherit"
            startIcon={<TasksIcon />}
            onClick={() => handleTabClick('challenges')}
            sx={{ 
              fontWeight: activeTab === 'challenges' ? 'bold' : 'normal',
              borderBottom: activeTab === 'challenges' ? `2px solid ${theme.palette.primary.main}` : 'none'
            }}
          >
            Challenges
          </Button>
          <Button
            color="inherit"
            startIcon={<ShopIcon />}
            onClick={() => handleTabClick('shop')}
            sx={{ 
              fontWeight: activeTab === 'shop' ? 'bold' : 'normal',
              borderBottom: activeTab === 'shop' ? `2px solid ${theme.palette.primary.main}` : 'none'
            }}
          >
            Shop
          </Button>
          {isAdmin && (
            <Button
              color="inherit"
              startIcon={<SettingsIcon />}
              onClick={() => handleTabClick('manage')}
              sx={{
                fontWeight: activeTab === 'manage' ? 'bold' : 'normal',
                borderBottom: activeTab === 'manage' ? `2px solid ${theme.palette.primary.main}` : 'none'
              }}
            >
              Manage
            </Button>
          )}
        </Box>

        {/* Right Side: Group Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : error ? (
            <Typography color="error" variant="body2">{error}</Typography>
          ) : group ? (
            <>
              <Avatar 
                alt={group.name} 
                src={group.profilePic || undefined} 
                sx={{ width: 40, height: 40 }}
              />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary, fontWeight: 'medium' }}
              >
                {group.name}
              </Typography>
              <CoinIcon sx={{ color: theme.palette.text.primary }} />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
              >
                {userCoins !== undefined ? userCoins.toLocaleString() : '3'}
              </Typography>
            </>
          ) : (
            <Typography variant="body2">No group data</Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default GroupNavbar;