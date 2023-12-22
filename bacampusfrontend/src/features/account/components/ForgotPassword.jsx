import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "../scss/forgotPassword.scss";
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
    };    
    
    try {      
      const result  = await axios.post(
        `https://localhost:7247/api/Account/ForgotPassword`, 
        {
          email: email
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );       
      if (result.status === 200) {
        const linkFromAPI = result.data.Token; // Örnek: "/Account/ResetPassword?email=..."
        const passwordResetLink = `http://localhost:3000${linkFromAPI}`;
        setResetSuccess(true);
        toast.success("Şifre sıfırlama isteği başarıyla gönderildi.");        
        setTimeout(() => {
          navigate("/"); 
        }, 5000); 
      } else {
        setResetSuccess(false);
        setResetError(true); 
        toast.error("Hatalı giriş yaptınız. Lütfen tekrar deneyiniz.");        

        setTimeout(() => {
          setResetError(false); 
        }, 2000); 
        
      }   
      }      
     catch (error) {      
      console.error("Şifre sıfırlama hatası:", error);
      toast.error("Şifre sıfırlama hatası!");
      setResetError(true);       

 
      setTimeout(() => {
        setResetError(false); 
      }, 2000); 
    }
  };

  return (
    <div>
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          {resetSuccess ? (
            <div className="success-message">
              Şifre sıfırlama isteği başarıyla gönderildi. Lütfen e-posta kutunuzu kontrol edin.
              Giriş Ekranına Yönlendirileceksiniz.
            </div>
          ) : resetError ? ( 
            <div className="error-message">
              Hatalı giriş yaptınız. Lütfen mail adresinizi kontrol ediniz.
            </div>
          ) : (
            <>
              <div className="inputBox">
                <img src={require("../img/login-logo.png")} alt="" />
                {/* <img src={require("../../../layouts/adminlayout/img/logo-academy.png")} alt="" /> */}
                {/* <img src="img/login-logo.png" alt="" /> */}

                <br></br>
                <label>E-Posta Adresi</label>
                <input
                  className="forgot-email-input"
                  type="email"
                  required
                  placeholder="örnek@bilgeadam.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="inputBox">
                <input
                  className="btn-login-forgot"
                  type="submit"
                  value="Şifre Sıfırla"
                  onClick={handleSubmit}
                />
              </div>
            </>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
