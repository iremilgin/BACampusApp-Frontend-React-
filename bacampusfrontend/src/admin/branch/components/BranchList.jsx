import React, {useState, useEffect} from 'react'
import "../scss/branch-list.scss";
import { useNavigate } from 'react-router-dom';
import { Button } from "semantic-ui-react";
import { getAllBranch, deleteBranch } from '../api/branchApi';
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { BsGear, BsTrash, BsChevronCompactDown } from "react-icons/bs";
import DataTable from "../../../shared/data-table/DataTable";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";

const BranchList = () => {
    const [branchList, setBranchList] = useState([]);

    useEffect(() => {
        fetchBranchList();
    }, [])

    const fetchBranchList = async () => {
        try {
          const list = await getAllBranch();
          setBranchList(list);
        } catch (error) {
          if (error.name === 'RedirectError') {
            navigate('/error'); // Redirect to ErrorPage
          }     
          console.error("Error fetching trainingType list:", error);
        }
      };
    
    const navigate = useNavigate();
    
    const handleCreate = () => {
        navigate('./branchcreate')
    }

    const columns = [
        {
          Header: "Şubeler",
          accessor: "name",
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
                onOptionClick={() => handleDropdownAction(row.original.id)}
              />
              <button onClick={() => handleDeleteType(row.original.id)}>
                <BsTrash />
              </button>
            </div>
          ),
        },
      ];

      const handleDropdownAction = (id) => {
        handleUpdate(id);
      };
    
      const handleUpdate = (id) => {
        console.log(id, "update id'si");
        navigate(`./branchupdate/${id}`);
      };
    
      const handleDeleteType = async (id) => {
        const isSuccess = await DeleteItem(
          id,
          deleteBranch // apiden gelen silme fonksiyonu
        );
    
        if (isSuccess) {
            setBranchList(branchList.filter((type) => type.id !== id));
        }
      };

  return (
    <div>
        <h1>Şube</h1>
        <img className="line" src={require("../img/substract.png")} alt="" />
        <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>
      {Array.isArray(branchList) && branchList.length > 0 ? (
        <DataTable columns={columns} data={branchList} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz....</p>
      )}
    </div>
  )
}

export default BranchList