import React, { useRef } from "react";
import Draggable from "react-draggable";

import {
  Box,
  Card,
  Slide,
  Paper,
  styled,
  Dialog,
  Tooltip,
  IconButton,
  Typography,
  CardContent,
  DialogTitle,
  DialogContent,
  tooltipClasses,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fafafa",
    color: "rgba(0, 0, 0, 0.87)",
    minWidth: 200,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    borderRadius: "10px",
  },
}));

const DocumentListViewer = (props) => {
  const { isOpen, onClose, documents, isDocument } = props;

  const openInNewTab = (url) => {
    window.open(`/admin/view-file/${url}`, "_blank");
  };

  const title = isDocument ? "Documents" : "Notes";
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog"
        TransitionComponent={Transition}
        TransitionProps={{
          timeout: {
            enter: 500,
            exit: 200,
          },
        }}
      >
        <DialogTitle
          style={{
            cursor: "move",
            borderBottom: "1px solid #AAA",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="draggable-dialog"
        >
          {title}
        </DialogTitle>
        <Tooltip title={"Close"} placement="right">
          <IconButton
            aria-label="Close"
            color="error"
            onClick={onClose}
            style={{
              position: "absolute",
              right: "0px",
              top: "0px",
            }}
          >
            <DisabledByDefaultRoundedIcon
              style={{
                fontSize: "30px",
                color: "red",
              }}
            />
          </IconButton>
        </Tooltip>
        <DialogContent
          style={{
            display: "flex",
            gap: "10px",
            padding: "15px",
            margin: "0",
            flexWrap: "wrap",
          }}
        >
          {documents?.length > 0 ? (
            documents.map((document, index) => (
              <Card
                key={index}
                style={{
                  display: "flex",
                  border: "1px solid #BBB",
                  height: "auto",
                  maxHeight: "100px",
                  width: "auto",
                  minWidth: "200px",
                  maxWidth: "250px",
                  borderRadius: "10px 10px 10px 10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    paddingInlineStart: "5px",
                    width: "100%",
                  }}
                >
                  <Box style={{ height: "40px" }}>
                    <CardContent
                      style={{
                        paddingBlock: "5px",
                        margin: "0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        height: "auto",
                      }}
                    >
                      <HtmlTooltip
                        title={
                          <React.Fragment>
                            <Typography
                              color="inherit"
                              style={{ textAlign: "center" }}
                            >
                              {document?.fileName}
                            </Typography>
                            <div>
                              <p>
                                <b>User :</b> {document?.userName}
                              </p>
                              <p>
                                <b>Department :</b> {document?.departmentName}
                              </p>
                              <p>
                                <b>Asset :</b> {document?.assetName}
                              </p>
                              <p>
                                <b>Note :</b> {document?.noteName}
                              </p>
                              <p>
                                <b>Upload Date :</b>{" "}
                                {document?.uploadDate?.split(`T`)[0]} UTC
                              </p>
                              <p>
                                <b>Upload Time :</b>{" "}
                                {document?.uploadDate?.split(`T`)[1]} UTC
                              </p>
                            </div>
                          </React.Fragment>
                        }
                        arrow
                        placement={"top"}
                      >
                        <IconButton
                          sx={{ color: "#999F" }}
                          aria-label={`info about ${document.fileName}`}
                          style={{
                            position: "absolute",
                            right: "0px",
                            top: "3px",
                            padding: "3px",
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </HtmlTooltip>
                      <Tooltip title={"View Document"} arrow placement="top">
                        <IconButton
                          aria-label="View Document"
                          color="primary"
                          onClick={() => {
                            openInNewTab(document._id);
                            // setFile(document);
                            // setIsOpenDialog(true);
                            // setIsFull(true);
                          }}
                          style={{
                            position: "absolute",
                            right: "30px",
                            top: "3px",
                            padding: "3px",
                          }}
                        >
                          <FileOpenIcon />
                        </IconButton>
                      </Tooltip>
                    </CardContent>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      position: "relative",
                      height: "100%",
                      width: "100%",
                      padding: "0px 10px 0px 10px",
                      overflow: "auto",
                      maxHeight: "300px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        gap: "5px",
                        flexDirection: "column",
                      }}
                    >
                      {document.fileName}
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))
          ) : (
            <>
              <Box style={{ padding: "30px", margin: "0px" }}>
                No {title} found for the user
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentListViewer;
