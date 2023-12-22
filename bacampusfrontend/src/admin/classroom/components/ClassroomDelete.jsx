import React from "react";
import { Button } from "semantic-ui-react";
import { deleteClassroom } from "../api/classroomApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ClassroomDelete = ({ id, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteClassroom(id);
      toast.error("Grup başarıyla silindi.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      onDelete();
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Sınıfı silme hatası:", error);
    }
  };

  return (
    <Button
      color="red"
      onClick={handleDelete}
      icon="trash"
    />
  );
};

export default ClassroomDelete;
