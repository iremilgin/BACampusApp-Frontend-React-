import React, { useEffect, useState } from "react";
import "../scss/comment-details.scss";
import "../scss/button.scss";
// import { Link } from "react-router-dom";

let savedData = sessionStorage.getItem("savedData");
if (sessionStorage.getItem("savedData") != null) {
  savedData = sessionStorage.getItem("savedData").split(",");
  const role = savedData[1];
}
const CommentDetails = ({ commentId, onClose }) => {
  const [comment, setComment] = useState(null);

  useEffect(() => {
    fetch(
      `https://localhost:7247/api/Admin/Comment/GetById?guid=${commentId}`,
      {
        mode: "cors",
        headers: {
          Authorization: "Bearer " + savedData[0],
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setComment(data.data))
      .catch((error) =>
        console.error("Veriler alınırken hata oluştu: ", error)
      );
  }, [commentId]);

  if (!comment) {
    return <div>Loading...</div>;
  }

  const handleGoBack = () => {
    onClose();
  };

  const commentTypeMap = {
    1: "Student",
    2: "HomeWork",
    3: "SupplementaryResource",
  };
  
  
  const getCommentTypeText = (commentType) => {
    return commentTypeMap[commentType] || "Bilinmeyen"; 
  };

  return (
    <div className="comment-details-container">
      <h1 className="comment-details-title">
        {comment.title}
      </h1>
      <div className="comment-details-item">
        <span className="comment-details-label">Başlık:</span>
        <span className="comment-details-value">{comment.title}</span>
      </div>
      <div className="comment-details-item">
        <span className="comment-details-label">İçerik:</span>
        <span className="comment-details-value">{comment.content}</span>
      </div>
      <div className="comment-details-item">
        <span className="comment-details-label">Yorum Türü:</span>
        <span className="comment-details-value">
            {getCommentTypeText(comment.itemType)}
       </span>
      </div>
      <div className="form-buttons">
        <button className="custom-cancel-button" onClick={handleGoBack}>
          Listeye Dön
        </button>
      </div>
    </div>
  );
};

export default CommentDetails;
