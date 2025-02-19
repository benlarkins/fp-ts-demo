import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

import { store } from '@/store/store';
import { Counter } from '@/components/Counter';
import { Login } from '@/components/Login';
import { Provider as ChakraProvider } from '@/components/ui/provider';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Counter />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
