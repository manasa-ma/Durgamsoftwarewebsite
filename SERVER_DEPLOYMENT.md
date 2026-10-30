# Server Deployment & Client-Side Routing Fallback Guide
**Durgam Soft Pvt. Ltd. — Website & Portal Deployment Reference**

When deploying this Single Page Application (SPA) built with React 19, React Router v7, and Vite, all page navigation (such as `/careers`, `/admin/login`, `/about-us`, `/services`) is handled on the client side via the HTML5 History API.

When a visitor opens a subpage directly in a browser or refreshes the page, the web server looks for a physical directory or file. Because these files only exist virtually within React Router, the server must be configured to **rewrite all non-file/non-directory requests to the root `index.html`** instead of returning an HTTP 404 error.

---

## 1. Apache HTTP Server (cPanel, Ubuntu/Debian Apache, LiteSpeed)

### Configuration File: `.htaccess`
- **Location in Source**: `public/.htaccess`
- **Location in Build**: `dist/.htaccess` (automatically copied during `npm run build`)
- **Web Server Prerequisite**: `mod_rewrite` and `mod_headers` must be enabled.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Do not rewrite requests for the root index.html
  RewriteRule ^index\.html$ - [L]

  # 2. Pass backend API requests through untouched if reverse proxy or API is co-hosted
  RewriteCond %{REQUEST_URI} ^/api(/.*)?$ [NC]
  RewriteRule ^ - [L]

  # 3. If requested resource exists physically as a file or directory, serve it directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 4. Fallback for all other URLs: rewrite cleanly to index.html for React Router
  RewriteRule ^ index.html [L]
</IfModule>
```

> **Note for Apache Admins**: In Apache virtual host configuration (`httpd.conf` or `apache2.conf`), ensure `AllowOverride All` is set for the document root directory so `.htaccess` rules take effect.

---

## 2. Microsoft IIS (Windows Server)

### Configuration File: `web.config`
- **Location in Source**: `public/web.config`
- **Location in Build**: `dist/web.config` (automatically copied during `npm run build`)
- **Web Server Prerequisite**: Microsoft **URL Rewrite Module 2.0+** installed on IIS.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <clear />
        <!-- Pass API requests through untouched -->
        <rule name="API Bypass" stopProcessing="true">
          <match url="^api(/.*)?$" />
          <action type="None" />
        </rule>
        <!-- SPA Fallback: rewrite any non-existing file/folder to root /index.html -->
        <rule name="React SPA Routing Fallback" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".woff" />
      <mimeMap fileExtension=".woff" mimeType="font/woff" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
      <remove fileExtension=".webp" />
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <remove fileExtension=".svg" />
      <mimeMap fileExtension=".svg" mimeType="image/svg+xml" />
    </staticContent>
    <httpErrors errorMode="DetailedLocalOnly" />
  </system.webServer>
</configuration>
```

---

## 3. Nginx Server (Linux / Docker)

### Configuration File: `public/nginx.conf`
Place this configuration in your `/etc/nginx/sites-available/durgamsoft` configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/durgamsoft/dist;
    index index.html;

    # Static assets with hash in filename
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # API Proxy to Express Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA Fallback: Rewrite missing routes to /index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Prevent caching of index.html
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }
}
```

---

## 4. Node.js / Express Server

If running via `npm start` or `npm run server` (`node server/index.js`):
- The server automatically handles SPA routing with Express static middleware and a wildcard fallback.
- Any non-API route serves `dist/index.html` with status `200 OK`.

---

## 5. Cloud Platforms (Vercel, Netlify, Cloudflare Pages)

### Vercel (`vercel.json`)
Placed at root of the repository:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify & Cloudflare Pages (`public/_redirects`)
Automatically bundled to `dist/_redirects`:
```text
/*    /index.html   200
```

---

## 6. Subdomain & Custom Live Domains Support

### Does this work when domain changes to company domain (e.g. `https://durgamsoft.com` or `https://portal.durgamsoft.com` or `http://192.168.1.100`)?
**Yes, 100% domain-agnostic.**
- **No hardcoded domain names**: The code contains no hardcoded hostnames. All asset paths (`/assets/...`) and API endpoints (`/api/...`) use root-relative paths.
- **Universal Route Support**: Every single route works under ANY live URL or IP address, including:
  - Public marketing routes: `/`, `/about`, `/services`, `/products`, `/careers`, `/contact`, `/book-demo`, `/landingpage`, `/blog`
  - Admin/CEO portal: `/admin/login`, `/admin/signup`, `/admin/dashboard`, `/admin/employees`, `/admin/attendance`, `/admin/leaves`, `/admin/announcements`, `/admin/profile`, `/admin/settings`
  - Employee portal: `/employee/login`, `/employee/signup`, `/employee/dashboard`, `/employee/attendance`, `/employee/leaves`
- **Direct Navigation & Page Refresh (F5)**: Typing any URL directly into the browser or pressing refresh returns HTTP 200 with `index.html`, and React Router instantly loads the exact page without 404.

---

## 7. How to Deploy Updates

1. In the project root, run:
   ```bash
   npm run build
   ```
2. Verify that `dist/` contains:
   - `dist/index.html`
   - `dist/.htaccess` (for Apache / cPanel / LiteSpeed)
   - `dist/web.config` (for Microsoft IIS)
   - `dist/nginx.conf` (for Nginx)
   - `dist/_redirects` (for Netlify / Cloudflare Pages)
   - `dist/assets/`
3. Upload or synchronize the entire contents of the `dist/` folder to your server's document root (e.g., `/var/www/html`, `public_html`, or `C:\inetpub\wwwroot`).
4. Any subpage refreshed or entered directly (e.g. `https://your-company-domain.com/admin/login` or `https://your-company-domain.com/employee/login` or `https://your-company-domain.com/landingpage`) will load instantly without a 404 error.
