import React from 'react';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import placeholderImage from '../../assets/sapi_coin.png';

interface CustomAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  sx?: object;
}

const CustomCoin: React.FC<CustomAvatarProps> = ({
  src,
  alt = 'Placeholder Image',
  size = 32,
  sx = {},
}) => {
  return (
    <Avatar
      sx={{  width: size, height: size, ...sx }}
      alt={alt}
      src={src || placeholderImage}
    />
  );
};

export default CustomCoin;