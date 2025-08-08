// components/SearchPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";

function SearchPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.text())
      .then(setMessage)
      .catch((err) => console.error("Error fetching from backend:", err));
  }, []);

  const handleSearch = (username) => {
    setLoading(true);
    setError("");
    setUserData(null);

    fetch(`/api/github/${username}`)
      .then(async (res) => {
        if (!res.ok) {
          let errorMsg = "User not found";
          try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorMsg;
          } catch {}
          throw new Error(errorMsg);
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <p style={{ color: "green" }}>Message from backend: {message}</p>
      <SearchForm onSearch={handleSearch} />
      {loading && <p>Loading user data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userData && (
        <div
          onClick={() => navigate(`/user/${userData.login}`)}
          style={{
            cursor: "pointer",
            marginTop: "1rem",
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: "400px",
          }}>
          <img
            src={userData.avatar_url}
            alt={`${userData.login} avatar`}
            style={{ width: 100, borderRadius: "50%" }}
          />
          <h2>{userData.name || userData.login}</h2>
          <p>{userData.bio || "No bio available"}</p>
          <p style={{ color: "blue" }}>Click to view more details →</p>
        </div>
      )}
    </>
  );
}

export default SearchPage;
