import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UserDetails() {
  const { username } = useParams();
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`/api/github/${username}/repos`);
        if (!res.ok) throw new Error("Failed to fetch repos");
        const reposData = await res.json();
        setRepos(reposData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRepos();
  }, [username]);

  return (
    <div>
      <h2>Repos for {username}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {repos.length === 0 && !error && <p>Loading repos...</p>}
      {repos.map((repo) => (
        <div
          key={repo.name}
          style={{
            border: "1px solid #ccc",
            margin: "1rem 0",
            padding: "1rem",
            borderRadius: "8px",
          }}>
          <h3>{repo.name}</h3>
          <p>{repo.description || "No description"}</p>
          <p>Created: {new Date(repo.created_at).toLocaleDateString()}</p>
          <p>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
          <h4>Last 5 Commits:</h4>
          <ul>
            {repo.commits.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default UserDetails;
