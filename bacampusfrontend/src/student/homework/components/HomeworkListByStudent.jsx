// StudentHomeworkList.js
import React, { useEffect, useState } from "react";
import DataTable from "../../../shared/data-table/DataTable";
import "../scss/StudentHomeworkDetail.scss";
import { getStudentHomeworkByStudentId, downloadFileHomework ,getStudentHomeworkId} from "../api/studentHomeworkApi";
import { useNavigate } from "react-router-dom";
import { BsGear, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { listAllSubject } from "../../subject/subjectApi";
import { useParams, Link } from "react-router-dom";

let savedData = sessionStorage.getItem("savedData");
let role;

if (savedData != null) {
  savedData = savedData.split(",");
  role = savedData[1];
  
}


//Tarih formatı 
function formatDate(dateString) {
  const options = { dateStyle: "short", timeStyle: "short" };
  return new Date(dateString).toLocaleString("tr-TR", options)
};


const HomeworkListByStudent = () => {
  const [studentHomeworks, setStudentHomeworks] = useState([]);
  const navigate = useNavigate();
  const [homeworkId, setHomeworkId] = useState("");
  const [subjects, setSubjects] = useState([]);
 

  const decodeReferansFile = (referansFile) => {
    const byteCharacters = atob(referansFile);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentHomeworkList = await getStudentHomeworkByStudentId();
        setStudentHomeworks(studentHomeworkList.data);
        console.log(studentHomeworkList.data);

        const decodedHomeworks = (studentHomeworkList.data).map((homework) => ({
          ...homework,
          referansFile: homework.referansFile
            ? decodeReferansFile(homework.referansFile)
            : null,
        }));
        setStudentHomeworks(decodedHomeworks);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error('Hata detayları:', error);
      }
    };
    const fetchSubjectData = async () => {
      try {
        const response = await listAllSubject();
        setSubjects(response.data);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Konular alınırken hata oluştu: ", error);
      }
    };
    console.log("Konular");
    console.log(subjects);
    fetchData();
    fetchSubjectData();
  }, []);

  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data.data], { type: fileType });
    return URL.createObjectURL(blob);
  };

  //Yüklü olan dosyayı açma işlemi
  const handleDownloadFile = async (filePath, homeworkId) => {
    try {
      const fileResponse = await downloadFileHomework(filePath, homeworkId);

      if (fileResponse.status === 200) {
        const url = convertFileToUrl(fileResponse, fileResponse.data.type);
        window.open(url);
      } else if (fileResponse.status === 404) {
        throw new Error("Dosyaya ulaşılamadı");
      } else {
        throw new Error("Bilinmeyen bir hata oluştu");
      }
    } catch (error) {
      console.error("Download error: ", error.message);
      alert(error.message);
    }
  };

  const handleAllDownload = (filePath, homeworkId) => {
    setHomeworkId(homeworkId);
    console.log(homeworkId);
    handleDownloadFile(filePath, homeworkId);
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Cevapla") {
      handleDetail(id);
    }
  };

  const handleDetail = (id) => {
    console.log(`Detayiçin ID: ${id}`);
    navigate(`../studenthomeworkdetail/${id}`);
  };

  const columns = [
    {
      Header: "Başlık",
      accessor: "title",
    },
    {
      Header: "Konu",
      accessor: "subjectId",
      Cell: ({ value }) =>
        subjects.find((subject) => subject.id === value)?.name || "Konu yok",
    },
    {
      Header: "Başlangıç Tarihi",
      accessor: "startDate",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Bitiş Tarihi",
      accessor: "endDate",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Geç Teslim İzni",
      accessor: "isLateTurnedIn",
      Cell: ({ value }) => (value ? "Var" : "Yok"),
    },
    {
      Header: "Puan",
      accessor: "isHasPoint",
      Cell: ({ value, row }) => {
        const homeworkId = row.original.id;
        const studentId = savedData[2];
    
        const [pointData, setPointData] = useState(null);
    
        useEffect(() => {
          const fetchPointData = async () => {
            const result = await getStudentHomeworkId(studentId, homeworkId);
            setPointData(result.data);
          };
    
          fetchPointData();
        }, [studentId, homeworkId]);
    
        return (
          <span>
            {row.original.isHasPoint ? (
              pointData?.point || "Puansız"
            ) : (
              "Bu ödev puanlanamaz"
            )}
          </span>
        );
      },
    },
    
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div>
          <div className="buttons">
            <Dropdown
              triggerText={
                <span>
                  <BsGear />
                  <BsChevronCompactDown />
                </span>
              }
              options={["Cevapla"]}
              onOptionClick={(option) =>
                handleDropdownAction(option, row.original.id)
              }
            />
          </div>
        </div>
      )
    },
  ];

  return (
    <div>
      <div>
        <h1>Ödevler</h1>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
        {Array.isArray(studentHomeworks) && studentHomeworks.length > 0 ? (
          <DataTable columns={columns} data={studentHomeworks} />
        ) : (
          <p>Veriler yükleniyor, Lütfen bekleyiniz.</p>
        )}
      </div>
    </div>
  );
};

export default HomeworkListByStudent;
