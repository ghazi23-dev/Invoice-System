import { useLocation, Link } from "react-router-dom";
import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import "./Sidebar.css";
const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Define a list of pathnames that should not be displayed
  const excludedPaths = ["produits", "tresorerie", "Dashboard",];

  return (
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      style={{ marginLeft: 10, marginBottom: 20, marginTop: 10 }}
    >
      <Link to="/Dashboard/Home/">Dashboard</Link>
      {pathnames.map((value, index) => {
        // Skip this part of the path if it's in the excludedPaths array
        if (excludedPaths.includes(value)) return null;

        const isLast = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return isLast ? (
          <Typography color="text.primary" key={to}>
            {value}
          </Typography>
        ) : (
          <Link color="inherit" to={to} key={to}>
            {value}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
