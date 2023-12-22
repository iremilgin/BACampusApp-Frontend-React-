import React, { useEffect, useState } from "react";
import { getTrainerById } from "../api/trainerApi";
import { useNavigate, useParams, Link } from "react-router-dom";

const TrainerDetails = () => {
  const [trainer, setTrainer] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTrainerById(id)
      .then((data) => setTrainer(data))
      .catch((error) => {
        if (error.name === "RedirectError") {
          navigate("/error"); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  if (!trainer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Egitmen Detay</h1>
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
              {trainer.firstName.charAt(0).toUpperCase() +
                trainer.firstName.slice(1)}{" "}
              {trainer.lastName.charAt(0).toUpperCase() +
                trainer.lastName.slice(1)}
            </span>
          </div>
          <div className="form-field">
            <label className="form-label">E-mail :</label>
            <span className="form-label-answers">{trainer.email}</span>
          </div>
        </div>
        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Telefon Numarası :</label>
            <span className="form-label-answers">{trainer.phoneNumber}</span>
          </div>
          <div className="form-field">
            <label className="form-label">Doğum Tarihi :</label>
            <span className="form-label-answers">
              {" "}
              {new Date(trainer.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Cinsiyet :</label>
            <span className="form-label-answers">
              {trainer.gender ? "Erkek" : "Kadın"}
            </span>
          </div>
          <div className="form-field">
            <label className="form-label">Adres :</label>
            <span className="form-label-answers">{trainer.address}</span>
          </div>
        </div>
      </form>

      <div className="buttons-form">
        <Link className="submit-button backto-list" to={"/admin/trainer"}>
          Listeye Dön
        </Link>
      </div>
    </div>
  );
};

export default TrainerDetails;
