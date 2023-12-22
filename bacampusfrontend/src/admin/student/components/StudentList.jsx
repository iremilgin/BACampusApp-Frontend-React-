import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api/studentApi";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";

function StudentList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllStudents()
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
    console.log(id, "id var mi"); //daha sonra silinecek
    navigate(`./studentdetails/${id}`);
  };

  const handleUpdate = (id) => {
    console.log(id, "update için id var mi"); //daha sonra silinecek
    navigate(`./studentupdate/${id}`);
  };

  const handleCreate = () => {
    navigate(`./studentcreate`);
  };

  const handleDeleteStudent = async (id) => {
    const isSuccess = await DeleteItem(id, deleteStudent);

    if (isSuccess) {
      setUsers(users.filter((student) => student.id !== id));
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
          <button onClick={() => handleDeleteStudent(row.original.id)}>
            <BsTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1>Öğrenciler</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />

      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>

      {Array.isArray(users) && users.length > 0 ? (
        <DataTable
          columns={columns}
          data={users}
          handleEdit={handleUpdate}
          handleDelete={handleDeleteStudent}
          handleDetail={handleDetail}
        />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default StudentList;
