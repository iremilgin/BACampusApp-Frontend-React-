import React from "react";


const EducationListByStudent = () =>{



    return (
        <div>
          <div className="main">
            <h1>Eğitimler</h1>
            <img className="line" src={require("../img/substract.png")} alt="" />
            <div className="education-card-footer">
              {/* <button className="btn btn-create">
               Ekle
              </button> */}
            </div>
            <div className="row-education">
              <div className="education-card">
                <div className="education-card-header">
                  <h2>Application Development with .NET Core</h2>
                </div>
                <div className="education-card-body">
                  <div className="row-education">
                    <img src={require("../img/category.png")} alt="" />
                    <p>Back-End Developer</p>
                  </div>
                  <div className="row-education">
                    <img src={require("../img/clock.png")} alt="" />
                    <p>200 Saat</p>
                  </div>
                </div>
                <div className="education-card-footer">
                  <Link to="/educationsdetail" className="btn btn-primary">
                    Detay Görüntüle
                  </Link>
                </div>
              </div>
    
              <div className="education-card">
                <div className="education-card-header">
                  <h2>Front-End Development</h2>
                </div>
                <div className="education-card-body">
                  <div className="row-education">
                    <img src={require("../img/category.png")} alt="" />
                    <p>Front-End Developer</p>
                  </div>
                  <div className="row-education">
                    <img src={require("../img/clock.png")} alt="" />
                    <p>90 Saat</p>
                  </div>
                </div>
                <div className="education-card-footer">
                  <button className="btn btn-primary">Detay Görüntüle</button>
                </div>
              </div>
    
              <div className="education-card">
                <div className="education-card-header">
                  <h2>Microsoft SQL Server Querying and Developing</h2>
                </div>
                <div className="education-card-body">
                  <div className="row-education">
                    <img src={require("../img/category.png")} alt="" />
                    <p>Database Specialist</p>
                  </div>
                  <div className="row-education">
                    <img src={require("../img/clock.png")} alt="" />
                    <p>120 Saat</p>
                  </div>
                </div>
                <div className="education-card-footer">
                  <button className="btn btn-primary">Detay Görüntüle</button>
                </div>
              </div>
            </div>
          </div>
    
        
        </div>
      );
    };

export default EducationListByStudent;
