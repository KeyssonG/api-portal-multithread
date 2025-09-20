// src/pages/Login.tsx
import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import { useLoginForm } from '../hooks/useLoginForm';
import { usePasswordChangeForm } from '../hooks/usePasswordChangeForm';
import { LoginForm } from '../components/LoginForm';
import { PasswordChangeForm } from '../components/PasswordChangeForm';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Login = () => {
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [passwordChangeData, setPasswordChangeData] = useState<{
    token: string;
    username: string;
  } | null>(null);

  const loginForm = useLoginForm();
  const passwordForm = usePasswordChangeForm(
    passwordChangeData?.token || '',
    passwordChangeData?.username || ''
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    const result = await loginForm.handleSubmit(e);
    if (result.needsPasswordChange && result.token) {
      setPasswordChangeData({
        token: result.token,
        username: result.username || ''
      });
      setNeedsPasswordChange(true);
    }
  };

  return (
    <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Portal MultiThread</h1>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '70px' }}>
        {!needsPasswordChange ? (
          <LoginForm
            username={loginForm.formState.username}
            password={loginForm.formState.password}
            error={loginForm.apiState.error}
            isLoading={loginForm.apiState.isLoading}
            onUsernameChange={(e) => loginForm.formActions.setUsername(e.target.value)}
            onPasswordChange={(e) => loginForm.formActions.setPassword(e.target.value)}
            onSubmit={handleLoginSubmit}
          >
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <Link to="/reset-senha/solicitar">Esqueceu a senha?</Link>
            </div>
          </LoginForm>
        ) : (
          <PasswordChangeForm
            newPassword={passwordForm.formState.newPassword}
            confirmPassword={passwordForm.formState.confirmPassword}
            error={passwordForm.apiState.error}
            isLoading={passwordForm.apiState.isLoading}
            onNewPasswordChange={(e) => passwordForm.formActions.setNewPassword(e.target.value)}
            onConfirmPasswordChange={(e) => passwordForm.formActions.setConfirmPassword(e.target.value)}
            onSubmit={passwordForm.handleSubmit}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Login;