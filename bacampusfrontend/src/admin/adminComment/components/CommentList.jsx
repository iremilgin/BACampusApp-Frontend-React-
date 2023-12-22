import Table from "./Table";
import Dropdown from "./Dropdown";
// import Dropdown from "../../admin/components/Dropdown";
// import Dropdown from "../../admin/components/table";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import "../scss/button.scss";
import "../scss/style.scss";
import CommentDetails from "./CommentDetails";
import CommentUpdate from "./CommentUpdate";
import { Link } from "react-router-dom";

function CommentList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [currentOpenIndex, setCurrentOpenIndex] = useState(-1);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedCommentUpdateId, setSelectedCommentUpdateId] = useState(null);
  const savedData = sessionStorage.getItem("savedData").split(",");

  useEffect(() => {
    fetch("https://localhost:7247/api/Admin/Comment/ListAll", {
      mode: "cors",
      headers: {
        Authorization: "Bearer " + savedData[0],
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        console.log(data.data);
        setTotalPages(Math.ceil(data.data.length / pageSize));
      })
      .catch((error) =>
        console.error("Veriler alınırken hata oluştu: ", error)
      );
  }, [pageSize]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const getUsersForCurrentPage = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return users.slice(startIndex, endIndex);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const shouldShowPagination = totalPages > 1;
  const closeAllDropdowns = (exceptIndex) => {
    setCurrentOpenIndex(exceptIndex);
  };

  const handleEditComment = (userIndex) => {
    const globalUserIndex = (currentPage - 1) * pageSize + userIndex;
    const selectedCommentId = users[globalUserIndex].id;
    setSelectedCommentId(null);
    setSelectedCommentUpdateId(selectedCommentId);
  };
 
  const handleViewDetails = (userIndex) => {
    const globalUserIndex = (currentPage - 1) * pageSize + userIndex;
    const selectedCommentId = users[globalUserIndex].id;
    setSelectedCommentId(selectedCommentId); 
  };
  

  const handleCloseDetails = () => {
    setSelectedCommentId(null);
  };

  const handleCloseUpdate = () => {
    setSelectedCommentUpdateId(null);
  };
  const handleDeleteComment = async (commentId, identityId) => {
    const result = await Swal.fire({
      title: "Silmek İstediğinize Emin Misiniz?",
      text: "Silindikten sonra bu öğeyi kurtaramazsınız!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet, Sil!",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `https://localhost:7247/api/Admin/Comment/Delete?id=${encodeURIComponent(
            commentId
          )}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + savedData[0],
            },
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "Silindi!",
            text: "Seçtiğiniz öge silindi.",
            icon: "success",
          });

          setUsers(users.filter((user) => user.id !== commentId));
        } else {
          throw new Error("Silme işlemi sırasında bir hata oluştu.");
        }
      } catch (error) {
        Swal.fire({
          title: "Hata!",
          text: "Öge silinirken bir hata oluştu.",
          icon: "error",
        });
      }
    }
  };
  const handleCloseForm = () => {
    setSelectedCommentId(null);
    setSelectedCommentUpdateId(null);
  };
  const handleUpdateSuccess = async (message) => {
    await fetch("https://localhost:7247/api/Admin/Comment/ListAll")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        console.log(data.data);
        setTotalPages(Math.ceil(data.data.length / pageSize));
      });
    alert(message);
  };

  return (
    <div className="p-4">
      <h1 className="form-title-2">Yorumlar</h1>
      <img className="line" src={require("../../../assets/img/substract.png")} alt="" />
      {/* <div className="row-button-create">
        <Link to={`/subjectcreate`} className="btn btn-primary-2">
          Ekle
        </Link>
      </div> */}

      {selectedCommentId ? (
        <CommentDetails
          commentId={selectedCommentId}
          onClose={handleCloseDetails}
        />
      ) : selectedCommentUpdateId ? (
        <CommentUpdate
          commentId={selectedCommentUpdateId}
          onUpdateSuccess={(message) => {
            handleCloseUpdate();
            handleCloseForm();
            handleUpdateSuccess(message);
            alert(message);
          }}
          onClose={handleCloseUpdate}
        />
      ) : (
        <>
          <Table
            searchable={true}
            head={[
              { name: "Başlık", sortable: true },
              { name: "İçerik", sortable: true },
              { name: "Yorum Türü", sortable: true },
              { name: "İşlemler", width: 200 },
            ]}
            body={getUsersForCurrentPage().map((user, key) => [
              <div key={`${user.title}`}>{user.title}</div>,
              <div key={`${user.content}`}>{user.content}</div>,
              <div key={`${user.itemType}`}>{user.itemType}</div>,

              [
                <Dropdown
                  key={`actions-${user.id}`}
                  options={["Detay Görüntüle", "Sil"]}
                  userIndex={key}
                  currentOpenIndex={currentOpenIndex}
                  closeAllDropdowns={closeAllDropdowns}
                  onViewDetails={handleViewDetails}
                  onEditStudent={handleEditComment}
                  onDeleteStudent={() => handleDeleteComment(user.id)}
                />,
              //   <Link
              //   to={`/commentdetails/${user.id}`}
              // >
              //   Detaylar
              // </Link>            
              ],
            ])}
          />
          <div className="page-size-container">
            <span>Göster:</span>
            <select
              className="page-size-select"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={users.length}>Tümü</option>
            </select>
          </div>
          {shouldShowPagination && (
            <div>
              <div className="pagination">
                <button
                  className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Geri
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${
                      page === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className={`page-btn ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  İleri
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default CommentList;
