import { React, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AxiosInstance from "../Axios";
import { useNavigate, useParams } from "react-router-dom";
import "./quizDelete.css";

const QuizDelete = () => {
  const { id: QuizId } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosInstance.get(`questionnaires/${QuizId}`)
      .then((res) => {
        console.log(res.data);
        setName(res.data.name);
        setDescription(res.data.description);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных:", err);
        setLoading(false);
      });
  }, [QuizId]);

  const navigate = useNavigate();

  const submission = (data) => {
    AxiosInstance.delete(`questionnaires/${QuizId}/`).then((res) => {
      navigate(`/`);
    });
  };

  return (
    <section>
      <div className="container">
        <div>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <div className="delite-quiz-container">
              <h2 className="delite-quiz-title">Delete quiz</h2>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#dfdfe3",
                  marginTop: "10px",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <Typography sx={{ marginLeft: "20px", fontSize: "18px" }}>
                  <span className="delete-warning">Delete questionnaire:</span>{" "}
                  {name}
                </Typography>
                <Typography sx={{ marginLeft: "20px", fontSize: "18px" }}>
                  <span className="delete-warning">
                    Questionnaire description:
                  </span>{" "}
                  {description}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  boxShadow: 3,
                  padding: 4,
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    marginBottom: "40px",
                  }}
                >
                  <span className="delete-warning">
                    Are you sure that you want to delete this questionnaire:
                  </span>
                  {name}
                </Box>

                <Box sx={{ width: "30%" }}>
                  <Button
                    variant="contained"
                    onClick={submission}
                    sx={{ width: "100%" }}
                  >
                    Delete the questionnaire
                  </Button>
                </Box>
              </Box>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizDelete;
