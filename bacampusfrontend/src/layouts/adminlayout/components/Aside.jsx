import React from "react";
import "../scss/aside.scss";
import "../../../admin/trainer/Trainer";
import { Link, Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { UilBars } from "@iconscout/react-unicons";
import { useState } from "react";
import {
  FaLayerGroup,
  FaSlidersH,
  FaLaptopCode,
  FaUserFriends,
  FaUserTie,
  FaUsers,
  FaFileCode,
  FaFileSignature,
  FaFile,
  FaTag,
  FaComments,
  FaChevronDown,
  FaMinus,
  FaStream,
  FaBookmark,
  FaBuilding
} from "react-icons/fa";

const Aside = () => {
  const [expanded, setExpaned] = useState(true);
  const [showeducations, setShowEducations] = useState(true);
  const [showusers, setShowUsers] = useState(false);
  const [showothers, setShowOthers] = useState(false);

  const sidebarVariants = {
    true: {
      left: "-60%",
    },
    false: {
      left: "0",
    },
  };
  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "5%" } : { left: "60%" }}
        onClick={() => setExpaned(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="aside"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        <aside>
          {/* <div > */}
          {/* <div className="logo"> */}
          <NavLink to="/admin" className="top">
            <img
              className="logo-img"
              src={require("../img/logo-academy.png")}
              alt="logo"
            />
          </NavLink>
          {/* </div> */}
          {/* </div> */}
          <div className="sidebar">
            {/* <a href="#" className="dashblue" id="dashblue">
              <img src={require("../img/Category.png")} alt="" />
              <Link to="/admin">
                <h3 style={{ color: "white" }}>Anasayfa</h3>
              </Link>
            </a> */}
            {/* 
            <NavLink to="/admin" className="dashblue" id="dashblue">
              <img src={require("../img/Category.png")} alt="" />
              <h3 style={{ color: "white" }}>Anasayfa</h3>
            </NavLink> */}

            <button
              className="sidebar-header"
              onClick={() => {
                setShowEducations(!showeducations);
              }}
            >
              <h3>Eğitim</h3>
              {showeducations ? <FaMinus /> : <FaChevronDown />}
            </button>

            {showeducations && (
              <>
                <NavLink
                  to="technicalunits"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>

                  <div className="menu">
                    {/* <img src={require("../img/technic.png")} alt="" /> */}
                    <FaSlidersH />
                    <h3>Teknik Birimler</h3>
                  </div>
                  {/* <FaChevronRight className="chevron-icon" /> */}
                </NavLink>

                <NavLink
                  to="category"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    {/* <img src={require("../img/technic.png")} alt="" /> */}
                    <FaLayerGroup />
                    <h3>Kategoriler</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="subcategory"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    {/* <img src={require("../img/technic.png")} alt="" /> */}
                    <FaStream />
                    <h3>Alt Kategoriler</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="education"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaLaptopCode />
                    {/* <img src={require("../img/Work.png")} alt="" /> */}
                    <h3>Eğitimler</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="classroom"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaUserFriends />
                    {/* <img src={require("../img/training.png")} alt="" /> */}
                    <h3>Gruplar</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="subjects"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaFileCode />
                    {/* <img src={require("../img/subject.png")} alt="" /> */}
                    <h3>Konular</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="homework"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaFileSignature />
                    {/* <img src={require("../img/homework.png")} alt="" /> */}
                    <h3>Ödevler</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="supplementaryresource"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaFile />
                    {/* <img src={require("../img/fi_file.png")} alt="" /> */}

                    <h3>Kaynaklar</h3>
                  </div>
                </NavLink>
              </>
            )}

            <button
              className="sidebar-header"
              onClick={() => {
                setShowUsers(!showusers);
              }}
            >
              <h3>Kullanıcılar</h3>
              {showusers ? <FaMinus /> : <FaChevronDown />}
            </button>

            {showusers && (
              <>
                <NavLink
                  to="admin"
                  activeClassName="active-sidebar"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaUserTie />
                    {/* <img src={require("../img/User.png")} alt="" /> */}
                    <h3>Admin</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="trainer"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaUserFriends />
                    {/* <img src={require("../img/User.png")} alt="" /> */}
                    <h3>Eğitmenler</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="student"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaUsers />
                    {/* <img src={require("../img/User.png")} alt="" /> */}
                    <h3>Öğrenciler</h3>
                  </div>
                </NavLink>
              </>
            )}

            {/* <a href="#" className="menu-item">
              <img src={require("../img/User.png")} alt="" />
              <NavLink style={({ isActive }) => ({color: isActive ? "#0070BA" : "#414A59",})}
                to="/comment">
                <h3>Yorumlar</h3>
              </NavLink>
            </a> */}
            {/* <a href="#" className="menu-item">
              <NavLink style={({ isActive }) => ({color: isActive ? "#0070BA" : "#414A59",})}
                to="">
                <h3></h3>
              </NavLink>
            </a> */}

            <button
              className="sidebar-header"
              onClick={() => {
                setShowOthers(!showothers);
              }}
            >
              <h3>Diğer</h3> {showothers ? <FaMinus /> : <FaChevronDown />}
            </button>
            {/* <h3>DİĞER</h3> */}

            {showothers && (
              <>
                <NavLink
                  to="tags"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaTag />
                    {/* <img src={require("../img/tag.png")} alt="" /> */}
                    <h3>Etiketler</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="comment"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaComments />
                    {/* <img src={require("../img/User.png")} alt="" /> */}

                    <h3>Yorumlar</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="trainingtype"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaBookmark />
                    {/* <img src={require("../img/User.png")} alt="" /> */}

                    <h3>Eğitim Tipleri</h3>
                  </div>
                </NavLink>

                <NavLink
                  to="branch"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaBuilding />
                    {/* <img src={require("../img/User.png")} alt="" /> */}

                    <h3>Şube</h3>
                  </div>
                </NavLink>
                <NavLink
                  to="grouptype"
                  activeClassName="active"
                  className="menu-item"
                >
                  <div className="vertical-line"></div>
                  <div className="menu">
                    <FaUserFriends />
                    {/* <img src={require("../img/User.png")} alt="" /> */}

                    <h3>Grup Tipleri</h3>
                  </div>
                </NavLink>
              </>
            )}


            {/* <a href="#" className="menu-item">
              <NavLink
                style={({ isActive }) => ({color: isActive ? "#0070BA" : "#414A59",})}
                to="/comments">
                <h3></h3>
              </NavLink>
            </a> */}
          </div>
        </aside>
      </motion.div>
    </>
  );
};

// "@babel/plugin-proposal-private-property-in-object"
export default Aside;
