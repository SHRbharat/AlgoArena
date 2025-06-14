// testcases status mapping
export const testcaseStatus = {
  1: "In Queue",
  2: "Processing",
  3: "Accepted",
  4: "Wrong Answer",
  5: "Time Limit Exceeded",
  6: "Compilation Error",
  7: "Runtime Error (SIGSEGV)",
  8: "Runtime Error (SIGXFSZ)",
  9: "Runtime Error (SIGFPE)",
  10: "Runtime Error (SIGABRT)",
  11: "Runtime Error (NZEC)",
  12: "Runtime Error (Other)",
  13: "Internal Error",
  14: "Exec Format Error",
};

// Language mapping
export const languageMapping = {
  // 45: { name: "Assembly (NASM 2.14.02)", is_archived: false },
  // 2: { name: "Bash (4.0)", is_archived: true },
  // 1: { name: "Bash (4.4)", is_archived: true },
  // 46: { name: "Bash (5.0.0)", is_archived: false },
  // 3: { name: "Basic (fbc 1.05.0)", is_archived: true },
  // 47: { name: "Basic (FBC 1.07.1)", is_archived: false },
  // 75: { name: "C (Clang 7.0.1)", is_archived: false },
  // 76: { name: "C++ (Clang 7.0.1)", is_archived: false },
  // 15: { name: "C++ (g++ 4.8.5)", is_archived: true },
  // 14: { name: "C++ (g++ 4.9.4)", is_archived: true },
  // 13: { name: "C++ (g++ 5.4.0)", is_archived: true },
  // 12: { name: "C++ (g++ 6.3.0)", is_archived: true },
  // 11: { name: "C++ (g++ 6.4.0)", is_archived: true },
  // 10: { name: "C++ (g++ 7.2.0)", is_archived: true },
  // 9: { name: "C (gcc 4.8.5)", is_archived: true },
  // 8: { name: "C (gcc 4.9.4)", is_archived: true },
  // 7: { name: "C (gcc 5.4.0)", is_archived: true },
  // 6: { name: "C (gcc 6.3.0)", is_archived: true },
  // 5: { name: "C (gcc 6.4.0)", is_archived: true },
  // 4: { name: "C (gcc 7.2.0)", is_archived: true },
  // 48: { name: "C (GCC 7.4.0)", is_archived: false },
  // 52: { name: "C++ (GCC 7.4.0)", is_archived: false },
  // 49: { name: "C (GCC 8.3.0)", is_archived: false },
  // 53: { name: "C++ (GCC 8.3.0)", is_archived: false },
  50: { name: "C (GCC 9.2.0)", is_archived: false },
  54: { name: "C++ (GCC 9.2.0)", is_archived: false },
  // 86: { name: "Clojure (1.10.1)", is_archived: false },
  // 18: { name: "Clojure (1.8.0)", is_archived: true },
  // 17: { name: "C# (mono 5.2.0.224)", is_archived: true },
  // 16: { name: "C# (mono 5.4.0.167)", is_archived: true },
  // 51: { name: "C# (Mono 6.6.0.161)", is_archived: false },
  // 77: { name: "COBOL (GnuCOBOL 2.2)", is_archived: false },
  // 55: { name: "Common Lisp (SBCL 2.0.0)", is_archived: false },
  // 19: { name: "Crystal (0.23.1)", is_archived: true },
  // 56: { name: "D (DMD 2.089.1)", is_archived: false },
  // 20: { name: "Elixir (1.5.1)", is_archived: true },
  // 57: { name: "Elixir (1.9.4)", is_archived: false },
  // 21: { name: "Erlang (OTP 20.0)", is_archived: true },
  // 58: { name: "Erlang (OTP 22.2)", is_archived: false },
  // 44: { name: "Executable", is_archived: false },
  // 87: { name: "F# (.NET Core SDK 3.1.202)", is_archived: false },
  // 59: { name: "Fortran (GFortran 9.2.0)", is_archived: false },
  // 60: { name: "Go (1.13.5)", is_archived: false },
  // 22: { name: "Go (1.9)", is_archived: true },
  // 88: { name: "Groovy (3.0.3)", is_archived: false },
  // 24: { name: "Haskell (ghc 8.0.2)", is_archived: true },
  // 23: { name: "Haskell (ghc 8.2.1)", is_archived: true },
  // 61: { name: "Haskell (GHC 8.8.1)", is_archived: false },
  // 25: { name: "Insect (5.0.0)", is_archived: true },
  62: { name: "Java (OpenJDK 13.0.1)", is_archived: false },
  // 28: { name: "Java (OpenJDK 7)", is_archived: true },
  // 27: { name: "Java (OpenJDK 8)", is_archived: true },
  // 26: { name: "Java (OpenJDK 9 with Eclipse OpenJ9)", is_archived: true },
  63: { name: "JavaScript (Node.js 12.14.0)", is_archived: false },
  // 30: { name: "JavaScript (nodejs 7.10.1)", is_archived: true },
  // 29: { name: "JavaScript (nodejs 8.5.0)", is_archived: true },
  // 78: { name: "Kotlin (1.3.70)", is_archived: false },
  // 64: { name: "Lua (5.3.5)", is_archived: false },
  // 89: { name: "Multi-file program", is_archived: false },
  // 79: { name: "Objective-C (Clang 7.0.1)", is_archived: false },
  // 31: { name: "OCaml (4.05.0)", is_archived: true },
  // 65: { name: "OCaml (4.09.0)", is_archived: false },
  // 32: { name: "Octave (4.2.0)", is_archived: true },
  // 66: { name: "Octave (5.1.0)", is_archived: false },
  // 33: { name: "Pascal (fpc 3.0.0)", is_archived: true },
  // 67: { name: "Pascal (FPC 3.0.4)", is_archived: false },
  // 85: { name: "Perl (5.28.1)", is_archived: false },
  // 68: { name: "PHP (7.4.1)", is_archived: false },
  // 43: { name: "Plain Text", is_archived: false },
  // 69: { name: "Prolog (GNU Prolog 1.4.5)", is_archived: false },
  // 37: { name: "Python (2.6.9)", is_archived: true },
  // 70: { name: "Python (2.7.17)", is_archived: false },
  // 36: { name: "Python (2.7.9)", is_archived: true },
  71: { name: "Python (3.8.1)", is_archived: false },
  // Add more languages as needed
};

// Usage example
// import { testcaseStatus, languageMapping } from './mapping';
// console.log(testcaseStatus[4]); // Output: "Wrong Answer"
// console.log(languageMapping[45].name); // Output: "Assembly (NASM 2.14.02)"
