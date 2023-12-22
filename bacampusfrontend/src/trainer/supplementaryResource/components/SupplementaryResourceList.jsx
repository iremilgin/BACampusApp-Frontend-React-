import { useEffect, useState } from "react";
import "../scss/sr-list-all.scss"; // Adjust the path to your scss files accordingly
import { useNavigate } from "react-router-dom";
import {
  deleteSupplementaryResource, listAllSupplementaryResourcesByResourceTypeStatus,
} from "../api/suplamentaryResourceApi"; // Adjust the import path as needed

import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { PermanentlyDeleteItem } from "../../../shared/delete-alerts/PermanentlyDeleteAlert";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import ToastContent from "../../../shared/toast-content/ToastContent";

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [defaultMessage, setDefaultMessage] = useState("");
  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listAllSupplementaryResourcesByResourceTypeStatus(1); // ResourceTypeStatus == 1 approved
        setResources(data.data);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setDefaultMessage("Verileri getirme hatası");
        showToast(defaultMessage, "error");
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (id) => {
    navigate(`../trainersupplementaryresourceupdate/${id}`);
  };

  const handleCreate = () => {
    navigate(`../trainersupplementaryresourcecreate`);
  };

  const handleDeleteResource = async (id) => {
    const isSuccess = await PermanentlyDeleteItem(
      id,
      deleteSupplementaryResource
    );

    if (isSuccess) {
      setResources(resources.filter((resource) => resource.id !== id));
    }
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
      handleUpdate(id);
    } else if (option === "Detay") {
      handleShowSupplementaryResources(id);
    }
  };

  const handleShowSupplementaryResources = (resourceId) => {
    navigate(`../trainersupplementaryresourcedetail/${resourceId}`);
  };

  const handleGetDeletedResources = () => {
    navigate(`../trainerdeletedsupplementaryresources`);
  };

  const columns = [
    {
      Header: "Kaynak Adı",
      accessor: "name",
    },
    {
      Header: "Konu Adı",
      accessor: "subjectNames",
      Cell: ({ row }) => {
        if (
          row.original.supplementaryResourceEducationSubjects &&
          row.original.supplementaryResourceEducationSubjects.length > 0
        ) {
          // Benzersiz değerleri almak için Set kullanılır
          const uniqueSubjectNames = new Set(
            row.original.supplementaryResourceEducationSubjects.map(
              (subject) => subject.subjectName
            )
          );

          // Set'i diziye dönüştürerek virgülle birleştir
          const subjectNames = [...uniqueSubjectNames].join(", ");

          return subjectNames;
        } else {
          return "N/A";
        }
      },
    },
    {
      Header: "Etiket Adı",
      accessor: "supplementaryResourceTags",
      Cell: ({ row }) => {
        if (
          row.original.supplementaryResourceTags &&
          row.original.supplementaryResourceTags.length > 0
        ) {
          const tagNames = row.original.supplementaryResourceTags
            .map((tag) => tag.tagName)
            .join(", ");
          return tagNames;
        } else {
          return "N/A";
        }
      },
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
          {/* <button onClick={() => handleDeleteResource(row.original.id)}>
            <BsTrash />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1> Kaynaklar </h1>
      <img className="line" src={require("../img/substract.png")} alt="" />
      <Button className="btn-create" onClick={() => handleCreate()}>
        Kaynak Ekle
      </Button>
      {Array.isArray(resources) && resources.length > 0 ? (
        <DataTable columns={columns} data={resources} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
      {showToast(defaultMessage, "error")}
    </div>
  );
}

export default ResourceList;
