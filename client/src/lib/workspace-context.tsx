import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

interface WorkspaceContextType {
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  // Aliases used by pages
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
  workspaces: any[];
  activeWorkspace: any | null;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  activeWorkspaceId: "ws_default",
  setActiveWorkspaceId: () => {},
  workspaceId: "ws_default",
  setWorkspaceId: () => {},
  workspaces: [],
  activeWorkspace: null,
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("ws_default");
  
  const { data: workspaces = [] } = useQuery({
    queryKey: ["/api/workspaces"],
    queryFn: api.getWorkspaces,
  });

  const activeWorkspace = workspaces.find((w: any) => w.id === activeWorkspaceId) ?? workspaces[0] ?? null;

  // Set first workspace if default doesn't exist
  useEffect(() => {
    if (workspaces.length > 0 && !workspaces.find((w: any) => w.id === activeWorkspaceId)) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId]);

  return (
    <WorkspaceContext.Provider value={{ activeWorkspaceId, setActiveWorkspaceId, workspaceId: activeWorkspaceId, setWorkspaceId: setActiveWorkspaceId, workspaces, activeWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);
