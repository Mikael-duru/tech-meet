# 👨‍💻 TechMeet — Developer Interview Platform

Built with modern tools like Next.js, Stream, Clerk, Convex, and Monaco Editor, TechMeet lets interviewers and candidates connect smoothly, write code together, and communicate in real-time. 

## 🧰 Tech Stack

| Tech           | What it Does                                |
|----------------|----------------------------------------------|
| **Next.js 15** | App Router, SSR, SEO                         |
| **TailwindCSS**| Utility-first styling                       |
| **shadcn/ui**  | Headless, accessible UI components           |
| **Clerk**      | Auth & user sessions                         |
| **Stream**     | Video/audio calls with participant control   |
| **Convex**     | Real-time backend & serverless functions     |
| **Monaco Editor** | VSCode-like coding experience in-browser |

## 🧑‍🏫 Built for Interviews

- ✅ **Live Video Calls** – powered by Stream
- 🧑‍💻 **Collaborative Code Editor** – Monaco with real-time updates
- 🧭 **Lobby & Meeting Flow** – Join, rejoin, setup screen logic
- 🔐 **Secure Auth** – Clerk handles sign up/sign in
- 🌩️ **Real-Time Backend** – Convex enables snappy interactions
- 🎯 **Minimal UI, Max Focus** – shadcn + Tailwind polish it off
  
## 📦 Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Mikael-duru/techmeet.git
   cd techmeet
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:  
   ```env
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

    # Convex
    CONVEX_DEPLOYMENT=   # Deployment used by `npx convex dev`
    NEXT_PUBLIC_CONVEX_URL=

    # Stream
    NEXT_PUBLIC_STREAM_API_KEY=
    STREAM_SECRET_KEY=

    # Site URL
    NEXT_PUBLIC_APP_URL=

   ```
4. Start the convex server  
   ```bash
   npx convex dev
   ```
5. Run the development server:  
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.  

---  
Built with ❤️ and Nextjs.  
