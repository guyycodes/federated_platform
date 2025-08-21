import React from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";

function SidebarWidget() {
  return (
    <Paper
      sx={{
        mx: "auto",
        mb: 2,
        width: "100%",
        maxWidth: 240,
        borderRadius: 4,
        p: 1,
        textAlign: "center",
        bgcolor: (theme) => 
          theme.palette.mode === "light" 
            ? "rgba(33, 136, 56, 0.05)" 
            : "rgba(33, 136, 56, 0.1)"
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1, 
          fontWeight: 600,
          color: (theme) => 
            theme.palette.mode === "light" 
              ? "#218838" 
              : "#2aaa45"
        }}
      >
        Need Help?
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 2,
          color: "text.secondary"
        }}
      >
        Access our documentation and support resources for help with credential verification.
      </Typography>
      
      {/* Stack container for buttons */}
      <Stack 
        direction="column" 
        spacing={1} 
        justifyContent="center"
      >
        <Button
          component="a"
          href="/facility/support"
          variant="contained"
          fullWidth
          size="small"
          sx={{ 
            p: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            bgcolor: "#218838",
            '&:hover': {
              bgcolor: "#1e7e34"
            }
          }}
        >
          Contact Support
        </Button>
        
        <Button
          component="a"
          href="/facility/documentation"
          variant="outlined"
          fullWidth
          size="small"
          sx={{ 
            p: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            borderColor: "#218838",
            color: "#218838",
            '&:hover': {
              borderColor: "#1e7e34",
              bgcolor: "rgba(33, 136, 56, 0.04)"
            }
          }}
        >
          Documentation
        </Button>
      </Stack>
    </Paper>
  );
}

export default SidebarWidget;