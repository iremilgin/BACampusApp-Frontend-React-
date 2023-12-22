import axios from 'axios';

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}
const baseUrt=process.env.REACT_APP_BASE_URL;
const API_BASE_URL = baseUrt+"/Admin/Classroom";

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

// Sınıf oluşturma
export async function createClassroom(data) {
  const errorMessages = {};
  try {
    const response = await axios.post(`${API_BASE_URL}/Create`, data, {
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
        errorMessages[field] = error.response.data.errors[field].join(", ");
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
        defaultMessage: "Grup oluşturulamadı.",
      };
    }
  }
}


// Sınıf silme
export async function deleteClassroom(classroomId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Delete?id=${classroomId}`, {
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
 
    throw new Error(error.response?.data?.title || 'Bir hata oluştu.');
  }
}

// Sınıf güncelleme
export async function updateClassroom(id,data) {
  const errorMessages = {};
  try {
    const response = await axios.put(`${API_BASE_URL}/Update?id=${id}`, data, {
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
        errorMessages[field] = error.response.data.errors[field].join(", ");
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
        defaultMessage: "Grup güncellenemedi.",
      };
    }
  }
}

// Sınıfı ID'ye göre alma
export async function getClassroomById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetById?id=${id}`, {
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

    throw new Error('Sınıf bilgileri alınamadı.');
  }
}

// Sınıfı educationID'ye göre alma
export async function GetActiveClassroomsByEducationId(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetActiveClassroomsByEducationId?id=${id}`, {
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

    throw new Error('Sınıf bilgileri alınamadı.');
  }
}

// Tüm sınıfları getir
export async function getClassrooms() {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetAll`, {
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

    throw new Error('Veriler alınırken hata oluştu');
  }
}

export async function getBranchById(id) {
  try {
    const response = await axios.get(`https://localhost:7247/api/Admin/Branch/GetById?id=${id}`, {
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

    throw new Error('Sınıf bilgileri alınamadı.');
  }
}

export async function getAllBranchBy() {
  try {
    const response = await axios.get(`https://localhost:7247/api/Admin/Branch/GetAll`, {
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

    throw new Error('Sınıf bilgileri alınamadı.');
  }
}


export async function getTrainingTypeById(id) {
  try {
    const response = await axios.get(`https://localhost:7247/api/Admin/TrainingType/GetById?id=${id}`, {
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

    throw new Error('Sınıf bilgileri alınamadı.');
  }
}

export async function getAllTrainingType() {
  try {
    const response = await axios.get(`https://localhost:7247/api/Admin/TrainingType/GetAll`, {
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

    throw new Error('Sınıf bilgileri alınamadı.');
  }
}


export async function getGroupTypeById(id) {
  try {
    const response = await axios.get(`https://localhost:7247/api/Admin/GroupType/GetById?id=${id}`, {
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

    throw new Error('Grup bilgileri alınamadı.');
  }
}

export async function getAllGroupTypeBy() {
  try {
    const response = await axios.get(`https://localhost:7247/api/Admin/GroupType/GetAll`, {
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

    throw new Error('Grup bilgileri alınamadı.');
  }
}

export async function getTrainersByClassroomId(classroomId) {
  try {
    const response = await axios.get(`https://localhost:7247/api/Admin/ClassroomTrainers/TrainersByClassroomId?id=${classroomId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
      },
    });

    if (response.data.isSuccess) {
      return {
        data: response.data.data,
        message: response.data.message,
      };
    } else {
      throw new Error(response.data.message || 'An error occurred while fetching data.');
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }

    throw new Error('An error occurred while fetching data.');
  }
}

export async function getStudentsByClassroomId(classroomId) {
  try {
    const response = await axios.get(`https://localhost:7247/api/Admin/ClassroomStudent/StudentsByClassroomId?id=${classroomId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedData[0]}`,
      },
    });

    if (response.data.isSuccess) {
      return {
        data: response.data.data,
        message: response.data.message,
      };
    } else {
      throw new Error(response.data.message || 'An error occurred while fetching data.');
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      // Redirect to ErrorPage 200 ve 400 hariç 
      if (status !== 200 && status !== 201 && status !==202 && status !== 203 && status !== 204 && status !== 205 && status !== 206 && status !== 207 && status !== 210 && status !== 400) {
        throw new RedirectError();
      }
    }

    throw new Error('An error occurred while fetching data.');
  }
}
