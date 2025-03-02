import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import CustomAvatar from '../CustomAvatar';
import placeholderimage from '../../assets/sap.png';

interface Group {
  _id: string;
  profilePic: string;
  name: string;
  description: string;
  coin: {
    image?: string;
    name: string;
  };
}

interface GroupCardProps {
  group: Group;
  handleGroupClick: (groupId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, handleGroupClick }) => {
  return (
    <Card
      key={group._id}
      sx={{
        mb: 2,
        width: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)', // Slightly scale up the card
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Add a shadow effect
          cursor: 'pointer', // Change cursor to pointer on hover
        },
      }}
      onClick={() => handleGroupClick(group._id)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar src={placeholderimage} sx={{ mr: 2 }} />
          <Typography variant="h6">{group.name}</Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {group.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
         
        </Box>
      </CardContent>
    </Card>
  );
};

export default GroupCard; 