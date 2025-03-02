import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Fab,
  useTheme,
  Zoom,
  Grow,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../components/Navbar";
import {
  Add as AddIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import { ShopItem } from "../../../utils/types/dataTypes";
import CreateShopItemModal from "../../../components/CreateShopItemModal";
import { useAuth } from "../../../context/AuthProvider";
import {
  createShopItem,
  getAllShopItemsByGroupId,
} from "../../../api";

const ShopPage: React.FC = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMod, setIsMod] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();
  const { id: groupId } = useParams<{ id: string }>();
  const { user } = useAuth();

  const handleCreateItem = async (
    itemData: Omit<ShopItem, "id"> & { imageFile?: File }
  ) => {
    try {
      if (!groupId) return;
      const newItem = await createShopItem({
        ...itemData,
        availability: itemData.availability.toLowerCase(),
        groupId: groupId,
      });
      setShopItems([...shopItems, newItem]);
    } catch (error) {
      console.error("Error creating item:", error);
      alert("Failed to create item");
    }
  };

  useEffect(() => {
    const fetchShopItems = async () => {
      if (!groupId) return;
      try {
        setLoading(true);
        const items = await getAllShopItemsByGroupId(groupId);
        setShopItems(items);
      } catch (err) {
        console.error("Error getting shop items:", err);
        setError("Failed to load shop items");
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, [groupId]);

  useEffect(() => {
    if (!user || !groupId) return;
    const groupData = user.groups.find((g) => g.GID === groupId);
    setIsAdmin(groupData?.role === "admin");
    setIsMod(groupData?.role === "moderator");
  }, [user, groupId]);

  const handleItemClick = (itemId: string) => {
    navigate(`/groups/${groupId}/shop/${itemId}`);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case "in stock":
        return theme.palette.success.main;
      case "available":
        return theme.palette.success.main;
      case "limited":
        return theme.palette.warning.main;
      case "out of stock":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
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

  return (
    <NavBar isGroupPage={true} activeTab="shop">
      <Box
        sx={{
          p: 3,
          minHeight: "85vh",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, color: theme.palette.text.primary }}
        >
          Group Shop
        </Typography>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" variant="h6" align="center">
            {error}
          </Typography>
        ) : shopItems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              py: 6,
              px: 4,
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'transparent',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <ShoppingBagIcon 
              sx={{ 
                fontSize: 80, 
                mb: 2,
                color: theme.palette.text.secondary,
                opacity: 0.5
              }} 
            />
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
                fontWeight: 'medium'
              }}
            >
              No Items Available
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: theme.palette.text.secondary,
                maxWidth: '500px'
              }}
            >
              {isAdmin || isMod 
                ? "Start by adding items to your shop. Click the + button below to create your first item!"
                : "There are no items available in the shop at the moment. Check back later!"}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {shopItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Grow in={true} timeout={300 * (index + 1)}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 6,
                      },
                      height: "100%",
                    }}
                    onClick={() => handleItemClick(item._id)}
                  >
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {item.image && (
                        <Box sx={{ mb: 2, textAlign: "center" }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              maxHeight: "150px",
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {item.name}
                        </Typography>
                        <Box
                          sx={{
                            bgcolor: getAvailabilityColor(
                              getAvailabilityStatus(item)
                            ),
                            color: "#fff",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          {getAvailabilityStatus(item)}
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          flexGrow: 1,
                          mb: 2,
                        }}
                      >
                        {item.description.length > 80
                          ? `${item.description.substring(0, 80)}...`
                          : item.description}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          mt: "auto",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            color: theme.palette.primary.main,
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

        {(isAdmin || isMod) && (
          <Zoom in={!loading}>
            <Fab
              color="primary"
              aria-label="create item"
              sx={{
                position: "fixed",
                bottom: 24,
                right: 24,
                boxShadow: 3,
              }}
              onClick={() => setCreateModalOpen(true)}
            >
              <AddIcon />
            </Fab>
          </Zoom>
        )}

        <CreateShopItemModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreateItem}
          groupId={groupId || ""}
        />
      </Box>
    </NavBar>
  );
};

export default ShopPage;