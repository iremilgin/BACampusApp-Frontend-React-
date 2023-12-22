// import Table from "../dataTable/Table";
// import Dropdown from "../dataTable/DropdownDeleted";
// import { useEffect, useState } from "react";
// import "../scss/button.scss";
// import "../scss/style.scss";
// import { getAllDeletedTags } from "../api/tagApi";
// function TagList() {
//   const [users, setUsers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentOpenIndex, setCurrentOpenIndex] = useState(-1);
//   const [selectedTagId, setSelectedTagId] = useState(null);
//   const savedData = sessionStorage.getItem("savedData").split(",");

//   const fetchData = async ()=>{
//     try{
//       const deletedTagList = await getAllDeletedTags();
//       setUsers(deletedTagList);
//       setTotalPages(Math.ceil(deletedTagList.length/pageSize));
//     } catch (error){
//       console.error("Veriler alınırken hata oluştu: ", error)
//     }
//   }

//   useEffect(()=>{
//     fetchData();
//   },[pageSize])

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handlePageSizeChange = (event) => {
//     setPageSize(Number(event.target.value));
//     setCurrentPage(1);
//   };

//   const getUsersForCurrentPage = () => {
//     const startIndex = (currentPage - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     return users.slice(startIndex, endIndex);
//   };

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pageNumbers.push(i);
//     }
//     return pageNumbers;
//   };

//   const shouldShowPagination = totalPages > 1;
//   const closeAllDropdowns = (exceptIndex) => {
//     setCurrentOpenIndex(exceptIndex);
//   };
//   const handleCloseForm = () => {
//     setSelectedTagId(null);
//   };
  
//   return (
//     <div className="p-4">
//       <div>
//         <h1 className="form-title-2">Etiketler</h1>
//         <img
//           className="line"
//           src={require("../../../assets/img/substract.png")}
//           alt=""
//         />
//       </div>
      
//       <h3 className="tag-title">Silinen Etiketler</h3>
//       <Table
//         searchable={true}
//         head={[
//           { name: "Etiket", sortable: true },
//         ]}
//         body={getUsersForCurrentPage().map((user, key) => [
//           <div key={`${user.name}`}>{user.name}</div>,
//           [
//             <Dropdown
//               key={`actions-${user.id}`}
//               options={["Detay Görüntüle", "Düzenle", "Sil"]}
//               userIndex={key}
//               currentOpenIndex={currentOpenIndex}
//               closeAllDropdowns={closeAllDropdowns}
//             />,
//           ],
//         ])}
//       />
//       <div className="page-size-container">
//         <span>Göster:</span>
//         <select
//           className="page-size-select"
//           value={pageSize}
//           onChange={handlePageSizeChange}
//         >
//           <option value={5}>5</option>
//           <option value={10}>10</option>
//           <option value={25}>25</option>
//           <option value={50}>50</option>
//           <option value={users.length}>Tümü</option>
//         </select>
//       </div>
//       {shouldShowPagination && (
//         <div>
//           <div className="pagination">
//             <button
//               className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               Geri
//             </button>
//             {getPageNumbers().map((page) => (
//               <button
//                 key={page}
//                 className={`page-btn ${page === currentPage ? "active" : ""}`}
//                 onClick={() => handlePageChange(page)}
//               >
//                 {page}
//               </button>
//             ))}
//             <button
//               className={`page-btn ${
//                 currentPage === totalPages ? "disabled" : ""
//               }`}
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               İleri
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// export default TagList;