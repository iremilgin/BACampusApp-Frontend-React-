import React, { useEffect, useState } from "react";
import { getStudentById } from "../api/studentApi";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaUser } from "react-icons/fa";
import "../scss/StudentDetails.scss";

const StudentDetails = () => {
  const [student, setStudent] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="accordion">
        <div className="accordion-title" onClick={() => setIsOpen(!isOpen)}>
          <div className="title-with-circle">
            {" "}
            <span className="circle"></span>
            <h2>{title}</h2>
          </div>
          <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
        </div>
        {isOpen && <div className="accordion-content">{children}</div>}
      </div>
    );
  };

  const AccordionSection = ({ label, content, image }) => (
    <div className="accordion-section">
      <div className="section-content">
        <div>{image}</div>
        <label>{label}</label>
      </div>
      <span>{content}</span>
    </div>
  );

  useEffect(() => {
    getStudentById(id)
      .then((data) => setStudent(data))
      .catch((error) => {
        if (error.name === "RedirectError") {
          navigate("/error");
        } else {
          console.error("Fetching data error: ", error);
        }
      });
  }, [id, navigate]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homework-form-container">
      <h1>Öğrenci Detay</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <Accordion title="Kişisel Bilgilerim">
        <div className="accordion-row">
          <AccordionSection
            image={
              student.image ? (
                <img src={student.image} className="accordion-image" />
              ) : (
                <FaUser className="accordion-default-icon" />
              )
            }
            label={`${student.firstName} ${student.lastName}`}
          />
          <AccordionSection
            label="Doğum Tarihi"
            content={new Date(student.dateOfBirth).toLocaleDateString()}
          />
          <AccordionSection
            label="Cinsiyet"
            content={student.gender ? "Erkek" : "Kadın"}
          />
        </div>
      </Accordion>
      <Accordion title="İletişim Bilgilerim">
        <div className="accordion-row">
          <AccordionSection label="E-Mail" content={student.email} />
          <AccordionSection
            label="Telefon Numarası"
            content={student.phoneNumber}
          />
        </div>
      </Accordion>
      <Accordion title="Eğitim Bilgilerim">
        <div className="accordion-row">
          <AccordionSection
            label="Başlama Tarihi"
            content={new Date(student.startDate).toLocaleDateString()}
          />
          <AccordionSection
            label="Bitiş Tarihi"
            content={new Date(student.endDate).toLocaleDateString()}
          />
        </div>
      </Accordion>
      <div className="buttons-form">
        <Link className="submit-button backto-list" to={"/admin/student"}>
          Listeye Dön
        </Link>
      </div>
    </div>
  );
};

export default StudentDetails;
