import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { WorkspaceProvider } from "./lib/workspace-context";

// Pages
import ProjectsPage from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import RoadmapExplorer from "./pages/RoadmapExplorer";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/not-found";

import { TopNav } from "./components/TopNav";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNav />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>
        <Router hook={useHashLocation}>
          <AppShell>
            <Switch>
              <Route path="/" component={ProjectsPage} />
              <Route path="/projects" component={ProjectsPage} />
              <Route path="/projects/:id" component={ProjectDetail} />
              <Route path="/roadmap" component={RoadmapExplorer} />
              <Route path="/settings" component={SettingsPage} />
              <Route component={NotFound} />
            </Switch>
          </AppShell>
        </Router>
        <Toaster />
      </WorkspaceProvider>
    </QueryClientProvider>
  );
}
