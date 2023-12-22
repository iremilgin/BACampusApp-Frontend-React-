import React, { useState, useEffect } from "react";
import { createTrainer } from "../api/trainerApi";
import "../scss/TrainerForm.scss";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ToastContent from "../../../shared/toast-content/ToastContent";
import Select from "react-select";

const TrainerCreate = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errors, setErrors] = useState({
    firstName: [],
    lastName: [],
    email: [],
    dateOfBirth: [],
  });
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [phoneNumberFormatError, setPhoneNumberFormatError] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const validDomains = [
    "@bilgeadamboost.com",
    "@bilgeadamakademi.com",
    "@bilgeadam.com",
  ];

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      gender: gender === "male" ? true : false,
      country: selectedCountry.value,
      dateOfBirth: dateOfBirth,
      address: address,
    };
    try {
      const result = await createTrainer(data);
      const message = result.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate(`../../trainer`);
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
      if (error.errorMessages.DateOfBirth) {
        // FirstName ile ilgili hata varsa, state'i güncelle
        setDateOfBirthError(error.errorMessages.DateOfBirth);
      } else {
        // Genel hata varsa, state'i temizle
        setDateOfBirthError("");
      }
      if (error.errorMessages.PhoneNumber) {
        // Eğer telefon hatası mesajı varsa, state'i güncelle
        setPhoneNumberError(error.errorMessages.PhoneNumber);
      } else {
        // Genel hata varsa, state'i temizle
        setPhoneNumberError("");
      }
      if (error.errorMessages.Address) {
        setAddressError(error.errorMessages.Address);
      } else {
        setAddressError("");
      }
      // if (error.errorMessages.message) {
      //   // Eğer telefon hatası mesajı varsa, state'i güncelle
      //   setPhoneNumberFormatError(error.errorMessages.message);
      // } else {
      //   // Genel hata varsa, state'i temizle
      //   setPhoneNumberFormatError("");
      // }
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

  // const validateEmail = () => {
  //   const isValid = validDomains.some((domain) => email.endsWith(domain));
  //   if (!isValid) {
  //     toast.error(
  //       "Geçerli bir e-posta domaini giriniz. Email adresi @bilgeadamboost.com, @bilgeadamakademi.com,bilgeadam.com ile bitmelidir.",
  //       {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         style: {
  //           color: "red",
  //         },
  //       }
  //     );
  //   }
  // };
  // const handleEmailChange = (e) => {
  //   const newEmail = e.target.value;
  //   setEmail(newEmail);
  // };

  // const handleLastNameChange = (e) => {
  //   setLastName(e.target.value.trim());
  // };

  // const handleBlur = () => {
  //   validateEmail();
  // };
  return (
    <div>
      <h1>Eğitmen Ekle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field trainer-input">
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
              {lastNameError && (
                <div className="error-message">{lastNameError}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-field trainer-input">
          <div className="trainer-row">
            <div className="trainer-row-space">
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
            <div className="trainer-row-space">
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
              {phoneNumberError && (
                <div className="error-message">{phoneNumberError}</div>
              )}
              {phoneNumberFormatError && (
                <div className="error-message">{phoneNumberFormatError}</div>
              )}
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

        <div className="form-field"></div>
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Ekle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/trainer"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TrainerCreate;
