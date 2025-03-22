import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField, Select, MenuItem, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import AxiosInstance from "../Axios";
import "./quizUpdate.css";

const QuizUpdate = () => {
  const { id: QuizId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosInstance.get(`questionnaires/${QuizId}`)
      .then((res) => {
        console.log(res.data);
        setName(res.data.name);
        setDescription(res.data.description);
        setQuestions(
          res.data.questions.map((q) => ({
            id: q.id, // Используем id из БД, если есть
            question: q.question,
            type: q.question_type,
            options:
              q.options.map((opt) =>
                typeof opt === "object" ? { id: opt.id, text: opt.text } : { id: null, text: opt }
              ) || [],
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных:", err);
        setLoading(false);
      });
  }, [QuizId]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, question: "", type: "text", options: [] },
    ]);
  };

  const updateQuestion = (id, key, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, options: [...q.options, { id: null, text: "" }] } : q))
    );
  };

  const updateOption = (qId, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === index ? { ...opt, text: value } : opt
              ),
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

    const formattedQuestions = questions.map((q, index) => ({
      id: q.id.toString().startsWith("temp-") ? undefined : q.id, // Исключаем временные ID
      question: q.question,
      question_type: q.type,
      order: index + 1,
      options:
        q.type !== "text"
          ? q.options.map((opt) => ({ id: opt.id, text: opt.text }))
          : [],
    }));

    console.log("Отправляемые данные:", {
      name,
      description,
      questions: formattedQuestions,
    });

    AxiosInstance.put(`questionnaires/${QuizId}/`, {
      name,
      description,
      questions: formattedQuestions,
    })
      .then((res) => {
        console.log("Опрос успешно обновлен:", res.data);
        navigate(`/`);
      })
      .catch((error) => {
        console.error(
          "Ошибка при обновлении опроса:",
          error.response?.data || error
        );
      });
  };

  return (
    <section>
      <div className="container">
        <div className="update-quiz-container">
          <h2 className="update-quiz-title">Update quiz</h2>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="update-quiz-form">
                <div className="form-item">
                  <TextField
                    label="Questionnaire Name"
                    value={name}
                    sx={{ marginBottom: "10px" }}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                </div>
                <div className="form-item">
                  <TextField
                    label="Description"
                    value={description}
                    sx={{ marginBottom: "10px" }}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                  />
                </div>
                {questions.map((q) => (
                  <div key={q.id} className="question-block">
                    <TextField
                      label="Question"
                      value={q.question}
                      sx={{ marginBottom: "10px" }}
                      onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                      fullWidth
                    />
                    <Select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                      sx={{ marginBottom: "10px" }}
                      fullWidth
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="single">Single Choice</MenuItem>
                      <MenuItem value="multiple">Multiple Choices</MenuItem>
                    </Select>
                    {q.type !== "text" && (
                      <>
                        {q.options.map((opt, index) => (
                          <div key={index} className="option-block">
                            <TextField
                              label={`Option ${index + 1}`}
                              value={opt.text}

                              onChange={(e) => updateOption(q.id, index, e.target.value)}
                              fullWidth
                            />
                            <IconButton onClick={() => updateQuestion(q.id, "options", q.options.filter((_, i) => i !== index))}>
                              <Delete />
                            </IconButton>
                          </div>
                        ))}
                        <Button onClick={() => addOption(q.id)}>Add Option</Button>
                      </>
                    )}
                    <IconButton onClick={() => removeQuestion(q.id)}>
                      <Delete />
                    </IconButton>
                  </div>
                ))}
                <Button onClick={addQuestion} startIcon={<Add />}>Add Question</Button>
              </div>
              <Button variant="contained" type="submit" sx={{ width: "30%" }}>Update</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizUpdate;
