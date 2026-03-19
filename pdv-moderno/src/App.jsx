import { useState } from 'react';
import CashierSelect from './pages/CashierSelect';
import PointOfSale from './pages/PointOfSale';
import './App.css';

function App() {
  const [operator, setOperator] = useState(null);

  // Router ultra simples para o protótipo
  if (!operator) {
    return <CashierSelect onSelect={setOperator} />;
  }

  return <PointOfSale operator={operator} onLogout={() => setOperator(null)} />;
}

export default App;
