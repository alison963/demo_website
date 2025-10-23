// app.js
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Zum Verarbeiten von URL-encoded-Daten
app.use(express.static(path.join(__dirname, "src"))); // Statische Dateien bereitstellen

// Home page: Render main.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "main.html"));
});

// Reflected XSS: /search
app.get("/search", (req, res) => {
  const query = req.query.firstname || "";
  const query2 = req.query.lastname || "";
  // Simple dangerous-input detection
  const dangerousPatterns = ["</script>", "<script", "alert(", "onerror=", "onload=", "javascript:"];
  function isDangerous(s) {
    if (!s) return false;
    const lower = s.toLowerCase();
    return dangerousPatterns.some(p => lower.includes(p));
  }

  if (isDangerous(query) || isDangerous(query2)) {
    // Respond with 404 for disallowed inputs
    res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
    return;
  }

  //UNSICHER: Benutzereingabe wird direkt in die Antwort eingefügt
  if (query.toLowerCase() === "special" || query2.toLowerCase() === "special") {
    res.sendFile(path.join(__dirname, "src", "special.html"));
    return;
  }

  res.send(`
    <h2>Search Results</h2>
    <p>You also searched for: ${query}</p>
    <p>You also searched for: ${query2}</p>
  `);
});
app.get("/searchbc", (req, res) => {

  const query3 = req.query.b || "";
  const query4 = req.query.c || "";
  // UNSICHER: Benutzereingabe wird direkt in die Antwort eingefügt
  //if (query3.toLowerCase() === "special" || query4.toLowerCase() === "special") {
  // Weiterleitung zu einer speziellen Website
  return res.sendFile(path.join(__dirname, "src", "ui_form.html"));
  //}
  // res.send(`
  //   <h2>Search Results</h2>
  //   <p>You also searched for: ${query3}</p>
  //   <p>You also searched for: ${query4}</p>


  // `);
});


app.get("/searchSpecial", (req, res) => {
  const query = req.query.s || "";
  // UNSICHER: Benutzereingabe wird direkt in die Antwort eingefügt
  res.send(`
    <h2>Special Search Results</h2>
    <p>You searched for: ${query}</p>
   
  `);
});
app.get("/searchad", (req, res) => {
  const query = req.query.ad || "";

  if (query.toLowerCase() === "special") {
    return res.sendFile(path.join(__dirname, "src", "admin.html"));
  }
  res.send(`
    <h2>Special Search Results</h2>
    <p>You searched for: ${query}</p>
   
  `);
});

app.get("/deleteUser", (req, res) => {
  const query = req.query.user || "";

  res.send(`

    <p>${query} successfully deleted.</p>

  `);
});


// Server starten
app.listen(3000, () => console.log('Server running on port 3000'));

