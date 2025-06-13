import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./componenets/Login/Login";
import Sidebar from "./componenets/Sidebar/sidebar";
import AllOrders from "./componenets/Orders/allOrders";
import AddProduct from "./componenets/Products/addProducts";
import AllEmployees from "./componenets/Employees/allEmployees";
import AddEmployee from "./componenets/Employees/addEmployee";
import EditEmployees from "./componenets/Employees/EditEmployees";
import HomePage from "./componenets/Home/home";
import SupplierProfile from "./componenets/Supplier/AddSupplier";
import { Home } from "lucide-react";
import SuppliersList from "./componenets/Supplier/EditSupplier";
import SupplierViewOnly from "./componenets/Supplier/ViewSuppliers";
import ViewProducts from "./componenets/Products/viewProducts";
import AddCategory from "./componenets/Products/addProductCategory";
import OrdersInCart from "./componenets/Orders/ordersIncart";

import TransactionControlView from "./componenets/Transactions/transactioncontrol";
import VerificationView from "./componenets/Transactions/transaction-verification";
import BankAccountView from "./componenets/Transactions/BankAccountview";
import OrderManagementDelivery from "./componenets/Order-management/delivery-orders";
import OrderManagementPickup from "./componenets/Order-management/pickup-orders";
import OrderDetails from "./componenets/Order-management/orderdetails";
import DeliveryMain from "./componenets/Delivery&complaints/Delivery";
import AllDeliveryComplaints from "./componenets/Delivery&complaints/Allcomplaints";
import NonDeliveredOrders from "./componenets/Orders/Non-delivered-orders";
import Driverchat from "./componenets/Order-management/drivers-chat";
import RefundComplain from "./componenets/Orders/Refunds";
import InventoryCheck from "./componenets/Inventory/InverntoryCheck";
import OutOfStockList from "./componenets/Inventory/outofstocklist";
import OrderListApprovedStock from "./componenets/Inventory/orderlist";
import ShowOrder from "./componenets/Inventory/showOrder";
import FillingInventory from "./componenets/Inventory/FillIinventory";
import InventoryControlCheck from "./componenets/Inventory/InventoryControl";
import CreateDiscount from "./componenets/Discounts/createDiscounts";
import AllDiscounts from "./componenets/Discounts/allDiscounts";
import DiscountedProductsInvA from "./componenets/Discounts/DiscountedInventory";
import InventoryControlCheckDiscount from "./componenets/Discounts/Inventorycontrol(discounts)";

import ReferralProfit from "./componenets/Refferal/referralProfits";
import ScooterDelivery from "./componenets/Order-management/ScooterDelivery";
import SalesData from "./componenets/Sales/salesdata";
import ReferralData from "./componenets/Refferal/referaldata";
import CalendarComponent from "./componenets/Settings/Calendar";
import CustomerPage from "./componenets/Customers/viewCustomers";
import CustomerDetail from "./componenets/Customers/customerDetails";
import LostStockManagement from "./componenets/Inventory/Loststock";
import CustomerChatView from "./componenets/Customers/viewChat";
import ReferralVideos from "./componenets/Refferal/referralDashboard";
import ForemanReferrals from "./componenets/Refferal/Foremanprofits";

function App() {
  return (
    <Router>
      <Routes>
        {/* Hero Section Route */}
        <Route
          path="/"
          element={
            <>
              <AdminLogin />
            </>
          }
        />
        <Route
          path="/all-orders"
          element={
            <>
              <AllOrders />
            </>
          }
        />
        <Route
          path="/add-product"
          element={
            <>
              <AddProduct />
            </>
          }
        />
        <Route
          path="/add-category"
          element={
            <>
              <AddCategory />
            </>
          }
        />
        <Route
          path="/delivery-orders"
          element={
            <>
              <OrderManagementDelivery />
            </>
          }
        />
        <Route
          path="/pickup-orders"
          element={
            <>
              <OrderManagementPickup />
            </>
          }
        />

        <Route
          path="/all-employees"
          element={
            <>
              <AllEmployees />
            </>
          }
        />
        <Route
          path="/lost-stock"
          element={
            <>
              <LostStockManagement />
            </>
          }
        />
        <Route
          path="/customers/:id/chat"
          element={
            <>
              <CustomerChatView />
            </>
          }
        />
        <Route
          path="/admin/supplier/add"
          element={
            <>
              <SupplierProfile />
            </>
          }
        />
        <Route path="/" element={<Navigate to="/transactions" replace />} />
        <Route
          path="/Transactions-control"
          element={<TransactionControlView />}
        />
        <Route path="/verification/:orderId" element={<VerificationView />} />
        <Route path="/bank-view/:orderId" element={<BankAccountView />} />
        <Route
          path="/order-details"
          element={
            <>
              <OrderDetails />
            </>
          }
        />
        <Route
          path="/Delivery"
          element={
            <>
              <DeliveryMain />
            </>
          }
        />
        <Route
          path="/referrals-data"
          element={
            <>
              <ReferralData />
            </>
          }
        />
        <Route
          path="/referals-foreman"
          element={
            <>
              <ForemanReferrals />
            </>
          }
        />
        <Route
          path="/Driver-chat"
          element={
            <>
              <Driverchat />
            </>
          }
        />
        <Route
          path="/view-refunds"
          element={
            <>
              <RefundComplain />
            </>
          }
        />
        <Route
          path="/Complaints"
          element={
            <>
              <AllDeliveryComplaints />
            </>
          }
        />
        <Route
          path="/non-delivered-orders"
          element={
            <>
              <NonDeliveredOrders />
            </>
          }
        />

        <Route
          path="/ordersINcart"
          element={
            <>
              <OrdersInCart />
            </>
          }
        />
        <Route
          path="/inventory-check"
          element={
            <>
              <InventoryCheck />
            </>
          }
        />
        <Route
          path="/out-of-stock"
          element={
            <>
              <OutOfStockList />
            </>
          }
        />
        <Route
          path="/order-list"
          element={
            <>
              <OrderListApprovedStock />
            </>
          }
        />
        <Route
          path="/show-order"
          element={
            <>
              <ShowOrder />
            </>
          }
        />
        <Route
          path="/Fill-inventory"
          element={
            <>
              <FillingInventory />
            </>
          }
        />
        <Route
          path="/inventory-control"
          element={
            <>
              <InventoryControlCheck />
            </>
          }
        />
        <Route
          path="/create-discount"
          element={
            <>
              <CreateDiscount />
            </>
          }
        />
        <Route
          path="/all-discounts"
          element={
            <>
              <AllDiscounts />
            </>
          }
        />
        <Route
          path="/discount-inventory"
          element={
            <>
              <DiscountedProductsInvA />
            </>
          }
        />
        <Route
          path="/discount-inventory-check"
          element={
            <>
              <InventoryControlCheckDiscount />
            </>
          }
        />
        <Route
          path="/referrals"
          element={
            <>
              <ReferralVideos />
            </>
          }
        />

        <Route
          path="/referral-profits"
          element={
            <>
              <ReferralProfit />
            </>
          }
        />
        <Route
          path="/scooter-delivery"
          element={
            <>
              <ScooterDelivery />
            </>
          }
        />
        <Route
          path="/sales-data"
          element={
            <>
              <SalesData />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <CalendarComponent />
            </>
          }
        />
        <Route
          path="/customers"
          element={
            <>
              <CustomerPage />
            </>
          }
        />
        {/* detail view for a given customer ID */}
        <Route path="/customers/:id" element={<CustomerDetail />} />

        <Route
          path="admin/supplier/edit"
          element={
            <>
              <SuppliersList />
            </>
          }
        />
        <Route
          path="view-suppliers"
          element={
            <>
              <SupplierViewOnly />
            </>
          }
        />

        <Route
          path="/admin/employee/edit"
          element={
            <>
              <EditEmployees />
            </>
          }
        />

        <Route
          path="/admin/employee/add"
          element={
            <>
              <AddEmployee />
            </>
          }
        />
        <Route
          path="/admin/Products"
          element={
            <>
              <ViewProducts />
            </>
          }
        />

        <Route
          path="/home"
          element={
            <>
              <HomePage />
            </>
          }
        />
      </Routes>

      {/* Footer */}
    </Router>
  );
}

export default App;
