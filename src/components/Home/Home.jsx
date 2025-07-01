import React from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar';
import Intro from '../Intro/Intro';
import Services from '../Services/Services';
import Works from '../Works/Works';
import Footer from '../Footer/Footer';

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home">
        <div id="Navbar">
          <Navbar />
        </div>
        <div id="intro">
          <Intro />
        </div>
        <div id="services">
          <Services />
        </div>
        <div id="works">
          <Works />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
