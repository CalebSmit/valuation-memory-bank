import { Switch, Route, Router, Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { WorkspaceProvider } from "./lib/workspace-context";

// Pages
import Dashboard from "./pages/Dashboard";
import WorkspacesPage from "./pages/Workspaces";
import ProjectsPage from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import PlaybooksPage from "./pages/Playbooks";
import PlaybookDetail from "./pages/PlaybookDetail";
import FrameworksPage from "./pages/Frameworks";
import FrameworkDetail from "./pages/FrameworkDetail";
import PrinciplesPage from "./pages/Principles";
import AntipatternsPage from "./pages/Antipatterns";
import TemplatesPage from "./pages/Templates";
import TemplateDetail from "./pages/TemplateDetail";
import ReferenceCasesPage from "./pages/ReferenceCases";
import ReferenceCaseDetail from "./pages/ReferenceCaseDetail";
import SourcesPage from "./pages/Sources";
import QAPage from "./pages/QA";
import NotesPage from "./pages/Notes";
import LessonsPage from "./pages/Lessons";
import SearchPage from "./pages/Search";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/not-found";

// Shell components
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
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
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/workspaces" component={WorkspacesPage} />
              <Route path="/projects" component={ProjectsPage} />
              <Route path="/projects/:id" component={ProjectDetail} />
              <Route path="/playbooks" component={PlaybooksPage} />
              <Route path="/playbooks/:id" component={PlaybookDetail} />
              <Route path="/frameworks" component={FrameworksPage} />
              <Route path="/frameworks/:id" component={FrameworkDetail} />
              <Route path="/principles" component={PrinciplesPage} />
              <Route path="/anti-patterns" component={AntipatternsPage} />
              <Route path="/reasoning-templates" component={TemplatesPage} />
              <Route path="/reasoning-templates/:id" component={TemplateDetail} />
              <Route path="/reference-cases" component={ReferenceCasesPage} />
              <Route path="/reference-cases/:caseId" component={ReferenceCaseDetail} />
              <Route path="/sources" component={SourcesPage} />
              <Route path="/qa" component={QAPage} />
              <Route path="/notes" component={NotesPage} />
              <Route path="/lessons" component={LessonsPage} />
              <Route path="/search" component={SearchPage} />
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
