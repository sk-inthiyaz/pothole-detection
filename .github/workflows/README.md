# 🔥 Keep Render Services Warm (GitHub Actions)

## Problem
Render free tier spins down services after 15 minutes of inactivity. First request after spin-down takes 30-60 seconds (cold start).

## Solution
This GitHub Action pings your services every 14 minutes to keep them active.

## Setup Instructions

### 1. Enable GitHub Actions
1. Go to your repository: `https://github.com/sk-inthiyaz/pothole-detection`
2. Click **Settings** tab
3. Click **Actions** → **General** (left sidebar)
4. Under "Actions permissions", select **"Allow all actions and reusable workflows"**
5. Click **Save**

### 2. Add Secrets
1. Still in **Settings**, click **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add two secrets:

**Secret 1: BACKEND_URL**
- Name: `BACKEND_URL`
- Value: `https://your-backend-url.onrender.com`
- Click **Add secret**

**Secret 2: AI_SERVICE_URL**
- Name: `AI_SERVICE_URL`
- Value: `https://your-ai-service-url.herokuapp.com` (Heroku paid dyno)
- Click **Add secret**

### 3. Enable Workflow
1. Go to **Actions** tab in your repository
2. Find "Keep Render Services Warm" workflow
3. Click **"Enable workflow"**

### 4. Test Workflow (Optional)
1. In **Actions** tab, click on "Keep Render Services Warm"
2. Click **"Run workflow"** dropdown
3. Click **"Run workflow"** button
4. Wait 10-20 seconds and refresh
5. Check if workflow ran successfully (green checkmark ✅)

## How It Works

```yaml
Schedule: Runs every 14 minutes (cron: '*/14 * * * *')
Actions:
  1. Curl backend URL
  2. Curl AI service URL
  3. Log results
```

## Benefits
- ✅ No cold starts for users
- ✅ Faster response times
- ✅ Better user experience
- ✅ Free (GitHub Actions: 2,000 minutes/month for free accounts)
- ℹ️ Note: AI service is hosted on Heroku (paid dyno via a subscribed account); keep-warm pings primarily help Render backend.

## Cost Calculation

```
Runs per day: 24 hours × 60 minutes ÷ 14 minutes = ~103 runs
Time per run: ~20 seconds
Daily minutes: 103 × (20/60) = ~34 minutes
Monthly minutes: 34 × 30 = ~1,020 minutes

Free tier: 2,000 minutes/month
Usage: ~1,020 minutes/month
Remaining: ~980 minutes/month ✅ Plenty of buffer!
```

## Monitoring

### Check Workflow Status
1. Go to **Actions** tab
2. See list of recent runs
3. Green ✅ = Success, Red ❌ = Failed

### Check Workflow Logs
1. Click on any workflow run
2. Click on "keep-warm" job
3. Expand each step to see curl outputs

### Disable Workflow (if needed)
1. Go to **Actions** tab
2. Click on "Keep Render Services Warm"
3. Click **"..."** (three dots)
4. Click **"Disable workflow"**

## Alternative: UptimeRobot (No Code Required)

If you prefer no-code solution:

1. Sign up at https://uptimerobot.com/ (Free)
2. Create new monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend-url.onrender.com`
   - Monitoring interval: 5 minutes
3. Create second monitor for AI service
4. Free tier: 50 monitors, 5-minute intervals

## Troubleshooting

**Workflow not running?**
- Check Actions are enabled (Settings → Actions)
- Check secrets are set correctly
- Manually trigger workflow to test

**Services still cold?**
- Check workflow logs for curl errors
- Verify URLs in secrets are correct
- Try reducing cron interval to `*/10 * * * *` (every 10 min)

**Exceeded free tier?**
- Disable workflow temporarily
- Use UptimeRobot instead
- Upgrade to GitHub Pro (unlimited minutes for public repos)

## Notes
- GitHub Actions runs on UTC time
- Workflow may skip occasional runs (GitHub's limitation)
- Services might still spin down briefly during deployments
- This keeps services in "warm" state, not "always on"

---

**Status:** Ready to deploy! Commit and push to GitHub to activate.
