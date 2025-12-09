# Development Port Configuration

## Permanent Port: 4200

This project uses **port 4200** for local development to avoid conflicts with other services.

### Why Port 4200?
- Uncommon port number reduces conflicts with other dev servers
- Easy to remember
- Configured permanently in `package.json`

### Usage

```bash
npm run dev
```

The server will always start on: **http://localhost:4200**

### URLs
- Root: http://localhost:4200
- Admin Portal: http://localhost:4200/admin
- Client Demo: http://localhost:4200/client-demo
- Acme HVAC Portal: http://localhost:4200/acme-hvac
- Login: http://localhost:4200/login

### Changing the Port

To use a different port, edit `package.json`:

```json
"scripts": {
  "dev": "next dev -p YOUR_PORT_HERE"
}
```

### Production

Production deployment uses standard ports (80/443) via Vercel, not port 4200.
