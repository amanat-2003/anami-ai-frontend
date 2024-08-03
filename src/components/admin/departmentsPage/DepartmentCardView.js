import React, { useState } from "react";

import { IconButton, Tooltip, Grid, Typography, Box } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";

import UpdateDepartmentForm from "./UpdateDepartmentForm.js";
import DeleteDepartmentDialog from "./DeleteDepartmentDialog.js";

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "85px",
  justifyContent: "space-between",
  padding: "13px",
  borderRadius: "5px",
  border: "solid 1px #d9d9d9",
  backgroundColor: "#fff",
  position: "relative",
  cursor: "pointer",
  margin: "5px",
};

const cardTitleStyle = {
  fontSize: "17px",
  marginBottom: "4px",
};

const cardSubheaderStyle = {
  display: "flex",
  flexDirection: "column",
  fontSize: "12px",
  color: "#888",
};

const DepartmentCardView = ({
  user,
  allUsers,
  departments,
  handleLogout,
  openComponent,
  setDepartments,
  selectedDepartment,
  setSelectedDepartment,
}) => {
  const [openUpdateDepartmentForm, setOpenUpdateDepartmentForm] =
    useState(false);
  const [isDepartmentDeleteDialogOpen, setIsDepartmentDeleteDialogOpen] =
    useState(false);

  const handleOpenUpdateDepartmentForm = () => {
    setOpenUpdateDepartmentForm(true);
  };

  const handleCloseUpdateDepartmentForm = () => {
    setOpenUpdateDepartmentForm(false);
  };

  const handleOpenDepartmentDeleteDialog = () => {
    setIsDepartmentDeleteDialogOpen(true);
  };

  const handleCloseDepartmentDeleteDialog = () => {
    setIsDepartmentDeleteDialogOpen(false);
  };

  return (
    <>
      {isDepartmentDeleteDialogOpen && (
        <DeleteDepartmentDialog
          admin={user}
          departments={departments}
          handleLogout={handleLogout}
          setDepartments={setDepartments}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          isDepartmentDeleteDialogOpen={isDepartmentDeleteDialogOpen}
          handleCloseDepartmentDeleteDialog={handleCloseDepartmentDeleteDialog}
        />
      )}
      {openUpdateDepartmentForm && (
        <UpdateDepartmentForm
          admin={user}
          departments={departments}
          setDepartments={setDepartments}
          handleLogout={handleLogout}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          allUsers={allUsers}
          openUpdateDepartmentForm={openUpdateDepartmentForm}
          onClose={handleCloseUpdateDepartmentForm}
          handleOpenDepartmentDeleteDialog={handleOpenDepartmentDeleteDialog}
        />
      )}
      <Grid
        container
        spacing={0}
        style={{
          position: "relative",
        }}
      >
        {departments.length > 0 ? (
          departments.map((department, index) => (
            <Grid key={index} item xs={6} sm={6} md={4} lg={3} xl={2.4}>
              <div
                style={{ ...cardStyle }}
                onClick={() => {
                  openComponent("Assets");
                  setSelectedDepartment(department);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "1px",
                  }}
                >
                  {user?.role === 0 && (
                    <AccountBalanceRoundedIcon sx={{ margin: "10px" }} />
                  )}
                  <div
                    style={{
                      ...cardTitleStyle,
                      width:
                        user?.role === 1 ? `calc(100% - 50px)` : `calc(100%)`,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={department.departmentName}
                  >
                    {department.departmentName}
                  </div>

                  {user?.role === 1 && (
                    <div style={cardSubheaderStyle}>
                      <span>{`User Count: ${
                        department?.allowedUsers?.length - 1
                      }`}</span>
                    </div>
                  )}
                  <div style={cardSubheaderStyle}>
                    <span>{`Date created: ${new Date(
                      department?.createdAt
                    ).toLocaleDateString("en-US", {
                      hour12: false,
                    })}`}</span>
                  </div>

                  {user?.role === 1 && (
                    <Tooltip title={"Edit Department"} arrow>
                      <IconButton
                        aria-label="Edit Department"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDepartment(department);
                          handleOpenUpdateDepartmentForm();
                        }}
                      >
                        <BorderColorIcon style={{ fontSize: "20px" }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </div>
            </Grid>
          ))
        ) : (
          <Box
            minHeight={`calc(100vh - 288px)`}
            width={"100%"}
            style={{
              margin: "25px 0 0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              minHeight={"100%"}
              textTransform={"uppercase"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ fontSize: { xs: "h4", sm: "h6" } }}
            >
              You have no department!
            </Typography>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default DepartmentCardView;
