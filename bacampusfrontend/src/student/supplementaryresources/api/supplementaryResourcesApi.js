import axios from 'axios';
import Swal from 'sweetalert2';
let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}
const baseUrl = process.env.REACT_APP_BASE_URL;
const API_BASE_URL_SUPLEMENTARY = baseUrl+'/Student/SupplementaryResource';


class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

//Tüm yardımcı kaynakları listeleme
export async function listAllSupplementaryResources() {
    try {
      const response = await axios.get(`${API_BASE_URL_SUPLEMENTARY}/ListsAll/${savedData[2]}`, {
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


  export async function downloadFileSupplementaryResource(filePath,supplementaryResourceId){

    const response = await axios.get(`${API_BASE_URL_SUPLEMENTARY}/DownloadDocumentSupplementaryResource?filePath=${filePath}&supplementaryResourceId=${supplementaryResourceId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
      },
      responseType: 'blob',
    });
    if(response.status==200){
  
      return response;
    }
    else if(response.status==404){
      throw new Error("Dosyaya ulaşılamadı");
    } else {
        throw new Error("Bilinmeyen bir hata oluştu");
    }
    
  
  }


  export async function getDocumentsOrVideosByEducationId(
    educationId,
    resourceType
  ) {
    const validationErrors = {};
    try {
      const response = await axios.get(
        `${API_BASE_URL_SUPLEMENTARY}/GetDocumentsOrVideosByEducationId?educationId=${educationId}&resourceType=${resourceType}`,
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
          defaultMessage: "Listelenemedi",
        };
      }
    }
  }

  export async function downloadVideoSupplementaryResource(
    filePath,
    supplementaryResourceId,
    quality
  ) {
    const validationErrors = {};
    try {
      const response = await axios.get(
        `${API_BASE_URL_SUPLEMENTARY}/DownloadVideoSupplementaryResource?filePath=${filePath}&supplementaryResourceId=${supplementaryResourceId}&quality=${quality}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedData[0]}`,
          },
          responseType: "blob",
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
          defaultMessage: "Listelenemedi",
        };
      }
    }
  }
  
  