import React from 'react';
import {
  Card, CardContent, CardHeader, Avatar, Typography, Button, TextField, CardActions, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const AccountCard = () => {
  const [editMode, setEditMode] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = () => {
    // Here you would handle the save operation, perhaps sending the updated info to the backend
    console.log('Saved', userInfo);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="user">{userInfo.name.charAt(0)}</Avatar>
        }
        title={editMode ? "Edit Profile" : "Profile"}
        action={
          editMode ? (
            <>
              <IconButton aria-label="save" color="primary" onClick={handleSave}>
                <SaveIcon />
              </IconButton>
              <IconButton aria-label="cancel" color="secondary" onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <IconButton aria-label="edit" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          )
        }
      />
      <CardContent>
        {editMode ? (
          <>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              margin="normal"
            />
          </>
        ) : (
          <>
            <Typography variant="subtitle1">Name: {userInfo.name}</Typography>
            <Typography variant="subtitle1">Email: {userInfo.email}</Typography>
          </>
        )}
      </CardContent>
      {editMode && (
        <CardActions>
          <Button color="primary" startIcon={<SaveIcon />} onClick={handleSave}>
            Save
          </Button>
          <Button color="secondary" startIcon={<CancelIcon />} onClick={handleCancel}>
            Cancel
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default AccountCard;
