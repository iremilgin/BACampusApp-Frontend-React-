import React, { useEffect, useState } from "react";
import { deleteTechnicalUnit, listAllTechnicalUnit } from "../Api/technicalunitApi";
import { useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { BsGear , BsTrash ,BsChevronCompactDown } from "react-icons/bs";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
function TechnicalUnitList() {
  const [technicalUnits, setTechnicalUnits] = useState([]);
  const navigate = useNavigate()
  
  useEffect(() => {
    listAllTechnicalUnit()
      .then((response) => response)
      .then((data) => {
        setTechnicalUnits(data.data);
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
    navigate(`../technicalunitupdate/${id}`)
  }

  const handleCreate = () => {
    navigate(`./technicalunitcreate`)
  }

  const handleDeleteTechUnit = async (id) => {
    const isSuccess = await DeleteItem(
      id,
      deleteTechnicalUnit // apiden gelen silme fonksiyonu
    );

    if (isSuccess) {
      setTechnicalUnits(technicalUnits.filter((techUnit) => techUnit.id !== id));
    }
  }
  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
        handleUpdate(id);}
       
    };
  const columns = [
    {
      Header: "Teknik Birim",
      accessor: "name",
    },
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="buttons">
          <Dropdown
            triggerText={<span><BsGear/><BsChevronCompactDown/></span>}
            options={["Düzenle"]}
            onOptionClick={(option) => handleDropdownAction(option, row.original.id)}
          />
          <button onClick={() => handleDeleteTechUnit(row.original.id)}><BsTrash/></button>
        </div>
      ),
    },
   
  ]

  return (
    <div className="p-4">
      <div>
        <h1>Teknik Birimler</h1>
        <img
          className="line"
          src={require("../img/substract.png")}
          alt=""
        />
      </div>
      
     
        <Button className="btn-create" onClick={() => handleCreate()}>
          Ekle
        </Button>      
    
        
      {Array.isArray(technicalUnits) && technicalUnits.length > 0 ? (
        <DataTable columns={columns} data={technicalUnits} handleEdit={handleUpdate} handleDelete={handleDeleteTechUnit} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz</p>
      )}    
    </div>
  );
}

export default TechnicalUnitList;
