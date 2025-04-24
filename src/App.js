import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import MainTransactionControl from "./componenets/Transactions/MainTransactionControl";
import TransactionControlView from "./componenets/Transactions/transactioncontrol";
import VerificationView from "./componenets/Transactions/transaction-verification";
import BankAccountView from "./componenets/Transactions/BankAccountview";
import OrderManagementDelivery from "./componenets/Order-management/delivery-orders";
import OrderManagementPickup from "./componenets/Order-management/pickup-orders";
import OrderDetails from "./componenets/Order-management/orderdetails";

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
          path="/admin/supplier/add"
          element={
            <>
              <SupplierProfile />
            </>
          }
        />
        <Route
          path="/Transactions-control"
          element={
            <>
              <MainTransactionControl />
            </>
          }
        />
        <Route
          path="/order-details"
          element={
            <>
              <OrderDetails />
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
