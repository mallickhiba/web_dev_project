import React, { useState, useEffect } from "react";
import { Grid, Container } from "@mui/material";
import axios from "axios";
import AdminSidebar from '../Admin/components/AdminSidebar';
import VendorCard from './components/VendorCard2';

export default function VendorApproval() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    // Fetch vendors from the API when the component mounts
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:5600/admin/vendors");
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const handleApproveVendor = async (email) => {
    try {
      await axios.post("http://localhost:5600/admin/vendors/approve", { email });
      setVendors(vendors.map(vendor => vendor.email === email ? { ...vendor, approved: true } : vendor));
    } catch (error) {
      console.error("Error approving vendor:", error);
    }
  };

  const handleViewVendorDetails = async (vendorId) => {
    try {
      const response = await axios.get(`http://localhost:5600/admin/user/${vendorId}`);
      console.log("Vendor details:", response.data);
      // Handle vendor details here (e.g., show a modal with details)
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    }
  };

  const handleDeactivate = async (email) => {
    try {
      await axios.post("http://localhost:5600/admin/vendors/deactivate", { email });
      setVendors(vendors.map(vendor => vendor.email === email ? { ...vendor, approved: false } : vendor));
    } catch (error) {
      console.error("Error deactivating vendor:", error);
    }
  };

  return (
    <Container>
      <Grid container>
        {/* Render the AdminSidebar component */}
        <Grid item xs={12} md={3}>
          <AdminSidebar active={1} />
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9}>
          <div className="container">
            <h3>Vendor Page</h3>
            {vendors.length > 0 ? (
              <div className="row">
                {vendors.map((vendor) => (
                  <VendorCard
                    key={vendor._id}
                    vendor={vendor}
                    onViewVendorDetails={handleViewVendorDetails}
                    onApproveVendor={handleApproveVendor}
                  />
                ))}
              </div>
            ) : (
              <p>No vendors found.</p>
            )}
          </div>
        </Grid>
        {/* Main content ends here */}
      </Grid>
    </Container>
  );
}