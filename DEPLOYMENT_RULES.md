# Deployment Rules for Paths Project

## Overview
This document outlines the deployment rules and procedures for the Paths project repositories:
- **Frontend**: https://github.com/inpathstech/Paths-Web-FE (Next.js)
- **Backend**: https://github.com/inpathstech/Paths-Backend (NestJS)

## Repository Structure

### Frontend (Paths-Web-FE)
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Package Manager**: npm
- **Deployment**: AWS S3 + CloudFront (using existing setup)

### Backend (Paths-Backend)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: AWS EC2/ECS (using existing setup)

## Branch Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch for features

### Feature Development
- Create feature branches from `develop`
- Format: `feature/description` or `fix/description`
- Example: `feature/user-authentication`, `fix/login-bug`

## Deployment Rules

### 1. Code Quality Requirements
- ✅ All code must pass linting (`npm run lint`)
- ✅ All tests must pass (`npm run test`)
- ✅ Build must succeed (`npm run build`)
- ✅ No TypeScript errors
- ✅ Code review approval required

### 2. Environment Management
- ✅ Environment variables must be configured in hosting platform
- ✅ Secrets must be stored in GitHub repository secrets
- ✅ No hardcoded sensitive information
- ✅ Different environments for staging and production

### 3. Database Rules (Backend)
- ✅ All migrations must be tested locally first
- ✅ Database schema changes require review
- ✅ Backup strategy must be in place
- ✅ No direct database modifications in production

### 4. Security Requirements
- ✅ Dependencies must be up to date
- ✅ Security vulnerabilities must be addressed
- ✅ API keys and secrets must be rotated regularly
- ✅ HTTPS must be enforced in production

## Deployment Process

### Frontend Deployment
1. **Development**: Work on feature branch
2. **Testing**: Push to `develop` for integration testing
3. **Review**: Create PR from `develop` to `main`
4. **Approval**: Get code review and approval
5. **Deployment**: Merge to `main` triggers automatic deployment

### Backend Deployment
1. **Development**: Work on feature branch
2. **Testing**: Push to `develop` for integration testing
3. **Database**: Test migrations locally
4. **Review**: Create PR from `develop` to `main`
5. **Approval**: Get code review and approval
6. **Deployment**: Merge to `main` triggers automatic deployment

## Required GitHub Secrets

### Frontend Repository
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
S3_BUCKET_NAME=your_s3_bucket_name
CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_distribution_id
NEXT_PUBLIC_API_URL=your_backend_api_url
```

### Backend Repository
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
EC2_INSTANCE_ID=your_ec2_instance_id
SSH_PRIVATE_KEY=your_ssh_private_key
DATABASE_URL=your_production_database_url
JWT_SECRET=your_jwt_secret
```

## Branch Protection Rules

### Main Branch
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators
- ✅ Restrict pushes that create files
- ✅ Allow force pushes: Disabled
- ✅ Allow deletions: Disabled

### Develop Branch
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Include administrators

## Monitoring and Alerts

### Required Monitoring
- ✅ Application health checks
- ✅ Error tracking (Sentry)
- ✅ Performance monitoring
- ✅ Database performance
- ✅ Uptime monitoring

### Alert Rules
- ✅ Deployments must be monitored
- ✅ Errors must trigger alerts
- ✅ Performance degradation must be flagged
- ✅ Database issues must be escalated

## Rollback Procedures

### Frontend Rollback
1. Revert to previous commit in `main`
2. Force push to trigger new deployment
3. Verify rollback success

### Backend Rollback
1. Revert to previous commit in `main`
2. Check database compatibility
3. Force push to trigger new deployment
4. Verify rollback success

## Emergency Procedures

### Critical Issues
1. **Immediate**: Deploy hotfix to production
2. **Investigation**: Root cause analysis
3. **Communication**: Notify stakeholders
4. **Prevention**: Update procedures to prevent recurrence

### Contact Information
- **DevOps Lead**: [Add contact]
- **Backend Lead**: [Add contact]
- **Frontend Lead**: [Add contact]

## Compliance and Standards

### Code Standards
- ✅ Follow TypeScript best practices
- ✅ Use ESLint and Prettier
- ✅ Follow Git commit message conventions
- ✅ Document API changes

### Documentation Requirements
- ✅ API documentation must be updated
- ✅ README files must be current
- ✅ Deployment guides must be maintained
- ✅ Architecture decisions must be documented

## Review Checklist

### Before Deployment
- [ ] All tests pass
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Security scan completed
- [ ] Performance impact assessed

### After Deployment
- [ ] Health checks pass
- [ ] Monitoring alerts configured
- [ ] Error tracking active
- [ ] Performance metrics normal
- [ ] Stakeholders notified

## Maintenance Schedule

### Weekly
- [ ] Review dependency updates
- [ ] Check security vulnerabilities
- [ ] Monitor performance metrics
- [ ] Update documentation

### Monthly
- [ ] Review deployment procedures
- [ ] Update security policies
- [ ] Performance optimization review
- [ ] Backup verification

### Quarterly
- [ ] Architecture review
- [ ] Security audit
- [ ] Disaster recovery testing
- [ ] Team training updates
