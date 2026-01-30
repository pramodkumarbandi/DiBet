import Header from "../views/components/Header/Header";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
