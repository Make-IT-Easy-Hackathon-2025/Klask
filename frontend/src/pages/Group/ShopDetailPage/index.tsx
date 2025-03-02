import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  useTheme,
  Grid,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  LocalOffer as LocalOfferIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import NavBar from "../../../components/Navbar";
import { ShopItem } from "../../../utils/types/dataTypes";
import { getShopItemById, purchaseShopItem, updateQuantity } from "../../../api";
import { useAuth } from "../../../context/AuthProvider";
import LoadingPage from "../../LoadingPage";

const ShopItemDetailPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [item, setItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { itemId, id: groupId } = useParams<{ itemId: string; id: string }>();
  const { user } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const isAuthorized = user?.groups.find((group) => group.GID === groupId)?.role === "admin" 
    || user?.groups.find((group) => group.GID === groupId)?.role === "moderator";
  

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        if (itemId) {
          const response = await getShopItemById(itemId);
          setItem(response);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching item details:", error);
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= (item?.quantity || 0)) {
      setSelectedQuantity(value);
    }
  };

  const handleIncrement = () => {
    if (selectedQuantity < (item?.quantity || 0)) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  const handlePurchase = async () => {
    if (!user || !groupId || !item) {
      console.log("no data shop", user, groupId, item);
      return;
    }
    setLoading(true);
    try {
      const response = await purchaseShopItem(
        user._id,
        groupId,
        item._id,
        selectedQuantity
      );
      navigate(`/groups/${groupId}/shop`);
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 400) {
        setError("Insufficient Funds");
      }
      console.error("Error making purchase:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case "in stock":
        return theme.palette.success.main;
      case "limited":
        return theme.palette.warning.main;
      case "out of stock":
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getAvailabilityStatus = (item: ShopItem): string => {
    if (item.quantity === 0) {
      return "Out of Stock";
    }
    if (item.quantity <= 5) {
      return "Limited";
    }
    return "In Stock";
  };



  // Add these state variables
const [adminQuantity, setAdminQuantity] = useState<number | null>(null);
const [updatingQuantity, setUpdatingQuantity] = useState(false);
const [quantityUpdateError, setQuantityUpdateError] = useState<string | null>(null);
const [quantityUpdateSuccess, setQuantityUpdateSuccess] = useState(false);
const [deletingItem, setDeletingItem] = useState(false);

// Add these functions
const handleUpdateQuantity = async () => {
  if (adminQuantity === null || !item || !groupId) return;
  
  setUpdatingQuantity(true);
  setQuantityUpdateError(null);
  setQuantityUpdateSuccess(false);
  
  try {
    
    const response = await updateQuantity(item._id, adminQuantity)
    // Update the local item state with new quantity
    setItem({
      ...item,
      quantity: adminQuantity
    });
    
    setAdminQuantity(null);
    setQuantityUpdateSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setQuantityUpdateSuccess(false);
    }, 3000);
  } catch (err) {
    console.error("Failed to update quantity:", err);
    setQuantityUpdateError("Failed to update item quantity");
  } finally {
    setUpdatingQuantity(false);
  }
};

const handleDeleteItem = async () => {
  if (!window.confirm("Are you sure you want to remove this item from the shop?")) {
    return;
  }
  
  setDeletingItem(true);
  
  try {
    // Replace with your actual API call
    // await deleteShopItem(item._id, groupId);
    
    // For now, simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back to the shop
    navigate(`/groups/${groupId}/shop`);
  } catch (err) {
    console.error("Failed to delete item:", err);
    alert("Failed to remove item from shop");
  } finally {
    setDeletingItem(false);
  }
};



  if (loading) {
    return (
      <NavBar isGroupPage={true} activeTab="shop">
        <LoadingPage />
      </NavBar>
    );
  }
  return (
    <NavBar isGroupPage={true} activeTab="shop">
      <Box sx={{ padding: 3, maxWidth: "1200px", margin: "0 auto" }}>
        <Button
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to Shop
        </Button>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : item ? (
          <>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Grid container spacing={4}>
                {item.image && (
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "400px",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 3,
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} md={item.image ? 7 : 12}>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                      {item.name}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                      <Chip
                        icon={<LocalOfferIcon />}
                        label={`${item.price} coins`}
                        color="primary"
                        sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                      />
                      <Chip
                        icon={<InventoryIcon />}
                        label={`${item.quantity} available`}
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                      />
                      <Chip
                        label={getAvailabilityStatus(item)}
                        sx={{
                          bgcolor: getAvailabilityColor(
                            getAvailabilityStatus(item)
                          ),
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: theme.palette.text.secondary }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                      {item.description}
                    </Typography>

                    {item.details && (
                      <>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, color: theme.palette.text.secondary }}
                        >
                          Additional Details
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ mb: 4, lineHeight: 1.8 }}
                        >
                          {item.details}
                        </Typography>
                      </>
                    )}

                    <Box sx={{ mt: "auto" }}>
                      {!isAuthorized &&<Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 3,
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          Quantity:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <IconButton
                            onClick={handleDecrement}
                            disabled={selectedQuantity <= 1}
                            size="small"
                            sx={{ borderRadius: 0 }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <TextField
                            value={selectedQuantity}
                            onChange={handleQuantityChange}
                            type="number"
                            inputProps={{
                              min: 1,
                              max: item.quantity,
                              style: {
                                textAlign: "center",
                                width: "50px",
                                padding: "8px 0",
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                              "& .MuiOutlinedInput-root": { padding: 0 },
                            }}
                          />
                          <IconButton
                            onClick={handleIncrement}
                            disabled={selectedQuantity >= item.quantity}
                            size="small"
                            sx={{ borderRadius: 0 }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            ml: 2,
                          }}
                        >
                          (Total: {selectedQuantity * item.price} coins)
                        </Typography>
                      </Box> }
                      {error && (
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.primary,
                            mb: 2,
                            textAlign: "center",
                            fontWeight: "medium",
                            backgroundColor: theme.palette.error.light,
                            padding: 2,
                            borderRadius: 1,
                          }}
                        >
                          {error}
                        </Typography>
                      )}
                    { !isAuthorized && <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={
                        item.quantity === 0 ||
                        item.availability.toLowerCase() === "out of stock" ||
                        selectedQuantity > item.quantity
                      }
                      onClick={handlePurchase}
                      startIcon={<ShoppingCartIcon />}
                      sx={{
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {item.quantity === 0 ||
                      item.availability.toLowerCase() === "out of stock"
                        ? "Out of Stock"
                        : `Purchase ${selectedQuantity} Item${
                            selectedQuantity > 1 ? "s" : ""
                          } - ${selectedQuantity * item.price} coins`}
                    </Button>}       
                    {isAuthorized && (
  <Box sx={{ mt: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
      Admin Controls
    </Typography>
    
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
        Update Item Inventory:
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="Set Quantity"
          type="number"
          variant="outlined"
          size="small"
          value={adminQuantity !== null ? adminQuantity : item.quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 0) {
              setAdminQuantity(value);
            }
          }}
          inputProps={{ min: 0 }}
          sx={{ width: 150 }}
        />
        
        <Button
          variant="contained"
          color="primary"
          disabled={adminQuantity === null || adminQuantity === item.quantity || updatingQuantity}
          onClick={handleUpdateQuantity}
          startIcon={updatingQuantity ? <CircularProgress size={20} /> : null}
        >
          {updatingQuantity ? 'Updating...' : 'Update Quantity'}
        </Button>
        
        {adminQuantity !== null && adminQuantity !== item.quantity && (
          <Button
            variant="text"
            color="inherit"
            onClick={() => setAdminQuantity(null)}
            disabled={updatingQuantity}
          >
            Cancel
          </Button>
        )}
      </Box>
      
      {quantityUpdateError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {quantityUpdateError}
        </Typography>
      )}
      
      {quantityUpdateSuccess && (
        <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
          Quantity updated successfully!
        </Typography>
      )}
    </Box>
    
    <Divider sx={{ my: 2 }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/groups/${groupId}/shop/edit/${item._id}`)}
      >
        Edit Item Details
      </Button>
      
      <Button
        variant="outlined"
        color="error"
        onClick={handleDeleteItem}
        disabled={deletingItem}
        startIcon={deletingItem ? <CircularProgress size={20} /> : null}
      >
        {deletingItem ? 'Deleting...' : 'Remove Item'}
      </Button>
    </Box>
  </Box>
)}           
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Item not found.
            </Typography>
          </Paper>
        )}
      </Box>
    </NavBar>
  );
};

export default ShopItemDetailPage;
