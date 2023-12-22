import axios from "axios";

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

export const getClassroomsByStudentId = async (Id) => {
  const validationErrors = {};
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Student/ClassroomStudent/AllClassroomsByStudentId?id=${savedData[2]}`,
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
        defaultMessage: "Bir hata oluştu.",
      };
    }
  }
};

export async function getStudentsByClassroomId(classroomId){
  const validationErrors = {};
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Student/ClassroomStudent/StudentsByClassroomId?id=${classroomId}`,
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
        defaultMessage: "Bir hata oluştu.",
      };
    }
  }
};

export async function getTrainersByClassroomIdAsync(id){
  const validationErrors = {};
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Student/ClassroomTrainers/TrainersByClassroomId?id=${id}`,
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
        defaultMessage: "Bir hata oluştu.",
      };
    }
  }
};


export async function getDetailsByStudentId(studentId) {
  const validationErrors = {};
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Student/Student/GetDetailsByStudentId?studentId=${studentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedData[0]}`,
        },
      }
    );
    return response.data;
  } catch (error) {
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
        defaultMessage: "Bir hata oluştu.",
      };
    }
  }
};
