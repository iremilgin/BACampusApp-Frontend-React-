import axios from 'axios';

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const baseUrl = process.env.REACT_APP_BASE_URL;

const API_BASE_URL_ACCOUNT = baseUrl + '/Account';

const API_BASE_URL_ROLELOG = baseUrl + "/Admin/RoleLog";

const API_BASE_URL_ROLELOG2 = baseUrl + "/RoleLog";


class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

// Giriş yapma
export async function login(data) {
  try {
    const response = await axios.post(`${API_BASE_URL_ACCOUNT}/Login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage for statuses other than 200, 201, ..., and 500
      if (
        status !== 200 &&
        status !== 201 &&
        status !== 202 &&
        status !== 203 &&
        status !== 204 &&
        status !== 205 &&
        status !== 206 &&
        status !== 207 &&
        status !== 210 &&
        status !== 400
      ) {
        throw new RedirectError();
      }
    }
    throw new Error(error.response?.data?.title || 'Giriş yapılamadı.');
  }
}

// Oturumu sonlandırma
export async function logout() {
  try {
    const response = await axios.post(`${API_BASE_URL_ACCOUNT}/Logout`, null, {
      headers: {
        "Content-Type": "application/json",
        
        "Authorization": `Bearer ${savedData[0]}`,
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
    throw new Error(error.response?.data?.title || 'Çıkış yapılamadı.');
  }
}

// RoleLog kayıt
export async function createRoleLog(data) {
    try {
      const response = await axios.post(`${API_BASE_URL_ROLELOG}/Create`, data, {
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
      throw new Error(error.response?.data?.title || 'Kayıt yapılamadı.');
    }
  }
  
    // Son rol log kaydı getirme
  export async function getLastRoleLog(id) {
      try {
        const response = await axios.get(`${API_BASE_URL_ROLELOG2}/GetLastRoleLogByUserId?id=${id}`, {
          headers: {
            'Content-Type': 'application/json',
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
          throw new Error(error.response?.data?.title || 'Log kaydı alınamadı.');
      }
    }