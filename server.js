const http = require('http');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    // define route handlers here
    if (req.method === `GET` && req.url === `/`) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.write(`Dog Club`);
      return res.end();
    }

    if (req.method === `GET` && req.url === `/dogs`) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.write(`Dog index`);
      return res.end();
    }

    if(req.method === `GET` && req.url === `/dogs/`) {
      console.log("req ulr: ", res.url);
      const urlParts = req.url.split("/");
      console.log("url part: ", urlParts);
      if(urlParts.length === 3) {
        const dogId = urlParts[2];
        if(dogId === "new") {
          const responseBody = "Dog create form page";
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          return res.end(responseBody);
        } else {
          const responseBody = `Dog details for dogId: ${dogId}`;
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          return res.end(responseBody);
        }
    }


    if(req.method === "POST" && req.url.startsWith("/dogs/")) {
      console.log("req ulr: ", res.url);
      const urlParts = req.url.split("/");
      console.log("url part: ", urlParts);
      if(urlParts.length === 3) {
        const dogId = urlParts[2];
        res.statusCode = 302;
        res.setHeader(`location`, `/dogs/${dogId}`);
        return res.end();
      }
    }

    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
