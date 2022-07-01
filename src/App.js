import { Route, Routes } from 'react-router-dom';
import './App.css';
import Billing from './components/Billing/Billing';
import Layout from './components/Layout/Layout';
import Login from './components/login/Login';
import Register from './components/Register/Register';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout></Layout>} />
        <Route path="/home" element={<Layout></Layout>} />
        <Route path="/registration" element={<Register></Register>} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/billing" element={<Billing></Billing>} />
      </Routes>
    </div>
  );
}

export default App;
