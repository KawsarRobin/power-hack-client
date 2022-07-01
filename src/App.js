import { Route, Routes } from 'react-router-dom';
import './App.css';
import Billing from './components/Billing/Billing';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout></Layout>} />
        <Route path="/home" element={<Layout></Layout>} />

        <Route path="/billing" element={<Billing></Billing>} />
      </Routes>
    </div>
  );
}

export default App;
