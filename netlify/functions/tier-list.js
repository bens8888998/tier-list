// netlify/functions/tier-list.js

const fs = require("fs");
const path = require("path");

const filePath = path.resolve("/tmp/data.json");

exports.handler = async (event) => {
  // Allow CORS for local testing or different origins
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  // Save to file on POST
  if (event.httpMethod === "POST") {
    try {
      fs.writeFileSync(filePath, event.body || "[]");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Saved." }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to write file." }),
      };
    }
  }

  // Load from file on GET
  try {
    const data = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8")
      : "[]";
    return {
      statusCode: 200,
      headers,
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to read file." }),
    };
  }
};
