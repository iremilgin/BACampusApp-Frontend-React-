import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { getAllAdmins, deleteAdmin } from "../api/adminApi";
import { ToastContainer, toast } from "react-toastify";
import DataTable from "../../../shared/data-table/DataTable";
import { Button } from "semantic-ui-react";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";

function AdminList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    getAllAdmins()
      .then((data) => {
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
    navigate(`./admindetail/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`./adminupdate/${id}`);
  };

  const handleCreate = () => {
    navigate(`./admincreate`);
  };

  const handleDeleteAdmin = async (id) => {
    const isSuccess = await DeleteItem(
      id,
      deleteAdmin // apiden gelen silme fonksiyonu
    );

    if (isSuccess) {
      setUsers(users.filter((admin) => admin.id !== id));
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
            triggerText={
              <span>
                <BsGear />
                <BsChevronCompactDown />
              </span>
            }
            options={["Düzenle", "Detay"]}
            onOptionClick={(option) =>
              handleDropdownAction(option, row.original.id)
            }
          />
          <button onClick={() => handleDeleteAdmin(row.original.id)}>
            <BsTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1>Yöneticiler</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />

      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>

      {Array.isArray(users) && users.length > 0 ? (
        <DataTable columns={columns} data={users} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz</p>
      )}
      <ToastContainer />
    </div>
  );
}
export default AdminList;
