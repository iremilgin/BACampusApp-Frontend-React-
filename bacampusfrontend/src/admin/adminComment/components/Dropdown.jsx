import React, { useState, useEffect } from "react";
import "../scss/button.scss";
import "../scss/style.scss";

function Dropdown({ 
  options, 
  userIndex, 
  currentOpenIndex, 
  closeAllDropdowns,
  onViewDetails, 
  onEditTag,
  onDeleteTag,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(currentOpenIndex === userIndex);
  }, [currentOpenIndex, userIndex]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    closeAllDropdowns(isOpen ? -1 : userIndex);
  };

  const handleActionClick = (action) => {
    console.log(`Perform action: ${action}`);
    if (action === "Detay Görüntüle") {
      onViewDetails(userIndex);
    
    } 
    else if (action === "Düzenle") {
      onEditTag(userIndex);
    }else if (action === "Sil") {
      // Silme işlemi için bu blok eklendi
      onDeleteTag(userIndex);
    }
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container">
      <button onClick={toggleDropdown} className="btn-operations">
        İşlemler
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {options.map((option, index) => (
            <button
              key={index}
              className="dropdown-option"
              onClick={() => handleActionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;