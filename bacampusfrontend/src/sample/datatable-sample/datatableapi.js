// datatableapi.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
const API_BASE_URL = 'https://localhost:7247/api/Admin/Trainer';

let savedData = sessionStorage.getItem("savedData");
if (savedData != null) {
  savedData = savedData.split(",");
}

//Eğitmen Listesi
export async function TrainerList() {
    try {
        const response = await axios.get(`${API_BASE_URL}/ListsAll`, {
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

// Eğitmen silme
export async function deleteTrainer(trainerId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Delete?id=${trainerId}`, {
      headers: {
        'Authorization': `Bearer ${savedData[0]}`,
      },
    });
    console.log(response.data);
    return response.data;
   
  } catch (error) {
      // Axios ile gelen hatayı işle
      const errorMessage = error.response?.data?.message || 'Bir hata oluştu. ';
      console.error(errorMessage);
  
      // Swal.fire() backend tarafından gelen hata mesajını göster
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage
      });
  
      throw error;
  }
}

