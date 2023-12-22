import axios from "axios";
import Swal from "sweetalert2";

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}
export async function createSubCategory(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/Admin/SubCategory/Create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }

    if (error.response && error.response.data && error.response.data.errors) {
      // Eğer API'den doğrulama hataları gelirse bu hatalar burada işlenecek. ??
      const validationErrors = error.response.data.errors;
      throw validationErrors;
    } else {
      // Diğer hatalar için bu gönderilecek.
      throw new Error(error.response?.data?.message);
    }
  }
}

export async function listAllSubCategory() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Admin/SubCategory/ListAll`, {
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
}

export async function deleteSubCategory(subcategoryId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Admin/SubCategory/Delete?id=${subcategoryId}`,
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

export async function updateSubCategories(subCategoryId, data) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Admin/SubCategory/Update?id=${subCategoryId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
   return {
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }

    if (error.response && error.response.data && error.response.data.errors) {
      // Eğer API'den doğrulama hataları gelirse bu hatalar burada işlenecek. ??
      const validationErrors = error.response.data.errors;
      throw validationErrors;
    } else {
      // Diğer hatalar için bu gönderilecek.
      throw new Error(error.response?.data?.message || "Bir hata oluştu!");
    }
  }
}


