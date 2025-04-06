// MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { Avatar, CardHeader } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Card>
      <CardHeader
        title="New Customers"
        sx={{
          pt: 2,
          alignItems: 'center',
          '& .MuiCardHeader-action': { mt: 0.6 },
        }}
        action={
          <Typography
            onClick={() => navigate('/admin/customers')}
            variant="caption"
            sx={{ color: 'blue', cursor: 'pointer', paddingRight: '.8rem' }}
          >
            View All
          </Typography>
        }
        titleTypographyProps={{
          variant: 'h5',
          sx: {
            lineHeight: '1.6 !important',
            letterSpacing: '0.15px !important',
          },
        }}
      />
      <TableContainer>
        <Table sx={{ minWidth: 390 }} aria-label="table in dashboard">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((item) => (
              <TableRow
                hover
                key={item.id}
                sx={{
                  '&:last-of-type td, &:last-of-type th': { border: 0 },
                }}
              >
                <TableCell>
                  <Avatar>{item.firstName[0]?.toUpperCase()}</Avatar>
                </TableCell>
                <TableCell>
                  {item.firstName} {item.lastName}
                </TableCell>
                <TableCell>{item.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default Customers;
