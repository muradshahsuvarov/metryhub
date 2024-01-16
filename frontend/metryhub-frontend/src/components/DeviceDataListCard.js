import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  Box,
  Typography,
  Button,
  TextField,
  Stack
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@date-io/date-fns';

const DeviceDataListCard = ({ devices }) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [datasetDetails, setDatasetDetails] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const DATA_CHUNK_SIZE = 10;

  const fetchDatasetDetails = useCallback(async () => {
    if (loading || !canLoadMore) return;

    setLoading(true);
    setTimeout(() => {
      const newData = Array.from({ length: DATA_CHUNK_SIZE }, (_, index) => ({
        id: `data-${datasetDetails.length + index}`,
        timestamp: new Date().toISOString(),
        key: 'Temperature',
        value: `${Math.random() * 100}`
      }));

      setDatasetDetails(prevData => [...prevData, ...newData]);
      setCanLoadMore(newData.length === DATA_CHUNK_SIZE);
      setLoading(false);
    }, 1000);
  }, [loading, canLoadMore, datasetDetails.length]);

  const handleDownload = useCallback(() => {
    if (!startDate || !endDate) {
      alert('Please select a date range to download the dataset.');
      return;
    }

    console.log(`Downloading data from ${startDate} to ${endDate}`);
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectedDevice && datasetDetails.length === 0 && canLoadMore) {
      fetchDatasetDetails();
    }
  }, [selectedDevice, datasetDetails.length, canLoadMore, fetchDatasetDetails]);

  const handleChangeDevice = (event) => {
    setSelectedDevice(event.target.value);
  };

  const handleLoadMore = () => {
    fetchDatasetDetails();
  };

  return (
    <Card>
      <CardHeader title="Device Datasets" />
      <CardContent>
        <FormControl fullWidth>
          <Select
            value={selectedDevice}
            onChange={handleChangeDevice}
        displayEmpty
        inputProps={{ 'aria-label': 'Select Device' }}
        >
        <MenuItem value="" disabled>
        Select Device
        </MenuItem>
        {devices.map((device) => (
        <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
        ))}
        </Select>
        </FormControl>
        <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" style={{ marginTop: '20px' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
        <Button variant="contained" color="primary" onClick={handleDownload}>
            Download Data
        </Button>
        </Stack>
        <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight: '400px', overflow: 'auto' }}>
        <Table stickyHeader aria-label="device data table">
        <TableHead>
        <TableRow>
        <TableCell>Timestamp</TableCell>
        <TableCell>Data Key</TableCell>
        <TableCell>Actions</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {datasetDetails.map((data) => (
        <TableRow key={data.id}>
        <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
        <TableCell>{data.key}</TableCell>
        <TableCell>
        <IconButton onClick={() => setIsDrawerOpen(true)}>
        <VisibilityIcon />
        </IconButton>
        </TableCell>
        </TableRow>
        ))}
        {canLoadMore && (
        <TableRow>
        <TableCell colSpan={3} align="center">
        <Button onClick={handleLoadMore} color="primary" disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
        </Button>
        </TableCell>
        </TableRow>
        )}
        </TableBody>
        </Table>
        </TableContainer>
        </CardContent>
        <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        >
        <Box
        sx={{ width: 250 }}
        role="presentation"
        >
        <List>
        {/* Display detailed data here */}
        {datasetDetails.map((data, index) => (
        <ListItem key={index}>
        <Typography variant="subtitle1">{data.value}</Typography>
        </ListItem>
        ))}
        </List>
        </Box>
        </Drawer>
        </Card>
        );
        };

        export default DeviceDataListCard;