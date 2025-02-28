import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ErrorMessageProps {
  message?: string | null;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Dialog open={!!message} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Error
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography color="error">{message}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorMessage;
