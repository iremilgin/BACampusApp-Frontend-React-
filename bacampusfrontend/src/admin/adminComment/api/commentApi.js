import axios from 'axios';

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const API_BASE_URL = 'https://localhost:7247/api/Admin/Comment';

// Yorum oluşturma
export async function createComment(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/Create`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.title || 'Bir hata oluştu.');
  }
}

// Yorum güncelleme
export async function updateComment(commentData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/Update?id=${commentData.id}`, commentData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.title || 'Bir hata oluştu.');
  }
}

// Sınıfı ID'ye göre alma
export async function getCommentById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetById?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Sınıf bilgileri alınamadı.');
  }
}
