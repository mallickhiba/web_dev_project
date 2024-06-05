
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
};

const vendorServiceSlice = createSlice({
  name: "vendorServices",
  initialState,
  reducers: {
    setServices(state, action) {
      state.services = action.payload;
    },
    editService(state, action) {
      const updatedService = action.payload;
      state.services = state.services.map((service) =>
        service._id === updatedService._id ? updatedService : service
      );
    },
    deletePackage(state, action) {
      const { serviceId, packageId } = action.payload;
      const serviceIndex = state.services.findIndex(service => service._id === serviceId);
      if (serviceIndex !== -1) {
        state.services[serviceIndex].packages = state.services[serviceIndex].packages.filter(pkg => pkg._id !== packageId);
      }
    },
    deleteService(state, action) {
      const idToDelete = action.payload;
      state.services = state.services.filter((service) => service._id !== idToDelete);
    },
  },
});

export const { setServices, editService, deleteService, deletePackage } = vendorServiceSlice.actions;

export default vendorServiceSlice.reducer;
