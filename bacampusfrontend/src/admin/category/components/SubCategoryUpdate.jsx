import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategoryById, listAllCategory } from "../api/categoryApi";
import { updateSubCategories } from "../api/subCategoryApi";
import ToastContent from "../../../shared/toast-content/ToastContent";
import "react-toastify/dist/ReactToastify.css";

function SubCategoryUpdate() {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  const [parentCategory, setParentCategory] = useState("");
  const [error, setError] = useState("");

  const [resultMessage, setResultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  let savedData = sessionStorage.getItem("savedData");
  if (savedData != null) {
    savedData = savedData.split(",");
  }

  useEffect(() => {
    listAllCategory()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Veriler alınırken hata oluştu ", error));

    //Alt kategorileri getiriyor.

    getCategoryById(id)
      .then((data) => {
        console.log(data);
        setSubCategoryName(data.data.name);
        // setTecnicalUnit(data.data.technicalUnitId);
        setParentCategory(data.data.parentCategoryId);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, [id]);

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await updateSubCategories(id, {
        id: id,
        name: subCategoryName,
        parentCategoryId: parentCategory || null,
      });

      const message = data.data.message;
      setSuccessMessage(message);

      setTimeout(() => {
        navigate(`/admin/subcategory`);
      }, 2000);
    } catch (errors) {
      if (errors.Name) {
        setResultMessage(errors.Name[0]);
      } else if (errors.message) {
        setResultMessage("");
        setErrorMessage(errors.message);
      } else {
        console.error(error);
        setResultMessage(errors.message); // genel hata mesajını yolla
      } 
    }
  };

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "0") {
      setResultMessage(error.ParentCategoryId);
    } else {
      setParentCategory(selectedValue);
      // Eğer hata mesajı daha önce görüntüleniyorsa temizle
      setResultMessage("");
    }
  };

  return (
    <div className="homework-form-container">
      <h1>Alt Kategori Güncelle</h1>
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
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
        </div>

        {resultMessage && <div className="error-message">{resultMessage}</div>}

        <div className="form-field">
          <label htmlFor="id" className="form-label">
            Kategori Seçiniz :
          </label>

          <select
            id="id"
            value={parentCategory}
            onChange={handleCategoryChange}
            required
            className="form-input"
          >
            {categories?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="buttons-form">
          <input type="submit" value="Guncelle" className="submit-button" />
          <Link className="submit-button backto-list" to={"/admin/subcategory"}>
            Listeye Dön
          </Link>
        </div>
      </form>

      {showToast(errorMessage, "error")}
      {showToast(successMessage, "success")}
    </div>
  );
}

export default SubCategoryUpdate;
