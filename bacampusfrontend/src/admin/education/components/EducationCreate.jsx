import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createEducation } from "../api/educationApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastContent from "../../../shared/toast-content/ToastContent";

const EducationCreate = () => {
  const [educationName, setEducationName] = useState("");
  const [description, setDescription] = useState("");
  const [courseHours, setCourseHours] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [nameError, setNameError] = useState("");
  const [courseHoursError, setCourseHoursError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState([]);

  const navigate = useNavigate();

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  }

  useEffect(() => {
    if (apiMessageError) {
      showToast(apiMessageError, "error");
    } else if (defaultMessage) {
      showToast(defaultMessage, "error");
    }
  }, [apiMessageError, defaultMessage]);


  let savedData = sessionStorage.getItem("savedData");
  if (sessionStorage.getItem("savedData") != null) {
    savedData = sessionStorage.getItem("savedData").split(",");
  }

  const fetchCategories = () => {
    fetch("https://localhost:7247/api/Admin/Category/ListAll", {
      mode: "cors",
      headers: {
        Authorization: "Bearer " + savedData[0],
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  };


  const fetchSubCategories = (categoryId) => {
    fetch(
      `https://localhost:7247/api/Admin/Category/ListByParentId?parentCategoryId=${categoryId}`,
      {
        mode: "cors",
        headers: {
          Authorization: "Bearer " + savedData[0],
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSubCategories(data.data);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createEducation({
        name: educationName,
        description: description,
        courseHours: courseHours,
        subCategoryId: subCategory || null,
        //categoryId: category
        //subCategoryId: subCategory || null,
      });
      const message = data.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("../../education");
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);
      if (error.errorMessages.Name) {
        setNameError(error.errorMessages.Name);
      } else {
        setNameError("");
      }
      if (error.errorMessages.CourseHours) {
        setCourseHoursError(error.errorMessages.CourseHours);
      } else {
        setCourseHoursError("");
      } if (error.errorMessages.message) {
        setApiMessageError(error.errorMessages.message);
      } else {
        setApiMessageError("");
      }
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    fetchSubCategories(e.target.value);
  };

  return (
    <div className="homework-form-container">
      <h1>Eğitim Ekle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />

      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="category" className="form-label">
                  Eğitim Kategorisi :
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="form-input option"
                >
                  <option className="option" value="0">
                    Seçiniz
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="subCategory" className="form-label right-label">
                  Alt Kategori :
                </label>
                <select
                  id="categoryId"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="form-input option"
                >
                  <option className="option" value="1">
                    Seçiniz
                  </option>
                  {subCategories.map((subCat) => (
                    <option key={subCat.id} value={subCat.id}>
                      {subCat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="educationName" className="form-label">
                  Eğitim Adı :
                </label>
                <input
                  type="text"
                  id="educationName"
                  value={educationName}
                  onChange={(e) => setEducationName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
                {nameError && <div className="error-message">{nameError}</div>}
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="courseHours" className="form-label right-label">
                  Toplam Kurs Saati :
                </label>
                <input
                  type="number"
                  id="courseHours"
                  value={courseHours}
                  onChange={(e) => setCourseHours(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
                {courseHoursError && (
                  <div
                    className="error-message"
                    style={{ paddingLeft: "24px" }}
                  >
                    {courseHoursError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error.CourseHours && (
          <div className="error-message-sm">
            {error.CourseHours.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="description" className="form-label ">
                  Açıklama :
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Lütfen eğitimin açıklamasını girin."
                  rows="5"
                  className="form-input"
                  style={{ fontFamily: "CustomFont", fontSize: "12.18px" }}
                ></textarea>
              </div>
              <div>
                {defaultMessage && (
                  <div className="error-message">{defaultMessage}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}

        <div className="buttons-form">
          <input type="submit" value="Ekle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/education"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EducationCreate;
