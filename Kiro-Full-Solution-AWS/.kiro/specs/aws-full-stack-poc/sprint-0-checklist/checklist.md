# Sprint 0 — Environment Setup Checklist

Complete all items below before starting Sprint 1. Each section includes the verification command and the install guide link.

---

## 1. Java 21

- [ ] Java 21 installed
- [ ] `JAVA_HOME` pointing to Java 21

**Verify:**
```bash
java --version
# Expected: openjdk 21.x.x or similar
```

**Install:** [Eclipse Temurin 21](https://adoptium.net/temurin/releases/?version=21) (recommended) or your preferred JDK distribution.

---

## 2. Docker

- [ ] Docker Engine installed and running
- [ ] Docker Compose v2 available (`docker compose` — note: no hyphen)

**Verify:**
```bash
docker --version
# Expected: Docker version 24.x.x or higher

docker compose version
# Expected: Docker Compose version v2.x.x
```

**Install:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or [Docker Engine](https://docs.docker.com/engine/install/) (Linux).

---

## 3. Node.js 20+

- [ ] Node.js 20 or higher installed
- [ ] npm available

**Verify:**
```bash
node --version
# Expected: v20.x.x or higher

npm --version
```

**Install:** [Node.js LTS](https://nodejs.org/en/download) or via [nvm](https://github.com/nvm-sh/nvm).

---

## 4. AWS CLI v2

- [ ] AWS CLI v2 installed
- [ ] AWS credentials configured (access key + secret, or SSO profile)
- [ ] Default region set

**Verify:**
```bash
aws --version
# Expected: aws-cli/2.x.x

aws sts get-caller-identity
# Expected: JSON with UserId, Account, Arn — confirms credentials work
```

**Install:** [AWS CLI v2 install guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

**Configure credentials:**
```bash
aws configure
# Prompts for: AWS Access Key ID, Secret Access Key, Region, Output format
```

> Tip: use `sa-east-1` (São Paulo) or `us-east-1` (N. Virginia) as your default region. All sprint commands will use `CDK_DEFAULT_REGION` from this config.

---

## 5. AWS CDK v2

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

## 6. Gradle (optional — via wrapper)

- [ ] The backend uses the Gradle wrapper (`./gradlew`), so no global install is required
- [ ] Confirm the wrapper script is executable (Linux/Mac only)

**Verify (after cloning):**
```bash
cd backend
./gradlew --version
# Expected: Gradle 8.x
```

> On Windows (PowerShell): use `./gradlew.bat --version`

---

## 7. AWS Account Readiness

- [ ] You have an AWS account with permissions to create: Cognito, ECR, App Runner, S3, CloudFront, IAM roles
- [ ] CDK bootstrap has been run (or is ready to run) in the target account/region

**Bootstrap (run once per account/region):**
```bash
cd infra
npx cdk bootstrap aws://<ACCOUNT_ID>/<REGION>
# Example: npx cdk bootstrap aws://123456789012/us-east-1
```

> You can get your account ID with: `aws sts get-caller-identity --query Account --output text`

---

## 8. Decide on AWS Region

- [ ] Choose and note down your AWS region for all sprints

Suggested options:

| Region | Name | Notes |
|--------|------|-------|
| `us-east-1` | N. Virginia | Most services available, lowest latency for global APIs |
| `sa-east-1` | São Paulo | Best latency for Brazil-based users |
| `us-west-2` | Oregon | Common default for many AWS examples |

Set it as your CLI default or export before running CDK commands:
```bash
export AWS_DEFAULT_REGION=us-east-1
# or: aws configure set region us-east-1
```

---

## 9. Java Package Name Decision

- [ ] Decide on the Java root package for the backend

The spec uses `com.example.poc` as placeholder. Replace with your preferred namespace before Sprint 2:

| Option | Example |
|--------|---------|
| Keep placeholder | `com.example.poc` |
| Company-based | `com.yourcompany.poc` |
| GitHub-based | `io.github.yourusername.poc` |

Note your choice here: **`___________________`**

---

## 10. App Runner First-Deploy Strategy

- [ ] Decide how to handle the initial ECR image requirement for App Runner

App Runner needs an image in ECR before the CDK stack is fully operational. Choose one:

- **Option A — Placeholder image (recommended for POC):** CDK creates the ECR repo and App Runner service pointing to a public placeholder image (`public.ecr.aws/amazonlinux/amazonlinux:latest`). Sprint 2 `deploy.sh` then replaces it with the real image.
- **Option B — Sequential deploy:** Run `npx cdk deploy` with only the Cognito + S3 + CloudFront stacks first, then build and push the backend image, then deploy the App Runner portion.

Note your choice here: **`___________________`**

---

## Ready to Start?

Once all items above are checked, proceed to **Sprint 1**:

```
.kiro/specs/aws-full-stack-poc/sprint-1-iac/requirements.md
```
