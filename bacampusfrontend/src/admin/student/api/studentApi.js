import axios from "axios";
import Swal from 'sweetalert2';

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const baseUrl = process.env.REACT_APP_BASE_URL;
const API_BASE_URL = baseUrl + "/Admin/Student";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

export async function createStudent(data) {
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
        defaultMessage: "Öğrenci oluşturulamadı.",
      };
    }
  }
}

export async function deleteStudent(studentId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Delete?id=${studentId}`,
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

export async function getAllStudents() {
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

    throw new Error(error.response?.data?.title || "Öğrenciler listelenemedi.");
  }
}

export async function getStudentById(studentId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/GetById?id=${studentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
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
      error.response?.data?.title || "Student bilgileri alınamadı."
    );
  }
}

export async function updateStudent(studentId, data) {
  const errorMessages = {};
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Update?id=${studentId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${savedData[0]}`,
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
    } 
    else if(error.response?.data.message){
      throw{
        errorMessages: { message: error.response.data.message },

      };
    }
    else {
      throw {
        errorMessages,
        defaultMessage: "Öğrenci güncellenemedi.",
      };
    }
  }
}
