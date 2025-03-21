import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
} from "@mui/material";
import AxiosInstance from "../Axios";

const QuizRun = () => {
  const { id: QuizId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosInstance.get(`questionnaires/${QuizId}`)
      .then((res) => {
        setName(res.data.name);
        setDescription(res.data.description);
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных:", err);
        setLoading(false);
      });
  }, [QuizId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, optionId, checked) => {
    setAnswers((prev) => {
      const prevOptions = prev[questionId] || [];
      const updatedOptions = checked
        ? [...prevOptions, optionId]
        : prevOptions.filter((id) => id !== optionId);
      return { ...prev, [questionId]: updatedOptions };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedAnswers = questions.map((q) => ({
      question: q.id,
      selected_options: q.type !== "text" ? answers[q.id] || [] : [],
      text_response: q.type === "text" ? answers[q.id] || "" : null,
    }));

    AxiosInstance.post(`answers/`, { answers: formattedAnswers })
      .then(() => navigate(`/`))
      .catch((error) => console.error("Ошибка при отправке ответов:", error));
  };

  return (
    <section>
      <div className="container">
        <div className="run-quiz-container">
          <h2 className="run-quiz-title">You are going to pass the quiz:</h2>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <Typography sx={{ fontSize: "18px", marginBottom: "20px" }}>
                <span className="delete-warning">Delete questionnaire:</span>{" "}
                {name}
              </Typography>
              <Typography sx={{ fontSize: "16px", marginBottom: "20px" }}>
                <span className="delete-warning">
                  Questionnaire description:
                </span>{" "}
                {description}
              </Typography>
              {questions.map((q) => (
                <div key={q.id}>
                  <h4>Question: {q.question}</h4>
                  {q.question_type === "text" && (
                    <TextField
                      fullWidth
                      multiline
                      sx={{ marginBottom: "20px" }}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  )}
                  {q.question_type === "single" && (
                    <RadioGroup
                      sx={{ marginBottom: "20px" }}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    >
                      {q.options.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          control={<Radio />}
                          label={option.text}
                        />
                      ))}
                    </RadioGroup>
                  )}
                  {q.question_type === "multiple" && (
                    <FormGroup sx={{ marginBottom: "20px" }}>
                      {q.options.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          control={
                            <Checkbox
                              onChange={(e) =>
                                handleCheckboxChange(
                                  q.id,
                                  option.id,
                                  e.target.checked
                                )
                              }
                            />
                          }
                          label={option.text}
                        />
                      ))}
                    </FormGroup>
                  )}
                </div>
              ))}
              <Box sx={{ width: "10%" }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ width: "100%" }}
                >
                  Send
                </Button>
              </Box>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizRun;
