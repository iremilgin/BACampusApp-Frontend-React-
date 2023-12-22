import React, { useState, useEffect } from "react";
import {
  listAllSupplementaryResources,
  downloadFileSupplementaryResource,
  getDocumentsOrVideosByEducationId,
} from "../../supplementaryResource/api/suplamentaryResourceApi";
import "../scss/education-sr-options.scss";
import { useParams } from "react-router-dom";
import ToastContent from "../../../shared/toast-content/ToastContent";
import DataTable from "../../../shared/data-table/DataTable";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { useNavigate } from "react-router-dom";

const EducationSRDocumentaryList = () => {
  const [supplementaryResources, setSupplementaryResources] = useState("");
  const { id } = useParams();
  const [resultMessage, setResultMessage] = useState("");
  const [educationName, setEducationName] = useState("");
  const navigate = useNavigate();

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDocumentsOrVideosByEducationId(id, 1);
        const result = await getDocumentsOrVideosByEducationId(id, 3);

        const mergedData = [...response.data, ...result.data];

        setSupplementaryResources(mergedData);
        setEducationName(
          mergedData[0].supplementaryResourceEducationSubjects[0].educationName
        );
      } catch (error) {
        if (error.validationErrors.message) {
          setResultMessage(error.validationErrors.message);
          showToast(resultMessage, "error");
        } else {
          setResultMessage("");
        }
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        }
      }
    };

    fetchData();
  }, []);

  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data.data], { type: fileType });
    return URL.createObjectURL(blob);
  };

  const handleDownloadAndPlay = async (filePath, id) => {
    try {
      const fileResponse = await downloadFileSupplementaryResource(
        filePath,
        id
      );

      if (fileResponse.status === 200) {
        const url = convertFileToUrl(fileResponse, fileResponse.data.type);
        window.open(url);
      } else if (fileResponse.status === 404) {
        throw new Error("Dosyaya ulaşılamadı");
      } else {
        throw new Error("Bilinmeyen bir hata oluştu");
      }
    } catch (error) {
      if (error.validationErrors.message) {
        setResultMessage(error.validationErrors.message);
        showToast(resultMessage, "error");
      } else {
        setResultMessage("");
      }
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      }
    }
  };

  const handleDropdownAction = (option, id, fileURL) => {
    if (option === "İndir") {
      handleDownloadAndPlay(fileURL, id)
    } else {
      window.open(fileURL, "_blank")
    }
    
  };

  const columns = [
    {
      Header: "Doküman Adı",
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
          const subjectNames =
            row.original.supplementaryResourceEducationSubjects
              .map((subject) => subject.subjectName)
              .join(", ");
          return subjectNames;
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
              row.original.resourceType === 1
                ? ["İndir"]
                : ["Aç"]
            }
            
            onOptionClick={(option) =>
              handleDropdownAction(option, row.original.id,row.original.fileURL)
            }

          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>{educationName} Dokümanları</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <div>
        {Array.isArray(supplementaryResources) &&
        supplementaryResources.length > 0 ? (
          <DataTable columns={columns} data={supplementaryResources} />
        ) : supplementaryResources.length === 0 && resultMessage ? (
          <p>Veri bulunamadı.</p>
        ) : (
          <p>Veriler yükleniyor, Lütfen bekleyiniz.</p>
        )}
      </div>
      {showToast(resultMessage, "error")}
    </div>
  );
};

export default EducationSRDocumentaryList;
