import axios from 'axios';
import Swal from 'sweetalert2'

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

const API_BASE_URL ='https://localhost:7247/api/Trainer/EducationSubject';

class RedirectError extends Error {
  constructor() {
    super('RedirectError');
    this.name = 'RedirectError';
  }
}

export async function ListByEducationtId(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/ListByEducationtId?educationId=${id}`, {
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
      const errorMessage = error.response?.data?.message ;
      console.error(errorMessage);
      throw error;
    }
  }

  export async function getEducationSubjectById(id){
    try {
      const response = await axios.get(`${API_BASE_URL}/GetById?Id=${id}`,{
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
      const errorMessage = error.response?.data?.message ;
      console.error(errorMessage);
      throw error;
    }
  }
