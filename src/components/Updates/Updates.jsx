import React from "react";
import "./Updates.css";
import { useGithubCommits } from "../../Data/Data";

const Updates = () => {
  const UpdatesData = useGithubCommits();
  return (
    <div className="Updates" aria-live="polite">
      {UpdatesData.length > 0 ? (
        UpdatesData.map((update, index) => (
          <article className="update" key={`${update.name}-${update.time}-${index}`}>
            <img src={update.img} alt={`Avatar ${update.name}`} />
            <div className="noti">
              <div className="update-copy">
                <span>{update.name}</span>
                <span> {update.noti}</span>
              </div>
              <span>{update.time}</span>
            </div>
          </article>
        ))
      ) : (
        <p className="empty-state">Belum ada pembaruan terbaru.</p>
      )}
    </div>
  );
};

export default Updates;
