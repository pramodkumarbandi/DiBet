import Header from "../views/components/Header/Header";
import TopNavbar from "../views/components/Header/TopNavbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <TopNavbar/>
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
