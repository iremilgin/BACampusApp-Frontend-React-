import React, { useState, useEffect } from "react";
import "../scss/trainingtype-list.scss";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import {
  getAllTrainingType,
  deleteTrainingType,
} from "../api/trainingtypeApi.js";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import DataTable from "../../../shared/data-table/DataTable";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";

const TrainingType = () => {
  const [trainingTypeList, setTrainingTypeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainingTypeList();
  }, []);

  const fetchTrainingTypeList = async () => {
    try {
      const list = await getAllTrainingType();
      setTrainingTypeList(list);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Error fetching trainingType list:", error);
    }
  };


  const handleCreate = () => {
    navigate(`./trainingtypecreate`);
  };

  const columns = [
    {
      Header: "Eğitim Tipi",
      accessor: "name",
    },
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="buttons">
          <Dropdown
            triggerText={
              <span>
                <BsGear />
                <BsChevronCompactDown />
              </span>
            }
            options={["Düzenle"]}
            onOptionClick={() => handleDropdownAction(row.original.id)}
          />
          <button onClick={() => handleDeleteType(row.original.id)}>
            <BsTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleDropdownAction = (id) => {
    handleUpdate(id);
  };

  const handleUpdate = (id) => {
    console.log(id, "update id'si");
    navigate(`./trainingtypeupdate/${id}`);
  };

  const handleDeleteType = async (id) => {
    const isSuccess = await DeleteItem(
      id,
      deleteTrainingType // apiden gelen silme fonksiyonu
    );

    if (isSuccess) {
      setTrainingTypeList(trainingTypeList.filter((type) => type.id !== id));
    }
  };

  return (
    <div>
      <h1>Eğitim Tipleri</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />
      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>
      {Array.isArray(trainingTypeList) && trainingTypeList.length > 0 ? (
        <DataTable columns={columns} data={trainingTypeList} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
    </div>
  );
};

export default TrainingType;
