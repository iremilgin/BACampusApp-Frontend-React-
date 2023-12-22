import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import {
  recoverResource,
  getDeletedResourceById,
} from "../api/suplamentaryResourceApi";
import { ListByEducationtId } from "../../education-subject/api/educationSubjectApi";
import { getAlllTag } from "../../tag/api/tagApi";

import { getAllEducationThatHaveEducationSubjects } from "../../education/api/educationApi";

import { MultipleAutoComplete } from "../components/MultipleAutoCompleteTagsUpdate";
import ToastContent from "../../../shared/toast-content/ToastContent";
import "../scss/subject-update.scss";
import { MultipleAutoCompleteEducationUpdate } from "./MultipleAutoCompleteEducationUpdate";
import { MultipleAutoCompleteSubjectUpdate } from "./MultipleAutoCompleteSubjectUpdate";

const ResourceUpdate = () => {
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [educations, setEducations] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedEducations, setSelectedEducations] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const { id } = useParams();
  const [supplamentaryResource, setSupplamentaryResource] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("Seçiniz");
  const [apiMessageError, setApiMessageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otherSuccessMessage, setOtherSuccessMessage] = useState("");
  const [educationErrorMessage, setEducationErrorMessage] = useState("");
  const [subjectErrorMessage, setSubjectErrorMessage] = useState("");
  const [tagErrorMessage, setTagErrorMessage] = useState("");
  const [otherErrorMessage, setOtherErrorMessage] = useState("");
  const [downloadErrorMessage, setDownloadErrorMessage] = useState("");
  const fileInputRef = useRef();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

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
    getDeletedResourceById(id)
      .then((data) => {
        setSupplamentaryResource(data);
        setName(data.name);
        const initialSelectedTags = data.supplementaryResourceTags.map(
          (tag) => tag.tagId
        );
        setSelectedTags(initialSelectedTags);

        const initialSelectedSubjects =
          data.supplementaryResourceEducationSubjects.map(
            (subject) => subject.subjectId
          );
        setSelectedSubjects(initialSelectedSubjects);

        const initialSelectedEducations = [
          ...new Set(
            data.supplementaryResourceEducationSubjects.map(
              (education) => education.educationId
            )
          ),
        ];
        setSelectedEducations(initialSelectedEducations);
      })

      .catch((error) => {
        setDefaultMessage(error.defaultMessage);
        if (error.validationErrors.message) {
          setApiMessageError(error.validationErrors.message);
        } else {
          setApiMessageError("");
        }
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
      });
  }, [id]);

  const handleOptionChange = (event) => {
    const selectedOptionEvent = event.target.value;
    setSelectedOption(selectedOptionEvent);
  };

  const handleTagIdSelecting = (tagIds) => {
    setSelectedTags(tagIds);
  };
  const handleSubjectIdSelecting = (subjectIds) => {
    setSelectedSubjects(subjectIds);
  };
  const handleEducationIdSelecting = (educationIds) => {
    setSelectedEducations(educationIds);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("isHardDelete", false);
    const flatTags = selectedTags.flat();
    flatTags.forEach((element, index) => {
      formData.append(`tags[${index}]`, element);
    });
    const flatEducations = selectedEducations.flat();
    flatEducations.forEach((element, index) => {
      formData.append(`educations[${index}]`, element);
    });
    const flatSubjects = selectedSubjects.flat();
    flatSubjects.forEach((element, index) => {
      formData.append(`subjects[${index}]`, element);
    });
    try {
      setTagsError("");
      formData.id = id;
      const result = await recoverResource(formData);
      const message = result.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("../../supplementaryresource/deletedsupplementaryresources");
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);

      if (error.validationErrors.Tags) {
        setTagsError(error.validationErrors.Tags);
      } else {
        setTagsError("");
      }
      if (error.validationErrors.message) {
        setApiMessageError(error.validationErrors.message);
      } else {
        setApiMessageError("");
      }
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
    }
  };

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const response = await getAllEducationThatHaveEducationSubjects();
        setEducations(response);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setEducationErrorMessage("Eğitimler alınırken hata oluştu");
        showToast(educationErrorMessage, "error");
      }
    };
    fetchEducationData();
  }, []);

  useEffect(() => {
    const fetchSubjectData = async (educationIds) => {
      try {
        setSubjects([]); // Önceki konuları temizle
        for (const educationId of educationIds) {
          const response = await ListByEducationtId(educationId);
          if (response.isSuccess) {
            const newSubjects = response.data;
            setSubjects((prevSubjects) => [...prevSubjects, ...newSubjects]); // Yeni konuları ekle
          }
        }
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        if (error.response && error.response.data.isSuccess === false) {
          showToast(apiMessageError, "error");
        }
        setSubjects([]);
      }
    };

    if (selectedEducations.length > 0) {
      fetchSubjectData(selectedEducations);
    }
  }, [selectedEducations]);

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const response = await getAlllTag();
        setTags(response);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setTagErrorMessage("Etiketler alınırken hata oluştu");
        showToast(tagErrorMessage, "error");
      }
    };
    fetchTagData();
  }, []);

  return (
    <div className="homework-form-container">
      <h1>Kaynak Kurtar</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="name" className="form-label">
                  Kaynak Adı:
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-fields">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="educationId" className="form-label">
                  Eğitim Seç:
                </label>
                <div className="form-input">
                  {educations !== undefined && (
                    <MultipleAutoCompleteEducationUpdate
                      educations={educations}
                      onEducationIdSelecting={handleEducationIdSelecting}
                      selectedEducations={selectedEducations}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-fields">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="subjectId" className="form-label">
                  Konu Seç:
                </label>
                <div className="form-input">
                  {subjects !== undefined && (
                    <MultipleAutoCompleteSubjectUpdate
                      subjects={subjects}
                      onSubjectIdSelecting={handleSubjectIdSelecting}
                      selectedSubjects={selectedSubjects}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="subjectId" className="form-label">
                  Etiket Seç:
                </label>
                <div className="form-input">
                  {tags !== undefined && (
                    <MultipleAutoComplete
                      tags={tags}
                      onTagIdSelecting={handleTagIdSelecting}
                      selectedTags={selectedTags}
                    />
                  )}
                </div>
              </div>
              <div>
                {tagsError && <div className="error-message">{tagsError}</div>}
              </div>
            </div>
          </div>
        </div>
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Kurtar" className="submit-button" />
          <Link
            className="submit-button backto-list"
            to={"/admin/supplementaryresource/deletedsupplementaryresources"}
          >
            Listeye Dön
          </Link>
        </div>
        {showToast(otherErrorMessage, "error")}
        {showToast(otherSuccessMessage, "success")}
        {showToast(educationErrorMessage, "error")}
        {showToast(tagErrorMessage, "error")}
      </form>
    </div>
  );
};

export default ResourceUpdate;
