import axios from 'axios';
import Swal from 'sweetalert2'

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const baseUrl = process.env.REACT_APP_BASE_URL;
const API_BASE_URL = baseUrl + "/Admin/Subject";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

//Konu oluşturma
export async function listAllSubject() {
  try {
    const response = await axios.get(`${API_BASE_URL}/ListAll`, {
      headers: {
        'Authorization': `Bearer ${savedData[0]}`,
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

//Konu oluşturma
export async function createSubject(data) {
  const validationErrors = {};
  try {
    const response = await axios.post(`${API_BASE_URL}/Create`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
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
    } else if(error.response?.data.message){
      throw{
        validationErrors: { 
          message: error.response.data.message 
        },
      };
    } else {
      throw {
        validationErrors,
        defaultMessage: "Admin oluşturulamadı.",
      };
    }
  }
}


// Konu silme
export async function deleteSubject(subjectId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Delete?id=${subjectId}`, {
      headers: {
        'Authorization': `Bearer ${savedData[0]}`,
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

// Konu güncelleme
export async function updateSubjects(subjectData) {
  const validationErrors = {};
  try {
    const response = await axios.put(`${API_BASE_URL}/Update?id=${subjectData.id}`, subjectData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
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
    } else if(error.response?.data.message){
      throw{
        validationErrors: { 
          message: error.response.data.message 
        },
      };
    } else {
      throw {
        validationErrors,
        defaultMessage: "Admin oluşturulamadı.",
      };
    }
  }
}
// Konu ID'ye göre alma
export async function getSubjectById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetById?guid=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
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
export async function getAllSubject() {
  try {
    const response = await axios.get(`${API_BASE_URL}/ListAll`, {
      headers: {
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.title || "Konular alınamadı.");
  }
}