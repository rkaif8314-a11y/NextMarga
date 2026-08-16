<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/08cac3d5-b523-4adb-b19c-46d5dd01313f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## NextMarga — local demo

This project is a hackathon prototype. The included opportunity records are demo/sample data and must be verified against official sources before real-world use.

### Run without an API key

1. Install Node.js 20+
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:3000`

The app includes a rule-based CareerAI fallback, so the core demo works without a Gemini API key.

### Optional Gemini AI

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` locally. Never commit `.env` or a real API key to GitHub. You can optionally set `GEMINI_MODEL`; the default is `gemini-2.5-flash`.
