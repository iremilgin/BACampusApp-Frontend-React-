import axios from 'axios';


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

export async function getHomeworkById(homeworkId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Student/HomeWork/GetById?guid=${homeworkId}`,
      {
        headers: {
          "Content-Type": "application/json",
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
    throw new Error(
      error.response?.data?.message || "Ödev bilgileri alınamadı"
    );
  }
}

export async function getStudentHomeworkByStudentId() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Student/HomeWork/ListAssignments/${savedData[2]}`, {
      headers: {
        'Content-Type': 'application/json', 
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
    console.error('Hata detayları:', error);
    throw new Error('Öğrenci ödev bilgileri alınamadı');
  }
}

export async function updateStudentHomework(updateStudentHomeworkData) {
  const validationErrors = {};
  try {
    const response = await axios.put(`${API_BASE_URL}/Student/StudentHomework/StudentUpdate`, updateStudentHomeworkData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
        defaultMessage: "Bir hata oluştu.",
      };
    }
  }
}

export async function getStudentHomeworkId(studentId, homeworkId) {
  
  try {
    const response = await axios.get(`${API_BASE_URL}/Student/StudentHomework/GetStudentHomework?studentId=${studentId}&homeworkId=${homeworkId}`, {
      headers: {
        "Content-Type": "application/json",
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
    throw new Error(error.response?.data?.message || 'Yanıt Ekleme işlemi gerçekleşmedi.');
  }
}

export async function downloadFileHomework(filePath, homeworkId) {
  const response = await axios.get(
    `${API_BASE_URL}/Student/StudentHomework/DownloadDocumentHomework?filePath=${filePath}&homeworkId=${homeworkId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${savedData[0]}`,
      },
      responseType: "blob",
    }
  );
  if (response.status == 200) {
    return response;
  } else if (response.status == 404) {
    throw new Error("Dosyaya ulaşılamadı");
  } else {
    throw new Error("Bilinmeyen bir hata oluştu");
  }
}


