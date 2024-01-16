import React, { useState } from 'react';
import {
  Box, Card, CardContent, CardActions, Button, Typography, IconButton, Tooltip,
  Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Collapse
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const NotificationCard = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Dummy data for notifications
  const notifications = [
    { id: 1, text: 'System update available.', timestamp: '2024-01-14T10:00:00Z' },
    { id: 2, text: 'New device registered successfully.', timestamp: '2024-01-13T15:45:00Z' },
    { id: 3, text: 'Device XYZ reported a low battery warning.', timestamp: '2024-01-13T12:30:00Z' },
    // More notifications...
  ];

  const handleDismiss = (id) => {
    console.log(`Dismiss notification with id: ${id}`);
    // Here you would likely make a call to your backend to dismiss the notification
  };

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Notifications
        </Typography>
        <List dense>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="dismiss" onClick={() => handleDismiss(notification.id)}>
                    <CloseIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={notification.text}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
      <CardActions disableSpacing>
        <Button size="small" onClick={handleExpandClick}>
          {expanded ? 'Show Less' : 'Show More'}
          <ExpandMoreIcon />
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Additional content can go here, such as detailed notification information */}
          <Typography paragraph>Details:</Typography>
          <Typography paragraph>
            Here you can put more detailed information about the notifications or actions the user can take.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default NotificationCard;
