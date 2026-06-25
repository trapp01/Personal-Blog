# Blog → AWS: Terraform + Infrastructure Plan

> **Purpose:** Host this static Astro blog on AWS via Terraform, cheaply, as a portfolio/résumé
> project demonstrating Infrastructure-as-Code, CDN, TLS/DNS, least-privilege IAM, and keyless CI/CD.
> This doc is a handoff for the next working session.

**Last updated:** 2026-05-27

---

## 1. Where we are right now

| Item | Status |
|------|--------|
| direnv installed + zsh hook in `~/.zshrc` | ✅ Done |
| `.envrc` in repo root (`AWS_PROFILE=blog`, `AWS_REGION=us-east-1`), gitignored + `direnv allow`ed | ✅ Done |
| Personal AWS account created | ✅ Done (but **nothing configured inside it yet**) |
| IAM Identity Center / SSO set up | ❌ Not started |
| `blog` AWS CLI profile wired | ❌ Not started (profile name reserved in `.envrc`) |
| Terraform installed locally | ❌ Not installed |
| Any Terraform / infra code | ❌ Not written |
| GitHub Actions CI/CD | ❌ Not written |

**Important account note:** The local AWS CLI `default` and `m.trapp` profiles point at the **work**
account `442894682013` (region `ca-central-1`). All work for this project must use the **new personal
account** via the `blog` profile. direnv already routes this directory to `blog` — but the profile
doesn't exist until Phase 0 below is complete (so `aws` calls in this folder currently error with
"profile blog not found" — that's expected).

---

## 2. Decisions locked in

- **Site type:** Fully static Astro (Cactus theme). `astro build` → `dist/`; search is a prebuilt
  Pagefind index; OG images generated at build time. No SSR adapter, no server runtime needed.
- **Hosting architecture:** private **S3** (Origin Access Control) → **CloudFront** → **ACM** cert
  (must be in `us-east-1`) → **Route 53** DNS.
- **Domain:** purchased via **Cloudflare** (registrar stays Cloudflare). **DNS will move to Route 53**
  by repointing Cloudflare's nameservers. *(Actual domain name still needs to be provided — see Open Questions.)*
- **CI/CD:** full **keyless** pipeline — GitHub Actions builds on push to `main` and deploys via
  **OIDC assume-role** (no long-lived AWS keys stored in GitHub).
- **Terraform state:** remote **S3 backend** + lock. (Lock mechanism still open — see Open Questions.)
- **Credentials:** **IAM Identity Center (SSO)** → short-lived creds via `aws sso login`. Profile name `blog`.
- **Directory scoping:** **direnv** (analog to the user's per-host git SSH alias).
- **Region:** everything in **`us-east-1`** (CloudFront can only use ACM certs from us-east-1, so single-region keeps it simple).
- **TF structure:** flat config in `infra/` (single site — no premature modules).

## 3. Open questions to resolve next session

1. **What is the actual domain name?** (Needed for ACM, Route 53, CloudFront aliases.)
2. **State lock mechanism:** classic **S3 + DynamoDB lock table** (most recognizable in interviews —
   recommended) **vs.** modern **S3-native lockfile** (`use_lockfile = true`, Terraform ≥ 1.11, no DynamoDB).
   Plan below assumes DynamoDB; trivial to switch.

---

## 4. Environment facts (verified this session)

- GitHub repo: `trapp01/Personal-Blog`, branch `main`. (Remote alias `github-personal`.)
- Node: **v22.20.0** ✅
- AWS CLI: **2.33.2** ✅
- Terraform: **not installed** → `brew install terraform` (or `tfenv` for version pinning).
- Homebrew: present.
- Build command: `npm run build` (runs `astro build` then `pagefind --site dist` via postbuild) → outputs `dist/`.

---

## PHASE 0 — Personal AWS account, SSO, local tooling

**Goal:** get the `blog` profile returning the new account from `aws sts get-caller-identity`.

### 0.1 Secure the new account (browser, root login)
- Enable **MFA** on the root user.
- **Billing → Budgets**: create a ~$5/mo cost budget with email alert.
- Do **not** create root access keys.

### 0.2 Enable IAM Identity Center (browser)
1. Console → **IAM Identity Center** → **Enable** (accept Organization creation; this account becomes
   the management account). Host it in **us-east-1**.
2. Identity source: keep default **Identity Center directory**.
3. **Users → Add user** → yourself + personal email → complete the emailed password + MFA setup.
4. **Permission sets → Create** → Predefined → **AdministratorAccess** (fine for a personal sandbox).
5. **AWS accounts** → select the account → **Assign users** → your user + AdministratorAccess.
6. Note the **AWS access portal URL** (e.g. `https://d-xxxxxxxxxx.awsapps.com/start`) and the **SSO region** (`us-east-1`).

### 0.3 Wire the `blog` CLI profile
```bash
aws configure sso
#   SSO session name:        blog
#   SSO start URL:           <AWS access portal URL>
#   SSO region:              us-east-1
#   SSO registration scopes: sso:account:access   (default)
#   → browser opens to authorize
#   Pick the account + AdministratorAccess role
#   Default client region:   us-east-1
#   Default output format:   json
#   CLI profile name:        blog
```
This writes an `[sso-session blog]` + `[profile blog]` block to `~/.aws/config` (no static keys).

### 0.4 Verify
```bash
aws sso login --profile blog
cd /Users/mtdt1/Desktop/Projects/Blog/matt-trapp   # direnv sets AWS_PROFILE=blog
aws sts get-caller-identity                          # must show the NEW account, NOT 442894682013
```
> Re-run `aws sso login --profile blog` roughly every 8–12h when the token expires (the accepted
> tradeoff for short-lived creds).

### 0.5 Install Terraform
```bash
brew install terraform   # or: brew install tfenv && tfenv install latest
terraform version
```

---

## PHASE 1 — Terraform remote state (bootstrap)

**Chicken-and-egg:** the bucket/lock that hold remote state can't be created by the config that uses
them as a backend. So a tiny `bootstrap/` config (local state) creates them first.

`infra/bootstrap/main.tf` creates:
- S3 bucket for state (versioning on, public access blocked, SSE enabled).
- DynamoDB lock table (`LockID` hash key) — *or* skip if using S3-native lockfile.

```bash
cd infra/bootstrap
terraform init
terraform apply        # creates state bucket + lock table
```
Then the main config (Phase 2) uses an S3 backend pointing at that bucket.

---

## PHASE 2 — Core infrastructure

**Repo layout to create:**
```
infra/
  bootstrap/
    main.tf              # state bucket + lock table (local state; run once)
  backend.tf             # S3 backend config (points at bootstrap bucket)
  providers.tf           # AWS provider, region us-east-1
  variables.tf           # domain_name, github_repo, tags, etc.
  s3.tf                  # private site bucket, versioning, OAC-only bucket policy
  cloudfront.tf          # distribution, cache policy, default root object, error responses, CF Function assoc
  acm.tf                 # cert (DNS validation) for apex + www
  dns.tf                 # Route 53 hosted zone + A/AAAA alias records (apex + www)
  oidc.tf                # GitHub OIDC provider + scoped deploy role
  functions/rewrite.js   # CloudFront Function (viewer-request): clean-URL → /index.html
  outputs.tf             # NS records, distribution domain, deploy role ARN, bucket name
  terraform.tfvars       # domain_name = "<your-domain>", github_repo = "trapp01/Personal-Blog"
```

**Key implementation notes / gotchas:**
- **OAC, not public bucket / not legacy OAI.** Bucket stays fully private; bucket policy grants read
  only to the CloudFront distribution via `AWS:SourceArn`.
- **Clean URLs:** Astro emits `/posts/slug/index.html`. CloudFront does *not* resolve subdirectory
  index files on its own. The `functions/rewrite.js` CloudFront Function (viewer-request) rewrites:
  URI ends with `/` → append `index.html`; URI has no file extension → append `/index.html`.
- **Error pages:** CloudFront custom error response maps 403/404 → `/404.html` (Astro `404.astro`).
- **Cache headers:** `/_astro/*` (content-hashed) = long `max-age, immutable`; HTML = short / revalidate.
  Apply during deploy via two-pass `aws s3 sync` with `--cache-control`, or via a CloudFront response-headers policy.
- **ACM region:** cert resource must use the `us-east-1` provider (single-region plan satisfies this).

**DNS cutover ordering gotcha (important):**
ACM DNS validation needs the domain *delegated* to the new Route 53 zone first. Sequence:
1. `terraform apply -target=aws_route53_zone.this` (create the hosted zone).
2. Read the 4 nameservers from output → **paste into Cloudflare registrar's nameserver settings**.
3. Wait for delegation to propagate, then full `terraform apply` (ACM validation + CloudFront now succeed).

```bash
cd infra
terraform init        # migrates state to the S3 backend from Phase 1
terraform apply -target=aws_route53_zone.this
# → copy NS records into Cloudflare, wait for propagation
terraform apply
```

---

## PHASE 3 — GitHub OIDC + CI/CD

`infra/oidc.tf`:
- IAM **OIDC identity provider** for `token.actions.githubusercontent.com`.
- IAM **deploy role**, trust policy scoped to `repo:trapp01/Personal-Blog:ref:refs/heads/main`
  (or a GitHub Environment). Least-privilege permissions:
  - `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the site bucket.
  - `cloudfront:CreateInvalidation` on the distribution.

`.github/workflows/deploy.yml` (on push to `main`):
```yaml
permissions:
  id-token: write      # required for OIDC
  contents: read
# steps:
#   - checkout
#   - setup-node (v22), npm ci
#   - npm run build            # astro build + pagefind
#   - configure-aws-credentials (role-to-assume = deploy role ARN, no static keys)
#   - aws s3 sync dist/ s3://<bucket> --delete   (with cache-control passes)
#   - aws cloudfront create-invalidation --paths "/*"
```

---

## PHASE 4 — First deploy + validation

1. Local smoke test: `npm run build` then `aws s3 sync dist/ s3://<bucket> --delete` and load the
   CloudFront URL / domain over HTTPS.
2. Confirm: TLS valid, clean URLs work (`/posts/...`), 404 page renders, Pagefind search works.
3. Push to `main` → confirm the GitHub Actions pipeline deploys + invalidates with no stored keys.

---

## Architecture

```
 push to main
      │
      ▼
 GitHub Actions ──(OIDC assume-role, no keys)──► AWS
      │  npm run build → dist/
      ▼
   S3 (private, OAC-locked)
      ▼
 CloudFront  ──uses──►  ACM cert (us-east-1)
      │  (CF Function: clean URLs)
      ▼
  Route 53 (apex + www alias)  ◄── Cloudflare registrar NS delegation
```

## Cost estimate
- Route 53 hosted zone: **$0.50/mo** (the dominant cost).
- S3 + CloudFront for a blog: **pennies** (CloudFront free tier covers year 1).
- ACM: **free**. Domain: already purchased.
- **Total ≈ $0.50–1.50/mo.**

## Résumé talking points (what this demonstrates)
- IaC with remote state + state locking; staged applies handling real ordering constraints.
- Modern S3 access via **OAC**, fully private origin.
- CDN + edge compute (CloudFront Function for routing), TLS via ACM DNS validation.
- Cross-registrar DNS delegation (Cloudflare → Route 53).
- **Keyless CI/CD** via GitHub OIDC + least-privilege IAM (no long-lived secrets).
- Short-lived local credentials via IAM Identity Center + directory-scoped profiles (direnv).
- Right-sized architecture (no over-engineering a static site) — a judgment signal.

---

## Quick-start checklist for next session
- [ ] Provide the domain name.
- [ ] Decide: DynamoDB lock vs S3-native lockfile.
- [ ] Phase 0: SSO → `blog` profile → `aws sts get-caller-identity` shows new account; install Terraform.
- [ ] Phase 1: bootstrap state bucket (+ lock).
- [ ] Phase 2: write `infra/` config; `apply` zone → set Cloudflare NS → full `apply`.
- [ ] Phase 3: OIDC role + `deploy.yml`.
- [ ] Phase 4: deploy + validate.
