import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getCategoryById } from "../api/categoryApi";
import { createSubCategory } from "../api/subCategoryApi";
import ToastContent from "../../../shared/toast-content/ToastContent";
import "react-toastify/dist/ReactToastify.css";

function SubCategoryCreate() {
  const [technicalUnitId, setTecnicalUnitId] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [category, setCategory] = useState([]);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [resultMessage, setResultMessage] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");

  const navigate = useNavigate();

  let savedData = sessionStorage.getItem("savedData");
  if (sessionStorage.getItem("savedData") != null) {
    savedData = sessionStorage.getItem("savedData").split(",");
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  useEffect(() => {
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
          } 
          console.error("Veriler alınırken hata oluştu ", error)
        }
        );
    };
    fetchCategories();
  }, [id]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const categoryData = await getCategoryById(category);
        setParentCategoryId(categoryData.data.id);
        setTecnicalUnitId(categoryData.data.technicalUnitId);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Konular alınırken hata oluştu: ", error);
      }
    };
    fetchAllData();
  }, [category]);

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("technicalUnitId", technicalUnitId);
    formData.append("parentCategoryId", parentCategoryId);

    try {
      const result = await createSubCategory(formData);

      const message = result.data.message;
      setSuccessMessage(message);

      setTimeout(() => {
        navigate(`/admin/subcategory`);
      }, 2000);
      
    } catch (errors) {

      if (errors.Name) {
        setCategoryMessage("");
        setResultMessage(errors.Name[0]);
      } else if (errors.message) {
        setCategoryMessage("");
        setResultMessage("");
        setErrorMessage(errors.message);
      } else {
        setResultMessage("");
        setCategoryMessage(
          errors.message || "Lütfen bir kategori adı seçiniz !"
        );
      }
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="homework-form-container">
      <h1>Alt Kategori Ekle</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />

      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="name" className="form-label">
            Alt Kategori Adı :
          </label>
          <input
            className="form-input"
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>

        {resultMessage && <div className="error-message">{resultMessage}</div>}

        <div className="form-field">
          <label htmlFor="category" className="form-label">
            Kategori Adı :
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="form-input option"
          >
            <option className="option" value="0">
              Lütfen Seçim Yapın
            </option>
            {categories?.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </select>
         
        </div>

        {categoryMessage && (
          <div className="error-message">{categoryMessage}</div>
        )}

        <div className="buttons-form">
          <input
            type="submit"
            value="Ekle"
            onClick={handleSubmit}
            className=" submit-button"
          />

          <Link className="submit-button backto-list" to={"/admin/subcategory"}>
            Listeye Dön
          </Link>
        </div>

        {showToast(errorMessage, "error")}
        {showToast(successMessage, "success")}
       
      </form>
    </div>
  );
}

export default SubCategoryCreate;
