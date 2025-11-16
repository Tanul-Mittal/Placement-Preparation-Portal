import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import NotFound from './components/Error/NotFound';

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto p-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/users" element={<HomePage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}
