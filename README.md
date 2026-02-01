<img width="1536" height="1024" alt="ChatGPT Image Feb 1, 2026, 04_33_17 PM" src="https://github.com/user-attachments/assets/d4240b67-8fce-49d7-a769-a9c1c9329a0f" />

---

# 📚 Bookworm – Social Book Recommendation App (F

Bookworm is a social book recommendation application where users can share books they love, rate them, add images, and explore recommendations from others. 

---

## ✨ Features

* User authentication (Login & Signup)
* Create book recommendations with:

  * Book title
  * Star rating
  * Image upload
  * Caption/review
* Explore a feed of recommendations from other users
* Infinite scrolling & pull-to-refresh
* User profile with personal recommendations
* Clean and performance-optimized UI

---

## 🛠 Tech Stack

* **React Native (Expo)**
* **Expo Router** (File-based navigation)
* **Zustand** (State management)
* **JWT Authentication**
* **Cloudinary** (Image hosting & optimization)
* **REST APIs**
* **Node.js & Express** 
---

## 📱 Screens Overview

* Authentication (Login / Signup)
* Home Feed (Explore recommendations)
* Create Recommendation
* Profile (User’s posts & logout)

---

## ⚙️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/swayam-developer/bookworm-frontend.git
cd bookworm-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npx expo start
```

4. Run the app on:

* Android Emulator
* iOS Simulator
* Physical device using Expo Go

---

## 🔐 Environment Variables

Create a `.env` file and add:

```env
EXPO_PUBLIC_API_URL=your_backend_api_url
```

Make sure the backend server is running.

---

## 🚀 Performance Optimizations

* Route-level lazy loading using Expo Router
* Optimized image loading via Cloudinary
* FlatList optimizations (pagination, batching)
* Reduced unnecessary re-renders
* Improved Lighthouse performance scores

---
