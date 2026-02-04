import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { Dashboard } from './pages/dashboard/Dashboard';
import { CreateJob } from './pages/jobs/CreateJob';
import { EditJobPage } from './pages/jobs/EditJob';
import { ApplicationTable } from './pages/dashboard/ApplicationTable';
import ApplyJob from './pages/dashboard/application/Formsubmit';
import { ToastProvider } from './Toast/contexts/ToastContext';

function App() {
  return (
    
       <ToastProvider>
      {/* Your app components */}
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <ApplicationTable />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs/create"
            element={
              <PrivateRoute>
                <CreateJob />
              </PrivateRoute>
            }
          />

          <Route
            path="/jobs/edit/:id"
            element={
              <PrivateRoute>
                <EditJobPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/careers/Application"
            element={
               <ApplyJob/>
            }
          />
          

          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;
