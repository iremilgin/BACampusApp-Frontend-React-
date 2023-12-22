import React, { useEffect, useState } from "react";
// import "../scss/category-details.scss";
import {
  getCategoryById,
  listByParentId,
  deleteCategory,
} from "../api/categoryApi.js";
import{getTechnicalUnitById}from"../../technicalunit/Api/technicalunitApi.js"
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

function CategoryDetails() {
  const [category, setCategory] = useState(null);
  const [categoryTechnicalUnit, setCategoryTechnicalUnit] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    listByParentId(id)
      .then(async (data) => {
        setSubCategories(data);
  
        // Fetch technical unit information for each subcategory
        const subcategoriesWithTechnicalUnit = await Promise.all(
          data.map(async (subcategory) => {
            const technicalUnit = await getTechnicalUnitById(subcategory.technicalUnitId);
            return {
              ...subcategory,
              technicalUnitName: technicalUnit.data.name,
            };
          })
        );
  
        setSubCategories(subcategoriesWithTechnicalUnit);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seçilen kategori id'siyle kategori bilgisini al
        const selectedCategory = await getCategoryById(id);
        setCategory(selectedCategory.data);

        // Seçilen kategori için teknik birim bilgisini al
        const technicalUnit = await getTechnicalUnitById(selectedCategory.data.technicalUnitId);
        setCategoryTechnicalUnit(technicalUnit.data);

        // Alt kategorilerin listesini al
        const subcategories = await listByParentId(id);
        setSubCategories(subcategories);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Download Error: ", error.message);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    listByParentId(id)
      .then((data) => {
        setSubCategories(data);
      })

      .catch((error) =>{
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  const handleCreate = () => {
    navigate(`./categorydetails/${id}/subcategoryCreate`);
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
      handleUpdate(id);
    }
  };

  const handleUpdate = (id) => {
    navigate(`./categoryupdate/${id}`);
  };

  const handleDeleteCategory = async (id) => {
    const isSuccess = await DeleteItem(id, deleteCategory);

    if (isSuccess) {
      setSubCategories(
        subCategories.filter((subCategories) => subCategories.id !== id)
      );
    }
  };

  const columns = [
    {
      Header: "Alt Kategori İsmi",
      accessor: "name",
    },
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="buttons">
          <button onClick={() => handleDeleteCategory(row.original.id)}>
            <BsTrash />
          </button>
        </div>
      ),
    },
  ];

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="category-details-title">
      <div className="p-4">
        <h1 className="form-title-2">{category.name} - Detay </h1>

        <img className="line" src={require("../img/substract.png")} alt="" />
        <h2>Teknik birimi: <span style={{fontWeight: "normal", color: "gray"}}>{categoryTechnicalUnit ? categoryTechnicalUnit.name : "bulunamadı" }</span></h2>
        

        <Button className="btn-create" onClick={() => handleCreate()}>
          Ekle
        </Button>

        {Array.isArray(subCategories) && subCategories.length > 0 ? (
          <DataTable
            columns={columns}
            data={subCategories}
            handleUpdate={handleUpdate}
            handleDeleteCategory={handleDeleteCategory}
          />
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px", fontSize:18 }}>{subCategories.length > 0 ? "Veriler yükleniyor, Lütfen bekleyiniz...." : "Alt kategori yok."}</p>
        )}
        <ToastContainer />
      </div>
      {/* <div className="form-buttons">
        <button
          className="go-back-button cancel-button "
          onClick={() => navigate(`/admin/category`)}
        >
          Listeye Dön
        </button>
      </div> */}
    </div>
  );
}

export default CategoryDetails;
