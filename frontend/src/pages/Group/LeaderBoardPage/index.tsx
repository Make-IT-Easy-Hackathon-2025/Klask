import React from "react";
import {
  Typography,
  Container,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from "@mui/material";

import Navbar from "../../../components/Navbar";

const GroupPageLeaderBoard: React.FC = () => {
  const theme = useTheme();

  // Dummy data for the leaderboard
  const leaderboardData = [
    {
      name: "John Doe",
      coins: 1200,
      profilePic: "https://via.placeholder.com/40",
    },
    {
      name: "Jane Smith",
      coins: 1100,
      profilePic: "https://via.placeholder.com/40",
    },
    {
      name: "Alice Johnson",
      coins: 1000,
      profilePic: "https://via.placeholder.com/40",
    },
    {
      name: "Bob Brown",
      coins: 950,
      profilePic: "https://via.placeholder.com/40",
    },
    {
      name: "Charlie Davis",
      coins: 900,
      profilePic: "https://via.placeholder.com/40",
    },
  ];

  return (
    <>

      <Navbar isGroupPage={true} activeTab="leaderboard">
    
        {/* Main Content: Leaderboard */}
        <Container sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Leaderboard
          </Typography>
          <List>
            {leaderboardData.map((user, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={user.name} src={user.profilePic} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={`${user.coins} coins`}
                  sx={{ color: theme.palette.text.primary }}
                />
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.text.primary }}
                >
                  #{index + 1}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Container>
      </Navbar>
    </>
  );
};

export default GroupPageLeaderBoard;
