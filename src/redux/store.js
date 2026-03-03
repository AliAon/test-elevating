import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/auth-api";
import { adminClientApi } from "./services/admin-client";
import { subscriptionApi } from "./services/subscription";
import { userTypeApi } from "./services/user_type";
import { contractApi } from "./services/contract";
import { serviceContractApi } from "./services/service-contracts";
import { brandApi } from "./services/brand-api";
import subscriptionFlowReducer from "./slices/subscriptionFlowSlice";
import { groupsApi } from "./services/groups";
import { capitalBugetApi } from "./services/capital-buget-api";
import { equipmentsApi } from "./services/equipments-api";
import subscription_id_slice from "./slices/subscription_id";
import { costApi } from "./services/cost-api";
import { maintenanceApi } from "./services/maintenance";
import { callBacksApi } from "./services/call-backs-api";
import { responseTimeApi } from "./services/response-time";
import { dashboardApi } from "./services/dashboard-api";
import { logApi } from "./services/log-api";

export const store = configureStore({
  reducer: {
    subscriptionFlow: subscriptionFlowReducer,
    subscription_id: subscription_id_slice,
    [authApi.reducerPath]: authApi.reducer,
    [adminClientApi.reducerPath]: adminClientApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [userTypeApi.reducerPath]: userTypeApi.reducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [serviceContractApi.reducerPath]: serviceContractApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [capitalBugetApi.reducerPath]: capitalBugetApi.reducer,
    [costApi.reducerPath]: costApi.reducer,
    [equipmentsApi.reducerPath]: equipmentsApi.reducer,
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    [callBacksApi.reducerPath]: callBacksApi.reducer,
    [responseTimeApi.reducerPath]: responseTimeApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [logApi.reducerPath]: logApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(adminClientApi.middleware)
      .concat(subscriptionApi.middleware)
      .concat(userTypeApi.middleware)
      .concat(contractApi.middleware)
      .concat(serviceContractApi.middleware)
      .concat(brandApi.middleware)
      .concat(groupsApi.middleware)
      .concat(capitalBugetApi.middleware)
      .concat(costApi.middleware)
      .concat(equipmentsApi.middleware)
      .concat(maintenanceApi.middleware)
      .concat(callBacksApi.middleware)
      .concat(responseTimeApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(logApi.middleware),
});

// ssa