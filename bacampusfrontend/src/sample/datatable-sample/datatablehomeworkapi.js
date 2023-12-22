import axios from 'axios';
import Swal from 'sweetalert2'
let savedData = sessionStorage.getItem('savedData');
if (savedData != null) {
  savedData = savedData.split(',');
}
const API_BASE_URL = 'https://localhost:7247/api/Admin/Homework';
//Ödev Listesi
export async function HomeworkList() {
    try {
        const response = await axios.get(`${API_BASE_URL}/ListAll`, {
          headers: {
            'Authorization': `Bearer ${savedData[0]}`,
          },
        });
        const responseData = response.data.data;
        return responseData;
      } catch (error) {
        // throw new Error(error.response?.data?.title || 'Bir hata oluştu.');
      }
}

//Ödev Silme

export async function deleteHomework(deleteHomeworkData) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Delete?id=${deleteHomeworkData.homeworkId}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${savedData[0]}`,
      },
      data:deleteHomeworkData
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.title || 'Bir hata oluştu.');
  }
  
}





















