import React, { useEffect, useState } from "react";
import { listAllSubject } from "../../subject/api/subjectApi";
import Swal from "sweetalert2";
import {
  downloadFileHomework,
  deleteHomework,
  getStudentListByHomeworkId,
  permanentlyDeleteHomework,
  getHomeworkAssignedByTrainer,
  getHomeworkList,
  getAll,
} from "../Api/HomeworkApi";
import { getClassroomTrainers } from "../../classroom/api/assignmentApi";
import "../../../assets/scss/button.scss";
import DataTable from "../../../shared/data-table/DataTable";
import { useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { PermanentlyDeleteItem } from "../../../shared/delete-alerts/PermanentlyDeleteAlert";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Yetkilendirme
let savedData = sessionStorage.getItem("savedData");
let role;

if (savedData != null) {
  savedData = savedData.split(",");
  role = savedData[1];
}
//Tarih formatı
function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("tr-TR", options);
}

export const HomeworkList = () => {
  const [data, setData] = useState([]);
  const [homeworkId, setHomeworkId] = useState("");
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filteredEvaluatedHomeworks, setFilteredHomeworks] = useState([]);
  const [activeTab, setActiveTab] = useState("evaluated");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeworkList = await getHomeworkAssignedByTrainer();
        setData(homeworkList);

        const decodedHomeworks = homeworkList.map((homework) => ({
          ...homework,
          referansFile: homework.referansFile
            ? decodeReferansFile(homework.referansFile)
            : null,
        }));
        setData(decodedHomeworks);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Veriler alınırken hata oluştu: ", error);
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
    const fetchClassromData = async () => {
      try {
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Konular alınırken hata oluştu: ", error);
      }
    };
    fetchData();
    fetchSubjectData();
    fetchClassromData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        if (activeTab === "evaluated") {
          result = await filterEvaluatedHomeworks(data);
        } else if (activeTab === "overdue") {
          result = await filterOverdueHomeworks(data);
        } else if (activeTab === "assigned") {
          result = await filterAssignedHomeworks(data);
        } else if (activeTab === "all") {
          result = data;
        }

        setFilteredHomeworks(result);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Ödevleri filtreleme sırasında bir hata oluştu:", error);
      }
    };
    fetchData();
  }, [data, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await filterEvaluatedHomeworks(data);
  //       setFilteredHomeworks(result);
  //     } catch (error) {
  //       console.error("Ödevleri filtreleme sırasında bir hata oluştu:", error);
  //     }
  //   };
  //   fetchData();
  // }, [data]);
  //Sınıflar Listelenir
  useEffect(() => {
    getClassroomTrainers()
      .then((data) => {
        setClassrooms(data.data);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  //base64 Formatına Çevirme
  const decodeReferansFile = (referansFile) => {
    const byteCharacters = atob(referansFile);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  };
  const filterAssignedHomeworks = (homeworks) => {
    const currentDate = new Date(); // Şu anki tarih ve saat

    return homeworks.filter((homework) => {
      const startDate = new Date(homework.startDate);
      const endDate = new Date(homework.endDate);

      return endDate >= currentDate;
    });
  };
  const filteredAssignedHomeworks = filterAssignedHomeworks(data);

  const filterOverdueHomeworks = (homeworks) => {
    const currentDate = new Date(); // Şu anki tarih ve saat

    return homeworks.filter((homework) => {
      const startDate = new Date(homework.startDate);
      const endDate = new Date(homework.endDate);

      return endDate <= currentDate;
    });
  };
  const filteredOverdueHomeworks = filterOverdueHomeworks(data);

  const filterEvaluatedHomeworks = async (homeworks) => {
    try {
      const studentHomeworkIds = await getAll();

      const studentNotNullPoint = studentHomeworkIds.data.filter(
        (homework) => homework.point !== null && !isNaN(homework.point)
      );
      const studentHomeworkIdsArray = studentNotNullPoint.map(
        (student) => student.homeWorkId
      );

      const evaluatedHomeworks = homeworks.filter((homework) => {
        return studentHomeworkIdsArray.includes(homework.id);
      });
      return evaluatedHomeworks;
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Ödevleri filtreleme sırasında bir hata oluştu:", error);
      throw error;
    }
  };

  //Eklenen dosyayı URL'e Çevirme
  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data.data], { type: fileType });
    return URL.createObjectURL(blob);
  };

  //Yüklü olan dosyayı açma işlemi
  const handleDownloadFile = async (filePath, homeworkId) => {
    try {
      const fileResponse = await downloadFileHomework(filePath, homeworkId);

      if (fileResponse.status == 200) {
        const url = convertFileToUrl(fileResponse, fileResponse.data.type);
        window.open(url);
      } else if (fileResponse.status == 404) {
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
    handleDownloadFile(filePath, homeworkId);
  };

  //Update İşlemi
  const handleEdit = (id) => {
    navigate(`../trainerhomeworkupdate/${id}`);
  };

  //Detail İşlemi
  const handleDetail = (id) => {
    navigate(`../trainerhomeworkdetails/${id}`);
  };
  //Create İşlemi
  const handleCreate = () => {
    navigate(`../trainerhomeworkcreate`);
  };

  //Seçili Ödeve Ait Atanmış Kişileri Listeleme işlemi || Atanmış biri yoksa Alert gösterme
  const handleStudentAssignmentLHomeworkList = async (id) => {
    try {
      const studentList = await getStudentListByHomeworkId(id);
      if (studentList !== null)
        navigate(`../../studenthomework/trainerstudentassigmentlist/${id}`);
    } catch (error) {
      const initialConfirmation = await Swal.fire({
        title: "Bu ödev henüz bir sınıfa veya öğrenciye atanmamış.",
        icon: "warning",
      });
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
    }
  };

  //Silme işlemi
  const handleDeleteHomework = async (row) => {
    //referancefile eklenmemişse normal silme alerti çıkarır
    if (row.original.referansFile == null) {
      const isSuccess = await DeleteItem(
        row.original.id,
        deleteHomework // apiden gelen silme fonksiyonu
      );
      if (isSuccess) {
        setData(data.filter((homework) => homework.id !== row.original.id));
      }
    }
    //referancefile eklenmişse kalıcı sil/belgeyi sakla opsiyonu çıkarır.
    else {
      const isSuccess = await PermanentlyDeleteItem(
        row.original.id,
        permanentlyDeleteHomework // apiden gelen silme fonksiyonu
      );
      if (isSuccess) {
        setData(data.filter((homework) => homework.id !== row.original.id));
      }
    }
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
      handleEdit(id);
    }
    // else if(option === "Detay"){
    //   handleDetail(id);
    // }
    else if (option === "Detay") {
      //handleDetail(id);
      handleStudentAssignmentLHomeworkList(id);
    }
  };

  //Tablo verilerinini yönetimi
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
      Header: "Sınıf",
      accessor: "classroomId",
      Cell: ({ value }) =>
        classrooms.find((classroom) => classroom.id === value)?.name ||
        "Sınıf yok",
    },
    {
      Header: "Tarih Aralığı",
      accessor: "dateRange", // You can use any accessor name you prefer
      Cell: ({ row }) => (
        <span>
          {formatDate(row.original.startDate)} -{" "}
          {formatDate(row.original.endDate)}
        </span>
      ),
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
              options={["Düzenle", "Detay"]}
              onOptionClick={(option) =>
                handleDropdownAction(option, row.original.id)
              }
            />
            <button onClick={() => handleDeleteHomework(row)}>
              <BsTrash />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Ödevler</h1>
      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>
      <ul className="tag-list">
        <li>
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => handleTabChange("all")}
          >
            Tümü
          </button>
        </li>
        <li>
          <button
            className={activeTab === "evaluated" ? "active" : ""}
            onClick={() => handleTabChange("evaluated")}
          >
            Değerlendirilenler
          </button>
        </li>
        <li>
          <button
            className={activeTab === "overdue" ? "active" : ""}
            onClick={() => handleTabChange("overdue")}
          >
            Tarihi Geçenler
          </button>
        </li>
        <li>
          <button
            className={activeTab === "assigned" ? "active" : ""}
            onClick={() => handleTabChange("assigned")}
          >
            Atanmışlar
          </button>
        </li>
      </ul>

      {Array.isArray(data) && data.length > 0 ? (
        <DataTable columns={columns} data={filteredEvaluatedHomeworks} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz.</p>
      )}
   
    </div>
  );
};
export default HomeworkList;
