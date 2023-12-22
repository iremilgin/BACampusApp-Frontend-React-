import React, { useEffect, useState } from "react";
import "../scss/login.scss";
import { getLastRoleLog } from "../api/accountApi";
import { login } from "../api/accountApi";
import { Link, useNavigate } from "react-router-dom";
import Account from "../Account";
import Layout from "../../../layouts/adminlayout/Layout";
import ForgotPassword from "./ForgotPassword";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const naviageToForgotPassword = () => {
    const forgotPasswordURL = "../ForgotPassword";

    window.location.href = forgotPasswordURL;
    return (
      <>
        <ForgotPassword />
      </>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email: email, password: password };
    
    try {
      const result = await login(data);
      const token = result.token;
      const tokenParts = token.split(".");

      const header = JSON.parse(atob(tokenParts[0]));
      const payload = JSON.parse(atob(tokenParts[1]));
      const signature = tokenParts[2];

      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userId =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const userEmail = payload["email"];

      const roleLogData = await getLastRoleLog(userId);
      let userRole = "";

      if (roleLogData.message == "RoleLog bulunamadı !") {
        if (role.includes("Admin")) {
          userRole = "Admin";
        } else if (role.includes("Trainer")) {
          userRole = "Trainer";
        } else if (role.includes("Student")) {
          userRole = "Student";
        }
      } else {
        userRole = roleLogData.data.activeRole;
      }
      const userData = [token, userRole, userId, userEmail, role];
      sessionStorage.setItem("savedData", userData);
      window.location.href = "/";
      // window.location.reload();
    } catch (error) {
      if (error.name === 'RedirectError') {
        // Redirect to the error page
        navigate('/error');
       } 
      //else {
      //   console.log("deneme");
      //   setResultMessage(result.message);
      //   console.log(result);
      // }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div class="centering">
        <div class="blur-background"></div>

        <form className="form-login" onSubmit={handleSubmit}>
          <img
            className="login-logo"
            src={require("../img/login-logo.png")}
            alt=""
          />

          <div class="box">
            <div class="input__wrapper">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                class="input__field"
                required
              />
              <label for="password" class="input__label">
                E-posta
              </label>
            </div>
            <div class="input__wrapper">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type={showPassword ? "text" : "password"}
                class="input__field"
              />
              <label for="password" class="input__label">
                Şifre
              </label>
              <img
                alt="Eye Icon"
                title="Eye Icon"
                src={
                  showPassword
                    ? require("../img/eye-close.png")
                    : require("../img/eye.png")
                }
                class="input__icon"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          <div class="login-button-box">
            <button class="first-btn-login" type="submit">
              <span>Giriş Yap</span>
            </button>
            <Link className="login-forgot-password-button" to="/ForgotPassword">
              Şifremi Unuttum
            </Link>
          </div>
        </form>
        {/* <div class="img-box">
          <img src={require("../img/login-photo.png")} alt="" />
        </div> */}
      </div>
    </>
  );
};
