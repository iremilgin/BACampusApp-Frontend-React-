import React, { useEffect, useState } from "react";
import {
  listAllSupplementaryResources,
  downloadFileSupplementaryResource,
  getDocumentsOrVideosByEducationId
} from "../api/supplementaryResourcesApi";
import "../scss/sr-documents.scss";
import "react-toastify/dist/ReactToastify.css";
import ToastContent from "../../../shared/toast-content/ToastContent";
import { useNavigate,useParams } from "react-router-dom";

function SRListByStudent() {
  const [data, setData] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState([]);
  const [defaultMessage, setDefaultMessage] = useState("");
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [downloadErrorMessage, setDownloadErrorMessage] = useState("");
  const [supplementaryResources, setSupplementaryResources] = useState([]);
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
        console.log(mergedData);
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
        setFileErrorMessage("Dosyaya ulaşılamadı");
        showToast(fileErrorMessage, "error");
      } else {
        setDefaultMessage("Veriler alınırken hata oluştu");
        showToast(defaultMessage, "error");
      }
    } catch (error) {
      setDownloadErrorMessage("Dosya indirilemedi");
      showToast(downloadErrorMessage, "error");
    }
  };

  const selectTag = (tagId) => {
    setSelectedTagId(tagId);
  };

  const getMimeTypeIconUrl = (mimeType) => {
    switch (mimeType) {
      case "application/pdf":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/pdf.svg";
      case "image/png":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/png.svg";
      case "image/jpeg":
      case "image/jpg":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/jpg.svg";
      case "application/vnd.ms-powerpoint":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/ppt.svg";
      case "application/msword":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/doc.svg";
      case "application/x-zip-compressed":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/zip.svg";
      case "text/html":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/html.svg";
      case "video/mp4":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/mp4.svg";
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/xls.svg";
      default:
        return "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/txt.svg";
    }
  };

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();

    if (!searchText.trim()) {
      listAllSupplementaryResources()
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          if (error.name === 'RedirectError') {
            navigate('/error'); // Redirect to ErrorPage
          } 
          setDefaultMessage("Veriler alınırken hata oluştu");
          showToast(defaultMessage, "error");
        });
      return;
    }

    const filteredData = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchText) ||
        item.subjectName.toLowerCase().includes(searchText) ||
        item.mimeType.toLowerCase().includes(searchText) ||
        item.fileURL.toLowerCase().includes(searchText) ||
        (item.tagName &&
          item.tagName.some((tag) => tag.toLowerCase().includes(searchText)))
      );
    });

    setData(filteredData);
  };

  return (
    <div className="sr-col">
      <h1>Eğitim Dokümanları</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />
      <div className="sr-search ">
        <input
          className="form-input sr-search-input"
          type="text"
          placeholder="ara..."
          onChange={handleSearch}
        ></input>
      </div>

      <div className="content">
        <div className="container">
          <div className="row">
            <div class="col-12">
              <div class="sr-all-card-box">
                <div class="sr-all-row">
                  {supplementaryResources.map((item) => (
                    <div class="sr-all-card" key={item.id}>
                      <div className="file-man-box">
                        <a href="#" className="file-close">
                          <i className="fa fa-times-circle"></i>
                        </a>
                        <div className="file-img-box">
                          {item.mimeType === "" ? (
                            <img
                              src={require("../img/url (1).png")}
                              onClick={() =>
                                window.open(item.fileURL, "_blank")
                              }
                              alt="icon"
                            />
                          ) : (
                            <img
                              src={getMimeTypeIconUrl(item.mimeType)}
                              onClick={() =>
                                handleDownloadFile(item.fileURL, item.id)
                              }
                              alt="icon"
                            />
                          )}
                        </div>
                        <a
                          href="#"
                          className="file-download"
                          onClick={() =>
                            handleDownloadFile(item.filePath, item.id)
                          }
                        >
                          <i className="fa fa-download"></i>
                        </a>
                        <div className="file-man-title">
                          <h3 className="text-overflow">{item.name}</h3>
                          <p className="mini-tag text-overflow" >
                            {item.supplementaryResourceEducationSubjects &&
                              item.supplementaryResourceEducationSubjects.length > 0 &&
                              item.supplementaryResourceEducationSubjects.map(
                                (subject, index) => (
                                  <small key={index}>#{subject.subjectName} </small>
                                )
                              )}
                          </p>
                          <p className="mini-tag text-overflow" >
                            {item.supplementaryResourceTags &&
                              item.supplementaryResourceTags.length > 0 &&
                              item.supplementaryResourceTags.map(
                                (tag, index) => (
                                  <small key={index}>#{tag.tagName} </small>
                                )
                              )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showToast(defaultMessage, "error")}
      {showToast(fileErrorMessage, "error")}
      {showToast(downloadErrorMessage, "error")}
    </div>
  );
}

export default SRListByStudent;
