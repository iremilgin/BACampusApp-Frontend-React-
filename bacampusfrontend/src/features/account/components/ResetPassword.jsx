import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "../scss/resetPassword.scss";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const ResetPassword = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");  
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Sayfa yüklendiğinde URL'den token ve email'i al
    const searchParams = new URLSearchParams(location.search);
    const emailFromToken = searchParams.get('email');

    if (emailFromToken) {
    // Eğer token ile gelen email varsa, setEmail ile email değişkenini güncelle
    setEmail(emailFromToken);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        toast.error("Şifreler uyuşmuyor.");
      return;
    }

    try {
        const searchParams = new URLSearchParams(location.search);
        const email = searchParams.get('email');
        const token = searchParams.get('token');
        const response = await axios.post(
        `https://localhost:7247/api/Account/ResetPassword`,
        {
          email: email,
          token: token,
          newPassword: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {        
        setResetSuccess(true);
        toast.success("Şifre başarıyla sıfırlandı.");
        setTimeout(() => {
            navigate("/"); 
          }, 5000); 
      } else {
        setResetSuccess(false);
        setResetError(true); 
        toast.error("Hatalı giriş yaptınız. Lütfen tekrar deneyiniz.");  
      }
    } catch (error) {
        toast.error("Şifre sıfırlama hatası!");
        setResetError(true);
    }
  };

  return (

    <div>        
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          {resetSuccess ? (
            <div className="success-message">
              Şifre sıfırlama başarılı. Giriş Ekranına Yönlendirileceksiniz.
            </div>
          ) : resetError ? ( 
            <div className="error-message">
              Şifre sıfırlama başarısız.
            </div>
          ) : (
            <>
              <div className="inputBox">
                <img src={require("../img/login-logo.png")} alt="" />

                <br></br><br></br>
                <label>Yeni Şifre :</label>
                <input
                  className="reset-password-input"
                  type="password"
                  required                  
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br></br><br></br>
                <label>Şifreyi Onayla:</label>
                <input
                className="reset-password-input"
                 type="password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 required
                 />
              </div>
            <div>                
                </div>              
              <div className="inputBox">
                <input
                  className="btn-login-forgot"
                  type="submit"
                  value="Yeni Şifreyi Onayla"
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

export default ResetPassword;