import axios from "axios";
import Swal from 'sweetalert2';

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const baseUrl = process.env.REACT_APP_BASE_URL;
const API_BASE_URL = baseUrl + "/Admin/Education";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

// Tüm egitimleri getir
export async function getAllEducation() {
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
    throw new Error(error.response?.data?.title || "Egitimler alınamadı.");
  }
}
// Egitim oluşturma
export async function createEducation(data) {
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
    } 
    else if(error.response?.data.message){
      throw{
        errorMessages: { message: error.response.data.message },

      };
    }
    else {
      throw {
        errorMessages,
        defaultMessage: "Eğitim oluşturulamadı.",
      };
    }
  }
}
// Egitim silme
export async function deleteEducation(educationId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Delete?id=${educationId}`,
      {
        headers: {
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
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
    const errorMessage = error.response?.data?.message || 'Bir hata oluştu. ';
    console.error(errorMessage);

    // Swal.fire() backend tarafından gelen hata mesajını göster
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage
    });

    throw error;
}
}
// Egitimi ID'ye göre alma
export async function getEducationById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/Details?guid=${id}`, {
      headers: {
        "Content-Type": "application/json",
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
    throw new Error(
      error.response?.data?.title || "Egitim bilgileri alınamadı."
    );
  }
}
// Egitim güncelleme
export async function updateEducation(id, data) {
  const errorMessages = {};
  try {
    const response = await axios.put(`${API_BASE_URL}/Update?id=${id}`, data, {
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
    } 
    else if(error.response?.data.message){
      throw{
        errorMessages: { message: error.response.data.message },

      };
    }
    else {
      throw {
        errorMessages,
        defaultMessage: "Eğitim güncellenemedi.",
      };
    }
  }
}

export async function getAllEducationThatHaveEducationSubjects() {
  try {
    const response = await axios.get(`${API_BASE_URL}/ListAllThatHaveEducationSubject`, {
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
    throw new Error(error.response?.data?.title || "Egitimler alınamadı.");
  }
}