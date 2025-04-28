# Niyet — Mobile App

**Niyet** is a mobile application designed to help users break bad habits and replace them with positive ones through intention setting and habit tracking.

## 📱 Project Overview

Niyet allows users to:

- Set personal "Niyet" (intentions) by selecting a bad habit they want to quit.
- Optionally choose a positive habit to replace it.
- Track their progress with streaks and detailed logs.
- Get motivational quotes to stay focused on their goals.
- Manage their profile and app settings (including dark mode).

The project is currently under active development.

## ⚙️ Technologies Used

- **React Native** (via Expo)
- **TypeScript**
- **Supabase** (Authentication & Database)
- **Expo Router** (for navigation)
- **TailwindCSS for React Native** (via Nativewind)

## 📂 Project Structure (early version)

```
/niyet-app
  ├── app/           # App screens and routes
  ├── assets/        # Images, icons, fonts
  ├── components/    # Reusable UI components
  ├── lib/           # Utility functions (e.g., database requests)
  ├── constants/     # Static variables and configurations
  ├── provider/      # Context providers (e.g., ThemeProvider, SessionProvider)
  ├── styles/        # Global styling files
  ├── README.md      # Project documentation (this file)
  └── package.json   # Project metadata and dependencies
```

## 🚀 How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Sultan-Bakhytzhanov/niyet-app
   cd niyet-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the project:

   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go (on your phone) or run on an emulator.

## 📅 Project Status

- [x] Project setup completed
- [x] Basic screens (Home, Explore, Profile) created
- [ ] Authentication with Supabase (planned)
- [ ] Habit tracking system (in progress)
- [ ] Notifications and reminders (planned)
- [ ] Final UI polish (planned)

## 📌 Notes

- The app is currently in **MVP development phase**.
- Design and features are subject to change as testing and feedback are received.
