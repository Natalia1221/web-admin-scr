/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import VisiMisi from './routes/Profile';
import Kegiatan from './routes/Kegiatan';
import Berita from './routes/Berita';
import Detail from './routes/Detail';
import Pengurus from './routes/Pengurus';

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<VisiMisi />}/>
          <Route path="/pengurus" element={<Pengurus />} />
          <Route path="/Kegiatan" element={<Kegiatan />} />
          <Route path="/Berita"  >
            <Route index element={<Berita />} />
            <Route path=":id" element={<Detail />} />
          </Route>
        </Routes>
      </main>

      <footer>
        &copy; Copyright 2023
      </footer>
    </>
  );
}

export default App;
