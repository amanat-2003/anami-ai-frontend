import React, { useRef } from "react";
import Draggable from "react-draggable";
import {
  Slide,
  Paper,
  Table,
  Dialog,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  DialogContent,
  TableContainer,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function PaperComponent(props) {
  const paperRef = useRef(null);

  return (
    <Draggable
      handle={".draggable-dialog"}
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper {...props} ref={paperRef} />
    </Draggable>
  );
}

const cellStyle = {
  textAlign: "center",
  padding: "15px 30px",
  fontSize: "15px",
  color: "#000",
  border: "1px solid #7772",
};

const tableStyle = {
  width: "100%",
  borderRadius: "5px 5px 0 0",
  overflow: "auto",
};

const headerCellStyle = {
  ...cellStyle,
  background: "#0f8fa9",
  border: "1px solid #FFF5",
  fontSize: "16px",
  color: "#FFF",
  fontWeight: "400",
};

const MediaMetadataDialog = ({ asset, isOpen, onClose, media }) => {
  const renderTableCell = (value) => {
    return value || "-";
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperComponent={PaperComponent}
      PaperProps={{
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
        },
      }}
      aria-labelledby="draggable-dialog"
      TransitionComponent={Transition}
      TransitionProps={{
        timeout: {
          enter: 500,
          exit: 200,
        },
      }}
      fullWidth
    >
      <IconButton
        style={{ position: "absolute", right: "10px", top: "10px" }}
        onClick={() => {
          onClose();
        }}
      >
        <CloseOutlinedIcon />
      </IconButton>
      <div
        style={{
          cursor: "move",
          fontSize: "22px",
          fontWeight: "500",
          width: "100%",
          padding: "40px 0 0 0",
        }}
        className="draggable-dialog"
      >
        {media?.fileName}
      </div>
      <DialogContent style={{ padding: "20px 50px 30px 50px", width: "100%" }}>
        {media && (
          <TableContainer>
            <Table style={{ ...tableStyle }}>
              <TableBody>
                <TableRow>
                  <TableCell style={headerCellStyle}>Department</TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(media?.departmentName)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={headerCellStyle}>Asset</TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(media?.assetName)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={headerCellStyle}>Uploaded By</TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(media?.userName)}
                  </TableCell>
                </TableRow>
                {media?.createdAt ? (
                  <>
                    <TableRow>
                      <TableCell style={headerCellStyle}>Created At</TableCell>
                      <TableCell style={cellStyle}>
                        {renderTableCell(
                          new Date(media?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              hour12: false,
                            }
                          )
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={headerCellStyle}>Modified At</TableCell>
                      <TableCell style={cellStyle}>
                        {renderTableCell(
                          new Date(media?.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              hour12: false,
                            }
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell style={headerCellStyle}>Created At</TableCell>
                    <TableCell style={cellStyle}>
                      {renderTableCell(
                        new Date(media?.uploadDate).toLocaleDateString(
                          "en-US",
                          {
                            hour12: false,
                          }
                        )
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaMetadataDialog;
