import { useEffect, useState } from "react";
import "../scss/sr-list-all.scss"; // Adjust the path to your scss files accordingly
import { useNavigate } from "react-router-dom";
import {
  deleteSupplementaryResource,
  giveFeedback,
  listAllSupplementaryResources,
  updateResourcesTypeStatus,
} from "../api/suplamentaryResourceApi"; // Adjust the import path as needed

import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { PermanentlyDeleteItem } from "../../../shared/delete-alerts/PermanentlyDeleteAlert";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import ToastContent from "../../../shared/toast-content/ToastContent";
import { display } from "@mui/system";
import { ChangeFeedback } from "../../../shared/feedback/Feedback";

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [defaultMessage, setDefaultMessage] = useState("");
  const [allResources, setAllResources] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [resourceTypeStatus, setResourceTypeStatus] = useState([]);

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listAllSupplementaryResources();
        setResources(data.data);
        setAllResources(data.data);
        const list=[];
        data.data.forEach(element => {
         list.push(element.resourceTypeStatus);
        });

        setResourceTypeStatus(list);
        setResponseMessage(data.message);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setDefaultMessage("Verileri getirme hatası");
        showToast(defaultMessage, "error");
      }
    };

    fetchData();
  }, [...resourceTypeStatus]);

  const handleUpdate = (id) => {
    navigate(`./supplementaryresourceupdate/${id}`);
  };

  const handleCreate = () => {
    navigate(`./supplementaryresourcecreate`);
  };

  const handleGetList = (status) => {
    if (status === 1) {
      const responce = allResources.filter((x) => x.resourcesTypeStatus === 1);
      setResources(responce);
    } else if (status === 2) {
      const responce = allResources.filter((x) => x.resourcesTypeStatus === 2);
      setResources(responce);
    } else {
      setResources(allResources);
    }
    
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

  const handleUpdateResource = async (id) => {
    const isSuccess = await updateResourcesTypeStatus(id, 1);

    if (isSuccess) {
      try {
        const data = await listAllSupplementaryResources();
        setResources(data.data);
        setAllResources(data.data);
        const list = [];
        data.data.forEach((element) => {
          list.push(element.resourceTypeStatus);
        });
        setResourceTypeStatus(list);
        setResponseMessage(data.message);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setDefaultMessage("Verileri getirme hatası");
        showToast(defaultMessage, "error");
      }
    }
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
      handleUpdate(id);
    } else if (option === "Detay") {
      handleShowSupplementaryResources(id);
    } else if (option === "Onayla") {
      handleUpdateResource(id, 1);
    } else if (option === "Reddet") {
      handleGiveFeedback(id);
    }
  };

  const handleGiveFeedback = async (supplementaryResourceId) => {
    ChangeFeedback(supplementaryResourceId, giveFeedback);
  };

  const handleShowSupplementaryResources = (resourceId) => {
    navigate(`./supplementaryresourcedetail/${resourceId}`);
  };

  const handleGetDeletedResources = () => {
    navigate(`./deletedsupplementaryresources`);
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
            options={
              row.original.resourcesTypeStatus === 1
                ? ["Düzenle", "Detay"]
                : ["Düzenle", "Detay", "Onayla","Reddet"]
            }
            onOptionClick={(option) =>
              handleDropdownAction(option, row.original.id)
            }
          />
          <button onClick={() => handleDeleteResource(row.original.id)}>
            <BsTrash />
          </button>
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

      <ul className="tag-list">
        <li>
          <button
            //className={activeTab === "all" ? "active" : ""}
            onClick={() => handleGetList(3)}
          >
            Tümü
          </button>
        </li>
        <li>
          <button
            //className={activeTab === "all" ? "active" : ""}
            onClick={() => handleGetList(2)}
          >
            Onay Bekleyenler
          </button>
        </li>
        <li>
          <button
            //className={activeTab === "evaluated" ? "active" : ""}
            onClick={() => handleGetList(1)}
          >
            Onaylanmış
          </button>
        </li>
      </ul>

      <Button
        className="btn-create deleted-btn"
        onClick={() => handleGetDeletedResources()}
      >
        Silinenler
      </Button>
      {Array.isArray(resources) && resources.length > 0 ? (
        <DataTable columns={columns} data={resources} />
      ) : responseMessage ? (
          <p>Veri bulunamadı....</p>
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
      {showToast(defaultMessage, "error")}
    </div>
  );
}

export default ResourceList;
