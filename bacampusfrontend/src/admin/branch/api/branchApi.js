import axios from "axios";
import Swal from "sweetalert2";

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const baseUrt = process.env.REACT_APP_BASE_URL;
const API_BASE_URL = baseUrt + "/Admin/Branch";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

// Şube ekleme
export async function createBranch(data) {
  const validationErrors = {};
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
        validationErrors[field] = error.response.data.errors[field].join(" ");
      });
      throw {
        validationErrors,
      };
    } else if (error.response?.data.message) {
      throw {
        validationErrors: {
          message: error.response.data.message,
        },
      };
    } else {
      throw {
        validationErrors,
        defaultMessage: "Şube eklenemedi.",
      };
    }
  }
}

// Şube güncelleme
export async function updateBranch(typeData) {
  const validationErrors = {};
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Update?id=${typeData.id}`,
      typeData,
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
        validationErrors[field] = error.response.data.errors[field].join(" ");
      });
      throw {
        validationErrors,
      };
    } else if (error.response?.data.message) {
      throw {
        validationErrors: {
          message: error.response.data.message,
        },
      };
    } else {
      throw {
        validationErrors,
        defaultMessage: "Eğitim tipi oluşturulamadı.",
      };
    }
  }
}

// Şube silme
export async function deleteBranch(typeId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/Delete?id=${typeId}`, {
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
      throw new Error(error.response?.data?.title || "Bir hata oluştu.");
    }
  }

// Şubelerin tümünü alma
export async function getAllBranch() {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetAll`, {
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
    throw new Error("Şube bilgileri alınamadı.");
  }
}

// Şubeyi ID'ye göre alma
export async function getBranchById(typeId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetById?id=${typeId}`, {
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
