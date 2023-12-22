import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  listAllSupplementaryResourceBySubjectId,
  downloadFileSupplementaryResource,
} from "../api/suplamentaryResourceApi";
import "../../../assets/scss/button.scss";
import "../scss/sr-list.scss";


function SupplementaryResourceListBySubject() {
  const [supplementaryResources, setSupplementaryResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplementaryResourceId, setSupplementaryResourceId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // base64 Formatına Çevirme
  const decodeReferansFile = (referansFile) => {
    const byteCharacters = atob(referansFile);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await listAllSupplementaryResourceBySubjectId(id);
        setSupplementaryResources(response.data);
        setSubjectName(response.data[0].subjectName);
        setLoading(false);
        const decodedSupplementaryResource = decodeReferansFile(
          response.data.referansFile
        );
        setData(decodedSupplementaryResource);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Veriler alınırken hata oluştu: ", error);
      }
    }
    
  

    fetchData(); 
    
  }, [id]);

  const handleAllDownload = (filePath, supplementaryResourceId) => {
    setSupplementaryResourceId(supplementaryResourceId);
    console.log(supplementaryResourceId);
    handleDownloadFile(filePath, supplementaryResourceId);
  };


  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data.data], { type: fileType });
    return URL.createObjectURL(blob);
  };

  // Yüklü olan dosyayı açma işlemi
  const handleDownloadFile = async (filePath, supplementaryResourceId) => {
    try {
      const fileResponse = await downloadFileSupplementaryResource(
        filePath,
        supplementaryResourceId
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
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Download error: ", error.message);
      alert(error.message);
    }
  };

  const getMimeType = (mimeType, resourceType) => {
    if (resourceType == 2) {
      return ".link";
    } else {
      switch (mimeType) {
        case "application/pdf":
          return ".pdf";
        case "image/png":
          return ".png";
        case "image/jpeg":
        case "image/jpg":
          return ".jpg";
        case "application/vnd.ms-powerpoint":
          return ".ppt";
        case "application/msword":
          return ".doc";
        case "application/x-zip-compressed":
          return ".zip";
        case "text/html":
          return ".html";
        case "video/mp4":
          return ".mp4";
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          return ".xlsx"
        default:
          return ".unk";
      }
    }
  };

  const getClassNameByMimeType = (mimeType) => {
    switch (mimeType) {
      case "application/pdf":
        return "danger";
      case "image/png":
        return "warning";
      case "image/jpeg":
      case "image/jpg":
        return "success";
      case "application/vnd.ms-powerpoint":
        return "primary";
      case "application/msword":
        return "info";
      case "application/x-zip-compressed":
        return "secondary";
      case "text/html":
        return "primary";
      case "video/mp4":
        return "success";
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          return "success"
      default:
        return "black"; //
    }
  };

  return (
    <div>
      <h1>Yardımcı Kaynaklar</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />
      <div className="sr-subject">
        <h2>{subjectName}</h2>
      </div>
      <div className="supp-list-body">
        {loading ? (
          <div className="es-no-data">
            <h2>Bu konuya henüz yardımcı kaynak eklenmemiş...</h2>
          </div>
        ) : error ? (
          <div className="error-message">Hata oluştu: {error.message}</div>
        ) : (
          <div class="sr-card-body">
            <div class="product-file-type">
              <ul class="list-unstyled">
                {supplementaryResources.map((resource) => (
                  <li class="sr-row" key={resource.id}>
                    <span
                      class={`align-self-center img-icon ${getClassNameByMimeType(
                        resource.mimeType,
                        resource.resourceType
                      )}-rgba text-${getClassNameByMimeType(
                        resource.mimeType,
                        resource.resourceType
                      )}`}
                    >
                      {getMimeType(resource.mimeType, resource.resourceType)}
                    </span>
                    <div class="media-body">
                      {resource.mimeType === "" ? (
                        <h3
                          onClick={() =>
                            window.open(resource.fileURL, "_blank")
                          }
                          class="font-16 mb-1"
                        >
                          {resource.name}
                          <i class="feather icon-external-link float-right"></i>
                        </h3>
                      ) : (
                        <h3
                          onClick={() =>
                            handleAllDownload(resource.fileURL, resource.id)
                          }
                          class="font-16 mb-1"
                        >
                          {resource.name}
                          <i class="feather icon-download-cloud float-right"></i>
                        </h3>
                      )}
                      <p>{`${getMimeType(resource.mimeType)}`}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default SupplementaryResourceListBySubject;
