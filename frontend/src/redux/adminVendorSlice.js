
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendors: [],
};

const adminVendorSlice = createSlice({
  name: "adminVendors",
  initialState,
  reducers: {
    setVendors(state, action) {
      state.vendors = action.payload;
    },
    editVendor(state, action) {
      const updatedVendor = action.payload;
      state.vendors = state.vendors.map((vendor) =>
        vendor._id === updatedVendor._id ? updatedVendor : vendor
      );
    },
    deleteVendor(state, action) {
      const idToDelete = action.payload;
      state.vendors = state.vendors.filter((vendor) => vendor._id !== idToDelete);
    },
  },
});

export const { setVendors, editVendor, deleteVendor } = adminVendorSlice.actions;

export default adminVendorSlice.reducer;
