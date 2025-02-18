// src/components/Home/Home.jsx
import React from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar';
import Intro from '../Intro/Intro';
import Services from '../Services/Services';
import Works from '../Works/Works';
import Footer from '../Footer/Footer';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Intro/>
      <Services/>
      <Works/>
      <Footer/>
      
    </div>
  );
};

export default Home;
