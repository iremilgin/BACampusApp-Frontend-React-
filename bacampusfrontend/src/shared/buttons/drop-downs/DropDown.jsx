import React, { useState, useEffect } from "react";

function Dropdown({
  triggerText,
  options,
  onOptionClick,
  isOpen: controlledIsOpen,
  onClose,
  customClassName
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(controlledIsOpen);
  }, [controlledIsOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (controlledIsOpen) {
      onClose();
    }
  };

  const handleOptionClick = (option) => {
    onOptionClick(option);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown-container ${customClassName}`}>
      <button onClick={toggleDropdown} className={`btn-operations ${customClassName}`}>
        {triggerText}
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {options.map((option, index) => (
            <button
              key={index}
              className="dropdown-option"
              onClick={() => handleOptionClick(option)}
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
