# Nginx Configuration — Developer Reference

Quick reference for how this project's `nginx.conf` works.

---

## Big Picture

```
Client → Nginx (:8080) → Load Balancer → Node app (:3001, :3002, :3003)
```

Nginx sits in front of your Node.js cluster and acts as a **reverse proxy** — it accepts all incoming traffic and distributes it across three Node instances.

---

## Config Breakdown

```nginx
worker_processes auto;
```

> Spawns one Nginx worker process per CPU core. Maximizes hardware utilization automatically.

---

```nginx
events {
    worker_connections 1024;
}
```

> Each worker can handle up to **1024 simultaneous connections**. Total capacity = `worker_processes × 1024`.

---

```nginx
http {
    include mime.types;
```

> Loads the MIME type map (e.g., `.js` → `application/javascript`, `.html` → `text/html`). Required for browsers to interpret responses correctly.

---

### Upstream Block — The Load Balancer

```nginx
upstream nodejs_cluster {
    least_conn;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}
```

| Setting                   | What it does                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `upstream nodejs_cluster` | Names a group of backend servers                                                                           |
| `least_conn`              | **Load balancing strategy** — sends each new request to whichever server has the fewest active connections |
| `server 127.0.0.1:300X`   | The three Node.js app instances running locally                                                            |

**Why `least_conn` instead of default round-robin?**  
Round-robin ignores how busy each server is. `least_conn` is smarter — if one instance is slow, traffic automatically shifts to the faster ones.

---

### Server Block — The Virtual Host

```nginx
server {
    listen 8080;
    server_name localhost;

    location / {
        proxy_pass http://nodejs_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

| Directive                          | What it does                                                           |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `listen 8080`                      | Nginx accepts traffic on port **8080**                                 |
| `server_name localhost`            | Matches requests for `localhost` (can be a real domain in prod)        |
| `location /`                       | Matches **all** incoming URL paths                                     |
| `proxy_pass http://nodejs_cluster` | Forwards the request to one of the Node servers                        |
| `proxy_set_header Host`            | Passes the original `Host` header so Node sees the real hostname       |
| `proxy_set_header X-Real-IP`       | Passes the client's real IP (otherwise Node would only see Nginx's IP) |

---

## Request Flow (Step by Step)

```
1. Browser hits http://localhost:8080/hello
2. Nginx receives the request
3. location / matches → proxy_pass to nodejs_cluster
4. least_conn picks the least-busy Node instance (e.g., :3002)
5. Node processes the request, sends response back to Nginx
6. Nginx forwards response to the browser
```

---

## Common Things You'd Change

| Goal                                 | What to modify                                                   |
| ------------------------------------ | ---------------------------------------------------------------- |
| Add more Node instances              | Add `server 127.0.0.1:3004;` to the upstream block               |
| Change load balancing to round-robin | Remove the `least_conn;` line                                    |
| Serve on port 80                     | Change `listen 8080` → `listen 80`                               |
| Add a real domain                    | Change `server_name localhost` → `server_name yourdomain.com`    |
| Enable HTTPS                         | Add a second `server` block with `listen 443 ssl` and cert paths |
