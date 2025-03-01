import React, { use, useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Fab, Dialog, DialogTitle, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/Navbar";
import { IGroup } from "../../utils/types/dataTypes";
import { useAuth } from "../../context/AuthProvider";
import { getCreatedGroups, getUserGroups } from "../../api";
import LoadingPage from "../LoadingPage";
import { useNavigate } from "react-router-dom";
import GroupCard from "../../components/GroupCard"; // Import the GroupCard component

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userGroups = await getUserGroups(user._id); // or getCreatedGroups(user._id)
        setGroups(userGroups);
        console.log(userGroups);
      } catch (error) {
        console.error("Error fetching groups", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  // Handle group click
  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}/leaderboard`);
  };
  if(loading) {
    return <NavBar><LoadingPage /></NavBar>
  }
  return (
    <NavBar>
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Page Title */}
        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 3 }}>
          Joined Groups
        </Typography>

        {/* List of Groups or Empty State Message */}
        {groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              handleGroupClick={handleGroupClick}
            />
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic' }}>
            You are not part of any group.
          </Typography>
        )}
      </Box>
    </NavBar>
  );
};

export default HomePage;