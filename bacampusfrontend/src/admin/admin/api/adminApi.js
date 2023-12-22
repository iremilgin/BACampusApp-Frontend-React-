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


// Tüm yöneticileri getir
export async function getAllAdmins() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Admin/Admin/GetAll`, {
      headers: {
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
    throw new Error(error.response?.data?.title || 'Yöneticiler alınamadı.');
  }
}

// Yöneticiyi sil
export async function deleteAdmin(adminId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Admin/Admin/Delete?id=${adminId}`, {
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
    throw new Error(error.response?.data?.title || 'Yönetici silinemedi.');
  }
}

// Yöneticiyi ID'ye göre alma
export async function getAdminById(adminId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/Admin/Admin/GetById?id=${adminId}`, {
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
      throw new Error(error.response?.data?.title || 'Yönetici bilgileri alınamadı.');
    }
}

// Yönetici oluşturma
export async function createAdmin(data) {
  const errorMessages = {};
    try {
      const response = await axios.post(`${API_BASE_URL}/Admin/Admin/Create`, data, {
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
          errorMessages[field] = error.response.data.errors[field].join(" ");
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
          defaultMessage: "Admin oluşturulamadı.",
        };
      }
    }
  }

// Yönetici güncelleme
export async function updateAdmin(adminId, data) {
  const errorMessages = {};
    try {
      const response = await axios.put(`${API_BASE_URL}/Admin/Admin/Update?id=${adminId}`, data, {
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
          errorMessages[field] = error.response.data.errors[field].join(" ");
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
          defaultMessage: "Admin güncellenemedi.",
        };
      }
    }
  }


//IdentityId ye göre admin getirir
export async function getByIdentityIdAdmin(IdentityId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/Admin/Admin/GetByIdentityId?identityId=${IdentityId}`, {
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
    throw new Error(error.response?.data?.title || 'Admin bilgileri alınamadı.');
  }
}

