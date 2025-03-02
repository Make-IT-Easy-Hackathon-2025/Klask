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
import { getShopItemById, purchaseShopItem } from "../../../api";
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
                      <Box
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
                      </Box>
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
                      <Button
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
                      </Button>
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
