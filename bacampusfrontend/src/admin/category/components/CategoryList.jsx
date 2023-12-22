import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listAllCategory, deleteCategory } from "../api/categoryApi";
import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { ToastContainer, toast } from "react-toastify";

function CategoryList() {
  const [users, setUsers] = useState([]);
  const [deleteResponse, setDeleteResponse] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    listAllCategory()
      .then((data) => {
        setUsers(data);
      })

      .catch((error) =>{
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  const handleDetail = (id) => {
    navigate(`./categorydetails/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`./categoryupdate/${id}`);
  };

  const handleCreate = () => {
    navigate(`./categoryCreate`);
  };

  const handleDeleteCategory = async (id) => {
    const isSuccess = await DeleteItem(id, deleteCategory);

    if (isSuccess) {
      setUsers(users.filter((categorys) => categorys.id !== id));
    }
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
      handleUpdate(id);
    } else if (option === "Detay") {
        handleDetail(id);
      }
  };

  const columns = [
    {
      Header: "Kategori İsmi",
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
            options={["Detay","Düzenle"]}
            onOptionClick={(option) =>
              handleDropdownAction(option, row.original.id)
            }
          />
          <button onClick={() => handleDeleteCategory(row.original.id)}>
            <BsTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1> Kategoriler</h1>

      <img className="line" src={require("../img/substract.png")} alt="" />

      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>

      {Array.isArray(users) && users.length > 0 ? (
        <DataTable
          columns={columns}
          data={users}
          handleUpdate={handleUpdate}
          handleDeleteCategory={handleDeleteCategory}
          handleDetail={handleDetail}
        />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default CategoryList;
