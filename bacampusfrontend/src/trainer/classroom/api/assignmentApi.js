import axios from 'axios';

let savedData = sessionStorage.getItem("savedData");

if (savedData != null) {
  savedData = savedData.split(",");
}

const BASE_URL = 'https://localhost:7247/api/Trainer/ClassroomTrainers';

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}
// Belirli bir eğitmene ait olan sınıfları getirir
export const getClassroomTrainers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/ClassroomsByTrainerId?id=${savedData[2]}`, {
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
    throw error;
  }
};

// ---- STUDENT -----

const BASE_URL_CS = 'https://localhost:7247/api/Trainer/ClassroomStudent';

// Sınıfın öğrencilerini getiren API isteği
export const getClassroomStudents = async (classroomId) => {
  try {
    const response = await axios.get(
      `${BASE_URL_CS}/StudentsByClassroomId?id=${classroomId}`,
      {
        headers: {
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
    throw error;
  }
};
