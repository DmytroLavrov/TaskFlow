# 🚀 TaskFlow

**TaskFlow** is an interactive real-time Kanban dashboard (a Trello-like clone) for task management.

The project is built to demonstrate the capabilities of modern **Angular 18+** combined with **Firebase** cloud technologies. The application supports a full task lifecycle, an intuitive Drag & Drop interface, and personalized authentication.

## 🔗 Live Demo

👉 **[Open TaskFlow Live](https://task-flow-db.web.app)**

---

## 🛠 Tech Stack

| Technology      | Usage                                                        |
| :-------------- | :----------------------------------------------------------- |
| **Angular 18+** | Standalone Components, Signals, Control Flow (`@if`, `@for`) |
| **TypeScript**  | Strong typing, interfaces                                    |
| **Angular CDK** | Advanced Drag & Drop (cards and columns)                     |
| **Firebase**    | Firestore (real-time database), Authentication (Google)      |
| **RxJS**        | Asynchronous data streams                                    |
| **SCSS**        | Modular styling architecture, variables, mixins              |

---

## ✨ Key Features

* **🔐 Authentication:** Google Sign-In via Firebase Auth. Each user has access only to their own board.
* **🤚 Drag & Drop:**

  * Move cards between columns.
  * Reorder cards within a column.
  * Drag and reorder columns horizontally.
* **⚡ Real-time Updates:** All changes (movement, edits) are instantly synchronized across all user devices.
* **✏️ Inline Editing:** Edit task titles directly on click (no modal dialogs).
* **🗑 CRUD Operations:** Create and delete columns and tasks.

---

## 🏗 Architecture & Design Decisions

The project follows **Clean Architecture** principles:

1. **Smart & Dumb Components:** Separation between pages (`pages/`) and reusable UI components.
2. **Services:** All business logic and API communication is encapsulated in services (`AuthService`, `BoardService`).
3. **Route Guards:** Protected routes using `CanActivate`. Unauthorized users cannot access the board.
4. **Lazy Loading:** The board module loads only after authentication to improve initial load performance.
5. **OnPush Strategy:** `ChangeDetectionStrategy.OnPush` is used to optimize rendering during Drag & Drop operations.

---

## 🚀 Getting Started (Local Setup)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/task-flow.git
   cd task-flow
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Firebase:**

   * Create a project in the [Firebase Console](https://console.firebase.google.com/).
   * Enable **Authentication** (Google provider) and **Firestore**.
   * Add your Firebase configuration
     (or use `ng add @angular/fire` to connect your project).

4. **Run the development server:**

   ```bash
   ng serve
   ```

   Open `http://localhost:4200`.
