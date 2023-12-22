import React, { useEffect, useState } from "react";
import { getAdminById } from "../api/adminApi";
import { useNavigate, useParams, Link } from "react-router-dom";

const AdminDetails = () => {
  const [admin, setAdmin] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getAdminById(id)
      .then((data) => setAdmin(data))
      .catch((error) => {
        if (error.name === "RedirectError") {
          navigate("/error"); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Yonetici Detay</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form className="card-body">
        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Ad & Soyad :</label>
            <span className="form-label-answers">
              {" "}
              {admin.firstName.charAt(0).toUpperCase() +
                admin.firstName.slice(1)}{" "}
              {admin.lastName.charAt(0).toUpperCase() + admin.lastName.slice(1)}
            </span>
          </div>
          <div className="form-field">
            <label className="form-label">E-mail :</label>
            <span className="form-label-answers">{admin.email}</span>
          </div>
        </div>
        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Telefon Numarası :</label>
            <span className="form-label-answers">{admin.phoneNumber}</span>
          </div>
          <div className="form-field">
            <label className="form-label">Doğum Tarihi :</label>
            <span className="form-label-answers">
              {new Date(admin.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Cinsiyet :</label>
            <span className="form-label-answers">
              {admin.gender ? "Erkek" : "Kadın"}
            </span>
          </div>
          <div className="form-field">
            <label className="form-label">Adres :</label>
            <span className="form-label-answers">{admin.address}</span>
          </div>
        </div>
      </form>
      {/* className={`admin-details-value ${
                admin.gender ? "gender-male" : "gender-female"
              }`} */}

      {/* <div className="admin-details-item">
        <span className="admin-details-label">Kimlik Numarası:</span>
        <span className="admin-details-value">
          {admin.identificationNumber}
        </span>
      </div> */}
      <div className="buttons-form">
        <Link className="submit-button backto-list" to={"/admin/admin"}>
          Listeye Dön
        </Link>
      </div>
    </div>
  );
};

export default AdminDetails;
