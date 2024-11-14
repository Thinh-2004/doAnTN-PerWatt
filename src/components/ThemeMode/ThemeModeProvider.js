import { CssBaseline, GlobalStyles } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, useEffect, useState } from "react";

export const ThemeModeContext = createContext();

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("screenMode");
    return saved ? saved : "light";
  });
  const [checkAutoMode, setCheckAutoMode] = useState(() => {
    const saved = localStorage.getItem("autoScreenMode");
    return saved === "true";
  });

  useEffect(() => {
    if (checkAutoMode === true) {
      //Theo đỗi màu nền hệ thống
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleMediaChange = (e) => {
        setMode(e.matches ? "dark" : "light");
        localStorage.setItem("screenMode", e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleMediaChange);
      setMode(mediaQuery.matches ? "dark" : "light");
      localStorage.setItem("screenMode", mediaQuery.matches ? "dark" : "light");

      return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }
  }, [checkAutoMode]);

  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === "light"
        ? {
            //Light mode
            backgroundElement: {
              default: "white",
              children: "white",
            },
            background: {
              default: "#f4f6f8",
              // paper: "#fff",
            },
            text: {
              default: "#000", // Black text in light mode
              secondary: "#555", // Gray text for secondary text
              titleHeader: "#001F3F",
            },
          }
        : {
            //Dark mode
            // Custom colors for dark mode
            backgroundElement: {
              default: "#212121",
              children: "#363535",
            },
            background: {
              default: "#212121",
              // paper: "#1e1e1e",
            },
            text: {
              default: "#fff",
              secondary: "#aaa",
              titleHeader: "white",
            },
          }),
    },
    transitions: {
      duration: { enteringScreen: 500, leavingScreen: 500 }, // Thời gian chuyển đổi
    },
  });

  const toggleMode = (valueMode) => {
    const newMode = valueMode ? "dark" : "light";
    setMode(newMode);
    // console.log(newMode);
    document.body.style.backgroundColor =
      newMode === "dark" ? "#212121" : "#f4f6f8";
  };

  const handleAutoScreenMode = (valueAuto) => {
    const newAutoMode = valueAuto;
    setCheckAutoMode(newAutoMode);
    // console.log(valueAuto);
  };

  return (
    <ThemeModeContext.Provider
      value={{ mode, checkAutoMode, toggleMode, handleAutoScreenMode }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            "*": {
              transition: "background-color 0.5s ease, color 0.1s ease",
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
