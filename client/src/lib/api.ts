import { apiRequest } from "./queryClient";

export const api = {
  // Auth
  getMe: () => fetch("/api/me").then(r => r.json()),
  
  // Workspaces
  getWorkspaces: () => fetch("/api/workspaces").then(r => r.json()),
  createWorkspace: (data: any) => apiRequest("POST", "/api/workspaces", data),
  updateWorkspace: (id: string, data: any) => apiRequest("PATCH", `/api/workspaces/${id}`, data),
  deleteWorkspace: (id: string) => apiRequest("DELETE", `/api/workspaces/${id}`),
  
  // Projects
  getProjects: (workspaceId?: string) => fetch(`/api/projects${workspaceId ? `?workspaceId=${workspaceId}` : ""}`).then(r => r.json()),
  getProject: (id: string) => fetch(`/api/projects/${id}`).then(r => r.json()),
  getProjectDashboard: (id: string) => fetch(`/api/projects/${id}/dashboard`).then(r => r.json()),
  createProject: (data: any) => apiRequest("POST", "/api/projects", data),
  updateProject: (id: string, data: any) => apiRequest("PATCH", `/api/projects/${id}`, data),
  deleteProject: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),
  
  // Playbooks
  getPlaybooks: (workspaceId?: string) => fetch(`/api/playbooks${workspaceId ? `?workspaceId=${workspaceId}` : ""}`).then(r => r.json()),
  getPlaybook: (id: string) => fetch(`/api/playbooks/${id}`).then(r => r.json()),
  createPlaybook: (data: any) => apiRequest("POST", "/api/playbooks", data),
  updatePlaybook: (id: string, data: any) => apiRequest("PATCH", `/api/playbooks/${id}`, data),
  deletePlaybook: (id: string) => apiRequest("DELETE", `/api/playbooks/${id}`),
  clonePlaybook: (id: string, data: any) => apiRequest("POST", `/api/playbooks/${id}/clone`, data),
  
  // Frameworks
  getFrameworks: () => fetch("/api/frameworks").then(r => r.json()),
  getFramework: (id: string) => fetch(`/api/frameworks/${id}`).then(r => r.json()),
  createFramework: (data: any) => apiRequest("POST", "/api/frameworks", data),
  updateFramework: (id: string, data: any) => apiRequest("PATCH", `/api/frameworks/${id}`, data),
  cloneFramework: (id: string, data: any) => apiRequest("POST", `/api/frameworks/${id}/clone`, data),
  
  // Principles
  getPrinciples: () => fetch("/api/principles").then(r => r.json()),
  getPrinciple: (id: string) => fetch(`/api/principles/${id}`).then(r => r.json()),
  createPrinciple: (data: any) => apiRequest("POST", "/api/principles", data),
  updatePrinciple: (id: string, data: any) => apiRequest("PATCH", `/api/principles/${id}`, data),
  clonePrinciple: (id: string, data: any) => apiRequest("POST", `/api/principles/${id}/clone`, data),
  
  // Anti-patterns
  getAntipatterns: () => fetch("/api/anti-patterns").then(r => r.json()),
  getAntipattern: (id: string) => fetch(`/api/anti-patterns/${id}`).then(r => r.json()),
  createAntipattern: (data: any) => apiRequest("POST", "/api/anti-patterns", data),
  updateAntipattern: (id: string, data: any) => apiRequest("PATCH", `/api/anti-patterns/${id}`, data),
  cloneAntipattern: (id: string, data: any) => apiRequest("POST", `/api/anti-patterns/${id}/clone`, data),
  
  // Templates
  getTemplates: () => fetch("/api/reasoning-templates").then(r => r.json()),
  getTemplate: (id: string) => fetch(`/api/reasoning-templates/${id}`).then(r => r.json()),
  createTemplate: (data: any) => apiRequest("POST", "/api/reasoning-templates", data),
  updateTemplate: (id: string, data: any) => apiRequest("PATCH", `/api/reasoning-templates/${id}`, data),
  cloneTemplate: (id: string, data: any) => apiRequest("POST", `/api/reasoning-templates/${id}/clone`, data),
  draftPlaceholder: (id: string, data: any) => apiRequest("POST", `/api/reasoning-templates/${id}/draft-placeholder`, data),
  
  // Reference Cases
  getReferenceCases: () => fetch("/api/reference-cases").then(r => r.json()),
  getReferenceCase: (caseId: string) => fetch(`/api/reference-cases/${caseId}`).then(r => r.json()),
  getReferenceArtifacts: (caseId: string) => fetch(`/api/reference-cases/${caseId}/artifacts`).then(r => r.json()),
  getReferenceArtifact: (id: string) => fetch(`/api/reference-artifacts/${id}`).then(r => r.json()),
  cloneReferenceArtifact: (id: string, data: any) => apiRequest("POST", `/api/reference-artifacts/${id}/clone`, data),
  
  // Assumptions
  getAssumptions: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return fetch(`/api/assumptions?${params}`).then(r => r.json());
  },
  createAssumption: (data: any) => apiRequest("POST", "/api/assumptions", data),
  updateAssumption: (id: string, data: any) => apiRequest("PATCH", `/api/assumptions/${id}`, data),
  deleteAssumption: (id: string) => apiRequest("DELETE", `/api/assumptions/${id}`),
  
  // Sources
  getSources: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return fetch(`/api/sources?${params}`).then(r => r.json());
  },
  createSource: (data: any) => apiRequest("POST", "/api/sources", data),
  updateSource: (id: string, data: any) => apiRequest("PATCH", `/api/sources/${id}`, data),
  deleteSource: (id: string) => apiRequest("DELETE", `/api/sources/${id}`),
  
  // Evidence Links
  getEvidenceLinks: (targetType?: string, targetId?: string) => {
    const params = new URLSearchParams();
    if (targetType) params.set("targetType", targetType);
    if (targetId) params.set("targetId", targetId);
    return fetch(`/api/evidence-links?${params}`).then(r => r.json());
  },
  createEvidenceLink: (data: any) => apiRequest("POST", "/api/evidence-links", data),
  deleteEvidenceLink: (id: string) => apiRequest("DELETE", `/api/evidence-links/${id}`),
  
  // External Model References
  getExternalModelRefs: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return fetch(`/api/external-model-references?${params}`).then(r => r.json());
  },
  createExternalModelRef: (data: any) => apiRequest("POST", "/api/external-model-references", data),
  updateExternalModelRef: (id: string, data: any) => apiRequest("PATCH", `/api/external-model-references/${id}`, data),
  deleteExternalModelRef: (id: string) => apiRequest("DELETE", `/api/external-model-references/${id}`),
  
  // Support Memos
  getSupportMemos: (workspaceId?: string, projectId?: string, memoType?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    if (memoType) params.set("memoType", memoType);
    return fetch(`/api/support-memos?${params}`).then(r => r.json());
  },
  getSupportMemo: (id: string) => fetch(`/api/support-memos/${id}`).then(r => r.json()),
  createSupportMemo: (data: any) => apiRequest("POST", "/api/support-memos", data),
  updateSupportMemo: (id: string, data: any) => apiRequest("PATCH", `/api/support-memos/${id}`, data),
  deleteSupportMemo: (id: string) => apiRequest("DELETE", `/api/support-memos/${id}`),
  cloneSupportMemo: (id: string, data: any) => apiRequest("POST", `/api/support-memos/${id}/clone`, data),
  
  // Q&A
  getQaItems: (workspaceId?: string, projectId?: string, caseId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    if (caseId) params.set("caseId", caseId);
    return fetch(`/api/qa?${params}`).then(r => r.json());
  },
  createQaItem: (data: any) => apiRequest("POST", "/api/qa", data),
  updateQaItem: (id: string, data: any) => apiRequest("PATCH", `/api/qa/${id}`, data),
  deleteQaItem: (id: string) => apiRequest("DELETE", `/api/qa/${id}`),
  cloneQaItem: (id: string, data: any) => apiRequest("POST", `/api/qa/${id}/clone`, data),
  
  // Notes
  getNotes: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return fetch(`/api/notes?${params}`).then(r => r.json());
  },
  createNote: (data: any) => apiRequest("POST", "/api/notes", data),
  updateNote: (id: string, data: any) => apiRequest("PATCH", `/api/notes/${id}`, data),
  deleteNote: (id: string) => apiRequest("DELETE", `/api/notes/${id}`),
  
  // Lessons
  getLessons: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return fetch(`/api/lessons?${params}`).then(r => r.json());
  },
  createLesson: (data: any) => apiRequest("POST", "/api/lessons", data),
  updateLesson: (id: string, data: any) => apiRequest("PATCH", `/api/lessons/${id}`, data),
  deleteLesson: (id: string) => apiRequest("DELETE", `/api/lessons/${id}`),
  cloneLesson: (id: string, data: any) => apiRequest("POST", `/api/lessons/${id}/clone`, data),
  
  // Tags
  getTags: (workspaceId?: string) => fetch(`/api/tags${workspaceId ? `?workspaceId=${workspaceId}` : ""}`).then(r => r.json()),
  createTag: (data: any) => apiRequest("POST", "/api/tags", data),
  
  // Favorites
  getFavorites: (workspaceId?: string) => fetch(`/api/favorites${workspaceId ? `?workspaceId=${workspaceId}` : ""}`).then(r => r.json()),
  createFavorite: (data: any) => apiRequest("POST", "/api/favorites", data),
  deleteFavorite: (id: string) => apiRequest("DELETE", `/api/favorites/${id}`),
  
  // Search
  search: (q: string, params?: { workspaceId?: string; projectId?: string; type?: string; includeReferenceCases?: boolean }) => {
    const p = new URLSearchParams({ q });
    if (params?.workspaceId) p.set("workspaceId", params.workspaceId);
    if (params?.projectId) p.set("projectId", params.projectId);
    if (params?.type) p.set("type", params.type);
    if (params?.includeReferenceCases) p.set("includeReferenceCases", "true");
    return fetch(`/api/search?${p}`).then(r => r.json());
  },
  
  // Activity
  getActivity: (workspaceId?: string) => fetch(`/api/activity${workspaceId ? `?workspaceId=${workspaceId}` : ""}`).then(r => r.json()),
};
