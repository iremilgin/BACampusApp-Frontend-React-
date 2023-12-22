import React, { useEffect, useState } from "react";
import "../scss/tag-details.scss";
import { getTagById } from "../api/tagApi";

const TagDetails = ({ tagId, onClose }) => {
  const [tag, setTag] = useState(null);

  useEffect(() => {
    function fetchData() {
      try {
        // Etiket bilgilerini asenkron olarak çekmek için await kullanın
        const tagData = getTagById(tagId);
        setTag(tagData);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Etiket bilgileri alınamadı", error);
      }
    }

    fetchData();
  }, [tagId]);

  const getTagById = (tagId) => {
    try {
      // Tag bilgilerini çekmek için uygun bir API çağrısı yapın
      const response = fetch(`API_URL/${tagId}`); // API_URL'i uygun bir şekilde güncelleyin
      if (!response.ok) {
        throw new Error("Etiket bilgileri alınamadı");
      }
      const tagData = response.json();
      return tagData;
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      throw error;
    }
  };
  if (!tag) {
    return <div>Loading...</div>;
  }

  const handleGoBack = () => {
    onClose();
  };

  return (
    <div className="tag-details-container">
      <h1 className="tag-details-title">{tag.name}</h1>
      <div className="tag-details-item">
        <span className="tag-details-label">Etiket Adı:</span>
        <span className="tag-details-value">{tag.name}</span>
      </div>
      <div className="form-buttons">
        <button className="custom-cancel-button " onClick={handleGoBack}>
          Listeye Dön
        </button>
      </div>
    </div>
  );
};

export default TagDetails;
