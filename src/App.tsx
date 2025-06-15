
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './styles/global.css';
import Dashboard from './pages/Dashboard';
import { DashboardProvider } from './contexts/DashboardContextType';
import CadastroFuncionario from './pages/cadastroFuncionario';

const App = () => {
  return (
    <div className="app-container" style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastrar" element={<CadastroFuncionario />} />
            <Route path='/dashboard' element={
              <DashboardProvider>
                <Dashboard />
              </DashboardProvider>}></Route>
            <Route path='/' element={<Login />}></Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
