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
  Grow,
} from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../../components/Navbar';
import { Add as AddIcon } from '@mui/icons-material';
import { ShopItem } from '../../../utils/types/dataTypes';
import CreateShopItemModal from '../../../components/CreateShopItemModal';

const dummyShopItems: ShopItem[] = [
  { 
    id: '1', 
    name: 'Group T-Shirt', 
    description: 'Custom printed t-shirt with group logo',
    availability: 'In Stock', 
    price: 500,
    image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTG_q0A0cypAsXxYlgs5J_554BrcnjeeKExlQE3ZaZUuPYv0fUd'
  },
  { 
    id: '2', 
    name: 'Extra Points Boost', 
    description: '2x points for all activities for one week',
    availability: 'Available', 
    price: 300,
    image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTG_q0A0cypAsXxYlgs5J_554BrcnjeeKExlQE3ZaZUuPYv0fUd'
  },
  { 
    id: '3', 
    name: 'Premium Group Status', 
    description: 'Exclusive badge and profile highlights for one month',
    availability: 'Limited', 
    price: 1000,
    image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTG_q0A0cypAsXxYlgs5J_554BrcnjeeKExlQE3ZaZUuPYv0fUd'
  },
  { 
    id: '4', 
    name: 'Virtual Coffee with Mentor', 
    description: '30-minute one-on-one session with a group mentor',
    availability: 'Available', 
    price: 750,
    image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTG_q0A0cypAsXxYlgs5J_554BrcnjeeKExlQE3ZaZUuPYv0fUd'
  },
  { 
    id: '5', 
    name: 'Custom Challenge Creation', 
    description: 'Create your own custom challenge for the group',
    availability: 'Out of Stock', 
    price: 1200,
    image: 'https://via.placeholder.com/200x200?text=Custom+Challenge'
  },
];

const ShopPage: React.FC = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: groupId } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        setLoading(true);
        // Simulate an API call with dummy data
        setTimeout(() => {
          setShopItems(dummyShopItems);
          setError(null);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching shop items:", err);
        setError("Failed to load shop items");
        setLoading(false);
      }
    };

    fetchShopItems();
  }, []);

  const handleRedeemCoupon = () => {
    setCouponCode('');
    setRedeemModalOpen(false);
    
    // Here you would typically make an API call to redeem the coupon
    alert(`Successfully redeemed coupon: ${couponCode}`);
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/groups/${groupId}/shop/${itemId}`);
  };

  const getAvailabilityColor = (availability: string) => {
    switch(availability.toLowerCase()) {
      case 'in stock':
        return theme.palette.success.main;
      case 'available':
        return theme.palette.success.main;
      case 'limited':
        return theme.palette.warning.main;
      case 'out of stock':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleCreateItem = async (itemData: Omit<ShopItem, 'id'>) => {
    try {
      // You can use your API function here
      // const newItem = await createShopItem({
      //   ...itemData,
      //   groupId: groupId || ''
      // });
      
      // For now, just add to local state with a temp ID
      const newItem = {
        id: Date.now().toString(),
        ...itemData
      };
      
      setShopItems([...shopItems, newItem]);
      
      // Show success message
      alert('Item created successfully!');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    }
  };

  return (
    <NavBar isGroupPage={true} activeTab="shop">
      <Box sx={{ p: 3, minHeight: '85vh', position: 'relative' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ mb: 4, color: theme.palette.text.primary }}
        >
          Group Shop
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
            {shopItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
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
                    onClick={() => handleItemClick(item.id)}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {item.image && (
                        <Box sx={{ mb: 2, textAlign: 'center' }}>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ 
                              maxWidth: '100%', 
                              height: 'auto', 
                              maxHeight: '150px',
                              objectFit: 'contain' 
                            }}
                          />
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                          {item.name}
                        </Typography>
                        <Box 
                          sx={{ 
                            bgcolor: getAvailabilityColor(item.availability),
                            color: '#fff',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {item.availability}
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
                        {item.description.length > 80 
                          ? `${item.description.substring(0, 80)}...` 
                          : item.description}
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
                          {item.price} coins
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
            aria-label="redeem coupon"
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24,
              boxShadow: 3
            }}
            onClick={() => setRedeemModalOpen(true)}
          >
            <CartIcon />
          </Fab>
        </Zoom>

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
               onClick={() => setCreateModalOpen(true)}
             >
               <AddIcon />
             </Fab>
           </Zoom>

        {/* Redeem Coupon Modal */}
        <Dialog 
          open={redeemModalOpen} 
          onClose={() => setRedeemModalOpen(false)}
          PaperProps={{ 
            sx: { 
              borderRadius: 2,
              maxWidth: '400px'
            } 
          }}
        >
          <DialogTitle>Redeem Coupon</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter your coupon code to receive special offers or discounts.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="couponCode"
              label="Coupon Code"
              type="text"
              fullWidth
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setRedeemModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleRedeemCoupon} 
              variant="contained" 
              disabled={!couponCode.trim()}
            >
              Redeem
            </Button>
          </DialogActions>
        </Dialog>
        <CreateShopItemModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateItem}
        groupId={groupId || ''}
      />
      </Box>
    </NavBar>
  );
};

export default ShopPage;