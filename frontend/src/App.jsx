import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizCatalog from "../src/components/quizCatalog/QuizCatalog";
import QuizCreate from "../src/components/quizCreate/QuizCreate";
import QuizUpdate from "../src/components/quizUpdate/QuizUpdate";
import QuizDelete from "../src/components/quizDelete/QuizDelete";
import QuizRun from "./components/quizRun/QuizRun";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizCatalog />} />
        <Route path="/create-quiz" element={<QuizCreate />} />
        <Route path="/run-quiz/:id" element={<QuizRun />} />
        <Route path="/update-quiz/:id" element={<QuizUpdate />} />
        <Route path="/delete-quiz/:id" element={<QuizDelete />} />
      </Routes>
    </Router>
  );
}

export default App;
