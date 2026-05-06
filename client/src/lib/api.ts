import { apiRequest, apiGet } from "./queryClient";

export const api = {
  // Auth
  getMe: () => apiGet("/api/me"),

  // Workspaces
  getWorkspaces: () => apiGet("/api/workspaces"),
  createWorkspace: (data: any) => apiRequest("POST", "/api/workspaces", data),
  updateWorkspace: (id: string, data: any) => apiRequest("PATCH", `/api/workspaces/${id}`, data),
  deleteWorkspace: (id: string) => apiRequest("DELETE", `/api/workspaces/${id}`),

  // Projects
  getProjects: (workspaceId?: string) => apiGet(`/api/projects${workspaceId ? `?workspaceId=${workspaceId}` : ""}`),
  getProject: (id: string) => apiGet(`/api/projects/${id}`),
  getProjectDashboard: (id: string) => apiGet(`/api/projects/${id}/dashboard`),
  createProject: (data: any) => apiRequest("POST", "/api/projects", data),
  updateProject: (id: string, data: any) => apiRequest("PATCH", `/api/projects/${id}`, data),
  deleteProject: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),

  // Playbooks
  getPlaybooks: (workspaceId?: string) => apiGet(`/api/playbooks${workspaceId ? `?workspaceId=${workspaceId}` : ""}`),
  getPlaybook: (id: string) => apiGet(`/api/playbooks/${id}`),
  createPlaybook: (data: any) => apiRequest("POST", "/api/playbooks", data),
  updatePlaybook: (id: string, data: any) => apiRequest("PATCH", `/api/playbooks/${id}`, data),
  deletePlaybook: (id: string) => apiRequest("DELETE", `/api/playbooks/${id}`),
  clonePlaybook: (id: string, data: any) => apiRequest("POST", `/api/playbooks/${id}/clone`, data),

  // Frameworks
  getFrameworks: () => apiGet("/api/frameworks"),
  getFramework: (id: string) => apiGet(`/api/frameworks/${id}`),
  createFramework: (data: any) => apiRequest("POST", "/api/frameworks", data),
  updateFramework: (id: string, data: any) => apiRequest("PATCH", `/api/frameworks/${id}`, data),
  cloneFramework: (id: string, data: any) => apiRequest("POST", `/api/frameworks/${id}/clone`, data),

  // Principles
  getPrinciples: () => apiGet("/api/principles"),
  getPrinciple: (id: string) => apiGet(`/api/principles/${id}`),
  createPrinciple: (data: any) => apiRequest("POST", "/api/principles", data),
  updatePrinciple: (id: string, data: any) => apiRequest("PATCH", `/api/principles/${id}`, data),
  clonePrinciple: (id: string, data: any) => apiRequest("POST", `/api/principles/${id}/clone`, data),

  // Anti-patterns
  getAntipatterns: () => apiGet("/api/anti-patterns"),
  getAntipattern: (id: string) => apiGet(`/api/anti-patterns/${id}`),
  createAntipattern: (data: any) => apiRequest("POST", "/api/anti-patterns", data),
  updateAntipattern: (id: string, data: any) => apiRequest("PATCH", `/api/anti-patterns/${id}`, data),
  cloneAntipattern: (id: string, data: any) => apiRequest("POST", `/api/anti-patterns/${id}/clone`, data),

  // Templates
  getTemplates: () => apiGet("/api/reasoning-templates"),
  getTemplate: (id: string) => apiGet(`/api/reasoning-templates/${id}`),
  createTemplate: (data: any) => apiRequest("POST", "/api/reasoning-templates", data),
  updateTemplate: (id: string, data: any) => apiRequest("PATCH", `/api/reasoning-templates/${id}`, data),
  cloneTemplate: (id: string, data: any) => apiRequest("POST", `/api/reasoning-templates/${id}/clone`, data),
  draftPlaceholder: (id: string, data: any) => apiRequest("POST", `/api/reasoning-templates/${id}/draft-placeholder`, data),

  // Reference Cases
  getReferenceCases: () => apiGet("/api/reference-cases"),
  getReferenceCase: (caseId: string) => apiGet(`/api/reference-cases/${caseId}`),
  getReferenceArtifacts: (caseId: string) => apiGet(`/api/reference-cases/${caseId}/artifacts`),
  getReferenceArtifact: (id: string) => apiGet(`/api/reference-artifacts/${id}`),
  cloneReferenceArtifact: (id: string, data: any) => apiRequest("POST", `/api/reference-artifacts/${id}/clone`, data),

  // Assumptions
  getAssumptions: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return apiGet(`/api/assumptions?${params}`);
  },
  createAssumption: (data: any) => apiRequest("POST", "/api/assumptions", data),
  updateAssumption: (id: string, data: any) => apiRequest("PATCH", `/api/assumptions/${id}`, data),
  deleteAssumption: (id: string) => apiRequest("DELETE", `/api/assumptions/${id}`),

  // Sources
  getSources: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return apiGet(`/api/sources?${params}`);
  },
  createSource: (data: any) => apiRequest("POST", "/api/sources", data),
  updateSource: (id: string, data: any) => apiRequest("PATCH", `/api/sources/${id}`, data),
  deleteSource: (id: string) => apiRequest("DELETE", `/api/sources/${id}`),

  // Evidence Links
  getEvidenceLinks: (targetType?: string, targetId?: string) => {
    const params = new URLSearchParams();
    if (targetType) params.set("targetType", targetType);
    if (targetId) params.set("targetId", targetId);
    return apiGet(`/api/evidence-links?${params}`);
  },
  createEvidenceLink: (data: any) => apiRequest("POST", "/api/evidence-links", data),
  deleteEvidenceLink: (id: string) => apiRequest("DELETE", `/api/evidence-links/${id}`),

  // External Model References
  getExternalModelRefs: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return apiGet(`/api/external-model-references?${params}`);
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
    return apiGet(`/api/support-memos?${params}`);
  },
  getSupportMemo: (id: string) => apiGet(`/api/support-memos/${id}`),
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
    return apiGet(`/api/qa?${params}`);
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
    return apiGet(`/api/notes?${params}`);
  },
  createNote: (data: any) => apiRequest("POST", "/api/notes", data),
  updateNote: (id: string, data: any) => apiRequest("PATCH", `/api/notes/${id}`, data),
  deleteNote: (id: string) => apiRequest("DELETE", `/api/notes/${id}`),

  // Lessons
  getLessons: (workspaceId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set("workspaceId", workspaceId);
    if (projectId) params.set("projectId", projectId);
    return apiGet(`/api/lessons?${params}`);
  },
  createLesson: (data: any) => apiRequest("POST", "/api/lessons", data),
  updateLesson: (id: string, data: any) => apiRequest("PATCH", `/api/lessons/${id}`, data),
  deleteLesson: (id: string) => apiRequest("DELETE", `/api/lessons/${id}`),
  cloneLesson: (id: string, data: any) => apiRequest("POST", `/api/lessons/${id}/clone`, data),

  // Tags
  getTags: (workspaceId?: string) => apiGet(`/api/tags${workspaceId ? `?workspaceId=${workspaceId}` : ""}`),
  createTag: (data: any) => apiRequest("POST", "/api/tags", data),

  // Favorites
  getFavorites: (workspaceId?: string) => apiGet(`/api/favorites${workspaceId ? `?workspaceId=${workspaceId}` : ""}`),
  createFavorite: (data: any) => apiRequest("POST", "/api/favorites", data),
  deleteFavorite: (id: string) => apiRequest("DELETE", `/api/favorites/${id}`),

  // Search
  search: (q: string, params?: { workspaceId?: string; projectId?: string; type?: string; includeReferenceCases?: boolean }) => {
    const p = new URLSearchParams({ q });
    if (params?.workspaceId) p.set("workspaceId", params.workspaceId);
    if (params?.projectId) p.set("projectId", params.projectId);
    if (params?.type) p.set("type", params.type);
    if (params?.includeReferenceCases) p.set("includeReferenceCases", "true");
    return apiGet(`/api/search?${p}`);
  },

  // Activity
  getActivity: (workspaceId?: string) => apiGet(`/api/activity${workspaceId ? `?workspaceId=${workspaceId}` : ""}`),

  // Report sections (outline)
  getReportSectionTemplates: () => apiGet("/api/report-section-templates"),
  getProjectReportSections: (projectId: string) =>
    apiGet(`/api/projects/${projectId}/report-sections`),
  getProjectReportProgress: (projectId: string) =>
    apiGet(`/api/projects/${projectId}/report-progress`),
  upsertProjectReportSection: (projectId: string, slug: string, data: any) =>
    apiRequest("PUT", `/api/projects/${projectId}/report-sections/${slug}`, data),
  deleteProjectReportSection: (projectId: string, slug: string) =>
    apiRequest("DELETE", `/api/projects/${projectId}/report-sections/${slug}`),
};
