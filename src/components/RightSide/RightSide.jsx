import React from "react";
import Updates from "../Updates/Updates";
import "./RightSide.css";

const RightSide = () => {
  return (
    <div className="RightSide">
      <div className="section">
        <h3 className="section-title">Updates</h3>
        <Updates />
      </div>

      {/* <div className="section">
        <h3 className="section-title">Customer Review</h3>
        <CustomerReview />
      </div> */}
    </div>
  );
};

export default RightSide;
