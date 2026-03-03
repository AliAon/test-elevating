import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  createdSubscriptionId: localStorage.getItem("createdSubscriptionId") || null,
};

const subscriptionFlowSlice = createSlice({
  name: "subscriptionFlow",
  initialState,
  reducers: {
    setCreatedSubscriptionId: (state, action) => {
      state.createdSubscriptionId = action.payload;
      localStorage.setItem("createdSubscriptionId", action.payload);
    },
    clearCreatedSubscriptionId: (state) => {
      state.createdSubscriptionId = null;
      localStorage.removeItem("createdSubscriptionId");
    },
  },
});

export const {
  setCreatedSubscriptionId,
  clearCreatedSubscriptionId,
} = subscriptionFlowSlice.actions;

export default subscriptionFlowSlice.reducer;


export const useCreatedSubscriptionId = () => {
  const dispatch = useDispatch();

  const createdSubscriptionId = useSelector(
    (state) => state.subscriptionFlow.createdSubscriptionId
  );

  const saveSubscriptionId = (id) => {
    dispatch(setCreatedSubscriptionId(id));
  };

  const clearSubscriptionId = () => {
    dispatch(clearCreatedSubscriptionId());
  };

  return {
    createdSubscriptionId,
    saveSubscriptionId,
    clearSubscriptionId,
  };
};
