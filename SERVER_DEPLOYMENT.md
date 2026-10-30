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
          <action type="Rewrite" url="/" />
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
- The server automatically handles SPA routing with Express static middleware and a wildcard `app.get('*')` catch-all.
- Any non-API route serves `dist/index.html` with status `200 OK`.

---

## 5. Subdomain & Nested Subsection Routing

### Does this work for subdomains (e.g. `subdomain.yourcompany.com`)?
**Yes, 100% out of the box.**
When deploying to a subdomain (such as `careers.yourcompany.com`, `admin.yourcompany.com`, or `portal.yourcompany.com`):
1. **Document Root**: In Apache (VirtualHost / cPanel) or IIS, a subdomain points to its own folder where you deploy `dist/`.
2. **Fallback Execution**: When a user opens any subsection URL (e.g. `https://subdomain.yourcompany.com/careers/3` or `https://subdomain.yourcompany.com/admin/login`) directly in a new tab:
   - The server verifies that `/careers/3` is not a physical file.
   - The `.htaccess` (Apache) or `web.config` (IIS) rewrites the request internally to `index.html` at the subdomain's root.
   - The browser receives `index.html` with status `200 OK`.
3. **Asset Resolution on Nested URLs**:
   - All bundled CSS, JS, and image assets use root-relative paths (`/assets/...`).
   - Even on deeply nested subsection URLs (like `/admin/jobs/new` or `/careers/senior-engineer`), the browser requests `https://subdomain.yourcompany.com/assets/index-*.js` directly from the subdomain root. No 404s or broken styles occur.

### Subdomain vs. Subdirectory (Important Distinction):
- **Subdomain** (`https://portal.yourcompany.com/subsection`): Works immediately with standard build and `.htaccess` / `web.config`!
- **Subdirectory / Subfolder** (`https://yourcompany.com/portal/subsection`): If you place the site inside a subfolder rather than a subdomain, configure `base: '/portal/'` in `vite.config.js` and set `basename="/portal"` in React Router.

---

## 6. How to Deploy Updates

1. In the project root, run:
   ```bash
   npm run build
   ```
2. Verify that `dist/` contains:
   - `dist/index.html`
   - `dist/.htaccess` (for Apache)
   - `dist/web.config` (for IIS)
   - `dist/assets/`
3. Upload or synchronize the entire contents of the `dist/` folder to your server's document root (e.g., `public_html` or `wwwroot`).
4. Any subpage refreshed or entered directly (e.g. `https://your-domain.com/careers` or `https://your-domain.com/admin/login`) will now load instantly without a 404 error.
