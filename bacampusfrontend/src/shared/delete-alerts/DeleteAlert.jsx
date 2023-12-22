import React from "react";
import Swal from "sweetalert2";

//belge saklama durumu olmayan veriler için sil işlemi
export const DeleteItem = async (entityId, onDelete) => {
  const initialConfirmation = await Swal.fire({
    title: "Silmek İstediğinize Emin Misiniz?",
    text: "Silindikten sonra bu öğeyi kurtaramazsınız!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet, Sil!",
    cancelButtonText: "İptal"
  });

  if (initialConfirmation.isConfirmed) {
    try {
    
      const response = await onDelete(entityId);
      if (response.isSuccess) {
        Swal.fire({
          title: "Başarılı!",
          text: response.message, 
          icon: "success",
        });
        return true;

      } else {
        throw new Error("Silme işlemi sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Hata!",
        text: "Öge silinirken bir hata oluştu: " + error.response.data.message,
        icon: "error",
      });
    }
  }
  return false;

};







