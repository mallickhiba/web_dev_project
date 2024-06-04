import React, { useState } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';

const headCells = [
  { id: 'dateCreated', numeric: false, disablePadding: false, label: 'Date Created' },
  { id: 'bookingDate', numeric: false, disablePadding: false, label: 'Booking Date' },
  { id: 'customer', numeric: false, disablePadding: false, label: 'Customer' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
  { id: 'serviceName', numeric: false, disablePadding: false, label: 'Service Name' },
  { id: 'serviceCategory', numeric: false, disablePadding: false, label: 'Service Category' },
  { id: 'packageId', numeric: false, disablePadding: false, label: 'Package ID' },
  { id: 'packageName', numeric: false, disablePadding: false, label: 'Package Name' },
  { id: 'guests', numeric: true, disablePadding: false, label: 'Guests' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'bookingDate' ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable({ bookings = [], pagination, onPageChange, onRowsPerPageChange, onSortChange, onFilterChange }) {
    const { page, rowsPerPage, order, orderBy } = pagination;
    const [selected, setSelected] = useState([]);
  
    const handleRequestSort = (event, property) => {
      if (property === 'bookingDate') {
        onSortChange(property);
      }
    };
  
    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelected = bookings.map((booking) => booking._id); // assuming _id is the unique identifier for bookings
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };
  
    const handleClick = (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    };
  
    const handleChangePage = (event, newPage) => {
      onPageChange(newPage); // Update onPageChange to pass newPage directly
    };
  
    const handleChangeRowsPerPage = (event) => {
      const newRowsPerPage = parseInt(event.target.value, 10) || 5; 
      onRowsPerPageChange(newRowsPerPage); // Update onRowsPerPageChange to pass newRowsPerPage
    };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle" component="div">
            Bookings
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={bookings.length}
            />
            <TableBody>
              {bookings.map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.createdAt} {/* Assuming createdAt is the date created */}
                    </TableCell>
                    <TableCell align="left">{row.bookingDate}</TableCell>
                    <TableCell align="left">{row.customer.firstName} {row.customer.lastName}</TableCell>
                    <TableCell align="left">{row.customer.email}</TableCell>
                    <TableCell align="left">{/* Add phone field from customer object */}</TableCell>
                    <TableCell align="left">{row.service_id.service_name}</TableCell>
                    <TableCell align="left">{row.service_id.service_category}</TableCell>
                    <TableCell align="left">{row.selected_package.package_id}</TableCell>
                    <TableCell align="left">{row.selected_package.name}</TableCell>
                    <TableCell align="right">{row.guests}</TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
