import axios from "axios";
import Swal from "sweetalert2";

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
  //const role = savedData[1];
}
const baseUrl = process.env.REACT_APP_BASE_URL;
const API_BASE_URL = baseUrl + "/Admin/Tag";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

//Tag Oluşturma
export async function createTag(data) {
  const errorMessages = {};
  try {
    const response = await axios.post(`${API_BASE_URL}/Create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    if (response.data.isSuccess) {
      return {
        data: response.data,
        message: response.data.message,
      };
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }
    if (error.response?.data?.errors) {
      const errorFields = Object.keys(error.response.data.errors);
      errorFields.forEach((field) => {
        errorMessages[field] = error.response.data.errors[field].join(", ");
      });
      throw {
        errorMessages,
      };
    } else if (error.response?.data.message) {
      throw {
        errorMessages: { message: error.response.data.message },
      };
    } else {
      throw {
        errorMessages,
        defaultMessage: "Etiket oluşturulamadı.",
      };
    }
  }
}

//Tag Silme
export async function deleteTag(tagId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Delete?id=${tagId}`, {
      headers: {
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }
    // Axios ile gelen hatayı işle
    const errorMessage = error.response?.data?.message || "Bir hata oluştu. ";
    console.error(errorMessage);

    // Swal.fire() backend tarafından gelen hata mesajını göster
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });

    throw error;
  }
}

//Tag Update
export async function updateTag(tagId, data) {
  const errorMessages = {};
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Update?id=${tagId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
    if (response.data.isSuccess) {
      return {
        data: response.data,
        message: response.data.message,
      };
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }
    if (error.response?.data?.errors) {
      const errorFields = Object.keys(error.response.data.errors);
      errorFields.forEach((field) => {
        errorMessages[field] = error.response.data.errors[field].join(", ");
      });
      throw {
        errorMessages,
      };
    } else if (error.response?.data.message) {
      throw {
        errorMessages: { message: error.response.data.message },
      };
    } else {
      throw {
        errorMessages,
        defaultMessage: "Etiket güncelenemedi.",
      };
    }
  }
}

//Tagı Id'ye göre alma

export async function getTagById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetById?guid=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }
    throw new Error("Sınıf bilgileri alınamadı.");
  }
}
//Tüm Tagları getirme

export const getAlllTag = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ListAll`, {
      headers: {
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }
    throw new Error(error.response?.data?.title || "Bir hata oluştu.");
  }
};
//Silinmiş Tüm Tagları Getirme

export const getAllDeletedTags = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/DeletedListAll`, {
      headers: {
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }
    throw new Error(error.response?.data?.title || "Bir hata oluştu.");
  }
};
