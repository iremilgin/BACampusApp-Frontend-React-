import React, { useState, useEffect } from "react";
import { updateStudent, getStudentById } from "../api/studentApi";
import { useNavigate, useParams, Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import "../scss/studentForm.scss";
import ToastContent from "../../../shared/toast-content/ToastContent";

const StudentUpdate = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    value: "",
    label: "",
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [phoneNumberFormatError, setPhoneNumberFormatError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  useEffect(() => {
    if (apiMessageError) {
      showToast(apiMessageError, "error");
    } else if (defaultMessage) {
      showToast(defaultMessage, "error");
    }
  }, [apiMessageError, defaultMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countriesData = await axios.get(
          "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        );
        setCountries(countriesData.data.countries);
        await fetchStudentData();
      } catch (error) {
        if (error.name === "RedirectError") {
          navigate("/error"); // Redirect to ErrorPage
        }
        console.error("Veri çekme hatası: ", error);
      }
    };
    fetchData();
  }, [id]);
  const fetchStudentData = async () => {
    try {
      const student = await getStudentById(id);
      setFirstName(student.firstName);
      setLastName(student.lastName);
      setPhoneNumber(student.phoneNumber);
      setSelectedCountry({ value: student.country, label: student.country });
      setAddress(student.address);
    } catch (error) {
      if (error.name === "RedirectError") {
        navigate("/error"); // Redirect to ErrorPage
      }
      console.error("Öğrenci verileri alınırken hata oluştu: ", error);
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
      const response = await updateStudent(id, data);
      const message = response.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate(`../../student`);
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);

      if (error.errorMessages.FirstName) {
        setFirstNameError(error.errorMessages.FirstName);
      } else {
        setFirstNameError("");
      }
      if (error.errorMessages.LastName) {
        setLastNameError(error.errorMessages.LastName);
      } else {
        setLastNameError("");
      }
      if (error.errorMessages.PhoneNumber) {
        setPhoneNumberError(error.errorMessages.PhoneNumber);
      } else {
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
        setApiMessageError(error.errorMessages.message);
      } else {
        setApiMessageError("");
      }
      if (error.name === "RedirectError") {
        navigate("/error"); // Redirect to ErrorPage
      }
    }
  };
  return (
    <div>
      <h1>Öğrenci Güncelle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field student-input">
          <div className="student-row">
            <div className="student-row-space">
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
            <div className="student-row-space">
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
        {phoneNumberError && (
          <div className="error-message">{phoneNumberError}</div>
        )}
        {defaultMessage && (
          <div className="error-message">{defaultMessage}</div>
        )}

        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}

        <div className="buttons-form">
          <input type="submit" value="Guncelle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/student"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};
export default StudentUpdate;
