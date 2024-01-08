import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton } from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import PublicIcon from '@mui/icons-material/Public';
import SpeedIcon from '@mui/icons-material/Speed';
import InfoIcon from '@mui/icons-material/Info';

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8080/roles');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRoles(data);
        if (data.length > 0) {
          setRole(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRoleChange = (event) => {
    const selectedRole = roles.find(r => r.role_name === event.target.value);
    setRole(selectedRole);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
      role: role,
    };

    console.log(payload);
    handleClose();
  };

  const backgroundColor = 'rgba(242, 245, 250, 1)';

  return (
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: backgroundColor
    }}>
      {/* MetryHub Logo and Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <SensorsIcon color="primary" sx={{ fontSize: 40, marginRight: 1 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          MetryHub
        </Typography>
      </Box>

      {/* Tagline with IoT Icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <PublicIcon sx={{ marginRight: 1 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          Your global IoT data hub.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <SpeedIcon sx={{ marginRight: 1 }} />
        <Typography variant="subtitle1">
          Subscribe to devices and access real-time data seamlessly.
        </Typography>
      </Box>

      {/* Login Form */}
      <Paper elevation={4} sx={{ padding: 2, marginTop: 4, width: '100%', maxWidth: 400 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ margin: '24px 0px 16px' }}
        >
          Log In
        </Button>
        <Button
          type="button"
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
          onClick={handleOpen}
        >
          Create new account
        </Button>
      </Paper>

      {/* Registration Dialog */}
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Account</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="register-email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="register-password"
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Repeat Password"
            type="password"
            id="register-confirm-password"
            autoComplete="new-password"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role?.role_name || ''}
              label="Role"
              onChange={handleRoleChange}
            >
              {roles.map((roleItem) => (
                <MenuItem key={roleItem.role_id} value={roleItem.role_name}>
                  {roleItem.role_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title={role ? role.description : ''}>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
    </Container>
  );
};

export default HomePage;
