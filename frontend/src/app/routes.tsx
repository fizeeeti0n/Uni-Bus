import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { StudentDashboard } from "./components/StudentDashboard";
import { StudentProfile } from "./components/StudentProfile";
import { Notifications } from "./components/Notifications";
import { DriverInterface } from "./components/DriverInterface";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminAnalytics } from "./components/AdminAnalytics";
import { AdminLogin } from "./components/AdminLogin";
import { About } from "./components/About";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ForgotPassword } from "./components/ForgotPassword";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "student", Component: StudentDashboard },
      { path: "student/profile", Component: StudentProfile },
      { path: "student/notifications", Component: Notifications },
      { path: "driver", Component: DriverInterface },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/analytics", Component: AdminAnalytics },
      { path: "admin/login", Component: AdminLogin },
      { path: "about", Component: About },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "*", Component: NotFound },
    ],
  },
]);
