import axios from "axios";
import { Item } from "semantic-ui-react";
import Swal from "sweetalert2";
let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const baseUrl = process.env.REACT_APP_BASE_URL;
const API_BASE_URL_SUPLEMENTARY = baseUrl + "/Trainer/SupplementaryResource";
const API_BASE_URL_SUPLEMENTARYTAGS =
  baseUrl + "/Trainer/SupplementaryResourceTag";
const API_BASE_URL_SUPLEMENTARYEDUCATIONSUBJECTS =baseUrl+"/Trainer/SupplementaryResourceEducationSubject";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

//Konu oluşturma
export async function listAllSupplementaryResourceBySubjectId(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL_SUPLEMENTARY}/ListsAllBySubjectId?subjectId=${id}`,
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
    // Axios ile gelen hatayı işle
    const errorMessage = error.response?.data?.message || "Bir hata oluştu. ";
    console.error(errorMessage);
  }
}

export async function downloadFileSupplementaryResource(
  filePath,
  supplementaryResourceId
) {
  const response = await axios.get(
    `${API_BASE_URL_SUPLEMENTARY}/DownloadDocumentSupplementaryResource?filePath=${filePath}&supplementaryResourceId=${supplementaryResourceId}`,
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
//Tüm yardımcı kaynakları listeleme
export async function listAllSupplementaryResources() {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPLEMENTARY}/ListsAll`, {
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


export async function listAllSupplementaryResourcesByResourceTypeStatus(status) {
  try {
    const response = await axios.get(`${API_BASE_URL_SUPLEMENTARY}/ListsAllForResourceTypeStatus?status=${status}`, {
      headers: {
        "Content-Type":"aplication/jason",
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

//Yardımcı kaynakların etiketleri
export async function listAllSupplementaryResourcesTags() {
  try {
    const response = await axios.get(
      `${API_BASE_URL_SUPLEMENTARYTAGS}/GetAll`,
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
//Seçilen tag'e göre yardımcı kaynakları listele
export async function listAllSupplementaryResourceByTag(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL_SUPLEMENTARY}/ListsAllByTagId?tagId=${id}`,
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
    // Axios ile gelen hatayı işle
    const errorMessage = error.response?.data?.message || "Bir hata oluştu. ";
    console.error(errorMessage);
  }
}

export async function createSupplemantaryResource(data) {
  const validationErrors = {};
  try {
    const response = await axios.post(
      `${API_BASE_URL_SUPLEMENTARY}/Create`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
        defaultMessage: "Kaynak oluşturulamadı.",
      };
    }
  }
}

export async function deleteSupplementaryResource(supplementaryResource) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL_SUPLEMENTARY}/PermanentlyDocumentDelete`,
      {
        data: supplementaryResource,
        headers: {
          "Content-Type": "multipart/form-data",
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

// kaynak güncelleme
export async function updateResources(resourceData) {
  const validationErrors = {};
  try {
    const response = await axios.put(
      `${API_BASE_URL_SUPLEMENTARY}/Update?id=${resourceData.id}`,
      resourceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
        defaultMessage: "Kaynak güncellenemedi.",
      };
    }
  }
}

// Konu ID'ye göre alma
export async function getResourceById(id) {
  const validationErrors = {};
  try {
    const response = await axios.get(
      `${API_BASE_URL_SUPLEMENTARY}/GetById?id=${id}`,
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
        defaultMessage: "Veriler alınırken hata oluştu",
      };
    }
  }
}

export async function getDeletedResources() {
  const response = await axios.get(
    `${API_BASE_URL_SUPLEMENTARY}/DeletedResources`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${savedData[0]}`,
      },
      responseType: "json",
    }
  ); 
  if (response.status == 200) {
    return response.data;
  } else if (response.status == 404) {
    throw new Error("Dosyaya ulaşılamadı");
  } else {
    throw new Error("Bilinmeyen bir hata oluştu");
  }
}



export async function listAllSupplementaryResourcesEducationSubjects() {
  try {
    const response = await axios.get(
      `${API_BASE_URL_SUPLEMENTARYEDUCATIONSUBJECTS}/GetAll`,
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