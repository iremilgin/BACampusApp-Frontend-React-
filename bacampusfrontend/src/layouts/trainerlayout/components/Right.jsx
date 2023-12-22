import React, { useState } from "react";
import "../../trainerlayout/scss/right.scss";
import { Link, useNavigate } from "react-router-dom";
import { createRoleLog, logout } from "../../../features/account/api/accountApi";


let name = "";
let activeRole = "";
let roles = null;
let newRole = "";
let savedData = sessionStorage.getItem("savedData");
let userActiveRole = sessionStorage.getItem("userActiveRole");
if (savedData != null) {
  savedData = savedData.split(",");
  name = savedData[3].split(".")[0];
  name = name.charAt(0).toUpperCase() + name.slice(1);
  activeRole = savedData[1];
  roles = savedData.slice(4);
}
if (userActiveRole != null) {
  activeRole = userActiveRole;
}

const Right = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  async function RoleLog(role) {
    try {
      const newRoleLog = await createRoleLog({
        activeRole: role,
        actionType: 2
      });

    } catch (error) {
      console.error("Hata:", error);
    }
  }

  const changeRole = async (event) => {
    try {
      newRole = event.target.value;
      const result = await RoleLog(newRole);
      sessionStorage.setItem("userActiveRole", newRole);
      window.location.href="../";
    } catch (error) {
      console.error("Hata:", error);
    }
  };
  const handleLogoutClick = async (e) => {
    // e.preventDefault(); // Tıklama işlemini engelle
  
    try {
      await logout(); // Oturumu sonlandır
      
      // Oturum verilerini temizle
      sessionStorage.removeItem('savedData');
      localStorage.clear();
      sessionStorage.clear();
      // Kullanıcıyı yönlendir
      window.location.href = '/Account';
    } catch (error) {
      console.error('Çıkış işlemi sırasında bir hata oluştu:', error.message);
    }
  };

  return (
    <nav>
      <div className={`right ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="top">
          <div className={`profile ${isMenuOpen ? "menu-open" : ""}`}>
            <div className="info">
              <p>
                Merhaba, <b>{name}</b>
              </p>
              
                {roles.length > 1 && (
                  <div className="role-select">
                  <select value={activeRole} onChange={changeRole} className="text-muted">
                    {roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  </div>
                )}                
              
              {roles.length === 1 && (
                  <p className="text-muted">{activeRole}</p>
                )}              
            </div>
            <div className="profile-photo" onClick={toggleMenu}>
              <img src={require("../img/profile-photo.png")} alt="" />
            </div>
          </div>
        </div>
        <div
          className={`submenu-wrapper ${isMenuOpen ? "openMenu" : ""}`}
          id="subMenu"
        >
          <div className="submenu">
            <a href="#" className="submenu-link">
              <img src={require("../img/Profile.png")} alt="" />
              <p>Profil</p>
              <span></span>
            </a>
            <a href="#" className="submenu-link">
              <img src={require("../img/Setting.png")} alt="" />
              <p>Ayarlar</p>
              <span></span>
            </a>
            <a className="submenu-link">
              <img src={require("../img/Logout.png")} alt="" />
              <Link to="/Login" onClick={handleLogoutClick}> <p>Çıkış</p>  </Link>
              <span></span>
            </a>
            {/* <label className="switch">
              <input type="checkbox" id="toggle" onClick={changeMode} />
              <span className="slider round"></span>
            </label> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Right;
