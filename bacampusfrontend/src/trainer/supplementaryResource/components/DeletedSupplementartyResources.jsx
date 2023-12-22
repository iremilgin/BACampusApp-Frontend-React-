import { useEffect, useState } from "react";
import "../scss/sr-list-all.scss"; // Adjust the path to your scss files accordingly
import { useNavigate } from "react-router-dom";
import { getDeletedResources } from "../api/suplamentaryResourceApi"; // Adjust the import path as needed

import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
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
    getDeletedResources()
      .then((resp) => {
        const responsesWithUrl = resp.data.map((resource) => {
          // const blob = new Blob([resource.fileContent.fileContents], {
          //   type: resource.fileContent.contentType,
          // });
          // const blobUrl = URL.createObjectURL(blob);
          const blobUrl = createUrl(
            resource.fileContent.fileContents,
            resource.fileContent.contentType
          );
          resource.url = blobUrl;
          return resource;
        });
        setResources(responsesWithUrl);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setDefaultMessage(error.message);
        showToast(defaultMessage, "error");
      });
  }, []);

  const createUrl = (fileContents, contentType) => {
    const blob = new Blob([fileContents], { type: contentType });
    return URL.createObjectURL(blob);
  };

  const handleUseDeletedResource = (resource) => {
    console.log(resource);
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Kurtar") {
      handleUseDeletedResource(id);
    }
  };

  const handleDeleteResource = (id) => {
    console.log(id);
  };

  const columns = [
    {
      Header: "Kaynak Adı",
      accessor: "name",
    },
    {
      Header: "Konu",
      accessor: "subjectName",
    },
    {
      Header: "Dosya",
      accessor: "dosya",
      Cell: ({ row }) => <a href={row.original.url}>Görüntüle</a>,
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
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
      {showToast(defaultMessage, "error")}
    </div>
  );
}

export default ResourceList;
