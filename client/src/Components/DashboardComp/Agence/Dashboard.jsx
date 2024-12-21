import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReactEcharts from "echarts-for-react";

const data = [
  { name: "America", value: 43.8, color: "#3b82f6" },
  { name: "Asia", value: 31.3, color: "#f59e0b" },
  { name: "Europe", value: 18.8, color: "#9333ea" },
  { name: "Africa", value: 6.3, color: "#ef4444" },
];

const visitData = [
  { name: "Jan", TeamA: 40, TeamB: 24 },
  { name: "Feb", TeamA: 30, TeamB: 13 },
  { name: "Mar", TeamA: 20, TeamB: 18 },
  { name: "Apr", TeamA: 27, TeamB: 19 },
  { name: "May", TeamA: 18, TeamB: 24 },
  { name: "Jun", TeamA: 23, TeamB: 29 },
  { name: "Jul", TeamA: 34, TeamB: 22 },
];

const lineData = [
  { name: "Jan", Revenue: 3000 },
  { name: "Feb", Revenue: 2400 },
  { name: "Mar", Revenue: 2400 },
  { name: "Apr", Revenue: 3200 },
  { name: "May", Revenue: 2100 },
  { name: "Jun", Revenue: 4500 },
  { name: "Jul", Revenue: 3900 },
];

const tableData = [
  { name: "Product A", orders: 130, revenue: "$3400" },
  { name: "Product B", orders: 110, revenue: "$2500" },
  { name: "Product C", orders: 90, revenue: "$2200" },
  { name: "Product D", orders: 70, revenue: "$1900" },
  { name: "Product E", orders: 70, revenue: "$1900" },
];

const options = {
  title: {
    // text: Current Visits
    left: "center",
    top: "10%", // Adjust the top position for the title
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "right",
    top: "middle",
    itemWidth: 15, // Adjust as needed
    itemGap: 8, // Adjust as needed
    textStyle: {
      fontSize: 14, // Adjust as needed
    },
  },
  color: data.map((item) => item.color), // Dynamic colors based on your data
  series: [
    {
      name: "Visits",
      type: "pie",
      radius: ["70%", "100%"], // Adjusted for inner and outer radius
      center: ["50%", "50%"], // Centered
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

const Agence = () => {
  return (
    <Box sx={{ padding: 2, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Typography variant="h4" component="div" sx={{ mb: 2 }}>
        Hi, Welcome back! 👋
      </Typography>

      <Grid container spacing={3}>
        {/* Cards Section */}
        {[
          {
            title: "Weekly Sales",
            value: "714k",
            icon: <ShoppingCartIcon />,
            color: "#3b82f6",
          },
          {
            title: "New Users",
            value: "1.35m",
            icon: <PersonIcon />,
            color: "#a855f7",
          },
          {
            title: "Purchase Orders",
            value: "1.72m",
            icon: <InsertChartIcon />,
            color: "#fbbf24",
          },
          {
            title: "Messages",
            value: 234,
            icon: <MailIcon />,
            color: "#f87171",
          },
          {
            title: "New Offers",
            value: 56,
            icon: <LocalOfferIcon />,
            color: "#22c55e",
          },
          {
            title: "Active Users",
            value: "12.6k",
            icon: <PeopleIcon />,
            color: "#0ea5e9",
          },
          {
            title: "Account Balance",
            value: "$45.3k",
            icon: <AccountBalanceIcon />,
            color: "#f97316",
          },
          {
            title: "Views",
            value: "4.9m",
            icon: <VisibilityIcon />,
            color: "#10b981",
          },
        ].map((card, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              <Box>
                <Typography variant="h6" color="textSecondary">
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ color: card.color }}>
                  {card.value}
                </Typography>
              </Box>
              <IconButton
                sx={{
                  backgroundColor: card.color,
                  color: "#fff",
                  borderRadius: "50%",
                  p: 1,
                }}
              >
                {React.cloneElement(card.icon, { sx: { fontSize: 40 } })}
              </IconButton>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={11} md={6}>
          <Paper elevation={3}  sx={{
              padding: 2,
              borderRadius: 3,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9fafb",
            }}>
           <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "#334155",
              }}
            >
                <i
                className="fas fa-chart-pie"
                style={{ marginRight: "8px", color: "#4f46e5" }}
              ></i>
             Current Visits
            </Typography>
            <ReactEcharts
              option={options}
              style={{ height: "320px", width: "100%" }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 3,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9fafb",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "#334155",
              }}
            >
              <BarChartIcon sx={{ marginRight: "8px", color: "#4f46e5" }} />
              Website Visits
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#334155"
                  tick={{ fontSize: 12 }} // Font size for category labels
                  label={{
                    value: "Pages",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#334155",
                    fontSize: 14,
                  }}
                  tickMargin={3}
                />
                <YAxis
                  stroke="#334155"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Visits",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#334155",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#334155" }}
                />
                <Bar dataKey="TeamA" fill="url(#TeamA)" />
                <Bar dataKey="TeamB" fill="url(#TeamB)" />
                <defs>
                  <linearGradient id="TeamA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="TeamB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 3,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9fafb",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "#334155",
              }}
            >
              <i
                className="fas fa-chart-line"
                style={{ marginRight: "8px", color: "#4f46e5" }}
              ></i>
              Revenue Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#334155"
                  tick={{ fontSize: 12 }} // Font size for month labels
                  label={{
                    value: "Months",
                    position: "insideBottom", // Changed to insideBottom for better visibility
                    offset: -5, // Adjusts the position of the label
                    fill: "#334155",
                    fontSize: 14, // Increased font size for label
                  }}
                  tickMargin={3} // Margin for better spacing
                />
                <YAxis
                  stroke="#334155"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Revenue ($)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#334155",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#334155" }}
                />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#f87171"
                  strokeWidth={3}
                  dot={{
                    r: 8,
                    fill: "#f87171",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }} // Add dots on line points
                  activeDot={{
                    r: 6,
                    fill: "#ffffff",
                    stroke: "#f87171",
                    strokeWidth: 2,
                  }} // Style for active dot
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Statistics Tables */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              borderRadius: 3,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9fafb",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: "#334155",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i
                className="fas fa-dolly-flatbed"
                style={{ marginRight: "8px", color: "#4f46e5" }}
              ></i>
              Top Products
            </Typography>
            <TableContainer>
              <Table
                sx={{
                  minWidth: 650,
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: 16,
                        backgroundColor: "#e5e7eb",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: 16,
                        backgroundColor: "#e5e7eb",
                        textAlign: "right",
                        padding: "12px",
                      }}
                    >
                      Orders
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: 16,
                        backgroundColor: "#e5e7eb",
                        textAlign: "right",
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      Revenue
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                        transition: "background-color 0.3s ease",
                        "&:hover": { backgroundColor: "#f3f4f6" },
                        "& td": { borderBottom: "none", padding: "12px" },
                      }}
                    >
                      <TableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderTopLeftRadius: "8px",
                          borderBottomLeftRadius: "8px",
                        }}
                      >
                        <i
                className="fas fa-dolly-flatbed"
                style={{ marginRight: "8px", color: "#4f46e5" }}
              ></i>
                        {row.name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        {row.orders}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "right",
                          borderTopRightRadius: "8px",
                          borderBottomRightRadius: "8px",
                          color: row.revenue > 1000 ? "#16a34a" : "#ef4444",
                        }}
                      >
                        ${row.revenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Statistics Tables */}
        <Grid item xs={12} md={15}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              borderRadius: 3,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9fafb",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: "#334155",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i
                className="fas fa-chart-bar"
                style={{ marginRight: "8px", color: "#4f46e5" }}
              ></i>
              Sales Performance
            </Typography>
            <TableContainer>
              <Table
                sx={{
                  minWidth: 650,
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: 16,
                        backgroundColor: "#e5e7eb",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      Product
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: 16,
                        backgroundColor: "#e5e7eb",
                        textAlign: "right",
                        padding: "12px",
                      }}
                    >
                      Sales
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: 16,
                        backgroundColor: "#e5e7eb",
                        textAlign: "right",
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      Growth
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                        transition: "background-color 0.3s ease",
                        "&:hover": { backgroundColor: "#f3f4f6" },
                        "& td": { borderBottom: "none", padding: "12px" },
                      }}
                    >
                      <TableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderTopLeftRadius: "8px",
                          borderBottomLeftRadius: "8px",
                        }}
                      >
                        <i
                          className="fas fa-box"
                          style={{ marginRight: "8px", color: "#4f46e5" }}
                        ></i>
                        {row.name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        {row.orders}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "right",
                          borderTopRightRadius: "8px",
                          borderBottomRightRadius: "8px",
                          color: row.revenue > 1000 ? "#16a34a" : "#ef4444",
                        }}
                      >
                        ${row.revenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Agence;
