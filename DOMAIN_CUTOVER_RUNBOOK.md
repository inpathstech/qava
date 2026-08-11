# Domain cutover runbook: qava.ai → theclubnyc.com

## Target map

| Old | New |
|-----|-----|
| `qava.ai`, `www.qava.ai` | `www.theclubnyc.com` |
| `app.qava.ai` | `app.theclubnyc.com` |
| `api.qava.ai` | `api.theclubnyc.com` |
| `api.qava.ai/admin` | `app.theclubnyc.com/admin` |

Cookie parent domain: `.theclubnyc.com`  
Production `APP_URL` (admin emails): `https://app.theclubnyc.com`  
FE `NEXT_PUBLIC_BASE_URL`: `https://api.theclubnyc.com`

## Current live DNS (pre-cutover discovery)

| Host | Points to |
|------|-----------|
| `qava.ai` / `www.qava.ai` | GitHub Pages (`inpathstech.github.io`) |
| `app.qava.ai` | CloudFront `d2kq93xb0i15lc.cloudfront.net` |
| `api.qava.ai` | EC2 `51.21.238.33` |
| Marketing S3/CF (secondary) | `dlyqmq1f47q4g.cloudfront.net` (E2POWWPCWDEJI2), no aliases today |

The deploy IAM user `qava-deployment-user` **cannot** `acm:RequestCertificate`. Request the ACM cert with an admin AWS user (us-east-1 for CloudFront).

## Stage 0 — GoDaddy DNS (theclubnyc.com)

On GoDaddy for **theclubnyc.com**, choose **Connect an existing site** (not Website Builder). Add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `inpathstech.github.io.` | 600 |
| Forwarding | `@` (apex) | Forward https → `https://www.theclubnyc.com` (permanent) | — |
| CNAME | `app` | `d2kq93xb0i15lc.cloudfront.net.` | 600 |
| A | `api` | `51.21.238.33` | 600 |

### ACM (admin AWS account, us-east-1)

Request cert for:

- `theclubnyc.com`
- `www.theclubnyc.com`
- `app.theclubnyc.com`
- `api.theclubnyc.com`

Add the DNS validation CNAMEs ACM shows into GoDaddy, wait until **Issued**.

Then:

1. **App CloudFront** (`d2kq93xb0i15lc…` — may be another AWS account): add alias `app.theclubnyc.com` + attach cert.
2. **API nginx** on EC2: `server_name api.theclubnyc.com;` + certbot or ACM-exported cert.
3. **Optional marketing CloudFront** `E2POWWPCWDEJI2`: add `www.theclubnyc.com` / apex if you later move off GitHub Pages.
4. **GitHub Pages**: repo Settings → Pages → Custom domain `www.theclubnyc.com` (repo `CNAME` file already set in cutover PR). Enable Enforce HTTPS after DNS propagates.

Do **not** remove `qava.ai` DNS yet.

## Stage 1 — Dual-live + admin proxy

On the EC2 box that serves `app.qava.ai` / Nest:

1. Install [`infra/nginx/app.theclubnyc.com.conf`](infra/nginx/app.theclubnyc.com.conf) (proxy `/admin` and `/api/admin` → Nest `:3007`; everything else → Next `:3000`).
2. Install [`infra/nginx/api.theclubnyc.com.conf`](infra/nginx/api.theclubnyc.com.conf).
3. `sudo nginx -t && sudo systemctl reload nginx`
4. Set env and restart PM2:

```bash
# Paths-Backend
APP_URL=https://app.theclubnyc.com
PREMIUM_COOKIE_DOMAIN=.theclubnyc.com

# Paths-Web-FE
NEXT_PUBLIC_BASE_URL=https://api.theclubnyc.com
# then rebuild + pm2 restart Qava_Frontend
```

Verify:

- https://www.theclubnyc.com
- https://app.theclubnyc.com
- https://api.theclubnyc.com/api/…
- https://app.theclubnyc.com/admin/login

## Stage 2 — Code (PRs)

Merged via:

- Paths-Backend domain cutover PR
- Paths-Web-FE domain cutover PR
- qava marketing domain cutover PR

## Stage 3 — Cookie cutover

Already in code defaults (`.theclubnyc.com`). After deploy, users re-login once.

## Stage 4 — Old → new redirects

| From | To |
|------|-----|
| `qava.ai/*`, `www.qava.ai/*` | `https://www.theclubnyc.com/$1` |
| `app.qava.ai/*` | `https://app.theclubnyc.com/$1` |
| `api.qava.ai/admin*` | `https://app.theclubnyc.com/admin*` |
| `api.qava.ai/api*` | `https://api.theclubnyc.com/api*` |
| `theclubnyc.com/*` | `https://www.theclubnyc.com/$1` |

Configs:

- Marketing / GitHub Pages: [`infra/redirects/github-pages-qava-redirect.html`](infra/redirects/github-pages-qava-redirect.html) is not enough alone — prefer GoDaddy domain forwarding on `qava.ai` → `https://www.theclubnyc.com`, or a CloudFront Function ([`infra/redirects/cloudfront-host-redirect.js`](infra/redirects/cloudfront-host-redirect.js)) once CF serves the old host.
- App / API: [`infra/nginx/legacy-qava-redirects.conf`](infra/nginx/legacy-qava-redirects.conf)

Nest also 301s `api.*/admin*` → `app.theclubnyc.com/admin*`.

## Stage 5 — Verify

- [ ] Marketing nav/footer links use Club hosts
- [ ] App login + dashboard
- [ ] Admin at `app.theclubnyc.com/admin`
- [ ] API calls from app to `api.theclubnyc.com`
- [ ] Old hosts 301 with path+query preserved
- [ ] Stripe webhook endpoint URL updated if it pinned `api.qava.ai`
- [ ] Search Console property for `www.theclubnyc.com`

## Stage 6 — Cleanup (later)

Keep `qava.ai` registered and redirecting. Update docs when dual-live is no longer needed.
