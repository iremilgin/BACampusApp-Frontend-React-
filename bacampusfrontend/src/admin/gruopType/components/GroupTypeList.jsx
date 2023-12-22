import React, { useState, useEffect } from "react";
import "../scss/grouptype-list.scss";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import {
  getAllGroupType,
  deleteGroupType,
} from "../api/grouptypeApi.js";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown.jsx";
import DataTable from "../../../shared/data-table/DataTable.jsx";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert.jsx";

const GroupType = () => {
  const [groupTypeList, setGroupTypeList] = useState([]);

  useEffect(() => {
    fetchGroupTypeList();
  }, []);

  const fetchGroupTypeList = async () => {
    try {
      const list = await getAllGroupType();
      setGroupTypeList(list);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Error fetching groupType list:", error);
    }
  };

  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(`./grouptypecreate`);
  };

  const columns = [
    {
      Header: "Grup Tipi",
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
    navigate(`./grouptypeupdate/${id}`);
  };

  const handleDeleteType = async (id) => {
    const isSuccess = await DeleteItem(
      id,
      deleteGroupType // apiden gelen silme fonksiyonu
    );

    if (isSuccess) {
      setGroupTypeList(groupTypeList.filter((type) => type.id !== id));
    }
  };

  return (
    <div>
      <h1>Grup Tipleri</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />
      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>
      {Array.isArray(groupTypeList) && groupTypeList.length > 0 ? (
        <DataTable columns={columns} data={groupTypeList} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
    </div>
  );
};

export default GroupType;
