import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, Avatar, Typography, useTheme } from "@mui/material";
import NavBar from "../../components/Navbar";

export interface IGroup {
  _id: string;
  name: string;
  users: string[];
  profilePic: string;
  description: string;
  coin: {
    name: string;
    image: string;
  };
  shopItems: string[];
}

const groups: IGroup[] = [
  {
    _id: "1",
    name: "Group 1",
    users: ["user1", "user2"],
    profilePic: "https://via.placeholder.com/40",
    description: "Description of Group 1",
    coin: { name: "GroupCoin 1", image: "https://via.placeholder.com/20" },
    shopItems: ["item1", "item2"],
  },
  {
    _id: "2",
    name: "Group 2",
    users: ["user3", "user4"],
    profilePic: "https://via.placeholder.com/40",
    description: "Description of Group 2",
    coin: { name: "GroupCoin 2", image: "https://via.placeholder.com/20" },
    shopItems: ["item3", "item4"],
  },
  {
    _id: "3",
    name: "Group 3",
    users: ["user5", "user6"],
    profilePic: "https://via.placeholder.com/40",
    description: "Description of Group 3",
    coin: { name: "GroupCoin 3", image: "https://via.placeholder.com/20" },
    shopItems: ["item5", "item6"],
  },
];

const HomePage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const theme = useTheme();

  const handleGroupClick = (groupId: string) => {
    console.log("Group clicked:", groupId);
  }

  return (
    <NavBar>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <List sx={{ width: "100%" }}>
          {groups.map((group) => (
            <ListItem
              key={group._id}
              onClick={() => handleGroupClick(group._id)}
              sx={{
                padding: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                border: selectedGroup === group._id ? `2px solid ${theme.palette.primary.main}` : "none",
                transition: "0.3s",
              }}
            >
              <Avatar src={group.profilePic} sx={{ backgroundColor: "#E0E0E0" }} />
              <ListItemText
                primary={<Typography fontWeight="bold">{group.name}</Typography>}
                secondary={group.description}
                sx={{ textAlign: "left", marginLeft: 2 }}
              />
              <Typography fontWeight="bold">{group.coin.name}</Typography>
              <Avatar src={group.coin.image} sx={{ backgroundColor: "#E0E0E0" }} />
            </ListItem>
          ))}
        </List>
      </Box>
    </NavBar>
  );
};

export default HomePage;
