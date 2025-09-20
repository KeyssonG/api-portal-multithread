import { Routes, Route } from 'react-router-dom';
import  Login  from './pages/Login';
import ResetSenhaSolicitar from './pages/ResetSenhaSolicitar';
import ResetSenhaConfirmar from './pages/ResetSenhaConfirmar';
import './styles/global.css';
import Dashboard from './pages/Dashboard';
import { DashboardProvider } from './contexts/DashboardContextType';
import CadastroFuncionario from './pages/cadastroFuncionario';
import { PrivateRoute } from './components/PrivateRoute';
import { UserProjectionPage } from './components/UserProjectionPage'; // Adicione esta linha

const App = () => {
  return (
    <div className="app-container" style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastrar" element={<CadastroFuncionario />} />
            <Route path='/dashboard' element={
              <PrivateRoute>
                <DashboardProvider>
                  <Dashboard />
                </DashboardProvider>
              </PrivateRoute>
            }></Route>
            <Route path='/user-projection' element={
              <PrivateRoute>
                <UserProjectionPage />
              </PrivateRoute>
            }></Route>
            <Route path="/reset-senha/solicitar" element={<ResetSenhaSolicitar />} />
            <Route path="/reset-senha/confirmar" element={<ResetSenhaConfirmar />} />
            <Route path='/' element={<Login />}></Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;