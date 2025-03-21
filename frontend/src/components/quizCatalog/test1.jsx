import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../Axios";
import Modal from "../modal/Modal";
import { Button, Pagination } from "@mui/material";
import "./quizCatalog.css";
import crudImg from "../../img/crud.png";
import addImg from "../../img/square-plus.png";
import { blue } from "@mui/material/colors";

const QuizCatalog = () => {
  const [quizData, setQuizdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Количество карточек на странице
  const navigate = useNavigate();

  useEffect(() => {
    AxiosInstance.get(`questionnaires/`).then((res) => {
      setQuizdata(res.data);
      setLoading(false);
    });
  }, []);

  const openModal = (event, id) => {
    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + 3 + window.scrollY, // 3px ниже кнопки
      left: rect.left - 150 + window.scrollX, // Смещаем влево (150px – ширина модалки)
    });
    setActiveQuizId(id);
  };

  // **Фильтрация данных для текущей страницы**
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = quizData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="container">
          <div className="quiz-container">
            <div className="header-block">
              <h1 className="section-title hero-header">Quiz Catalog</h1>

              <div className="add-quiz-block">
                <h3 className="add-quiz-title">Create quiz</h3>
                <img
                  src={addImg}
                  alt="Add new quiz"
                  className="add-quiz-img"
                  onClick={() => navigate("/create-quiz")} // Переход при клике
                />
              </div>
            </div>

            <div className="quiz-cards">
              {quizData.map((item) => (
                <div key={item.id} className="card">
                  <div className="card-block">
                    <h4 className="card-header">{item.name}</h4>
                    <p className="card-description">{item.description}</p>
                    <div className="card-number">
                      Questions: {item.questions.length}
                    </div>
                    <div className="card-number">
                      Completions: {item.completions_amount}
                    </div>
                  </div>
                  <div className="card-block">
                    <img
                      src={crudImg}
                      alt="menu"
                      className="card-menu"
                      onClick={(e) => openModal(e, item.id)}
                    />
                  </div>

                  {activeQuizId === item.id && (
                    <Modal
                      open={true}
                      onClose={() => setActiveQuizId(null)}
                      position={modalPosition}
                      className="modal-quiz-catalog"
                    >
                      <h3 className="modal-header">Manage Quiz</h3>

                      <Button
                        component={Link}
                        to={`/run-quiz/${item.id}`}
                        sx={{
                          width: 40,
                          display: "flex",
                          textAlign: "start",
                          justifyContent: "flex-start",
                          color: "#0a0df0",
                          "&:hover": {
                            backgroundColor: "#dfdfe3",
                          },
                        }}
                      >
                        Run
                      </Button>

                      <Button
                        component={Link}
                        to={`/update-quiz/${item.id}`}
                        sx={{
                          width: 40,
                          display: "flex",
                          textAlign: "start",
                          justifyContent: "flex-start",
                          color: "#0a0df0",
                          "&:hover": {
                            backgroundColor: "#dfdfe3",
                          },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        component={Link}
                        to={`/delete-quiz/${item.id}`}
                        sx={{
                          width: 40,
                          display: "flex",
                          textAlign: "start",
                          justifyContent: "flex-start",
                          color: "#0a0df0",
                          "&:hover": {
                            backgroundColor: "#dfdfe3",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Modal>
                  )}
                </div>
              ))}
            </div>
            {/* БЛОК ПАГИНАЦИИ */}
            <div className="pagination-block">
              <Pagination
                shape="rounded"
                count={Math.ceil(quizData.length / itemsPerPage)} // Всего страниц
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                style={{
                  display: "flex",
                  alignItemsgn: "center",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuizCatalog;
