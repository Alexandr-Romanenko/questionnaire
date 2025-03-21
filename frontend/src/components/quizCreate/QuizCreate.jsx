import { React, useState, useForm } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Select, MenuItem, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import AxiosInstance from "../Axios";
import "./quizCreate.css";

const QuizCreate = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), question: "", type: "text", options: [] },
    ]);
  };

  const updateQuestion = (id, key, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const updateOption = (qId, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    AxiosInstance.post(`questionnaires/`, {
      name,
      description,
      questions: questions.map((q, index) => ({
        question: q.question,
        question_type: q.type,
        order: index + 1,
        options: q.options,
      })),
    })
      .then((res) => {
        console.log("Опрос успешно создан:", res.data);
        navigate(`/`);
      })
      .catch((error) => {
        console.error("Ошибка при создании опроса:", error);
      });
  };

  const navigate = useNavigate();

  return (
    <section>
      <div className="container">
        <h2 className="create-quiz-title">Create a new quiz</h2>
        <div className="create-quiz-container">
          <form onSubmit={handleSubmit}>
            <div className="create-quiz-form">
              <div className="form-item">
                <TextField
                  label="Questionnaire Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
              </div>

              <div className="form-item">
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                />
              </div>

              {questions.map((q) => (
                <div
                  key={q.id}
                  style={{
                    marginBottom: "20px",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <TextField
                    label="Question"
                    value={q.question}
                    sx={{ marginBottom: "10px" }}
                    onChange={(e) =>
                      updateQuestion(q.id, "question", e.target.value)
                    }
                    fullWidth
                  />

                  <Select
                    value={q.type}
                    sx={{ marginBottom: "10px" }}
                    onChange={(e) =>
                      updateQuestion(q.id, "type", e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="single">Single Choice</MenuItem>
                    <MenuItem value="multiple">Multiple Choices</MenuItem>
                  </Select>

                  {q.type !== "text" && (
                    <>
                      {q.options.map((opt, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <TextField
                            label={`Option ${index + 1}`}
                            value={opt}
                            onChange={(e) =>
                              updateOption(q.id, index, e.target.value)
                            }
                            fullWidth
                          />
                          <IconButton
                            onClick={() =>
                              updateQuestion(
                                q.id,
                                "options",
                                q.options.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      ))}
                      <Button onClick={() => addOption(q.id)}>
                        Add Option
                      </Button>
                    </>
                  )}

                  <IconButton onClick={() => removeQuestion(q.id)}>
                    <Delete />
                  </IconButton>
                </div>
              ))}

              <Button onClick={addQuestion} startIcon={<Add />}>
                Add Question
              </Button>
            </div>
            <Button variant="contained" type="submit" sx={{ width: "30%" }}>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default QuizCreate;
