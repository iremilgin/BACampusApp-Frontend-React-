import axios from "axios";
import Swal from "sweetalert2";

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const baseUrt=process.env.REACT_APP_BASE_URL;
const API_BASE_URL = baseUrt+"/Admin/Category";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
} 

// Kategory silme
export async function deleteCategory(categoryId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Delete?id=${categoryId}`,
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
export async function createCategory(data) {
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
      defaultMessage: "Kategori eklenemedi.",
    };
  }
}
}

   

// subCategory ekleme işlemi için kullanılıyor Base_url değişecek
export async function createSubCategory(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/Create`, data, {
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

    if (error.response && error.response.data && error.response.data.errors) {
      // Eğer API'den doğrulama hataları gelirse bu hatalar burada işlenecek. ??
      const validationErrors = error.response.data.errors;
      throw validationErrors;
    } else {
      // Diğer hatalar için bu gönderilecek.
      throw new Error(error.response?.data?.title || "Bir hata oluştu!");
    }
  }
}

export async function updateCategorys(categoryId, data) {
  const validationErrors = {};
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Update?id=${categoryId}`,
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

    const errorMessages = {};
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
        defaultMessage: "Kategori Güncellenemedi.",
      };
    }
  }
}
export async function getCategoryById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetById?id=${id}`, {
      headers: {
        // "Content-Type": "application/json",
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
    throw new Error("Kategori bilgileri alınamadı.");
  }
}

export async function listAllCategory(){
  try{
    const response = await axios.get(`${API_BASE_URL}/ListAll`,{
      headers:{
        'Authorization' : `Bearer ${savedData[0]}`
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

export async function listByParentId(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/ListByParentId?parentCategoryId=${id}`,
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
    throw new Error(error.response?.data?.title || "Bir hata oluştu.");
  }
}
