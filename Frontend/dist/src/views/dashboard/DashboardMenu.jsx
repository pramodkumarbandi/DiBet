// ** React Imports
import { useState } from "react";

// ** Reactstrap Imports
import { ListGroup, ListGroupItem } from "reactstrap";

// ** Hooks
import { useSkin } from "@hooks/useSkin";

// ** Data
import navData from "../../data/navData.json";

const DashboardMenu = () => {
  const { skin } = useSkin();
  const [activeId, setActiveId] = useState(1);

  const isDark = skin === "dark";

  return (
    <div
      className="rounded-4 p-2 mt-2 ms-5"
      style={{
        width: "260px",
        height: "80vh",
        backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
        overflowY: "auto",
          scrollbarWidth: "none",        
    msOverflowStyle: "none"  
      }}
    >
      <ListGroup flush>
        {navData.map(item => (
          <ListGroupItem
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className="d-flex align-items-center gap-2 border-bottom"
            style={{
              cursor: "pointer",
              backgroundColor:
                activeId === item.id
                  ? isDark
                    ? "#2a2a2a"
                    : "#f8f9fa"
                  : "transparent",
              color: isDark ? "#ffffff" : "#000000",
              padding: "14px"
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: "20px" }}>{item.icon}</span>

            {/* Label */}
            <span className="fw-semibold">{item.label}</span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default DashboardMenu;
