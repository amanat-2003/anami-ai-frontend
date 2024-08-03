// import { Button } from "@mui/material";
// import React from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

const Test = () => {
  // const [response, setResponse] = useState("");
  // const [streaming, setStreaming] = useState(false);

  // const startStream = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API}/api/v1/test/streamingTest`
  //     );
  //     const reader = response.body.getReader();

  //     setStreaming(true);

  //     const decoder = new TextDecoder();
  //     let result = "";

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;
  //       result += decoder.decode(value);
  //       setResponse(result);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setStreaming(false);
  //   }
  // };

  // const sendMail = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/api/v1/test/mailTest`
  //     );
  //     toast.success(response.data.message);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const file_url = encodeURI(
    "https://dev-zippiai.s3.amazonaws.com/Departments/65f83028dfac3e70469f2809/6641f96e232d60e711727c34/Documents/Final Report.docx"
  );

  return (
    <div
      style={{
        height: "100vh",
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
        // gap: "20px",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        title="TestDoc"
        // src={`https://docs.google.com/viewer?url=${file_url}&embedded=true`}
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${file_url}`}
      />
      {/* <Button onClick={startStream} disabled={streaming}>
        {streaming ? "Streaming..." : "Start Stream"}
      </Button> */}
      {/* <div
        style={{
          width: "100%",
          margin: 0,
          padding: "10px 0",
          backgroundColor: "#F3F2F0",
          borderRadius: "2px",
          fontFamily: "arial",
        }}
      >
        <div
          style={{
            width: "450px",
            margin: "0 auto",
            padding: "30px 40px 30px 40px",
            borderRadius: "1px",
            backgroundColor: "#FFF",
          }}
        >
          <div
            style={{
              textAlign: "center",
              margin: "10px auto 30px",
            }}
          >
            <img
              src="https://zippiai.app/images/ZippiAiLogo.png"
              alt="ZippiAi Logo"
              width="175"
            />
          </div>
          <p
            style={{
              fontSize: "17px",
              lineHeight: "24px",
              color: "#666",
            }}
          >
            Dear UserName
          </p>
          <p
            style={{
              fontSize: "17px",
              lineHeight: "24px",
              color: "#666",
            }}
          >
            We're writing to inform you that the password for your account has
            been successfully changed.
          </p>
          <p
            style={{
              fontSize: "17px",
              lineHeight: "24px",
              color: "#666",
            }}
          >
            You can now log in using your new password to access your account
            and enjoy all the features and benefits of our platform.
          </p>
          <p
            style={{
              fontSize: "17px",
              lineHeight: "24px",
              color: "#666",
            }}
          >
            If you need further assistance, feel free to contact our support
            team at <a href="mailto:support@zippiai.app">support@zippiai.app</a>
            .
          </p>
          <p
            style={{
              fontSize: "17px",
              lineHeight: "24px",
              color: "#666",
            }}
          >
            <div>Best regards,</div>
            <div>ZippiAi team</div>
          </p>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <a
              style={{
                display: "inline-block",
                backgroundColor: "#0a66c2",
                color: "#fff",
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: "5px",
                fontSize: "15px",
                minWidth: "150px",
                transition: "background-color 0.3s ease",
              }}
              href="process.env.REACT_APP_API/login"
            >
              Login
            </a>
          </div>
        </div>
        <div
          style={{
            width: "510px",
            padding: "10px",
            margin: "10px auto",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
          }}
        >
          <div
            style={{
              width: "100%",
              textAlign: "center",
              color: "#3b3f44",
              fontSize: "16px",
              lineHeight: "27px",
              fontWeight: "600",
              fontFamily: "arial",
              padding: "5px 0 0 0",
            }}
          >
            © {new Date().getFullYear()} ZippiAi Inc.
          </div>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              color: "#3b3f44",
              fontSize: "14px",
              lineHeight: "21px",
              fontFamily: "arial",
            }}
          >
            149 New Montgomery St, San Francisco, CA 94105, USA
          </div>
        </div>
      </div> */}
      {/* <div>
        <Button variant="contained" onClick={sendMail}>
          Send Test Mail
        </Button>
      </div> */}
      {/* <div
        style={{
          color: "#3b3f44",
          fontSize: "15px",
          lineHeight: "20px",
          fontFamily: "roboto",
          padding: "0px 0 7px 0",
        }}
      >
        Follow us on
      </div> */}
      {/* <div style={{ display: "flex", gap: "10px" }}>
        <a href="https://x.com/ZippiAi" target="_blank" rel="noreferrer">
          <img
            alt="svgImg"
            height="35px"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAsMCwyNTYsMjU2IgpzdHlsZT0iZmlsbDojMDAwMDAwOyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0ic2NhbGUoNS4zMzMzMyw1LjMzMzMzKSI+PHBhdGggZD0iTTM4LDQyaC0yOGMtMi4yMDksMCAtNCwtMS43OTEgLTQsLTR2LTI4YzAsLTIuMjA5IDEuNzkxLC00IDQsLTRoMjhjMi4yMDksMCA0LDEuNzkxIDQsNHYyOGMwLDIuMjA5IC0xLjc5MSw0IC00LDR6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjwvcGF0aD48cGF0aCBkPSJNMzQuMjU3LDM0aC02LjQzN2wtMTMuOTkxLC0yMGg2LjQzN3pNMjguNTg3LDMyLjMwNGgyLjU2M2wtMTEuNjUxLC0xNi42MDhoLTIuNTYzeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+PHBhdGggZD0iTTE1Ljg2NiwzNGw3LjIwMywtOC4zNDRsLTAuOTQyLC0xLjI0OWwtOC4zMDQsOS41OTN6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD48cGF0aCBkPSJNMjQuNDUsMjEuNzIxbDAuOTA1LDEuMjg5bDcuNzgxLC05LjAxaC0yeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+PC9nPjwvZz4KPC9zdmc+"
          />
        </a>
        <a
          href="https://www.linkedin.com/company/zippiai-inc/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="svgImg"
            height="35px"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiMwMDc4ZDQiIGQ9Ik00MiwzN2MwLDIuNzYyLTIuMjM4LDUtNSw1SDExYy0yLjc2MSwwLTUtMi4yMzgtNS01VjExYzAtMi43NjIsMi4yMzktNSw1LTVoMjZjMi43NjIsMCw1LDIuMjM4LDUsNQlWMzd6Ij48L3BhdGg+PHBhdGggZD0iTTMwLDM3VjI2LjkwMWMwLTEuNjg5LTAuODE5LTIuNjk4LTIuMTkyLTIuNjk4Yy0wLjgxNSwwLTEuNDE0LDAuNDU5LTEuNzc5LDEuMzY0CWMtMC4wMTcsMC4wNjQtMC4wNDEsMC4zMjUtMC4wMzEsMS4xMTRMMjYsMzdoLTdWMThoN3YxLjA2MUMyNy4wMjIsMTguMzU2LDI4LjI3NSwxOCwyOS43MzgsMThjNC41NDcsMCw3LjI2MSwzLjA5Myw3LjI2MSw4LjI3NAlMMzcsMzdIMzB6IE0xMSwzN1YxOGgzLjQ1N0MxMi40NTQsMTgsMTEsMTYuNTI4LDExLDE0LjQ5OUMxMSwxMi40NzIsMTIuNDc4LDExLDE0LjUxNCwxMWMyLjAxMiwwLDMuNDQ1LDEuNDMxLDMuNDg2LDMuNDc5CUMxOCwxNi41MjMsMTYuNTIxLDE4LDE0LjQ4NSwxOEgxOHYxOUgxMXoiIG9wYWNpdHk9Ii4wNSI+PC9wYXRoPjxwYXRoIGQ9Ik0zMC41LDM2LjV2LTkuNTk5YzAtMS45NzMtMS4wMzEtMy4xOTgtMi42OTItMy4xOThjLTEuMjk1LDAtMS45MzUsMC45MTItMi4yNDMsMS42NzcJYy0wLjA4MiwwLjE5OS0wLjA3MSwwLjk4OS0wLjA2NywxLjMyNkwyNS41LDM2LjVoLTZ2LTE4aDZ2MS42MzhjMC43OTUtMC44MjMsMi4wNzUtMS42MzgsNC4yMzgtMS42MzgJYzQuMjMzLDAsNi43NjEsMi45MDYsNi43NjEsNy43NzRMMzYuNSwzNi41SDMwLjV6IE0xMS41LDM2LjV2LTE4aDZ2MThIMTEuNXogTTE0LjQ1NywxNy41Yy0xLjcxMywwLTIuOTU3LTEuMjYyLTIuOTU3LTMuMDAxCWMwLTEuNzM4LDEuMjY4LTIuOTk5LDMuMDE0LTIuOTk5YzEuNzI0LDAsMi45NTEsMS4yMjksMi45ODYsMi45ODljMCwxLjc0OS0xLjI2OCwzLjAxMS0zLjAxNSwzLjAxMUgxNC40NTd6IiBvcGFjaXR5PSIuMDciPjwvcGF0aD48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTIsMTloNXYxN2gtNVYxOXogTTE0LjQ4NSwxN2gtMC4wMjhDMTIuOTY1LDE3LDEyLDE1Ljg4OCwxMiwxNC40OTlDMTIsMTMuMDgsMTIuOTk1LDEyLDE0LjUxNCwxMgljMS41MjEsMCwyLjQ1OCwxLjA4LDIuNDg2LDIuNDk5QzE3LDE1Ljg4NywxNi4wMzUsMTcsMTQuNDg1LDE3eiBNMzYsMzZoLTV2LTkuMDk5YzAtMi4xOTgtMS4yMjUtMy42OTgtMy4xOTItMy42OTgJYy0xLjUwMSwwLTIuMzEzLDEuMDEyLTIuNzA3LDEuOTlDMjQuOTU3LDI1LjU0MywyNSwyNi41MTEsMjUsMjd2OWgtNVYxOWg1djIuNjE2QzI1LjcyMSwyMC41LDI2Ljg1LDE5LDI5LjczOCwxOQljMy41NzgsMCw2LjI2MSwyLjI1LDYuMjYxLDcuMjc0TDM2LDM2TDM2LDM2eiI+PC9wYXRoPgo8L3N2Zz4="
          />
        </a>
        <a
          href="https://medium.com/@zippiaidev"
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="svgImg"
            height="35px"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAsMCwyNTYsMjU2IgpzdHlsZT0iZmlsbDojMDAwMDAwOyI+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMy4yOCwtMzMuMjgpIHNjYWxlKDEuMjYsMS4yNikiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMy41NTU1NiwzLjU1NTU2KSI+PHBhdGggZD0iTTQ1LjA0OSwxNGMxMi4wMTEsMCAxMi45NTEsMC45NCAxMi45NTEsMTIuOTUxdjE4LjA5OGMwLDEyLjAxMSAtMC45NCwxMi45NTEgLTEyLjk1MSwxMi45NTFoLTE4LjA5OGMtMTIuMDExLDAgLTEyLjk1MSwtMC45NCAtMTIuOTUxLC0xMi45NTF2LTE4LjA5OGMwLC0xMi4wMTEgMC45NCwtMTIuOTUxIDEyLjk1MSwtMTIuOTUxek0yOS43MTMsNDQuMTUxYzQuNTAyLDAgOC4xNTEsLTMuNjQ5IDguMTUxLC04LjE1MWMwLC00LjUwMiAtMy42NDksLTguMTUxIC04LjE1MSwtOC4xNTFjLTQuNTAyLDAgLTguMTUxLDMuNjQ5IC04LjE1MSw4LjE1MWMwLDQuNTAyIDMuNjUsOC4xNTEgOC4xNTEsOC4xNTF6TTQyLjcxMyw0My43NTdjMi4yMjgsMCA0LjAzNCwtMy40NzMgNC4wMzQsLTcuNzU3YzAsLTQuMjg0IC0xLjgwNiwtNy43NTcgLTQuMDM0LC03Ljc1N2MtMi4yMjgsMCAtNC4wMzQsMy40NzMgLTQuMDM0LDcuNzU3YzAsNC4yODQgMS44MDYsNy43NTcgNC4wMzQsNy43NTd6TTQ4Ljk4LDQyLjkyOGMwLjc3NSwwIDEuNDAzLC0zLjEwMiAxLjQwMywtNi45MjhjMCwtMy44MjYgLTAuNjI4LC02LjkyOCAtMS40MDMsLTYuOTI4Yy0wLjc3NSwwIC0xLjQwMywzLjEwMiAtMS40MDMsNi45MjhjMCwzLjgyNiAwLjYyOCw2LjkyOCAxLjQwMyw2LjkyOHoiPjwvcGF0aD48L2c+PC9nPjwvZz4KPC9zdmc+"
          />
        </a>
        <a
          href="https://www.instagram.com/zippiai/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="svgImg"
            height="35px"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAsMCwyNTYsMjU2IgpzdHlsZT0iZmlsbDojMDAwMDAwOyI+CjxkZWZzPjxyYWRpYWxHcmFkaWVudCBjeD0iMTkuMzgiIGN5PSI0Mi4wMzUiIHI9IjQ0Ljg5OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xX1h5MTBKY3UxTDJTdV9ncjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZGQ1NSI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC4zMjgiIHN0b3AtY29sb3I9IiNmZjU0M2YiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuMzQ4IiBzdG9wLWNvbG9yPSIjZmM1MjQ1Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjUwNCIgc3RvcC1jb2xvcj0iI2U2NDc3MSI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC42NDMiIHN0b3AtY29sb3I9IiNkNTNlOTEiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjAuNzYxIiBzdG9wLWNvbG9yPSIjY2MzOWE0Ij48L3N0b3A+PHN0b3Agb2Zmc2V0PSIwLjg0MSIgc3RvcC1jb2xvcj0iI2M4MzdhYiI+PC9zdG9wPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGN4PSIxMS43ODYiIGN5PSI1LjU0MDMiIHI9IjI5LjgxMyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0yX1h5MTBKY3UxTDJTdV9ncjIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzQxNjhjOSI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMC45OTkiIHN0b3AtY29sb3I9IiM0MTY4YzkiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjI4LC0xLjI4KSBzY2FsZSgxLjAxLDEuMDEpIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48ZyB0cmFuc2Zvcm09InNjYWxlKDUuMzMzMzMsNS4zMzMzMykiPjxwYXRoIGQ9Ik0zNC4wMTcsNDEuOTlsLTIwLDAuMDE5Yy00LjQsMC4wMDQgLTguMDAzLC0zLjU5MiAtOC4wMDgsLTcuOTkybC0wLjAxOSwtMjBjLTAuMDA0LC00LjQgMy41OTIsLTguMDAzIDcuOTkyLC04LjAwOGwyMCwtMC4wMTljNC40LC0wLjAwNCA4LjAwMywzLjU5MiA4LjAwOCw3Ljk5MmwwLjAxOSwyMGMwLjAwNSw0LjQwMSAtMy41OTIsOC4wMDQgLTcuOTkyLDguMDA4eiIgZmlsbD0idXJsKCNjb2xvci0xX1h5MTBKY3UxTDJTdV9ncjEpIj48L3BhdGg+PHBhdGggZD0iTTM0LjAxNyw0MS45OWwtMjAsMC4wMTljLTQuNCwwLjAwNCAtOC4wMDMsLTMuNTkyIC04LjAwOCwtNy45OTJsLTAuMDE5LC0yMGMtMC4wMDQsLTQuNCAzLjU5MiwtOC4wMDMgNy45OTIsLTguMDA4bDIwLC0wLjAxOWM0LjQsLTAuMDA0IDguMDAzLDMuNTkyIDguMDA4LDcuOTkybDAuMDE5LDIwYzAuMDA1LDQuNDAxIC0zLjU5Miw4LjAwNCAtNy45OTIsOC4wMDh6IiBmaWxsPSJ1cmwoI2NvbG9yLTJfWHkxMEpjdTFMMlN1X2dyMikiPjwvcGF0aD48cGF0aCBkPSJNMjQsMzFjLTMuODU5LDAgLTcsLTMuMTQgLTcsLTdjMCwtMy44NiAzLjE0MSwtNyA3LC03YzMuODU5LDAgNywzLjE0IDcsN2MwLDMuODYgLTMuMTQxLDcgLTcsN3pNMjQsMTljLTIuNzU3LDAgLTUsMi4yNDMgLTUsNWMwLDIuNzU3IDIuMjQzLDUgNSw1YzIuNzU3LDAgNSwtMi4yNDMgNSwtNWMwLC0yLjc1NyAtMi4yNDMsLTUgLTUsLTV6IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PGNpcmNsZSBjeD0iMzEuNSIgY3k9IjE2LjUiIHI9IjEuNSIgZmlsbD0iI2ZmZmZmZiI+PC9jaXJjbGU+PHBhdGggZD0iTTMwLDM3aC0xMmMtMy44NTksMCAtNywtMy4xNCAtNywtN3YtMTJjMCwtMy44NiAzLjE0MSwtNyA3LC03aDEyYzMuODU5LDAgNywzLjE0IDcsN3YxMmMwLDMuODYgLTMuMTQxLDcgLTcsN3pNMTgsMTNjLTIuNzU3LDAgLTUsMi4yNDMgLTUsNXYxMmMwLDIuNzU3IDIuMjQzLDUgNSw1aDEyYzIuNzU3LDAgNSwtMi4yNDMgNSwtNXYtMTJjMCwtMi43NTcgLTIuMjQzLC01IC01LC01eiIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjwvZz48L2c+PC9nPgo8L3N2Zz4="
          />
        </a>
      </div> */}
    </div>
  );
};

export default Test;
