import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages";
import { ForgotPassword } from "./pages/forgotPassword";
import Otp from "./pages/otp";
import SetPassword from "./pages/setPassword";
import Dashboard from "./pages/dashboard";
import Layout from "./components/layout";
import Equipments from "./pages/equipments";
import ServiceContracts from "./pages/service-contracts";
import ContractDetails from "./pages/contract-details";
import AdminLayout from "./components/admin-layout";
import AdminServiceContracts from "./pages/admin/service-contracts";
import ServiceContractLists from "./pages/admin/service-contract-list";
import AdminServiceContractsDetails from "./pages/admin/service-contract-details";
import AdminServiceContractUpdate from "./pages/admin/service-contract-update";
import AdminEsPluseContracts from "./pages/admin/es-plus-contract";
import EsPluseContractLists from "./pages/admin/es-pluse-contract-list";
import AdminEsContractsDetails from "./pages/admin/es-contract-details";
import AdminEsContractAdd from "./pages/admin/es-contract-add";
import AddUpdateClient from "./pages/admin/add-update-client";
import NotFound from "./pages/not-found";
import AdminClients from "./pages/admin/clients";
import EsClient from "./pages/admin/es-client";
import AdminDashboard from "./pages/admin/dashboard";
import AdminClientsContracts from "./pages/admin/client-contracts";
import AdminClientEsSubscription from "./pages/admin/client-es-subscription";
import EsClientDetails from "./pages/admin/es-client-details";
import AddEsClient from "./pages/admin/add-es-client";
import EsAdmin from "./pages/admin/es-admin";
import EsAdminDetails from "./pages/admin/es-admin-details";
import AddEsAdmin from "./pages/admin/add-es-admin";
import ClientDetailsEsPulseContract from "./pages/admin/client-details-es-pulse-contract";
import CreateUsers from "./pages/admin/create-users";
import AdminCreateUpdateUser from "./pages/admin/admin-create-update-user";
import EquipmentsDetails from "./pages/admin/equipments-details";
import AdminEquipments from "./pages/admin/equipments/groupDetails";
import AdminEquipmentDetails from "./pages/admin/equipment-details";
import AddEquipment from "./pages/admin/add-equipment";
import EquipmentGroup from "./pages/admin/equipment-group";
import MaintenanceOverView from "./pages/maintenance";
import PlannedMaintenance from "./pages/maintenance/planned-maintenance";
import PlannedEquipmentDetails from "./pages/maintenance/planned-equipment-details";
import ScrollToTop from "./components/ScrollToTop";
import Products from "./pages/admin/products";
import AddProduct from "./pages/admin/addProduct";
import ProductDetail from "./pages/admin/product-detail";
import EditProduct from "./pages/admin/editProduct";
import ClientList from "./pages/admin/clients-list";
import Buildings from "./pages/admin/buildings";
import AddBuildings from "./pages/admin/buildings/add-buildings";
import AddGroups from "./pages/admin/add-groups";
import CallbacksOverView from "./pages/callbacks";
import Groups from "./pages/admin/groups";
import CapitalBudget from "./pages/capital-budget";
import CapitalBudgetSingle from "./pages/capital-budget/capital-budget-single";
import CallbacksDetail from "./pages/callbacks/callback-details";
import PlannedCallbacks from "./pages/callbacks/planned-callbacks";
import CallbacksList from "./components/callbacks/callbacksList";
import AdminCapitalBudget from "./pages/admin/capital-budget";
import AdminCapitalBudgetDetails from "./pages/admin/capital-budget/capital-budget-details";
import AdminCapitalBudgetSingle from "./pages/admin/capital-budget/admin-capital-budget-single";
import EditCapitalBudget from "./pages/admin/capital-budget/admin-capital-budget-single/edit-capital-budget";
import CostInfo from "./pages/admin/cost-info";
import Level1 from "./pages/admin/level-1";
import Level2 from "./pages/admin/level-2";
import Downloads from "./pages/downloads";
import KPIPenality from "./pages/kpi-penalty";
import KPIPenalitySelected from "./pages/kpi-penalty/selected-equipment";
import KpiPenaltyEquipmentDetails from "./pages/kpi-penalty/kpi-penalty-equipment-details";
import ResponseTimes from "./pages/response-times";
import SelectedCallbacksEquiment from "./pages/response-times/selected-callbacks-equiment";
import ResponseTimesCallbacksDetail from "./pages/response-times/response-time-callback-details";
import ResponseTimeEquipmentDetails from "./pages/response-times/response-time-equipment-details";
import Logs from "./pages/admin/adminLogs";
import Profile from "./pages/admin/profile";
import EidtProfile from "./pages/admin/profile/edit-profile";
import ChangePassword from "./pages/admin/profile/change-password";
import CustomerBuildings from "./pages/buildings";
import BuildingDetails from "./pages/buildings/building-details";
import GroupDetails from "./pages/groups";
import Onboarding from "./pages/admin/onboarding";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/setPassword" element={<SetPassword />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/service-contracts" element={<ServiceContracts />} />
          <Route path="/contract-details/:id" element={<ContractDetails />} />
          <Route path="/capital-budget" element={<CapitalBudget />} />
          <Route path="/response-times" element={<ResponseTimes />} />
          <Route
            path="/response-time-callbacks-overview/:id"
            element={<ResponseTimesCallbacksDetail />}
          />
          <Route
            path="/selected-equiment-details"
            element={<SelectedCallbacksEquiment />}
          />
          <Route
            path="/response-time-equipment-details/:id"
            element={<ResponseTimeEquipmentDetails />}
          />
          <Route path="/capital-budget/:id" element={<CapitalBudgetSingle />} />
          <Route path="/callbacks-overview" element={<CallbacksOverView />} />
          <Route path="/callbacks-details/:id" element={<CallbacksDetail />} />
          <Route path="/planned-callbacks" element={<PlannedCallbacks />} />
          <Route path="/callbacksList" element={<CallbacksList />} />
          <Route
            path="/maintenance-overview"
            element={<MaintenanceOverView />}
          />
          <Route path="/kpi-penalty" element={<KPIPenality />} />
          <Route
            path="/kpi-panailty-selected-equipment/:id"
            element={<KPIPenalitySelected />}
          />
          <Route
            path="/kpi-penalty-equipment-details/:id"
            element={<KpiPenaltyEquipmentDetails />}
          />
          <Route
            path="/planned-maintenance/:id/:equipment_id"
            element={<PlannedMaintenance />}
          />
          <Route
            path="/planned-equipment-details/:id"
            element={<PlannedEquipmentDetails />}
          />
          <Route path="/equipments" element={<Equipments />} />
          <Route
            path="/equipment-details/:id"
            element={<EquipmentsDetails />}
          />
          <Route path="/buildings" element={<CustomerBuildings />} />
          <Route path="/buildings/:buildingId" element={<BuildingDetails />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EidtProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/all-client" element={<ClientList />} />
          <Route
            path="/admin/clients-contracts"
            element={<AdminClientsContracts />}
          />
          <Route path="/admin/buildings" element={<Buildings />} />
          <Route
            path="/admin/add-buildings"
            element={<AddBuildings Onboarding={false} />}
          />
          <Route path="/admin/add-groups" element={<AddGroups />} />
          <Route path="/admin/level-1" element={<Level1 />} />
          <Route path="/admin/level-2" element={<Level2 />} />
          <Route
            path="/admin/clients-es-subscription"
            element={<AdminClientEsSubscription />}
          />
          <Route
            path="/admin/clients-details-es-pulse-contract"
            element={<ClientDetailsEsPulseContract />}
          />
          <Route
            path="/admin/add-update-client"
            element={<AddUpdateClient />}
          />
          <Route path="/admin/onboarding-client" element={<Onboarding />} />
          <Route path="/create-users" element={<CreateUsers />} />

          <Route
            path="/admin/create-update-user"
            element={<AdminCreateUpdateUser />}
          />

          <Route
            path="/admin/es-pulse-subscriptions"
            element={<AdminEsPluseContracts />}
          />
          <Route
            path="/admin/es-contracts-list"
            element={<EsPluseContractLists />}
          />
          <Route
            path="/admin/es-contracts-details/:id"
            element={<AdminEsContractsDetails />}
          />
          <Route
            path="/admin/es-contracts-add"
            element={<AdminEsContractAdd />}
          />
          <Route
            path="/admin/service-contracts"
            element={<AdminServiceContracts />}
          />
          <Route
            path="/admin/services-contracts-list"
            element={<ServiceContractLists />}
          />
          <Route
            path="/admin/services-contracts-details/:id"
            element={<AdminServiceContractsDetails />}
          />
          <Route
            path="/admin/services-contracts-update"
            element={<AdminServiceContractUpdate />}
          />
          <Route path="/admin/equipments" element={<AdminEquipments />} />
          <Route path="/admin/groups" element={<Groups />} />
          <Route
            path="/admin/equipment-details/:id"
            element={<AdminEquipmentDetails />}
          />
          <Route path="/add-equipment" element={<AddEquipment />} />
          <Route path="/equipment-group" element={<EquipmentGroup />} />
          <Route path="/admin/es-clients" element={<EsClient />} />
          <Route path="/admin/brands" element={<Products />} />
          <Route
            path="/admin/products-details/:id"
            element={<ProductDetail />}
          />
          <Route path="/admin/brand-details" element={<AddProduct />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route
            path="/admin/capital-budget"
            element={<AdminCapitalBudget />}
          />
          <Route
            path="/admin/capital-budget/details"
            element={<AdminCapitalBudgetDetails />}
          />
          <Route
            path="/admin/capital-budget/single-equipment/:id"
            element={<AdminCapitalBudgetSingle />}
          />
          <Route
            path="/admin/capital-budget/single-equipment/edit-capital-budget/:id"
            element={<EditCapitalBudget />}
          />
          <Route path="/admin/cost-info" element={<CostInfo />} />

          <Route
            path="/admin/es-client-details/:id"
            element={<EsClientDetails />}
          />
          <Route path="/admin/add-es-client/:id" element={<AddEsClient />} />
          <Route path="/admin/add-es-admin/:id" element={<AddEsAdmin />} />
          <Route path="/admin/es-admin" element={<EsAdmin />} />
          <Route
            path="/admin/es-admin-details/:id"
            element={<EsAdminDetails />}
          />
          <Route path="/admin/logs" element={<Logs />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/edit-profile" element={<EidtProfile />} />
          <Route path="/admin/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
