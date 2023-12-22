import Swal from "sweetalert2";
export const PermanentlyDeleteItem = async (entityId, onDelete) => {
  const result = await Swal.fire({
    title: "Silme İşlemi",
    text: "Bu işlemden sonra veri silinecektir. Silme işlemini seçin:",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Kalıcı olarak sil",
    cancelButtonText: "Belgeyi Sakla",
    showCloseButton: true,
    allowOutsideClick: false,
  });
  if (result.isConfirmed) {
    try {
      const isHardDelete = true;
      const deleteEntityData = {
        id: entityId,
        isHardDelete: isHardDelete,
      };
      const response = await onDelete(deleteEntityData);

      if (response.data.isSuccess) {
        Swal.fire({
          title: "Başarılı!",
          text: response.data.message,
          icon: "success",
        })
        return true;
      } else {
        throw new Error("Silme işlemi sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error(error.message);
      Swal.fire({
        title: "Hata!",
        text: "Öge silinirken bir hata oluştu.",
        icon: "error",
      });
    }
  } else if (result.dismiss === Swal.DismissReason.close) {
    Swal.fire("İptal Edildi", "İşlem iptal edildi.", "info");
  } else {
    // "Belgeyi Sakla" seçeneği seçildiğinde
    try {
      const isHardDelete = false;
      const deleteEntityData = {
        id: entityId,
        isHardDelete: isHardDelete,
      };
      const response = await onDelete(deleteEntityData);
      if (response.data.isSuccess) {
        Swal.fire({
          title: "Başarılı!",
          text: response.data.message,
          icon: "success",
        });
        return true;
      } else {
        throw new Error("Saklama işlemi sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error(error.message);
      Swal.fire({
        title: "Hata!",
        text: "Öge saklanırken bir hata oluştu.",
        icon: "error",
      });
    }
  }
  return false;
};