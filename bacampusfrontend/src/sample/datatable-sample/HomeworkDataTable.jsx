import React, { useState, useEffect } from "react";
import DataTable from "../../shared/data-table/DataTable";
import { useNavigate } from "react-router-dom";
import { HomeworkList,deleteHomework } from "./datatablehomeworkapi"; 


//Yetkilendirme
let savedData = sessionStorage.getItem("savedData");
let role;

if (savedData != null) {
  savedData = savedData.split(",");
  role = savedData[1];
}

//Tarih formatı
function formatDate(dateString) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  }

export const HomeworkDataTable = () => {
  const [data, setData] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const navigate = useNavigate();
  

//Tablo verilerinini yönetimi
  const columns = [
    {
      Header: "Adı",
      accessor: "title",
    },
    {
      Header: "Yönergeler",
      accessor: "intructions",
    },
    {
        Header: "Örnek File",
        accessor: "referansFile",
        Cell: ({ value }) => (value !=null ? "Dosya Görüntüle" : "Yok"),
    },
    {
        Header: "Başlangıç Tarihi",
        accessor: "startDate",
        Cell: ({ value }) => formatDate(value),
    },
    {
        Header: "Bitiş Tarihi",
        accessor: "endDate",
        Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Geç Teslim İzni",
      accessor: "isLateTurnedIn",
      Cell: ({ value }) => (value ? "Var" : "Yok"),
    },
    {
        Header: "Puanlı mı?",
        accessor: "isHasPoint",
        Cell: ({ value }) => (value ? "Evet" : "Hayır"),
      },
    
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div>
         
          <button onClick={() => handleEdit(row.original.id)}>Düzenle</button>
          <button onClick={() => handleDelete(row.original.id)} >Sil</button>
          <button onClick={() => handleDetail(row.original.id)} >Detay</button>
        </div>
      ),
    },
  ];
  

  //Update İşlemi
  const handleEdit = (id) => {
    console.log(`Düzenleme için ID: ${id}`);
    navigate(`../homeworkupdate/${id}`);
  };
  //Delete İşlemi
  const handleDelete = async(id) => {
    console.log(`Silme için ID: ${id}`);

   
  };

  //Detail İşlemi
  const handleDetail = (id) => {
    console.log(`Detayiçin ID: ${id}`);
    navigate(`../homeworkdetail/${id}`);
  };




  //api.js'den gelen dataların aktarımı
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await HomeworkList(); 
        setData(result);
      } catch (error) {
        console.error("Error fetching trainer list:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Homework DataTable Örneği</h1>
      {Array.isArray(data) && data.length > 0 ? (
        <DataTable columns={columns} data={data} handleEdit={handleEdit} handleDelete={handleDelete} handleDetail ={handleDetail} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz.</p>
      )}
    </div>
  );
};

export default HomeworkDataTable;
