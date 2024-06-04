import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Container,
  Pagination,
  styled,
  InputBase,
  alpha,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import AdminSidebar from './components/AdminSidebar';
import axios from "axios";
import { setUsers } from "../../redux/adminUserSlice";
import SearchIcon from '@mui/icons-material/Search';
import UserCard from "./components/UserCard";
import UserEditModal from "./components/UserEditModal";
import DeleteUserDialog from "./components/DeleteUserDialog";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const ManageUsers = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.adminUsers.users);
  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(1);
  const usersPerPage = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await axios.get("http://localhost:5600/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User details:", response.data);
        dispatch(setUsers(response.data));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [dispatch, token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    return allUsers.filter(user => {
      const email = user.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return email.includes(query);
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const handleEditUser = (id) => {
    const user = allUsers.find(user => user._id === id);

    if (user) {
      setSelectedUser(user);
      setOpenEditModal(true);
    }
  };

  const handleDeleteUser = (id) => {
    setSelectedUserId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDeleteUser = () => {
    console.log("Deleting user with ID:", selectedUserId);
    setOpenDeleteDialog(false);
  };

  const customers = allUsers.filter(user => user.role === 'customer');
  const vendors = allUsers.filter(user => user.role === 'vendor');

  const currentAllUsers = searchQuery ? handleSearch() : allUsers.slice(indexOfFirstUser, indexOfLastUser);
  const currentCustomers = searchQuery ? handleSearch() : customers.slice(indexOfFirstUser, indexOfLastUser);
  const currentVendors = searchQuery ? handleSearch() : vendors.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={3}>
          <AdminSidebar active={2} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box mb={3} mt={5}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="All Users" />
              <Tab label="Customers" />
              <Tab label="Vendors" />
            </Tabs>
          </Box>
          {showHeader && (
            <Box mb={3} ml={3} display="flex" alignItems="center">
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </Search>
            </Box>
          )}
          {value === 0 && ( // Display All Users tab content
            <>
              <Grid container spacing={3}>
                {currentAllUsers.map((user) => (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <UserCard
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                    />
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(allUsers.length / usersPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                style={{ marginTop: '20px', marginBottom: '20px' }}
              />
            </>
          )}
          {value === 1 && ( // Display Customers tab content
            <>
              <Grid container spacing={3}>
                {currentCustomers.map((user) => (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <UserCard
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                    />
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(customers.length / usersPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                style={{ marginTop: '20px', marginBottom: '20px' }}
              />
            </>
          )}
          {value === 2 && ( // Display Vendors tab content
            <>
              <Grid container spacing={3}>
                {currentVendors.map((user) => (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <UserCard
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                    />
                  </Grid>
                ))}
              </Grid>
              <Pagination
                count={Math.ceil(vendors.length / usersPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                style={{ marginTop: '20px', marginBottom: '20px' }}
              />
            </>
          )}
        </Grid>
      </Grid>
      <UserEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={selectedUser}
      />
      <DeleteUserDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDeleteUser}
        userId={selectedUserId}
        token={token}
      />
    </Container>
  );
};

export default ManageUsers;
