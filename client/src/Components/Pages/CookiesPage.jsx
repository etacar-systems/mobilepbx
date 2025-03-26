import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function CookiesPage() {
  const [cookies, setCookies] = useState({});

  useEffect(() => {
    // Get all cookies and set them in the state
    setCookies(Cookies.get());
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Cookies</h1>
      <ul style={styles.list}>
        {Object.entries(cookies).map(([key, value]) => (
          <li key={key} style={styles.listItem}>
            <strong>{key}:</strong> <span style={styles.value}>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    margin: "20px auto",
    maxWidth: "600px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
    maxHeight: "600px", // Fixed height for the list
    overflow: "auto", // Enable scrolling when content overflows
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  listItem: {
    fontSize: "18px",
    color: "#555",
    background: "#fff",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    wordWrap: "break-word",
  },
  value: {
    display: "inline-block",
    wordWrap: "break-word",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    maxWidth: "100%",
  },
};

export default CookiesPage;
