import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard/Deshboard';
import InformacoesDashboard from './Dashboard/InformacoesDashboard';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

function Home() {
  return (
    <Routes>
      <Route path="/" element={<InformacoesDashboard />} />
    </Routes>
  );
}

export default Home;
