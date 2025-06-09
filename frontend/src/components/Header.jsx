import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Moon, Sun, User, Menu, X, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setIsLoginPage } from "@/redux/slice/toggleSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutUser } from "@/api/authApi";
import { logout } from "@/redux/slice/authSlice";
import { motion } from "framer-motion";
import AlgoArena_dark from "../assets/logo/AlgoArena_dark.png";
import AlgoArena_light from "../assets/logo/AlgoArena_light.png";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const username = user?.email.split("@")[0];

  const handleLogout = async () => {
    await LogoutUser();
    dispatch(logout());
    navigate("/auth");
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 md:h-16 items-center justify-between p-2 md:p-6">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center">
              <img
                src={theme === 'light' ? AlgoArena_light : AlgoArena_dark}
                alt="CompeteNest"
                className="h-10 md:h-12"
              />
            </span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {isAuthenticated && user && (user.role === "Organiser" || user.role === "Admin") && (
            <NavLink to="/dashboard" isActive={isActive("/dashboard")}>Dashboard</NavLink>
          )}
          <NavLink to="/problems" isActive={isActive("/problems")}>Problems</NavLink>
          <NavLink to="/contests" isActive={isActive("/contests")}>Contests</NavLink>
          <NavLink to="/compiler" isActive={isActive("/compiler")}>Compiler</NavLink>
        </nav>

        <div className="flex items-center space-x-1 md:space-x-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">User profile</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/profile/${username}`)} className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/settings/${username}`)} className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-1 md:space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    dispatch(setIsLoginPage(false));
                    navigate("/auth");
                  }}
                  size="sm"
                  className="rounded-full px-4"
                >
                  Sign up
                </Button>
              </motion.div>
            </div>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-[1.2rem] w-[1.2rem]" /> : <Menu className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t"
        >
          <div className="flex flex-col space-y-3 p-4">
            {isAuthenticated && user && (user.role === "Organiser" || user.role === "Admin") && (
              <MobileNavLink to="/dashboard" isActive={isActive("/dashboard")}>Dashboard</MobileNavLink>
            )}
            <MobileNavLink to="/problems" isActive={isActive("/problems")}>Problems</MobileNavLink>
            <MobileNavLink to="/contests" isActive={isActive("/contests")}>Contests</MobileNavLink>
            <MobileNavLink to="/compiler" isActive={isActive("/compiler")}>Compiler</MobileNavLink>
          </div>
        </motion.nav>
      )}
    </header>
  );
}

function NavLink({ to, isActive, children }) {
  return (
    <Link to={to} className="relative px-3 py-2 rounded-md text-sm font-medium transition-colors">
      <span className={`${isActive ? "text-primary" : "text-foreground hover:text-primary/90"}`}>{children}</span>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({ to, isActive, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-base font-medium transition-all ${
        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted hover:text-primary/90"
      }`}
    >
      {children}
    </Link>
  );
}
