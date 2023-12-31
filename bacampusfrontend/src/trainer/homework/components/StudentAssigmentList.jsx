import React, { useEffect, useState, useRef } from "react";
import "../../../assets/scss/button.scss";
import DataTable from "../../../shared/data-table/DataTable";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStudentListByHomeworkId,
  getHomeworkById,
  getStudentHomeworkById,
  givePoint,
  giveFeedback,
} from "../Api/HomeworkApi";
import TextField from "@mui/material/TextField";
import HomeworkDetails from "../components/HomeworkDetails";
import Input from "@mui/material/Input";
import { ChangeFeedback } from "../../../shared/feedback/Feedback";

//Yetkilendirme
let savedData = sessionStorage.getItem("savedData");
let role;

if (savedData != null) {
  savedData = savedData.split(",");
  role = savedData[1];
}

const StudentAssigmentList = () => {
  const [data, setData] = useState([]);
  const [point, setPoint] = useState(0);
  const inputRef = useRef(null);
  const [doesHasPoint, setDoesHasPoint] = useState(true);
  const [studentHomeworkId, setStudentHomeworkId] = useState("");
  const [givePointChange, setGivePointChange] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const studentList = await getStudentListByHomeworkId(id);
      setData(studentList);
      const selectedHomework = await getHomeworkById(id);
      setDoesHasPoint(selectedHomework.data.isHasPoint);
      console.log(studentList);
      console.log(doesHasPoint);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Yüklenme Hatası: ", error.message);
    }
  };
  useEffect(() => {
    fetchData();
    console.log(data);
  }, [id]);

  //Dışarı tıklandığında işlemi iptal eden ve sadece bir kez çalışan kısım
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        // Eğer tıklama input alanının dışında gerçekleşirse

        setGivePointChange(false);
        alert("Ödev ekleme iptal edildi");
      }
    };
    // Document seviyesinde click olayı dinleyicisi eklemek
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Component kaldırıldığında olay dinleyicisini temizlemek
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  //Öğrenciye puan verme
  const handleGivePoint = async (studentHomeworkId) => {
    const studenthomework = await getStudentHomeworkById(studentHomeworkId);
    setPoint(studenthomework.data.point); // Puan ver dediğimizde en son puanı editable yapıp gösteriyor.
    setStudentHomeworkId(studentHomeworkId);
    setGivePointChange(true);
  };

  //Öğrencinin ödevine verilen puanın submit edilmesi
  const handlePointSubmit = async (event) => {
    event.preventDefault();
    const numberValue = event.target.number?.value || event.target.value;
    const formData = new FormData();
    formData.append("id", studentHomeworkId);
    formData.append("point", numberValue);
    setPoint(numberValue);

    try {
      const response = await givePoint(formData);
      const studentList = await getStudentListByHomeworkId(id);
      console.log(response);
      setData(studentList);
      setGivePointChange(false);
      alert("Öğrenciye puan verildi.");
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      alert(error.message || "Bir hata oluştu.");
    }
  };
  //Öğrenci Detaylarını Görüntüleme
  const handleDetail = (homeworkId, studentHomeworkId) => {
    navigate(
      `../../studenthomework/studenthomeworkdetail/${homeworkId}/${studentHomeworkId}`
    );
  };
  //Ödeve geri bildirim eklemek için kullanılan fonksiyon.
  const handleGiveFeedback = async (studentHomeworkId) => {
    console.log(studentHomeworkId);
    ChangeFeedback(studentHomeworkId, giveFeedback);
  };

  //Ödevin durum Enumunun karşılıklarına çeviren fonksiyon
  function getHomeworkStateString(homeworkState) {
    switch (homeworkState) {
      case 0:
        return "Atanmış";
      case 1:
        return "Teslim Edilmiş";
      case 2:
        return "Teslim Edilmemiş";
      case 3:
        return "Geç Teslim Edilmiş";
    }
  }

  //Tablo verilerinini yönetimi
  const columns = [
    {
      Header: "Adı",
      accessor: "firstName",
    },
    {
      Header: "Soyadı",
      accessor: "lastName",
    },
    doesHasPoint
      ? {
          Header: "Puan",
          accessor: "point",
          Cell: ({ value, row }) => {
            if (
              givePointChange &&
              row.original.studentHomeworkId === studentHomeworkId
            ) {
              return (
                <form onSubmit={handlePointSubmit} onBlur={handlePointSubmit}>
                  <Input
                    id="point"
                    sx={{ m: 0.5, width: "9ch" }}
                    type="number"
                    defaultValue={point}
                    name="number"
                    ref={inputRef}
                  />
                </form>
              );
            } else {
              return (
                <form>
                  <Input
                    disabled
                    id="number"
                    sx={{ m: 0.5, width: "9ch" }}
                    type="number"
                    value={value ? value : 0}
                  />
                </form>
              );
            }
          },
        }
      : { accessor: "null" },
    {
      Header: "Teslim Edilme Durumu",
      accessor: "homeworkState",
      Cell: ({ value }) =>
        value !== null ? getHomeworkStateString(value) : "Bilinmeyen Durum",
    },
    {
      Header: "İşlemler",
      accessor: "studentHomeworkId",
      accessor2: "homeworkId",
      Cell: ({ value, row }) =>
        value ? (
          doesHasPoint ? (
            row.original.homeworkState === 1 ||
            row.original.homeworkState === 3 ? ( //test bittiğinde bu şekilde kullanılmalıdır.
              //row.original.homeworkState === 0 ? ( //test amaçlı eklendi.
              <div className="buttons">
                <button
                  className="details-column"
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => handleGiveFeedback(value)}>
                  Geri Bildirim Ver
                </button>
                <br />
                <button
                  className="details-column"
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => handleGivePoint(value)}>
                  Puan Ver
                </button>
                <br />
                <button
                  className="details-column"
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => handleDetail(id, value)}>
                  Detaylar
                </button>
              </div>
            ) : (
              <div className="buttons">
                <button
                  className="details-column"
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => handleDetail(id, value)}>
                  Detaylar
                </button>
              </div>
            )
          ) : (
            <div className="buttons">
              {(row.original.homeworkState === 1 ||
                row.original.homeworkState === 3) && (
                <button onClick={() => handleGiveFeedback(value)}>
                  Geri Bildirim Ver
                </button>
              )}
              <button
                className="details-column"
                style={{ fontSize: "0.9rem" }}
                onClick={() => handleDetail(id, value)}>
                Detaylar
              </button>
            </div>
          )
        ) : (
          "ID bulunamıyor"
        ),
    },
  ];

  return (
    <div>
      {/* <h1>Öğrenci Listesi</h1> */}
      <HomeworkDetails></HomeworkDetails>
      {Array.isArray(data) && data.length > 0 ? (
        <DataTable
          columns={columns}
          data={data}
          handleDetail={handleDetail}
          handleGivePoint={handleGivePoint}
        />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz.</p>
      )}
    </div>
  );
};

export default StudentAssigmentList;
