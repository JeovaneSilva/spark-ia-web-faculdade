import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import { RequireAuth } from "./features/auth/RequireAuth";
import { LoginPage } from "./features/auth/LoginPage";
import { SignupPage } from "./features/auth/SignupPage";
import { LandingPage } from "./features/landing/LandingPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardHomePage } from "./features/dashboard/DashboardHomePage";
import { ChatbotPage } from "./features/chatbot/ChatbotPage";
import { FlashcardsPage } from "./features/flashcards/FlashcardsPage";
import { FlashcardSubjectPage } from "./features/flashcards/FlashcardSubjectPage";
import { QuestionsPage } from "./features/questions/QuestionsPage";
import { QuestionDetailPage } from "./features/questions/QuestionDetailPage";
import { NotFoundPage } from "./features/errors/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <LandingPage />
            </RequireAuth>
          }
        />

        <Route
          path="/app"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="flashcards/:materia/:pergunta" element={<FlashcardSubjectPage />} />
          <Route path="questoes" element={<QuestionsPage />} />
          <Route path="questoes/:prova/:questao" element={<QuestionDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
