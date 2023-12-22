import React, { useEffect, useState } from "react";
// import "../scss/category-details.scss";
import {
  listAllSubCategory,
  listByParentId,
} from "../api/subCategoryApi.js";
import{getCategoryById}from"../api/categoryApi.js";
import { useNavigate } from "react-router-dom";
import { Button} from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { deleteSubCategory } from "../api/subCategoryApi.js";



function SubCategoryList() {

  const [subCategories, setSubCategories] = useState([]);
  const navigate = useNavigate();

  // console.log(users, "denem");

  useEffect(() => {
    listAllSubCategory()
      .then((data) => {
        setSubCategories(data);
      })

      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  // const handleDetail = (id) => {
  //   console.log(id, "id var mi");
  //   navigate(`./categorydetails/${id}`);
  // };

  const handleUpdate = (id) => {
    // console.log(id, "update id'si");
    navigate(`./subcategoryupdate/${id}`);
  };

  const handleCreate = () => {
    navigate(`./subcategorycreate`);
  };

  const handleDeleteSubCategory = async (id) => {
    const isSuccess = await DeleteItem(id, deleteSubCategory);

    if (isSuccess) {
      setSubCategories(subCategories.filter((subcategory) => subcategory.id !== id));

    }
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
      handleUpdate(id);
    }
    // } else if (option === "Detay") {
    //   handleDetail(id);
    // }
  };

  const columns = [
    {
      Header: "Alt Kategori İsmi",
      accessor: "name",
    },
    {
      Header: "Kategori İsmi",
      accessor: "parentCategoryId",
      Cell: ({ value }) => {
        const [parentCategory, setParentCategory] = useState(null);

        useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await getCategoryById(value);
              setParentCategory(response.data);
            } catch (error) {
              if (error.name === 'RedirectError') {
                navigate('/error'); // Redirect to ErrorPage
              } 
              console.error("Error fetching parent category:", error);
            }
          };

          fetchData();
        }, [value]);

        return parentCategory ? parentCategory.name : "Belirtilmemiş";
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
            options={["Düzenle"]}
            onOptionClick={(option) =>
              handleDropdownAction(option, row.original.id)
            }
          />
          <button onClick={() => handleDeleteSubCategory(row.original.id)}>
            <BsTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1> Alt Kategoriler</h1>

      <img className="line" src={require("../img/substract.png")} alt="" />

      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>

      {Array.isArray(subCategories) && subCategories.length > 0 ? (
        <DataTable
          columns={columns}
          data={subCategories}
          handleUpdate={handleUpdate}
          handleDeleteCategory={handleDeleteSubCategory}
        />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default SubCategoryList;
