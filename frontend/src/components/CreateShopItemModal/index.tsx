import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import { ShopItem } from '../../utils/types/dataTypes';

interface CreateShopItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<ShopItem, 'id'> & { imageFile?: File }) => void;
  groupId: string;
}

// Styled component for hidden file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CreateShopItemModal: React.FC<CreateShopItemModalProps> = ({ 
  open, 
  onClose, 
  onSave,
  groupId 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    availability: 'In Stock',
    price: '',
    image: '',
    details: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
    
    // Clear error when field is edited
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clear any image URL as we're now using a file
      setFormData(prev => ({ ...prev, image: '' }));
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleClearFile = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.availability.trim()) {
      newErrors.availability = 'Availability status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        name: formData.name,
        description: formData.description,
        availability: formData.availability,
        price: Number(formData.price),
        image: formData.image || imagePreview || undefined,
        details: formData.details || undefined,
        imageFile: imageFile || undefined
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        availability: 'In Stock',
        price: '',
        image: '',
        details: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          maxWidth: '600px',
          width: '100%'
        } 
      }}
    >
      <DialogTitle>Add New Shop Item</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Create a new item for the shop. Items can be redeemed by users with coins earned from challenges.
        </Typography>
        
        <TextField
          label="Item Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
          required
        />
        
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Price (coins)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.price}
            helperText={errors.price}
            required
            inputProps={{ min: 1 }}
          />
          
          <FormControl fullWidth margin="normal" error={!!errors.availability}>
            <InputLabel>Availability</InputLabel>
            <Select
              name="availability"
              value={formData.availability}
              label="Availability"
              onChange={handleChange}
            >
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Limited">Limited</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
            {errors.availability && (
              <Typography color="error" variant="caption">
                {errors.availability}
              </Typography>
            )}
          </FormControl>
        </Box>
        
        {/* Image Upload Section */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Item Image
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {imagePreview && (
              <Box sx={{ position: 'relative', width: 'fit-content' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    borderRadius: '4px'
                  }} 
                />
                <IconButton 
                  size="small" 
                  onClick={handleClearFile}
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    bgcolor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ width: 'fit-content' }}
            >
              Upload Image
              <VisuallyHiddenInput 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </Button>
            
            <Typography variant="caption" color="text.secondary">
              Or provide an image URL:
            </Typography>
            
            <TextField
              name="image"
              value={formData.image}
              onChange={handleChange}
              fullWidth
              placeholder="https://example.com/image.jpg"
              disabled={!!imageFile}
              size="small"
            />
          </Box>
        </Box>
        
        <TextField
          label="Additional Details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
          placeholder="Additional information about the item"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
        >
          Create Item
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateShopItemModal;