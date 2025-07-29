import React, { useEffect } from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar';
import Intro from '../Intro/Intro';
import Services from '../Services/Services';
import Works from '../Works/Works';
import Footer from '../Footer/Footer';
import { Element, scroller } from 'react-scroll';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.scrollTo) {
      scroller.scrollTo(location.state.scrollTo, {
        duration: 500,
        smooth: true,
        offset: -70,
      });
    }
  }, [location]);

  return (
    <div className="home-wrapper">
      <Navbar />
      <div className="home-content">
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
