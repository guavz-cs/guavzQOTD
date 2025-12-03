# guavz QOTD - Quote of the Day PWA

A Progressive Web App that delivers daily inspirational quotes. Built with vanilla JavaScript to practice PWA fundamentals and browser APIs.

## Features
- 📱 Installable as a mobile app
- 🔔 Daily quote notifications
- 🌓 Dark/Light theme toggle
- 📡 Works offline with cached quotes
- 🔄 Random quote generator
- 📤 Share quotes via WhatsApp

## Tech Stack
- Vanilla JavaScript
- Service Workers for offline support
- LocalStorage for data persistence
- Notification API
- DummyJSON Quotes API

## What I Learned
- Implementing Service Worker caching strategies
- Building installable PWAs
- Handling offline scenarios
- Working with browser notifications
- Managing app state with LocalStorage

## Live Demo
[guavz-qotd.vercel.app](https://guavz-qotd.vercel.app)

## Installation
1. Clone the repo
2. Open index.html in browser
3. Click "Install App" prompt (mobile/Chrome)

## Screenshot
<img width="484" height="636" alt="image" src="https://github.com/user-attachments/assets/1e50dc3f-9595-4a59-b9f3-c2d5f849b81e" />

## Challenges
The trickiest part was getting the Service Worker caching right. I had to balance caching the app shell for offline use while still fetching fresh quotes from the API. Solution was to cache static assets aggressively but use network-first for API calls with fallback quotes.
