import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./lib/AppContext";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Queues from "./pages/Queues";
import Jobs from "./pages/Jobs";
import Workers from "./pages/Workers";
import Dlq from "./pages/Dlq";
import Projects from "./pages/Projects";

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/queues" element={<Queues />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/dlq" element={<Dlq />} />
            <Route path="/projects" element={<Projects />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
