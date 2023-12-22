import React, { useState, useEffect } from "react";
import DataTable from "../../shared/data-table/DataTable";
import { useNavigate } from "react-router-dom";
import { TrainerList, deleteTrainer } from "./datatableapi"; 
import { DeleteItem } from "../../shared/delete-alerts/DeleteAlert";

//Yetkilendirme
let savedData = sessionStorage.getItem("savedData");
let role;

if (savedData != null) {
  savedData = savedData.split(",");
  role = savedData[1];
}

export const TrainerDataTable = () => {
  const [data, setData] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const navigate = useNavigate();

//Tablo verilerinini yönetimi
  const columns = [
    {
      Header: "Ad",
      accessor: "firstName",
    },
    {
      Header: "Soyad",
      accessor: "lastName",
    },
    {
      Header: "Aktiflik",
      accessor: "isActive",
      Cell: ({ value }) => (value ? "Aktif" : "Pasif"),
    },
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div>
          <button onClick={() => handleEdit(row.original.id)}>Düzenle</button>
          <button onClick={() => handleDelete(row.original.id)} >Sil</button>
        </div>
      ),
    },
  ];

  //Update İşlemi
  const handleEdit = (id) => {
    console.log(`Düzenleme için ID: ${id}`);
    navigate(`../trainerupdate/${id}`);
  };


  //Delete İşlemi
  const handleDelete = async (id) => {
    const isSuccess = await DeleteItem(
      id,
      deleteTrainer // apiden gelen silme fonksiyonu
     
    );
  
    if (isSuccess) {
      // Başarılı silme işlemi
      setTrainers(trainers.filter((trainer) => trainer.id !== id));
      navigate('/trainer');
    }

  };
  //api.js'den gelen dataların aktarımı
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await TrainerList(); 
        setData(result);
      } catch (error) {
        console.error("Error fetching trainer list:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Trainer DataTable Örneği</h1>
      {Array.isArray(data) && data.length > 0 ? (
        <DataTable columns={columns} data={data} handleEdit={handleEdit} handleDelete={handleDelete} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz.</p>
      )}
    </div>
  );
};

export default TrainerDataTable;
