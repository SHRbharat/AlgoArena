import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { CompeteNestProblemPage } from "./pages/CompeteNestProblemPage";
import { ProblemsPage } from "./pages/ProblemsPage";
import { ContestsPage } from "./pages/ContestsPage";
import { AdminPortal } from "@/components/AdminPortal";
import { ManageUsers } from "./components/admin/ManageUsers";
import { AddProblem } from "./components/admin/AddProblem";
import { ManageProblems } from "./components/admin/ManageProblems";
import { ManageContests } from "@/components/admin/ManageContests";
import { ManageCompanies } from "@/components/admin/ManageCompanies";
import { ManageTopics } from "@/components/admin/ManageTopics";
import { OnlineCompiler } from "@/components/OnlineCompiler";
import { EditProblem } from "@/components/admin/EditProblem";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Auth } from "./pages/Auth";
import { HomePage } from "./pages/HomePage";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hook";
import { setIsAuthenticated, setUser } from "@/redux/slice/authSlice";
import { AddContest } from "@/components/admin/AddContest";
import { ValidateToken } from "@/api/authApi";
import { ForbiddenPage } from "@/pages/ForbiddenPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { Loader } from "./components/Loader";
import Contest from "./pages/Contest";
import { LeaderBoard } from "./components/LeaderBoard";
import ProfilePage from "./pages/Profile";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    ValidateToken()
      .then((data) => {
        if (data) {
          dispatch(setIsAuthenticated(true));
          dispatch(setUser(data.user));
        }
      })
      .catch((err) => {
        console.error("Token validation failed:", err);
      });
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<ProtectedRoute allowedRoles={['Organiser', 'Admin']} />}>
                <Route path="/dashboard" element={<AdminPortal />}>
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="problems" element={<ManageProblems />} />
                  <Route path="problems/add" element={<AddProblem />} />
                  <Route path="problems/edit/:id" element={<EditProblem />} />
                  <Route path="contests" element={<ManageContests />} />
                  <Route path="contests/add" element={<AddContest />} />
                  <Route path="companies" element={<ManageCompanies />} />
                  <Route path="topics" element={<ManageTopics />} />
                </Route>
              </Route>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:user_id" element={<ProfilePage />} />
              <Route path="/settings/:user_id" element={<SettingsPage />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problems/:problem_id" element={<CompeteNestProblemPage />} />
              <Route element={<ProtectedRoute allowedRoles={['User', 'Organiser', 'Admin']} />}>
                <Route path="/contests" element={<ContestsPage />} />
                <Route path="/contest/:contest_id" element={<Contest />} />
                <Route path="/contest/:contest_id/problem/:problem_id" element={<CompeteNestProblemPage />} />
                <Route path="/contest/:contest_id/leaderboard" element={<LeaderBoard />} />
              </Route>
              <Route path="/compiler" element={<OnlineCompiler />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />
              <Route path="/loader" element={<Loader />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
