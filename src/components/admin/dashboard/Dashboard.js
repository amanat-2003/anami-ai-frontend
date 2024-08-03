import React from "react";

import { Box, CircularProgress, IconButton } from "@mui/material";

import { BarChart } from "@mui/x-charts/BarChart";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { PieChart } from "@mui/x-charts/PieChart";

import AssetCard from "./AssetCard.js";
import DepartmentCard from "./DepartmentCard.js";
import UserCard from "./UserCard.js";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = (props) => {
  const {
    numberedData,
    selectedUser,
    handleUserChange,
    allUsers,
    decrementMonth,
    incrementMonth,
    months,
    loading,
    isCurrentMonthDataExists,
    days,
    chat,
    embeddings,
    currentMonthIndex,
    storageData,
  } = props;

  return (
    <Box
      style={{
        backgroundColor: "#FAFAFA",
        paddingBlock: "2rem",
        height: `calc(100vh)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            height: "100px",
            marginBottom: "30px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "50px",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                fontFamily: "Inter",
                fontSize: "24px",
                textalign: "left",
                color: "#000",
              }}
            >
              Dashboard
            </div>
          </Box>

          <DepartmentCard value={numberedData.numberOfDepartments} />
          <AssetCard
            sx={{ height: "100px", width: "200px" }}
            value={numberedData.numberOfAssets}
          />
          <UserCard
            sx={{ height: "100px", width: "200px" }}
            value={numberedData.numberOfUsers}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            // alignItems:"center"
          }}
        >
          <Box
            sx={{
              padding: "15px",

              width: "50%",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              margin: "10px",
              backgroundColor: "#fff",
              // height: "500px"
            }}
          >
            <div
              style={{
                // background: "yellow",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div>
                <select value={selectedUser} onChange={handleUserChange}>
                  {allUsers?.map((user) => (
                    <option key={user?._id} value={user?._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton onClick={decrementMonth}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <div className="month-names">
                  <span>{months[currentMonthIndex]}</span>
                </div>
                <IconButton onClick={incrementMonth}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </div>
            </div>

            {isCurrentMonthDataExists && !loading ? (
              <BarChart
                xAxis={[{ scaleType: "band", data: days }]}
                series={[
                  { data: chat, label: "Chat" },
                  { data: embeddings, label: "Embeddings" },
                ]}
                // width={500}

                height={300}
                margin={10}
                sx={{
                  padding: "25px",
                  maxWidth: "90%",
                }}
              />
            ) : (
              <>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span> No Data Available</span>
                  </div>
                )}
              </>
            )}
          </Box>

          <Box
            sx={{
              // background: "red",
              padding: "10px",

              // // width: "fit-content",
              display: "flex",
              flexDirection: "column",
              // justifyContent: "flex-start",
              // alignItems: "left"
              // gap: "5px",
              // margin: "10px"
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              {`Total storage used : ${storageData?.totalStorageUsed?.toFixed(
                3
              )} Gb.`}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{}}>
                {storageData.map((entry, index) => (
                  <div
                    key={entry.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: COLORS[index],
                        marginRight: "5px",
                      }}
                    />
                    <span>{`${entry.name} : ${entry.value?.toFixed(
                      3
                    )} Gb.`}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  width: "500px",
                }}
              >
                <PieChart
                  colors={COLORS}
                  series={[{ storageData }]}
                  height={200}
                />
              </div>
            </div>
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
