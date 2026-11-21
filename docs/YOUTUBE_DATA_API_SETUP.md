# YouTube Data API v3 Configuration Guide

This guide explains how to obtain and configure a Google Cloud API Key for the **TQV Engineering Lab — Listening Room** playlist library.

The Listening Room uses the official **YouTube Data API v3** via a secure Cloudflare Pages Function (`/api/listening-room`) to fetch live playlist tracks, titles, channel credits, and durations.

---

## 1. Obtain a Google Cloud API Key

1. Navigate to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Create a new project (e.g., `tqv-engineering-portfolio`) or select an existing project.
3. In the sidebar, go to **APIs & Services** → **Library**.
4. Search for **YouTube Data API v3** and click **Enable**.
5. Go to **APIs & Services** → **Credentials**.
6. Click **+ Create Credentials** → **API key**.
7. Copy your generated API key.

### Restrict Your API Key (Recommended)
To prevent unauthorized usage of your quota:
1. On the Credentials page, click the edit icon next to your newly created API key.
2. Under **API restrictions**, choose **Restrict key**.
3. In the dropdown, select only **YouTube Data API v3**.
4. Click **Save**.

---

## 2. Local Development Configuration (`.dev.vars`)

Cloudflare Pages Functions reads local secrets from `.dev.vars` when running with Wrangler.

1. In the repository root, copy the example environment file:
   ```bash
   cp .dev.vars.example .dev.vars
   ```
2. Edit `.dev.vars` and add your actual API key:
   ```env
   YOUTUBE_PLAYLIST_ID=PLV8hEip3Kp-o
   YOUTUBE_API_KEY=AIzaSy...YourRealKeyHere
   ```
3. `.dev.vars` is automatically included in `.gitignore` — **never commit your real API key to GitHub**.

To run the local preview with Cloudflare Pages Functions:
```bash
npx wrangler pages dev dist
```

---

## 3. Cloudflare Pages Production Configuration

When deploying the portfolio to Cloudflare Pages:

1. Log into your **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
2. Navigate to **Workers & Pages** and select your portfolio Pages project.
3. Go to **Settings** → **Environment variables**.
4. Click **Add variables**:
   * **Variable 1 (Plain text)**:
     * Variable name: `YOUTUBE_PLAYLIST_ID`
     * Value: `PLV8hEip3Kp-o`
   * **Variable 2 (Encrypted secret)**:
     * Variable name: `YOUTUBE_API_KEY`
     * Value: `<Your Google Cloud API Key>`
     * Type: **Encrypt** (Secret)
5. Save the variables.
6. Trigger a redeployment in **Deployments** → **Retry deployment** (or push a new commit) for the new environment secrets to take effect.

---

## 4. Verify API Functionality

Once configured, verify the endpoint by visiting:

* Local: `http://localhost:8788/api/listening-room`
* Production: `https://your-domain.pages.dev/api/listening-room`

You should receive a `200 OK` JSON response:
```json
{
  "playlistId": "PLV8hEip3Kp-o",
  "playlistTitle": "OLD BUT GOLD",
  "totalResults": 42,
  "tracks": [
    {
      "playlistItemId": "...",
      "videoId": "0LuignGmX_0",
      "position": 1,
      "title": "...",
      "channelTitle": "...",
      "thumbnailUrl": "https://i.ytimg.com/vi/0LuignGmX_0/hqdefault.jpg",
      "durationSeconds": 245,
      "embeddable": true
    }
  ],
  "nextPageToken": null,
  "fetchedAt": "2026-11-21T..."
}
```

---

## 5. Graceful Behavior When Key is Not Configured

If `YOUTUBE_API_KEY` is not present in the environment:
- The website continues to build and run cleanly without breaking.
- The Listening Room UI displays a "Waiting for YouTube Data API Key" notification in the playlist panel.
- Visitors can still launch the stream directly on YouTube Music via the external link.
- No dummy or fabricated API data is presented.
