import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { deleteTag, getAlllTag } from "../api/tagApi";
import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";

import "../scss/style.scss";

function TagList() {
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAlllTag()
      .then((response) => {
        setTags(response);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  const handleCreate = () => {
    navigate(`./tagcreate`);
  };

  const handleUpdate = (id) => {
    navigate(`./tagupdate/${id}`);
  };
  const handleDetail = (id) => {
    navigate(`./tagdetails/${id}`);
  };

  const handleDeleteTag = async (id) => {
    const isSuccess = await DeleteItem(id, deleteTag);

    if (isSuccess) {
      setTags(tags.filter((tag) => tag.id !== id));
      navigate("/admin/tags");
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
      Header: "Etiket Ismi",
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
            // options dan detay "Detay" cikartildi proje gelistirilmesi dogrultusunda eklenebilir
            options={["Düzenle"]}
            onOptionClick={(option) =>
              handleDropdownAction(option, row.original.id)
            }
          />
          <button onClick={() => handleDeleteTag(row.original.id)}>
            <BsTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1> Etiketler</h1>

      <img className="line" src={require("../img/substract.png")} alt="" />

      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>

      {Array.isArray(tags) && tags.length > 0 ? (
        <DataTable columns={columns} data={tags} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
    </div>
  );
}
export default TagList;
