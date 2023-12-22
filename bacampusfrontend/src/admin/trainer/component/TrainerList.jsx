import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../scss/pagination.scss";
import "../scss/button.scss";
import { useNavigate } from "react-router-dom";
import { deleteTrainer, listAllTrainer } from "../api/trainerApi";
import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { ToastContainer } from "react-toastify";
import { BsGear , BsTrash ,BsChevronCompactDown } from "react-icons/bs";

import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";

function TrainerList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listAllTrainer()
      .then((data) => {
        console.log(data);
        setUsers(data);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  const handleDetail = (id) => {
    console.log(id, 'id var mi');
    navigate(`./trainerdetails/${id}`)
  }

  const handleUpdate = (id) => {
    console.log(id, 'update için id var mi');
    navigate(`../trainerupdate/${id}`)
  }

  const handleCreate = () => {
    navigate(`./trainercreate`)
  }

  const handleDeleteTrainer = async (id) => {
    const isSuccess = await DeleteItem(
      id,
      deleteTrainer // apiden gelen silme fonksiyonu
    );
  
    if (isSuccess) {
      setUsers(users.filter((trainer) => trainer.id !== id));
   
    }
  }

  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
        handleUpdate(id);}
        else if(option === "Detay"){
          handleDetail(id);
        }
       
    };
  const columns = [
    {
      Header: "İsim",
      accessor: "firstName",
    },
    {
      Header: "Soyisim",
      accessor: "lastName",
    },
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="buttons">
          <Dropdown
            triggerText={<span><BsGear/><BsChevronCompactDown/></span>}
            options={["Düzenle","Detay"]}
            onOptionClick={(option) => handleDropdownAction(option, row.original.id)}
          />
          <button onClick={() => handleDeleteTrainer(row.original.id)}><BsTrash/></button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-4">
      <div>
        <h1>Eğitmenler</h1>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
      </div>
   
        <Button className="btn-create" onClick={() => handleCreate()}>
          Ekle
        </Button>      
  
        
      {Array.isArray(users) && users.length > 0 ? (
        <DataTable columns={columns} data={users} handleEdit={handleUpdate} handleDelete={handleDeleteTrainer} handleDetail={handleDetail} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz</p>
      )}
    <ToastContainer/>
    </div>
  );
}

export default TrainerList;
