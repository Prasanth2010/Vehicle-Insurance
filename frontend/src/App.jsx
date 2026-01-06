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
import AdminCoverages from './pages/admin/AdminCoverages';
import RegisterAdmin from './pages/admin/RegisterAdmin';
import RegisterSurveyor from './pages/admin/RegisterSurveyor';
import Surveyors from './pages/admin/Surveyors';
import AddCoverage from './pages/admin/AddCoverage';
import PolicyDetails from './pages/admin/PolicyDetails';
import SurveyorDashboard from './pages/surveyor/SurveyorDashboard';
import SurveyorLogin from './pages/surveyor/SurveyorLogin';
import EditPolicy from './pages/admin/EditPolicy';
import ReviewClaim from './pages/surveyor/ReviewClaim';
import NewClaim from './pages/user/NewClaim';
import Profile from './pages/user/Profile';
import SurveyorProfile from './pages/surveyor/SurveyorProfile';
import AssignedClaims from './pages/surveyor/AssignedClaims';
import CompletedReports from './pages/surveyor/CompletedReports';
import MyClaims from './pages/user/MyClaims';
import UserPolicies from './pages/user/UserPolicies';


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
        <Route path="/admin/coverages" element={<AdminCoverages />} />
        <Route path="/admin/register-admin" element={<RegisterAdmin />} />
        <Route path="/admin/register-surveyor" element={<RegisterSurveyor />} />
        <Route path="/admin/surveyors" element={<Surveyors />} />
        <Route path="/admin/add-coverage/:policyId" element={<AddCoverage />} />
        <Route path="/admin/policy-details/:id" element={<PolicyDetails />} />
        <Route path="/surveyor/panel" element={<SurveyorDashboard />} />
        <Route path="/surveyor/login" element={<SurveyorLogin />} />
        <Route path="/admin/edit-policy/:id" element={<EditPolicy />} />
        <Route path="/surveyor/review-claim" element={<ReviewClaim />} />
        <Route path="/user/new-claim" element={<NewClaim />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/surveyor/profile" element={<SurveyorProfile />} />
        <Route path="/surveyor/claims" element={<AssignedClaims />} />
        <Route path="/surveyor/reports" element={<CompletedReports />} />
        <Route path="/user/claims" element={<MyClaims />} />
        <Route path="/user/policies" element={<UserPolicies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;