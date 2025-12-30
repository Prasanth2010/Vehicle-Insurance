import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/user/Register';
import Login from './pages/user/Login';
import UserDashboard from './pages/user/UserDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';
import AddPolicy from './pages/admin/AddPolicy';
import Policies from './pages/admin/Policies'; 
import Claims from './pages/admin/Claims';      
import Customers from './pages/admin/Customers';
import Applications from './pages/admin/Applications';
import RegisterAdmin from './pages/admin/RegisterAdmin';
import RegisterSurveyor from './pages/admin/RegisterSurveyor';
import Surveyors from './pages/admin/Surveyors';
import AddCoverage from './pages/admin/AddCoverage';
import PolicyDetails from './pages/admin/PolicyDetails';
import SurveyorPanel from './pages/surveyor/SurveyorPanel';
import SurveyorLogin from './pages/surveyor/SurveyorLogin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/admin/add-policy" element={<AddPolicy />} />
        <Route path="/admin/policies" element={<Policies />} />
        <Route path="/admin/claims" element={<Claims />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/applications" element={<Applications />} />
        <Route path="/admin/register-admin" element={<RegisterAdmin />} />
        <Route path="/admin/register-surveyor" element={<RegisterSurveyor />} />
        <Route path="/admin/surveyors" element={<Surveyors />} />
        <Route path="/admin/add-coverage/:policyId" element={<AddCoverage />} />
        <Route path="/admin/policy-details/:id" element={<PolicyDetails />} />
        <Route path="/surveyor/panel" element={<SurveyorPanel />} />
        <Route path="/surveyor/login" element={<SurveyorLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;