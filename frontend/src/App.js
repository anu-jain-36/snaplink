import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./components/homePage";
import SigninPage from "./components/signinPage";
import AdvancedPage from "./components/advancedPage";
import ResolveShortUrl from "./components/resolveShorUrl";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<SigninPage />} />
                <Route path="/:shortUrl" element={<ResolveShortUrl />} />
                <Route path="/advanced" element={<AdvancedPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
