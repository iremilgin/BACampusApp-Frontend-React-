import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../scss/escreate.scss";
import { useParams, useNavigate } from "react-router-dom";
const EducationSubjectCreate = () => {
  const [selectedSourceItems, setSelectedSourceItems] = useState([]);
  const [selectedDestinationItems, setSelectedDestinationItems] = useState([]);
  const [targetSubjects, setTargetSubjects] = useState([]);
  const [resourceSubjects, setResourceSubjects] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setError] = useState({});
  let savedData = sessionStorage.getItem("savedData");
  if (sessionStorage.getItem("savedData") != null) {
    savedData = sessionStorage.getItem("savedData").split(",");
    const role = savedData[1];
  }
  useEffect(() => {
    fetch(`https://localhost:7247/api/Admin/Education/Details?guid=${id}`, {
      mode: "cors",
      headers: {
        Authorization: "Bearer " + savedData[0],
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setEducationDetails(data.data);
        } else {
          console.error("Eğitim detayları alınamadı.");
        }
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7247/api/Admin/EducationSubject/ListByEducationtId?educationId=${id}`,
          {
            mode: "cors",
            headers: {
              Authorization: "Bearer " + savedData[0],
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const formattedData = data.data.map((item) => ({
          educationName: item.educationName,
          subjectId: item.subjectId,
          subjectName: item.subjectName,
        }));
        console.log(formattedData);
        setTargetSubjects(formattedData);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Veriler alınırken hata oluştu ", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7247/api/Admin/EducationSubject/ResourceSubjectsList?educationId=${id}`,
          {
            mode: "cors",
            headers: {
              Authorization: "Bearer " + savedData[0],
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const formattedData = data.data.map((item) => ({
          educationName: "",
          subjectId: item.subjectId,
          subjectName: item.subjectName,
        }));
        setResourceSubjects(formattedData);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Veriler alınırken hata oluştu ", error);
      }
    };
    fetchData();
  }, [id]);
  const educationSubjectCreateWithList = async () => {
    const data = {
      educationId: educationDetails.id,
      subjectIds: targetSubjects.map((item) => item.subjectId),
    };
    console.log(data);
    const response = await fetch(
      "https://localhost:7247/api/Admin/EducationSubject/CreateWithList",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + savedData[0],
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      if (responseData.errors) {
        setError(responseData.errors);
        const validationErrors = Object.entries(responseData.errors).map(
          ([field, messages]) => `${messages.join("\n")}`
        );
        //throw new Error(validationErrors.join("\n"));
      }
      //throw new Error(responseData.title);
    } else {
      navigate(`../educationdetail/${educationDetails.id}`);
      return responseData;
    }
  };
  const handleBulkMove = (fromList, toList, selectedItems) => {
    const updatedFromList = Array.from(fromList);
    const updatedToList = Array.from(toList);
    selectedItems.forEach((itemId) => {
      const item = updatedFromList.find((item) => item.subjectId === itemId);
      if (item) {
        updatedFromList.splice(updatedFromList.indexOf(item), 1);
        updatedToList.push(item);
      }
    });
    if (fromList === resourceSubjects) {
      setResourceSubjects(updatedFromList);
    } else {
      setResourceSubjects(updatedToList);
    }
    if (toList === resourceSubjects) {
      setTargetSubjects(updatedFromList);
    } else {
      setTargetSubjects(updatedToList);
    }
    setSelectedSourceItems([]);
    setSelectedDestinationItems([]);
  };
  const handleSourceItemToggle = (itemId) => {
    if (selectedSourceItems.includes(itemId)) {
      setSelectedSourceItems(selectedSourceItems.filter((id) => id !== itemId));
    } else {
      setSelectedSourceItems([...selectedSourceItems, itemId]);
    }
  };
  const handleDestinationItemToggle = (itemId) => {
    if (selectedDestinationItems.includes(itemId)) {
      setSelectedDestinationItems(
        selectedDestinationItems.filter((id) => id !== itemId)
      );
    } else {
      setSelectedDestinationItems([...selectedDestinationItems, itemId]);
    }
  };
  const handleDragEnd = (result) => {
    if (
      !result.destination ||
      result.source.droppableId === result.destination.droppableId
    ) {
      return;
    }
    const sourceList =
      result.source.droppableId === "source"
        ? resourceSubjects
        : targetSubjects;
    const destinationList =
      result.destination.droppableId === "source"
        ? resourceSubjects
        : targetSubjects;
    const [draggedItem] = sourceList.splice(result.source.index, 1);
    destinationList.splice(result.destination.index, 0, draggedItem);
    setResourceSubjects([...resourceSubjects]);
    setTargetSubjects([...targetSubjects]);
  };
  return (
    <div>
      <div>
        <h1 className="form-title-2">Eğitime Bağlı Konular</h1>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
      </div>
      <div className="main-form-es-create">
        <div className="es-create-card">
          <div className="es-create-card-header">
            <h2>{educationDetails.name}</h2>
          </div>
          <div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="transfer-list">
                <div className="list-container">
                  <h2>Konular (Seç)</h2>
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Droppable droppableId="source">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`list source-list ${
                          snapshot.isDraggingOver ? "dragging-over" : ""
                        }`}
                      >
                        {resourceSubjects
                          .filter((item) =>
                            item.subjectName
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                          .map((item, index) => (
                            <Draggable
                              key={item.subjectId}
                              draggableId={item.subjectId}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  className={`item ${
                                    selectedSourceItems.includes(item.subjectId)
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleSourceItemToggle(item.subjectId)
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedSourceItems.includes(
                                      item.subjectId
                                    )}
                                    onChange={() =>
                                      handleSourceItemToggle(item.subjectId)
                                    }
                                  />
                                  {item.subjectName}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
                <div className="transfer-buttons ">
                  <button
                    className="transfer-button button-es"
                    onClick={() =>
                      handleBulkMove(
                        resourceSubjects,
                        targetSubjects,
                        selectedSourceItems
                      )
                    }
                    disabled={selectedSourceItems.length === 0}
                  >
                    ➡️
                  </button>
                  <button
                    className="transfer-button button-es"
                    onClick={() =>
                      handleBulkMove(
                        targetSubjects,
                        resourceSubjects,
                        selectedDestinationItems
                      )
                    }
                    disabled={selectedDestinationItems.length === 0}
                  >
                    ⬅️
                  </button>
                </div>
                <div className="list-container">
                  <h2>Eğitime Bağlı Konular </h2>
                  <Droppable droppableId="destination">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`list destination-list ${
                          snapshot.isDraggingOver ? "dragging-over" : ""
                        }`}
                      >
                        {targetSubjects.map((item, index) => (
                          <Draggable
                            key={item.subjectId}
                            draggableId={item.subjectId}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className={`item ${
                                  selectedDestinationItems.includes(
                                    item.subjectId
                                  )
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleDestinationItemToggle(item.subjectId)
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedDestinationItems.includes(
                                    item.subjectId
                                  )}
                                  onChange={() =>
                                    handleDestinationItemToggle(item.subjectId)
                                  }
                                />
                                {item.subjectName}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </DragDropContext>
          </div>
          <div className="row-button-es">
            <button
              type="button"
              className="btn btn-primary"
              onClick={educationSubjectCreateWithList}
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EducationSubjectCreate;