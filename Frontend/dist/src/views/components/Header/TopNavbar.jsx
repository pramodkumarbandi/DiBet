// ** React Imports
import { useEffect, useState } from "react";

// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Hooks
import { useSkin } from "@hooks/useSkin";

// ** Data
import navData from "../../../data/navData.json";

const TopNavbar = () => {
  const { skin } = useSkin(); // dark | light
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(navData);
  }, []);

  const handleClick = (id) => {
    setItems(prev =>
      prev.map(item => ({
        ...item,
        active: item.id === id
      }))
    );
  };

  const isDark = skin === "dark";

  return (
    <div
      className={`px-1 py-1 ${
        isDark ? "bg-dark" : "bg-light"
      }`}
    >
      <Nav
        className="d-flex flex-nowrap overflow-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map(item => {
          const isActive = item.active || item.highlight;

          return (
            <NavItem key={item.id}>
             <NavLink
  href="#"
  onClick={() => handleClick(item.id)}
  className="rounded-pill fw-semibold me-2 px-2 py-0 text-nowrap"
  style={{
    fontSize: "10px",
    lineHeight: "1.4",
    backgroundColor: isActive
      ? isDark
        ? "#ffffff"   // active in dark
        : "#ffffff"   // active in light
      : isDark
      ? "#1e1e1e"     // normal dark item
      : "#f8f9fa",    // normal light item
    color: isActive
      ? "#d60000"     // active text
      : isDark
      ? "#cccccc"     // normal dark text
      : "#5a005a"
  }}
>
  {item.label}
</NavLink>

            </NavItem>
          );
        })}
      </Nav>
    </div>
  );
};

export default TopNavbar;
