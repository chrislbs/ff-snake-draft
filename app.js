const http = require('http');
const port = 8080;

function requestHandler(req, res) {
    console.log(req.url);
    res.end('Hello World')
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});
