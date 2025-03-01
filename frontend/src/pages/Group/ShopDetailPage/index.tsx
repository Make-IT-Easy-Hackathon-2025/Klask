import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  useTheme,
  Grid,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../../components/Navbar';
import { ShopItem } from '../../../utils/types/dataTypes';


const ShopItemDetailPage: React.FC = () => {
  const theme = useTheme();
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        // Mock data - replace with actual API call
        const mockItem: ShopItem = {
          id: itemId || '1',
          name: 'Premium Badge',
          description: 'A limited edition badge to showcase your status',
          availability: 'In Stock',
          price: 100,
          image: '/images/badge.jpg',
          details: 'This exclusive badge is designed for our most dedicated users. Display it proudly on your profile to show your commitment and achievements.'
        };
        
        setItem(mockItem);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item details:', error);
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handlePurchase = () => {
    // Implement purchase functionality
    alert('Purchase initiated!');
    // After successful purchase, you might want to navigate somewhere
    // navigate('/shop/purchased');
  };

  return (
    <NavBar isGroupPage={true} activeTab="shop">

      <Box sx={{ padding: 3 }}>
        <Button 
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
          variant="text"
        >
          Back to Shop
        </Button>

        {loading ? (
          <CircularProgress/>
        ) : item ? (
          <>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={3}>
                {item.image && (
                  <Grid item xs={12} md={4}>
                    <Box 
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: 1,
                        maxHeight: 300,
                        objectFit: 'cover'
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} md={item.image ? 8 : 12}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {item.name}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                    {item.availability}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {item.description}
                  </Typography>
                  
                  {item.details && (
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {item.details}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                      {item.price} coins
                    </Typography>
                    
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      onClick={handlePurchase}
                    >
                      Purchase Item
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </>
        ) : (
          <Typography variant="body1" sx={{ mt: 3 }}>
            Item not found.
          </Typography>
        )}
      </Box>
    </NavBar>
  );
};

export default ShopItemDetailPage;