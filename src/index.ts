import Ekspress from "./server";
import express from "express";

const app = (function() {
  if (process.env.EXPRESS === "true") {
    console.log("[#] using express...");
    
    const app = express()

    app.disable('etag')
    app.disable('x-powered-by')

    return app;
  }
  
  console.log("[#] using ekspress...");
  
  return new Ekspress();
})()

app.use((req, res, next) => {
  const { url = "", method = "" } = req;

  console.log("[1] " + method + " " + url);

  next();
});

app.use((req, res, next) => {
  console.log("[2] " + JSON.stringify(req.params));

  next();
});

app.all("/", (req, res) => {
  res.end(`<b>HTTP ${req.method}</b> ${req.url}`)
});

app.get("/users", (req, res) => {
  setTimeout(() => {
    res.json({
      method: req.method,
      url: req.url,
      params: req.params
    });
  }, 1000);
});

app.get("/users/5", (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    path: "/users/5",
    params: req.params
  });
});

app.get("/users/:id", (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    path: "/users/:id",
    params: req.params
  });
});

app.get("/users/:uid/friends", (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    params: req.params
  });
});

app.get("/users/:uid/friends/:fid", (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    params: req.params
  });
});

app.listen(8000);