import { useEffect, useState } from "react";
import { Feed } from "./components/Feed";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ThemeProvider } from "./contexts/theme";

function App() {
  const [theme, setTheme] = useState(localStorage.theme === "dark" || !("theme" in localStorage) ? "dark" : "white");
  const [triggerElement, setTriggerElement] = useState(null);

  const darkTheme = (e) => {
    setTheme("dark");
    localStorage.theme = "dark";
    setTriggerElement(e);
  };

  const lightTheme = (e) => {
    setTheme("white");
    localStorage.theme = "white";
    setTriggerElement(e);
  };

  useEffect(() => {
    document.querySelector("html").classList.remove("dark", "white");
    document.querySelector("html").classList.add(theme);
    if (triggerElement) {
      triggerElement.currentTarget.classList.add("dark:bg-white");
    }
  }, [theme]);

  return (
    <ThemeProvider value={{ theme, darkTheme, lightTheme }}>
      <Header />
      <main className="flex px-2 py-4 bg-[#f0f2f5] dark:bg-[#18191a] min-h-screen dark:text-[#e2e4e9] transition-colors duration-500">
        <Sidebar />
        <Feed />
        {/* --------------------------------------- */}
        <section className="basis-1/4">
          <h2>unknown section</h2>
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;
