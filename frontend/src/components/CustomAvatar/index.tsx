import React from 'react';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import placeholderImage from '../../assets/sap.png';

interface CustomAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  sx?: object;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  src,
  alt = 'Placeholder Image',
  size = 56,
  sx = {},
}) => {
  return (
    <Avatar
      sx={{ bgcolor: deepOrange[500], width: size, height: size, ...sx }}
      alt={alt}
      src={src || placeholderImage}
    />
  );
};

export default CustomAvatar;