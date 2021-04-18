import React from 'react';
import './App.css';
import { Provider } from 'react-redux'
import Container from './Container'
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Container />
      </div>
    </Provider>
  );
}

export default App;
