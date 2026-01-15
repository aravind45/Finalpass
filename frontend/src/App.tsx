import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Intake from './pages/Intake';
import Documents from './pages/Documents';
import Assets from './pages/Assets';
import AssetDetail from './pages/AssetDetail';
import Checklist from './pages/Checklist';
import Communications from './pages/Communications';
import Family from './pages/Family';
import AssetClosure from './pages/AssetClosure';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:assetId" element={<AssetDetail />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/family" element={<Family />} />
          <Route path="/asset-closure" element={<AssetClosure />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
