import React from "react";
import "../scss/aside.scss";
import "../../../admin/trainer/Trainer";
import { Link, Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { UilBars } from "@iconscout/react-unicons";
import { useState } from "react";
import {
  FaFileSignature,
  FaFile,
  FaChevronDown,
  FaMinus,
} from "react-icons/fa";
import { CgUserList } from "react-icons/cg";

const Aside = () => {
  const [expanded, setExpaned] = useState(true);
  const [showeducations, setShowEducations] = useState(true);

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
          <NavLink to="/student" className="top">
            <img
              className="logo-img"
              src={require("../img/logo-academy.png")}
              alt="logo"
            />
          </NavLink>
          <div className="sidebar">
            <button
              className="sidebar-header"
              onClick={() => {
                setShowEducations(!showeducations);
              }}
            >
              <h3>Eğitim</h3>
              {showeducations ? <FaMinus /> : <FaChevronDown />}
            </button>
            <NavLink
              to="classroomstudent/myclassroomlist"
              activeClassName="active"
              className="menu-item"
            >
              <div className="vertical-line"></div>
              <div className="menu">
              <CgUserList />
                <h3>Sınıfım</h3>
              </div>
            </NavLink>
            <NavLink
              to="homework/studenthomeworklist"
              activeClassName="active"
              className="menu-item"
            >
              <div className="vertical-line"></div>
              <div className="menu">
                <FaFileSignature />
                <h3>Ödevler</h3>
              </div>
            </NavLink>

            <NavLink
              to="supplementaryresource/supplementaryresourceoptions"
              activeClassName="active"
              className="menu-item"
            >
              <div className="vertical-line"></div>
              <div className="menu">
                <FaFile />
                <h3>Kaynaklar</h3>
              </div>
            </NavLink>
            
          </div>
        </aside>
      </motion.div>
    </>
  );
};

// "@babel/plugin-proposal-private-property-in-object"
export default Aside;
