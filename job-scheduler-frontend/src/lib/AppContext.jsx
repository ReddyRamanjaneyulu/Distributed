import { createContext, useContext, useEffect, useState } from "react";
import { listProjects } from "./api";
import { startEngine } from "./engine";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user] = useState({ name: "Alex Rivera", email: "alex@northwind.dev", role: "Admin" });
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    startEngine();
    listProjects().then((ps) => {
      setProjects(ps);
      setProjectId((prev) => prev ?? ps[0]?.id ?? null);
    });
  }, []);

  const project = projects.find((p) => p.id === projectId) || null;

  return (
    <AppContext.Provider value={{ user, projects, project, projectId, setProjectId, setProjects }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
