import { useEffect, useState } from "react";
import "../scss/sr-list-all.scss"; // Adjust the path to your scss files accordingly
import { useNavigate } from "react-router-dom";
import {
  getDeletedResources,
  permanentlyDeleteSoftDeletedResource,
} from "../api/suplamentaryResourceApi"; // Adjust the import path as needed

import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import ToastContent from "../../../shared/toast-content/ToastContent";

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [defaultMessage, setDefaultMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };
  const navigate = useNavigate();

  useEffect(() => {
    getDeletedResources()
      .then((resp) => {
        console.log(resp);
        setDefaultMessage(resp.message);
        const responsesWithUrl = resp.data.map((resource) => {
          
          if(resource.fileContent.fileContents != ""){
            const blobUrl = createUrl(
              resource.fileContent.fileContents,
              resource.fileContent.contentType
            );
            resource.url = blobUrl;
          }
          resource.url = "";
          return resource;
        });
        setResources(responsesWithUrl);
      })
      .catch((error) => {
        setDefaultMessage(error.message);
      });
  }, []);

  const createUrl = (fileContents, contentType) => {
    const blob = new Blob([fileContents], { type: contentType });
    return URL.createObjectURL(blob);
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Kurtar") {
      navigate(`../recoverdeletedresource/${id}`);
    }
  };

  const handleDeleteResource = (id) => {
    permanentlyDeleteSoftDeletedResource(id)
    .then((response) => {
      if(response.isSuccess){
        setResources(resources.filter((resource) => resource.id !== id));
      }
    })
    
  };

  const columns = [
    {
      Header: "Kaynak Adı",
      accessor: "name",
    },
    {
      Header: "Dosya",
      accessor: "dosya",
      Cell: ({ row }) => (
        <a href={row.original.url || row.original.link}>Görüntüle</a>
      ),
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
            options={["Kurtar"]}
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
      <h1> Silinen Yardımcı Kaynak Dosyaları </h1>
      {resources.length > 0 ? (
        <DataTable columns={columns} data={resources} />
      ) : resources.length === 0  ? (
        <p>Veri bulunamadı.</p>
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz.</p>
      )}
    </div>
  );
}

export default ResourceList;
