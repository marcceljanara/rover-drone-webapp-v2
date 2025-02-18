import React, { useState, useEffect } from 'react';
import { UilTimes, UilTelegramAlt } from "@iconscout/react-unicons";
import './NonFungibleToken.css';

const NonFungibleToken = () => {
  const [nftData, setNftData] = useState([]);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.xsmartagrichain.com/data/image')
      .then(response => response.json())
      .then(data => {
        const lastSixData = data.slice(-8).reverse();
        setNftData(lastSixData);
        setIsLoading(false); // Set isLoading ke false setelah data dimuat
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set isLoading ke false jika ada error
      });
  }, []);

  const handleCardClick = (index) => {
    setExpandedCardIndex(index);
  };

  const handleCloseClick = (event) => {
    event.stopPropagation(); 
    setExpandedCardIndex(null);
  };

  return (
    <div>
      <h1 style={{ marginTop: '40px' }}>Non-Fungible Token</h1>
      
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="nft-grid">
          {nftData.map((nft, index) => (
            <div 
              className="nft-card" 
              key={index} 
              onClick={() => handleCardClick(index)}
            >
              {expandedCardIndex === index ? (
                <div className="nft-info">
                  <UilTimes 
                    className="close-button" 
                    onClick={handleCloseClick}
                  />
                  <h2>Name ID: {nft.id.slice(-4)}</h2>
                  <p>Transaction ID: {nft.transactionId.slice(-9)}</p>
                  <a 
                    href={`https://explorer.shimmer.network/shimmer-testnet/transaction/${nft.transactionId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="paper-plane-button"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    <UilTelegramAlt size="24" />
                  </a>
                </div>
              ) : (
                <img src={nft.uri} alt={nft.name} className="nft-image" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NonFungibleToken;
