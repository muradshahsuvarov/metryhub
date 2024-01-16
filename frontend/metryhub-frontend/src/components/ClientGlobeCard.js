import React from 'react';
import { Paper, Typography, Box, Dialog, IconButton, DialogContent } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

// Style your IconButton to fit the design of the card
const ExpandIconButton = styled(IconButton)({
  position: 'absolute',
  top: 0,
  right: 0,
  color: 'black', // Adjust the color if necessary
  padding: '6px', // Adjust the padding if necessary
  zIndex: 2, // Ensure it's above other elements
});

const StyledBox = styled(Box)({
    position: 'relative', // Needed to position the expand button absolutely
    height: 'auto', // Or set to a higher fixed height
    width: '100%',
    // Add additional styling as needed
});

const TitleContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative', // Maintain the relative positioning
  });


const ClientGlobeCard = ({ clientData }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 2, bgcolor: 'white', color: 'black', overflow: 'hidden', position: 'relative' }}>
      <TitleContainer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Global Client Distribution
          </Typography>
          <IconButton onClick={handleClickOpen} size="large">
            <FullscreenIcon />
          </IconButton>
        </TitleContainer>
        <StyledBox>
          <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
            <image href={`${process.env.PUBLIC_URL}/world.svg`} width="100%" height="100%" />
            {/* ... rest of your SVG paths */}
          </svg>
        </StyledBox>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="map-dialog-title"
        maxWidth="lg" // This can be 'md', 'sm', 'xl', etc.
        fullWidth
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'black', // Adjust the color if necessary
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Box
            sx={{
              width: '100%',
              height: 'auto', // Adjust the height as needed
              overflow: 'hidden'
            }}
            >
              <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" width="100%">
                <image href={`${process.env.PUBLIC_URL}/world.svg`} width="100%" height="100%" />
                {/* ... rest of your SVG paths */}
              </svg>
            </Box>
          </DialogContent>
        </Dialog>
      </>
);
};

export default ClientGlobeCard;      