import http from 'http'
import {parse} from 'url'

let sumCallCount = 0;
let history = [];
const server = http.createServer((req, res) => {
  const parseURL = parse(req.url, true);
  const {pathname} = parseURL;
  if(req.method === 'POST' && pathname === '/sum') {
    let body = '';
    req.on('data', part => {
      body += part.toString();
    });
    req.on('end', () => {
      try{
        const data = JSON.parse(body);
        const {num1, num2} = data;
        if(typeof num1 !== 'number' || typeof num2 !== 'number') {
          const output = {error: "Invalid input"};
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(output));
          sumCallCount++;
          history.push({
            endpoint: '/sum',
            input: data,
            output
          });
          return;
        }
        const output = {sum: num1 + num2};
        sumCallCount++;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(output));
        history.push({
          endpoint: '/sum',
          input: data,
          output
        });
      }catch(error){
        const output = {error: "Invalid JSON"};
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(output));
        sumCallCount++;
        history.push({
          endpoint: '/sum',
          input: body,
          output
        });
      }
    });
  }else if(req.method ==='GET' && pathname === '/sum-count'){
    const output = {totalCalls: sumCallCount}
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(output));
    history.push({
      endpoint: '/sumCount',
      input: {},
      output
    });
  }else if(req.method === 'GET' && pathname === '/get-date') {
      const now = new Date().toISOString();
      const output = {currentTime: now};
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(output));
  }else if(req.method === 'GET' && pathname === '/history') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({history})); 
  }
});
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});