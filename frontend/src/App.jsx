import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AddPolicy from './pages/AddPolicy';
import Policies from './pages/Policies'; 
import Claims from './pages/Claims';      
import Customers from './pages/Customers';
import Applications from './pages/Applications';
import RegisterAdmin from './pages/RegisterAdmin';
import RegisterSurveyor from './pages/RegisterSurveyor';
import Surveyors from './pages/Surveyors';
import AddCoverage from './pages/AddCoverage';
import PolicyDetails from './pages/PolicyDetails';
import SurveyorPanel from './pages/SurveyorPanel';
import SurveyorLogin from './pages/SurveyorLogin';


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