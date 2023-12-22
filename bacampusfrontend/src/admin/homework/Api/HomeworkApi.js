import axios from "axios";


const baseUrl=process.env.REACT_APP_BASE_URL;
const API_BASE_URL = baseUrl+"/Admin/HomeWork";
const API_BASE_URL_STUDENTHOMEWORK = baseUrl+"/Admin/StudentHomework";
const API_BASE_URL_STUDENT = baseUrl+"/Admin/Student";


class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}


let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

//Ödevi ID'ye Göre Alma
export async function getHomeworkById(homeworkId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/GetById?guid=${homeworkId}`,
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

// Tüm ödevleri getir
export async function getHomeworkList() {
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
    throw new Error(
      error.response?.data?.message || "Veriler alınırken hata oluştu"
    );
  }
}

// Ödev Güncelleme
export async function updateHomework(updateHomeworkData) {
  const errorMessages = {};
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Update?guid=${updateHomeworkData.id}`,
      updateHomeworkData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${savedData[0]}`,
        },
        data: updateHomeworkData,
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
        errorMessages[field] = error.response.data.errors[field].join("\n");
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
        defaultMessage: "Ödev güncelleme işlemi gerçekleştirilemedi.",
      };
    }
  }
}

//Ödeve Belge Eklenmişse Silme

export async function permanentlyDeleteHomework(deleteHomeworkData) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/PermanentlyDocumentDelete?id=${deleteHomeworkData.homeworkId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedData[0]}`,
        },
        data: deleteHomeworkData,
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }
    throw new Error(error.response?.data?.message || "Ödev silinemedi.");
  }
}

//Ödeve Belge Eklenmemişse Silme

export async function deleteHomework(homeworkId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Delete?id=${homeworkId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
    throw new Error(error.response?.data?.message || "Ödev silinemedi.");
  }
}

// Ödev Oluşturma

export async function createHomework(data) {
  const errorMessages = {};
  try {
    const response = await axios.post(`${API_BASE_URL}/Create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
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
        errorMessages[field] = error.response.data.errors[field].join("\n");
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
        defaultMessage: "Ödev eklenemedi.",
      };
    }
  }
}

// Ödev eklentisinin indirilmesi

export async function downloadFileHomework(filePath, homeworkId) {
  const response = await axios.get(
    `${API_BASE_URL}/DownloadDocumentHomework?filePath=${filePath}&homeworkId=${homeworkId}`,
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

// Öğrencinin eklediği ödevin dosyasının indirilmesi

export async function downloadFileStudentHomework(filePath, studentHomeworkId) {
  const response = await axios.get(
    `${API_BASE_URL_STUDENTHOMEWORK}/DownloadDocumentStudentHomework?filePath=${filePath}&studentHomeworkId=${studentHomeworkId}`,
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

// Seçili Ödeve ait atanmı öğrenciler Listesini getir

export async function getStudentListByHomeworkId(homeworkId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL_STUDENTHOMEWORK}/StudentsByHomeworkId?id=${homeworkId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
    console.log(response.data.data)
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
      error.response?.data?.message ||
        "Bu ödeve atanmış öğrenci bilgileri alınamadı"
    );
  }
}

//Tüm StudentHomework listesini getirir

export async function getAllStudentHomework() {
  try {
    const response = await axios.get(`${API_BASE_URL_STUDENTHOMEWORK}/GetAll`, {
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
      error.response?.data?.message ||
        "Bu ödeve atanmış öğrenci bilgileri alınamadı"
    );
  }
}

export async function studentHomeworkCreate(data) {
  const errorMessages = {};
  try {
    const response = await axios.post(
      `${API_BASE_URL_STUDENTHOMEWORK}/Create`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
    return response;
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
        errorMessages[field] = error.response.data.errors[field].join("\n");
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
        defaultMessage: "Ödev oluşturulamadı.",
      };
    }
  }
}

//StudentHomework ID'ye Göre Alma
export async function getStudentHomeworkById(studentHomeworkId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL_STUDENTHOMEWORK}/GetById?id=${studentHomeworkId}`,
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
      error.response?.data?.message || "Atama bilgileri alınamadı"
    );
  }
}
//Öğrenciye ödev puanlaması yapma
export async function givePoint(formdata) {
  try {
    const response = await axios.post(
      `${API_BASE_URL_STUDENTHOMEWORK}/GivePoint`,
      formdata,
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
    throw new Error(error.response?.data?.message || "Puan verilemedi");
  }
}

//Ödeve geri bildirim ekleme
export async function giveFeedback(formdata) {
  try {
    const response = await axios.put(
      `${API_BASE_URL_STUDENTHOMEWORK}/GiveFeedback`,
      formdata,
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
      error.response?.data?.message || "Geri bildirim eklenemedi"
    );
  }
}

//Student ID'ye Göre Alma
export async function getStudentById(studentId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL_STUDENT}/GetById?id=${studentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Atama bilgileri alınamadı"
    );
  }
}

