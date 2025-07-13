import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from "./store";
import reportWebVitals from './reportWebVitals';
import {ChakraProvider} from "@chakra-ui/react";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </ChakraProvider>
);

reportWebVitals();
