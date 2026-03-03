import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subscription_id: null,
  level_1: null,
  level_2: null,
  level_3: null,
  service_contract: null,
  date_from: null,
  date_to: null,
};

const filtersSlice = createSlice({
  name: "subscription_id",
  initialState,
  reducers: {
    setSubscriptionId: (state, action) => {
      state.subscription_id = action.payload;
    },
    clearSubscriptionId: (state) => {
      state.subscription_id = null;
    },

    setLevel1: (state, action) => {
      state.level_1 = action.payload;

      state.level_2 = null;
      state.level_3 = null;
    },
    setLevel2: (state, action) => {
      state.level_2 = action.payload;
      state.level_3 = null;
    },
    setLevel3: (state, action) => {
      state.level_3 = action.payload;
    },
    setServiceContract: (state, action) => {
      state.service_contract = action.payload;
    },
    setDateFrom: (state, action) => {
      state.date_from = action.payload;
    },
    setDateTo: (state, action) => {
      state.date_to = action.payload;
    },
    clearFilters: (state) => {
      state.level_1 = null;
      state.level_2 = null;
      state.level_3 = null;
      state.service_contract = null;
      state.date_from = null;
      state.date_to = null;
    },
    clearLevel_3: (state) => {
      state.level_3 = null;
    },
  },
});

export const {
  setSubscriptionId,
  clearSubscriptionId,
  setLevel1,
  setLevel2,
  setLevel3,
  setServiceContract,
  setDateFrom,
  setDateTo,
  clearFilters,
  clearLevel_3,
} = filtersSlice.actions;

export default filtersSlice.reducer;
