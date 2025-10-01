# DNS Setup Guide for qava.ai

## Overview
This guide will help you configure your GoDaddy DNS settings to point qava.ai to your new AWS S3/CloudFront deployment, replacing your Webflow site.

## Prerequisites
- GoDaddy account with qava.ai domain
- AWS S3 bucket configured for static website hosting
- CloudFront distribution (optional but recommended for performance)

## Step 1: Configure S3 Bucket for Static Website Hosting

1. **Create S3 Bucket** (if not already exists):
   ```bash
   aws s3 mb s3://qava-ai-bucket --region eu-north-1
   ```

2. **Enable Static Website Hosting**:
   - Go to AWS S3 Console
   - Select your bucket
   - Go to "Properties" tab
   - Scroll to "Static website hosting"
   - Click "Edit"
   - Enable static website hosting
   - Set index document to: `index.html`
   - Set error document to: `index.html` (for SPA routing)
   - Save changes

3. **Configure Bucket Policy** (for public access):
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::qava-ai-bucket/*"
           }
       ]
   }
   ```

## Step 2: Set Up CloudFront Distribution (Recommended)

1. **Create CloudFront Distribution**:
   - Origin Domain: Your S3 bucket website endpoint
   - Origin Path: Leave empty
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: `index.html`
   - Error Pages: Create custom error response for 403/404 → 200 with `/index.html`

2. **Configure Custom Domain**:
   - Add `qava.ai` and `www.qava.ai` as alternate domain names
   - Request SSL certificate for `*.qava.ai` and `qava.ai`

## Step 3: Configure GoDaddy DNS

### Option A: Point to CloudFront (Recommended)
1. Log into GoDaddy
2. Go to "My Products" → "DNS"
3. Find qava.ai and click "DNS"
4. Update these records:

   **A Record (Root Domain)**:
   - Type: A
   - Name: @
   - Value: [CloudFront IP or use CNAME]
   - TTL: 600

   **CNAME Record (Root Domain)**:
   - Type: CNAME
   - Name: @
   - Value: [Your CloudFront distribution domain]
   - TTL: 600

   **CNAME Record (WWW)**:
   - Type: CNAME
   - Name: www
   - Value: [Your CloudFront distribution domain]
   - TTL: 600

### Option B: Point Directly to S3
1. **A Record (Root Domain)**:
   - Type: A
   - Name: @
   - Value: [S3 website endpoint IP]
   - TTL: 600

2. **CNAME Record (WWW)**:
   - Type: CNAME
   - Name: www
   - Value: [Your S3 bucket website endpoint]
   - TTL: 600

## Step 4: Verify Configuration

1. **Test DNS Propagation**:
   ```bash
   nslookup qava.ai
   dig qava.ai
   ```

2. **Test Website Access**:
   - Visit https://qava.ai
   - Visit https://www.qava.ai
   - Check that both redirect to HTTPS

3. **Test Performance**:
   - Use tools like GTmetrix or PageSpeed Insights
   - Verify CloudFront caching is working

## Step 5: Update GitHub Secrets

Add these secrets to your GitHub repository:

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
S3_BUCKET_NAME=qava-ai-bucket
CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_distribution_id
```

## Troubleshooting

### Common Issues:

1. **DNS Not Propagating**:
   - Wait 24-48 hours for full propagation
   - Check with different DNS servers
   - Clear browser cache

2. **SSL Certificate Issues**:
   - Ensure CloudFront certificate is valid
   - Check that domain names match certificate
   - Verify DNS is pointing to CloudFront

3. **Website Not Loading**:
   - Check S3 bucket permissions
   - Verify index.html exists in bucket
   - Check CloudFront distribution status

4. **Mixed Content Warnings**:
   - Ensure all resources use HTTPS
   - Update any hardcoded HTTP URLs in your HTML

## Migration Checklist

- [ ] S3 bucket created and configured
- [ ] CloudFront distribution set up (optional)
- [ ] SSL certificate requested and validated
- [ ] DNS records updated in GoDaddy
- [ ] GitHub secrets configured
- [ ] Landing page deployed to S3
- [ ] DNS propagation verified
- [ ] Website accessible via HTTPS
- [ ] Performance tested
- [ ] Webflow site backed up (optional)

## Post-Migration

1. **Monitor Performance**:
   - Set up CloudWatch alarms
   - Monitor CloudFront metrics
   - Track page load times

2. **SEO Considerations**:
   - Submit new sitemap to Google Search Console
   - Update Google Analytics (if applicable)
   - Monitor search rankings

3. **Backup Strategy**:
   - Regular S3 bucket backups
   - Version control for all changes
   - Document all configurations

## Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Verify DNS propagation with multiple tools
3. Test with different browsers/devices
4. Contact AWS support if needed
