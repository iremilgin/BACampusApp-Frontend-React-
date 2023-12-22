import axios from "axios";

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}
const baseUrl=process.env.REACT_APP_BASE_URL;
const BASE_URL = baseUrl+"/Admin/ClassroomTrainers";

const BASE_URL_CLASSROOMSTUDENT =baseUrl +"/Admin/ClassroomStudent";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

export const updateClassroomStudent = async (data) => {
  try {
    const url = `${BASE_URL_CLASSROOMSTUDENT}/${data.id}`;
    const updateData = {
      // Replace this with the actual update data
      ...data,
    };

    const response = await axios.put(
      url,
      updateData,
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
    throw error;
  }
};

export const GetByIdForClassRoomStudent = async (updateClassroomStudentId) => {
  try {
    const response = await axios.get(`${BASE_URL_CLASSROOMSTUDENT}/GetById?id=${updateClassroomStudentId}`, {
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
    throw error;
  }
};


export const getAllClassroomStudents = async () => {
  try {
    const response = await axios.get(`${BASE_URL_CLASSROOMSTUDENT}/GetAll`, {
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
    throw error;
  }
};
// Eğitmenlerin sınıfa atanmış halini getiren API isteği
export const getClassroomTrainers = async (classroomId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/TrainersByClassroomId?id=${classroomId}`,
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

// Sınıfa atanmamış eğitmenleri getiren API isteği
export const getClasslessTrainers = async (classroomId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/ClasslessTrainerList?id=${classroomId}`,
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

// Tüm eğitmenleri getiren API isteği
export const getAll = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/GetAll`, {
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
    throw error;
  }
};

// Eğitmeni sınıfa ekleyen API isteği
export const addToClassroom = async (
  classroomId,
  trainerId,
  startDate,
  endDate
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Create`,
      {
        classroomId,
        trainerId,
        startDate,
        endDate: endDate === "\\" ? "" : endDate,
      },
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
    throw error;
  }
};

// Eğitmenin sınıf atamasını güncelleyen API isteği
// export const updateClassroomAssignment = async (updateClassroomTrainerId, startDate, endDate) => {
//   try {
//     const response = await axios.put(
//       `${BASE_URL}/Update?id=${updateClassroomTrainerId}`,
//       {
//         startDate: startDate,
//         endDate: endDate,
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${savedData[0]}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// Eğitmeni sınıftan çıkaran API isteği
export const removeTrainerFromClassroom = async (classroomTrainerId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/Delete?id=${classroomTrainerId}`,
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
    throw error;
  }
};

export const GetByIdForTrainer = async (classroomTrainerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/GetById?id=${classroomTrainerId}`, {
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
    throw error;
  }
};

// ---- STUDENT -----



// Sınıfın öğrencilerini getiren API isteği
export const getClassroomStudents = async (classroomId) => {
  try {
    const response = await axios.get(
      `${BASE_URL_CLASSROOMSTUDENT}/StudentsByClassroomId?id=${classroomId}`,
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

// Sınıfa atanmamış öğrencileri getiren API isteği
export const getClasslessStudents = async (classroomId) => {
  try {
    const response = await axios.get(
      `${BASE_URL_CLASSROOMSTUDENT}/ClasslessStudentList?id=${classroomId}`,
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

// Diğer API işlevlerini burada tanımlayabilirsiniz...

// Öğrenciyi sınıfa ekleyen API isteği
export const addToClassroomStudent = async (
  classroomId,
  studentId,
  startDate,
  endDate
) => {
  try {
    const response = await axios.post(
      `${BASE_URL_CLASSROOMSTUDENT}/Create`,
      {
        classroomId,
        studentId,
        startDate,
        endDate,
      },
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
    throw error;
  }
};

// Öğrencinin sınıf atamasını güncelleyen API isteği
export const updateClassroomAssignment = async (
  updateData
) => {
  try {
    const response = await axios.put(
      `${BASE_URL_CLASSROOMSTUDENT}/Update?id=${updateData.id}`,
     updateData,
      {
        headers: {
          Authorization: `Bearer ${savedData[0]}`,
        },
        data:updateData,
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
    throw error;
  }
};

// Öğrenciyi sınıftan çıkaran API isteği
export const removeStudentFromClassroom = async (classroomStudentId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL_CLASSROOMSTUDENT}/Delete?id=${classroomStudentId}`,
      {
        headers: {
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
    return response.data;
  } catch (error) {  if (error.response) {
    const status = error.response.status;
    // Redirect to ErrorPage 200 ve 400 hariç 
    if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
      throw new RedirectError();
    }
  }
    throw error;
  }
};

// Tüm öğrencileri getiren API isteği
export const getAllForStudent = async () => {
  try {
    const response = await axios.get(`${BASE_URL_CLASSROOMSTUDENT}/GetAll`, {
      headers: {
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    return response.data.data;
  } catch (error) {  if (error.response) {
    const status = error.response.status;
    // Redirect to ErrorPage 200 ve 400 hariç 
    if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
      throw new RedirectError();
    }
  }
    throw error;
  }
};

//Sınıftaki öğrenciyi getiren API isteği
export const GetByIdForStudent = async (classroomStudentId) => {
  try {
    const response = await axios.get(`${BASE_URL_CLASSROOMSTUDENT}/GetById?id=${classroomStudentId}`, {
      headers: {
        Authorization: `Bearer ${savedData[0]}`,
      },
    });
    return response.data.data;
  } catch (error) {  if (error.response) {
    const status = error.response.status;
    // Redirect to ErrorPage 200 ve 400 hariç 
    if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
      throw new RedirectError();
    }
  }
    throw error;
  }
};
