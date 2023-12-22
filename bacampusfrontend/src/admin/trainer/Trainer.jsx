import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TrainerList from "../trainer/component/TrainerList";

function Trainer() {
  return (
    <div>
      <TrainerList />
      <a href="#" className="menu-item">
              <img src={require("../../layouts/adminlayout/img/fi_file.png")} alt="" />
              <Link to="trainersample">
                <h3>DataTable Örneği 1 (Trainer)</h3>
              </Link>
            </a>
            <a href="#" className="menu-item">
              <img src={require("../../layouts/adminlayout/img/fi_file.png")} alt="" />
              <Link to="trainerhomeworksample">
                <h3>DataTable Örneği-2 (Homework)</h3>
              </Link>
            </a>
    </div>
  );
}
export default Trainer;
