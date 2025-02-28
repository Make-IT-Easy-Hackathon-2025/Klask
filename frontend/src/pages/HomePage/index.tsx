import React, { useState } from "react";
import { Container, Box, List, ListItem, ListItemText, Avatar, Typography } from "@mui/material";
import NavBar from "../../components/Navbar";

const items = [
  { id: 1, title: "Title 1", description: "Description 1" },
  { id: 2, title: "Title 2", description: "Description 2" },
  { id: 3, title: "Title 3", description: "Description 3" },
];

const HomePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

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
          {items.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              sx={{
                backgroundColor: "#b28332",
                padding: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                border: selectedItem === item.id ? "2px solid #00AEEF" : "none",
                transition: "0.3s",
              }}
            >
              <Avatar sx={{ backgroundColor: "#E0E0E0" }} />
              <ListItemText
                primary={<Typography fontWeight="bold">{item.title}</Typography>}
                secondary={item.description}
                sx={{ textAlign: "left", marginLeft: 2 }}
              />
              <Typography fontWeight="bold">groupcoin</Typography>
              <Avatar sx={{ backgroundColor: "#E0E0E0" }} />
            </ListItem>
          ))}
        </List>
      </Box>
    </NavBar>
  );
};

export default HomePage;
