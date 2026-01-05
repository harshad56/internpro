import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5079/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    login: (credentials: any) => api.post('/Auth/login', credentials),
};

export const tradeService = {
    apply: (applicationData: any) => api.post('/Trade/apply', applicationData),
    getDashboardSummary: () => api.get('/Trade/dashboard-summary'),
};

export const lcService = {
    create: (data: any) => api.post('/LC/create', data),
    amend: (data: any) => api.post('/LC/amend', data),
    validateDocs: (ref: string) => api.get(`/LC/validate-docs/${ref}`),
    getAll: () => api.get('/LC'),
};

export const bgService = {
    issue: (data: any) => api.post('/BG/issue', data),
    claim: (data: any) => api.post('/BG/claim', data),
    getAll: () => api.get('/BG'),
};

export const complianceService = {
    screenAml: (data: any) => api.post('/Compliance/screen-aml', data),
};

export const loanService = {
    apply: (data: any) => api.post('/Loan/apply', data),
    getAll: () => api.get('/Loan'),
};

export const approvalService = {
    getPending: () => api.get('/Approval/pending'),
    processAction: (actionData: any) => api.post('/Approval/action', actionData),
};

export const documentService = {
    upload: (formData: FormData) => api.post('/Document/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    list: (ref: string) => api.get(`/Document/list/${ref}`),
};

export const reportService = {
    getVolume: () => api.get('/Report/volume'),
    getStats: () => api.get('/Report/stats'),
};

export const auditService = {
    getLogs: () => api.get('/AuditLog'),
};

export default api;
