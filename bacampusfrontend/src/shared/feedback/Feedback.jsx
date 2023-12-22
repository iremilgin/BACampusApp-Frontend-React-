import React from "react";
import Swal from "sweetalert2";

//belge saklama durumu olmayan veriler için sil işlemi
export const ChangeFeedback = async (entityId, onChangeFeedback) => {
  const initialConfirmation = await Swal.fire({
    input: "textarea",
    inputLabel: "Geri Bildirim",
    inputPlaceholder: "Geri bildirimini bu alana yazınız...",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Gönder",
    cancelButtonText: "İptal",
  });

  if (initialConfirmation.isConfirmed && initialConfirmation.value) {
    try {
      const formData = {
        id: entityId,
        feedback: initialConfirmation.value,
      };
      const response = await onChangeFeedback(formData);
      if (response.isSuccess) {
        Swal.fire({
          title: "Başarılı!",
          text: response.message,
          icon: "success",
        });
        return true;
      } else {
        throw new Error("Geri bildirim eklenirken bir hata oluştu.");
      }
    } catch (error) {
      Swal.fire({
        title: "Hata!",
        text: "Geri bildirim eklenemedi. Hata mesajı: " + error.message,
        icon: "error",
      });
    }
  } else if (initialConfirmation.isConfirmed && !initialConfirmation.value) {
    Swal.fire({
      text: "Geri bildirim alanını boş bıraktınız",
      icon: "warning",
    });
  } else {
    Swal.fire({
      text: "Geri bildirim işlemi iptal edildi",
      icon: "info",
    });
  }
  return false;
};
