import axios from "axios";
import React, { useState, useEffect } from "react";
import { updateAdmin, getAdminById } from "../api/adminApi";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import ToastContent from "../../../shared/toast-content/ToastContent";

const AdminUpdate = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    value: "",
    label: "",
  });
  const [defaultCountry, setDefaultCountry] = useState(null);
  const defaultValue = defaultCountry ? defaultCountry.value : null;

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countriesData = await axios.get(
          "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        );
        setCountries(countriesData.data.countries);
        await fetchAdminData();
      } catch (error) {
        if (error.name === "RedirectError") {
          navigate("/error"); // Redirect to ErrorPage
        }
        console.error("Veri çekme hatası: ", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (apiMessageError) {
      showToast(apiMessageError, "error");
    } else if (defaultMessage) {
      showToast(defaultMessage, "error");
    }
  }, [apiMessageError, defaultMessage]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const admin = await getAdminById(id);
      setFirstName(admin.firstName);
      setLastName(admin.lastName);
      setPhoneNumber(admin.phoneNumber);
      setSelectedCountry({ value: admin.country, label: admin.country });
      setAddress(admin.address);
    } catch (error) {
      if (error.name === "RedirectError") {
        navigate("/error"); // Redirect to ErrorPage
      }
      console.error("Veriler alınırken hata oluştu: ", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      country: selectedCountry.value,
      address: address,
    };

    try {
      const response = await updateAdmin(id, data);
      const message = response.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("../../admin");
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);
      if (error.errorMessages.FirstName) {
        // FirstName ile ilgili hata varsa, state'i güncelle
        setFirstNameError(error.errorMessages.FirstName);
      } else {
        // Genel hata varsa, state'i temizle
        setFirstNameError("");
      }
      if (error.errorMessages.LastName) {
        // FirstName ile ilgili hata varsa, state'i güncelle
        setLastNameError(error.errorMessages.LastName);
      } else {
        // Genel hata varsa, state'i temizle
        setLastNameError("");
      }
      if (error.errorMessages.PhoneNumber) {
        // Eğer telefon hatası mesajı varsa, state'i güncelle
        setPhoneNumberError(error.errorMessages.PhoneNumber);
      } else {
        // Genel hata varsa, state'i temizle
        setPhoneNumberError("");
      }
      if (error.errorMessages.Address) {
        // Eğer adres hatası mesajı varsa, state'i güncelle
        setAddressError(error.errorMessages.Address);
      } else {
        // Genel hata varsa, state'i temizle
        setAddressError("");
      }
      if (error.errorMessages.message) {
        // Eğer telefon hatası mesajı varsa, state'i güncelle
        setApiMessageError(error.errorMessages.message);
      } else {
        // Genel hata varsa, state'i temizle
        setApiMessageError("");
      }
      if (error.name === "RedirectError") {
        navigate("/error"); // Redirect to ErrorPage
      }
    }
  };

  return (
    <div>
      <h1>Yönetici Güncelle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="firstName" className="form-label">
                  Ad :
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
                {firstNameError && (
                  <div className="error-message">{firstNameError}</div>
                )}
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="lastName" className="form-label right-label">
                  Soyad :
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
                {lastNameError && (
                  <div className="error-message">{lastNameError}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="phoneNumber" className="form-label">
                  Telefon Numarası :
                </label>
                <Select
                  options={countries}
                  value={selectedCountry}
                  onChange={(selectedOption) =>
                    setSelectedCountry(selectedOption)
                  }
                  style={{ width: "100%" }}
                />
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="form-input"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                {phoneNumberError && (
                  <div className="error-message">{phoneNumberError}</div>
                )}
              </div>
            </div>
            <div className="form-field">
              <div className="trainer-row">
                <div className="trainer-row-space">
                  <div className="input-container">
                    <label htmlFor="address" className="form-label right-label">
                      Adres :
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    {addressError && (
                      <div className="error-message">{addressError}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}

        <div className="buttons-form">
          <input type="submit" value="Guncelle" className=" submit-button" />

          <Link className="submit-button backto-list" to={"/admin/admin"}>
            Listeye Dön
          </Link>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
};

export default AdminUpdate;
