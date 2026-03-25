import { useState } from 'react';
import CashierSelect from './pages/CashierSelect';
import PointOfSale from './pages/PointOfSale';
import { useAppRuntime } from './hooks/useAppRuntime';
import './App.css';

function App() {
  const [operator, setOperator] = useState(null);
  const runtime = useAppRuntime();

  if (!operator) {
    return <CashierSelect onSelect={setOperator} runtime={runtime} />;
  }

  return (
    <PointOfSale
      operator={operator}
      runtime={runtime}
      onLogout={() => setOperator(null)}
    />
  );
}

export default App;
