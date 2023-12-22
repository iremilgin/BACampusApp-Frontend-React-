import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

const ToastContent = ({ message, type = "success" }) => {
  useEffect(() => {
    const options = {
      ...defaultOptions,
    };

    if (message) {
      if (type === "success") {
        toast.success(message, options);
      } else if (type === "error") {
        toast.error(message, options);
      } else if (type === "warning") {
        toast.warning(message, options);
      }
    }
  }, [message, type]);

  return <ToastContainer />;
};

export default ToastContent;
