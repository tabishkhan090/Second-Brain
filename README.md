
# 🧠 Second Brain

Second Brain is a productivity tool that helps you save and organize helpful links, tweets, videos, and notes from across the web. Whether it’s an article you want to revisit, a project idea, or a productivity tip — store it all in one place and retrieve it whenever you need.

---

## 🛠 Tech Stack

- **Frontend**: React
- **Backend**: TypeScript (Node.js, Express)

---

## 🚀 Features

- ✍️ Create a personal collection of useful content
- 📥 Add tweets, videos, documents, and web links
- 🧩 Tag and organize content with a clean, intuitive UI
- 🔍 View all content in a structured way
- 📤 Share collections or single notes with others
- 🔐 Secure sign-up and sign-in endpoints
- 🗑 Delete any saved content
- 📄 View shared brains from other users
- 🤖 _Upcoming_: AI integration to smartly suggest tags, summarize content, and help recall forgotten links

---

## 🔐 Backend API (Key Routes)

- `POST /api/v1/signup`  
  Constraints:  
  • Username: 3–10 characters  
  • Password: 8–20 characters, includes uppercase, lowercase, number, special char

  Responses:  
  - 200: Signed up  
  - 411: Invalid input  
  - 403: User already exists  
  - 500: Server error

- `POST /api/v1/signin`
- `POST /api/v1/content` – Add new content
- `GET /api/v1/content` – Fetch all user content
- `DELETE /api/v1/content/:id` – Delete content
- `POST /api/v1/share` – Create shareable brain link
- `GET /api/v1/share/:username` – View another user's shared brain

---

## 📸 UI Preview

![App Screenshot](./Screenshot%202025-06-27%20at%207.52.40%E2%80%AFPM.png)

---

## 📌 Future Scope

- Integrate AI assistant to automate tagging, summarizing content, and recommending relevant notes
- Add search and filtering options
- Support for markdown notes
- User analytics dashboard

---

## 🧑‍💻 Author

**Md Tabish Raza Khan**  
GitHub: [tabishkhan090](https://github.com/tabishkhan090)

---

## 🌐 License

This project is licensed under the MIT License.
