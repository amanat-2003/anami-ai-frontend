import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import LinkTool from "@editorjs/link";
// import AttachesTool from "@editorjs/attaches";
import Embed from "@editorjs/embed";
// import InlineImage from "editorjs-inline-image";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import Hyperlink from "editorjs-hyperlink";
import Warning from "@editorjs/warning";
import Alert from "editorjs-alert";

// Custom Tools
import CustomVideoTool from "./customTools/CustomVideo.js";
import CustomTable from "./customTools/CustomTable.js";
import CustomImage from "./customTools/CustomImage.js";
import MyAssets from "./customTools/MyAssets.js";

export const EDJ_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    config: {
      placeholder: "Enter Heading",
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  image: {
    class: CustomImage,
    config: {
      uploadUrl: `${process.env.REACT_APP_API}/api/v1/custom-note/upload-image`,
    },
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: `${process.env.REACT_APP_API}/api/v1/custom-note/fetch-link-data`,
    },
  },
  // attaches: {
  //   class: AttachesTool,
  //   config: {
  //     endpoint: "http://localhost:7890/uploadFile",
  //   },
  // },
  embed: {
    class: Embed,
    inlineToolbar: true,
  },
  // inlineImage: {
  //   class: InlineImage,
  //   inlineToolbar: true,
  //   config: {
  //     embed: {
  //       display: false,
  //     },
  //     unsplash: {
  //       appName: process.env.REACT_APP_UNSPLASH_APP_NAME,
  //       apiUrl: `${process.env.REACT_APP_API}/api/v1/custom-note/fetch-unsplash-images`,
  //       maxResults: 30,
  //     },
  //   },
  // },
  table: {
    class: CustomTable,
    inlineToolbar: true,
    config: {},
  },
  code: CodeTool,
  Marker: {
    class: Marker,
  },
  inlineCode: {
    class: InlineCode,
  },
  underline: Underline,
  hyperlink: {
    class: Hyperlink,
    config: {
      target: "_blank",
      rel: "nofollow",
      availableTargets: ["_blank", "_self"],
      availableRels: ["author", "noreferrer"],
      validate: false,
    },
  },
  video: {
    class: CustomVideoTool,
    config: {
      uploadUrl: `${process.env.REACT_APP_API}/api/v1/custom-note/upload-video`,
    },
  },
  warning: {
    class: Warning,
  },
  alert: {
    class: Alert,
  },
  myassets: {
    class: MyAssets,
    config: {
      endpoints: [
        {
          text: "docs",
          url: `${process.env.REACT_APP_API}/api/v1/document/all-documents`,
        },
        {
          text: "notes",
          url: `${process.env.REACT_APP_API}/api/v1/note/all-notes`,
        },
        {
          text: "images",
          url: `${process.env.REACT_APP_API}/api/v1/media/all-images`,
        },
        {
          text: "videos",
          url: `${process.env.REACT_APP_API}/api/v1/media/all-videos`,
        },
      ],
    },
  },
};
