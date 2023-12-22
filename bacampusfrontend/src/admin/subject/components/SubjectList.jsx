import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import "../scss/subject-list.scss"; 
import { useNavigate, useParams } from "react-router-dom";
import { deleteSubject, listAllSubject } from "../api/subjectApi";
import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import { BsGear , BsTrash ,BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";



function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [deleteResponse, setDeleteResponse] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listAllSubject()
      .then((data) => {
        setSubjects(data.data);
      })
      .catch((error) => { 
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

const handleUpdate = (id) => {
  console.log(id, "update id'si");
  navigate(`./subjectupdate/${id}`)
}
const handleCreate = () =>{
  navigate(`./subjectcreate`)
}

const handleDeleteSubject = async (id) => {
  const isSuccess = await DeleteItem(
    id,
    deleteSubject // apiden gelen silme fonksiyonu
  );

  if (isSuccess) {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    
  }
};

const handleDropdownAction = (option, id) => {
if (option === "Düzenle") {
    handleUpdate(id);}
   else if(option === "Yardımcı Kaynaklar"){
    handleShowSupplementaryResources(id);
   }
};

const handleShowSupplementaryResources = (subjectId) => {      
  navigate(`./supplementaryresourcebysubject/${subjectId}`); // subject.id'yi kullanarak ilgili subjectin verilerini alabilirsiniz.
};

const columns = [
  {
    Header: "Konu",
    accessor: "name",
  },
  {
    Header: "Açıklama",
    accessor: "description",
  },
  {
    Header: "İşlemler",
    accessor: "actions",
    Cell: ({ row }) => (
      <div className="buttons">
        <Dropdown
          triggerText={<span><BsGear/><BsChevronCompactDown/></span>}
          options={["Düzenle","Yardımcı Kaynaklar"]}
          onOptionClick={(option) => handleDropdownAction(option, row.original.id)}
        />
        <button onClick={() => handleDeleteSubject(row.original.id)}><BsTrash/></button>
      </div>
    ),
  },
]
  return (
    <div>
      <h1> Konular</h1>
     
      <img className="line" src={require("../img/substract.png")} alt="" />
      <Button className="btn-create" onClick={ () => handleCreate()} >
        Ekle
      </Button>
      {Array.isArray(subjects) && subjects.length > 0 ? (
        <DataTable columns={columns} data={subjects} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
        )}
    </div>
  )
   
}
export default SubjectList;
