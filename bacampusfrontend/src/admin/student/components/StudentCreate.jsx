import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createStudent } from "../api/studentApi";
import { toast } from "react-toastify";
import Select from "react-select";
import "../scss/studentForm.scss";
import ToastContent from "../../../shared/toast-content/ToastContent";

const StudentCreate = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  // const [country, setCountry] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [errors, setError] = useState({});
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [phoneNumberFormatError, setPhoneNumberFormatError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const defaultCountry = { label: "Ülke Seçiniz", value: null };

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
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newStudent = await createStudent({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        gender: gender === "male" ? true : false,
        dateOfBirth: dateOfBirth,
        country: selectedCountry.value,
        address: address,
      });

      const message = newStudent.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("../../student");
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
      if (error.errorMessages.Email) {
        setEmailError(error.errorMessages.Email);
      } else {
        setEmailError("");
      }
      if (error.errorMessages.DateOfBirth) {
        setDateOfBirthError(error.errorMessages.DateOfBirth);
      } else {
        setDateOfBirthError("");
      }
      if (error.errorMessages.PhoneNumber) {
        setPhoneNumberError(error.errorMessages.PhoneNumber);
      } else {
        setPhoneNumberError("");
      }
      if (error.errorMessages.Address) {
        setAddressError(error.errorMessages.Address);
      } else {
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
      <h1>Öğrenci Ekle</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />

      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
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
              {lastNameError && (
                <div className="error-message">{lastNameError}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-field">
          <div className="student-row">
            <div className="student-row-space">
              <div className="input-container">
                <label htmlFor="email" className="form-label">
                  Email :
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <div className="student-row-space">
              <div className="input-container">
                <label htmlFor="dateOfBirth" className="form-label right-label">
                  Doğum Tarihi :
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              {dateOfBirthError && (
                <div className="error-message">{dateOfBirthError}</div>
              )}
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
                  options={[defaultCountry, ...countries]}
                  defaultValue={defaultCountry}
                  onChange={(selectedOption) =>
                    setSelectedCountry(selectedOption)
                  }
                />
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
                {phoneNumberError && (
                  <div className="error-message">{phoneNumberError}</div>
                )}
                {phoneNumberFormatError && (
                  <div className="error-message">{phoneNumberFormatError}</div>
                )}
                {defaultMessage && (
                  <div className="error-message">{defaultMessage}</div>
                )}
              </div>
            </div>

            <div className="trainer-row-space">
              <div className="input-container">
                <label className="form-label right-label">Cinsiyet :</label>
                <div className="form-radio">
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    Erkek
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    Kadın
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {defaultMessage && (
          <div className="error-message">{defaultMessage}</div>
        )}

        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="address" className="form-label">
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

        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}

        <div className="buttons-form">
          <input type="submit" value="Ekle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/student"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default StudentCreate;
