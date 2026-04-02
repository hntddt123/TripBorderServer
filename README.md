# Trip Border Server
Dockerized backend  
Postgres (SQL database) -- see migrations folder for schemas  
Express (Server)  
ngrok (Prototyping cloud reverse proxy） 
CloudFlare Tunnel (Development & Production with domain)  
Nominatim server (Open Street Map data)  
Prometheus (Metrics)  
Grafana (Metrics)  
nginx (Reverse proxy)  

## Available Scripts

In the project directory, you can run:  

```npm run docker```  
Runs the server in the development mode  
```npm run dockerprod```  
Runs the server in the production mode  

```npm run test:coverage```  
Jest coverage report  
```npm run test:watch```  
Jest watch mode  
```npm run lint```  
Lint code  
```npm run lintfix```  
Lint code autofix  