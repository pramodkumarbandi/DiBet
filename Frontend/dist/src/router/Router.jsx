import { Routes, Route } from "react-router-dom";
import Home from "../views/pages/Home/Home";
import DashboardMenu from "../views/dashboard/DashboardMenu";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboardMenu" element={<DashboardMenu/>} />
    </Routes>
  );
};

export default Router;
