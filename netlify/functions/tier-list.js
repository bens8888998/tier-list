const fs = require("fs");
const path = require("path");

const filePath = path.resolve("/tmp/data.json");

exports.handler = async (event) => {
  if (event.httpMethod === "POST") {
    fs.writeFileSync(filePath, event.body || "[]");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved." }),
    };
  }

  let data = "[]";
  if (fs.existsSync(filePath)) {
    data = fs.readFileSync(filePath, "utf-8");
  }

  return {
    statusCode: 200,
    body: data,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
};