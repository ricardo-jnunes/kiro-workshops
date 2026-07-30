# Sprint 0 — Environment Setup Checklist

Complete all items below before starting Sprint 1.

---

## Development Workflow

Daily development **does not use Docker**. Each service runs directly as a local process:

```bash
# Terminal 1 — Backend (port 8080)
cd backend
export COGNITO_ISSUER_URI=https://cognito-idp.<region>.amazonaws.com/<UserPoolId>
export CORS_ALLOWED_ORIGINS=http://localhost:5173
./gradlew bootRun

# Terminal 2 — Frontend (port 5173)
cd frontend
# .env.local with VITE_COGNITO_* and VITE_API_BASE_URL=http://localhost:8080
npm run dev
```

Docker image builds and deployments happen **exclusively in the AWS pipeline** (CodePipeline + CodeBuild), triggered automatically on GitHub push. No image build or deploy step is ever run locally.

---

## Deploy Pipeline (AWS CodePipeline + CodeBuild)

```
Push to GitHub (main)
    ↓
CodePipeline (CodeStar Connection → GitHub)
    ├── CodeBuild: backend
    │     └── docker build + push to ECR → App Runner redeploys
    └── CodeBuild: frontend
          └── npm run build + aws s3 sync + CloudFront invalidation
```

The pipeline is provisioned in Sprint 1 via CDK.

---

## 1. Java 21

- [ ] Java 21 installed
- [ ] `JAVA_HOME` pointing to Java 21

**Verify:**
```bash
java --version
# Expected: openjdk 21.x.x
```

**Install:** [Eclipse Temurin 21](https://adoptium.net/temurin/releases/?version=21) (recommended).

> **Windows:** ensure `JAVA_HOME` is set in system environment variables and `%JAVA_HOME%\bin` is on the `PATH`.

---

## 2. Node.js 20+

- [ ] Node.js 20 or higher installed
- [ ] npm available

**Verify:**
```bash
node --version
# Expected: v20.x.x or higher

npm --version
```

**Install:** [Node.js LTS](https://nodejs.org/en/download) or via [nvm-windows](https://github.com/coreybutler/nvm-windows).

---

## 3. AWS CLI v2

- [ ] AWS CLI v2 installed
- [ ] AWS credentials configured
- [ ] Default region set

**Verify:**
```bash
aws --version
# Expected: aws-cli/2.x.x

aws sts get-caller-identity
# Expected: JSON with UserId, Account, Arn
```

**Install:** [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

**Configure:**
```bash
aws configure
# Prompts for: Access Key ID, Secret Access Key, Region, Output format
```

---

## 4. AWS CDK v2

- [ ] AWS CDK v2 installed globally

**Verify:**
```bash
npx cdk --version
# Expected: 2.x.x
```

**Install:**
```bash
npm install -g aws-cdk
```

---

## 5. Gradle (via wrapper — no global install needed)

- [ ] No installation required — the backend uses the Gradle Wrapper

**Verify after cloning:**
```bash
cd backend
.\gradlew.bat --version   # Windows (PowerShell)
./gradlew --version       # Linux/Mac
# Expected: Gradle 8.x
```

---

## 6. Git + GitHub

- [ ] Git installed
- [ ] Repository created on GitHub
- [ ] Access to configure a CodeStar Connection (AWS → GitHub)

**Verify:**
```bash
git --version
```

> CodePipeline uses **AWS CodeStar Connections** to authenticate with GitHub. The connection is created once in the AWS console during the Sprint 1 setup.

---

## 7. AWS Account — Permissions and Bootstrap

- [ ] AWS account with permissions to create: Cognito, ECR, App Runner, S3, CloudFront, CodePipeline, CodeBuild, CodeStar Connections, IAM roles
- [ ] CDK bootstrap run (or ready to run) in the target account and region

**Bootstrap (run once per account/region):**
```bash
cd infra
npx cdk bootstrap aws://<ACCOUNT_ID>/<REGION>
```

> Get your Account ID: `aws sts get-caller-identity --query Account --output text`

---

## 8. Choose Your AWS Region

- [ ] Region decided and noted for use across all sprints

| Region | Name | Notes |
|--------|------|-------|
| `us-east-1` | N. Virginia | Widest service availability |
| `sa-east-1` | São Paulo | Lowest latency for Brazil-based users |
| `us-west-2` | Oregon | Common default in AWS examples |

```bash
aws configure set region us-east-1
```

My region: **`___________________`**

---

## 9. Java Package Name

- [ ] Java root package decided for the backend

The spec uses `com.example.poc` as a placeholder. Decide before starting Sprint 2:

| Option | Example |
|--------|---------|
| Keep placeholder | `com.example.poc` |
| Company-based | `com.yourcompany.poc` |
| GitHub-based | `io.github.yourusername.poc` |

My choice: **`___________________`**

---

## 10. App Runner First-Deploy Strategy

- [ ] Strategy decided for the initial ECR image

App Runner needs an image in ECR before it can be provisioned by CDK. Choose one:

- **Option A — Placeholder image (recommended):** CDK creates the App Runner service pointing to `public.ecr.aws/amazonlinux/amazonlinux:latest`. The first GitHub push triggers the pipeline, which replaces it with the real image.
- **Option B — Sequential deploy:** CDK provisions Cognito + S3 + CloudFront + pipeline first. The first pipeline run pushes the real image. Then run `cdk deploy` again to create the App Runner service.

My choice: **`___________________`**

---

## Ready to Start?

Once all items above are checked, proceed to **Sprint 1**:

```
.kiro/specs/aws-full-stack-poc/sprint-1-iac/requirements.md
```
