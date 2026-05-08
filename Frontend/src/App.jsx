import { useState } from "react";
import "./App.css";

import Header from "./layout/Header";
import Hero from "./layout/Hero";

import TestDetail from "./pages/TestDetails";
import MockTest from "./pages/Mocktest";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./layout/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/test/:examId" element={<TestDetail />} />
        <Route path="/test/:examId/mock" element={<MockTest />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;