const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:8085';
  }
  return 'http://localhost:31000';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    LOGIN_MULTITHREAD: '/login-multithread',
    ALTERAR_SENHA: '/alterar/senha',
    RESET_SENHA_SOLICITAR: '/reset-senha/solicitar',
    RESET_SENHA_CONFIRMAR: '/reset-senha/confirmar',
    CADASTRAR_FUNCIONARIO: '/cadastrar/funcionario-multithread',
    USERS: '/users',
    INTERNAL_EMPLOYEES_DEPARTAMENTO: '/internal/employees',
    INTERNAL_EMPLOYEES: '/internal/employees/date',
    EMPLOYEES_DEPARTAMENTO: '/employees',
    EMPLOYEES: '/employees/date',
  },
} as const;
