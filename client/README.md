# ⚛️ Shree Mega ERP – React Frontend

Welcome to the frontend codebase of **Shree Mega ERP**, built using **React**. This app is the user interface for managing modules like Grey Orders, NEFT Manager, Agent Master, Task Manager, and more.

---

## 📦 Tech Stack

- React (Functional Components)
- React Router DOM
- Axios (for API calls)
- CoreUI / Tailwind (for UI styling)
- Context API / Redux (optional for global state)
- Form Validation (Yup / custom)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the App

```bash
npm start
```

### 3. Build for Production

```bash
npm run build
```

---

## 📂 Folder Structure

```
src/
├── assets/              # Static files (images, logos)
├── components/          # Reusable UI components (Button, Modal, etc.)
├── pages/               # Route-level views (Home, GreyOrder, NeftEntry)
├── features/            # Feature-specific components & logic
│   ├── grey-order/
│   ├── neft-manager/
├── hooks/               # Custom hooks (useFetch, useForm)
├── services/            # API calls logic (axios setup)
├── utils/               # Helper functions (formatDate, validators)
├── App.jsx              # Main app entry with routes
└── index.js             # React root render
```

---

## 📘 Naming Conventions

| Type              | Format                  | Example                         |
| ----------------- | ----------------------- | ------------------------------- |
| Files/Folders     | `kebab-case`            | `grey-order/`, `agent-form.jsx` |
| Components        | `PascalCase`            | `GreyOrderForm.jsx`             |
| Hooks             | `camelCase`             | `useFetchData.js`               |
| Styles (CSS/SCSS) | `PascalCase.module.css` | `AgentCard.module.css`          |
| Variables         | `camelCase`             | `totalAmount`, `handleSubmit`   |

📄 Refer to `NAMING-CONVENTIONS.frontend.md` for full guidelines.

---

## 🧠 Dev Notes

- ❗ Keep components **stateless** and use **hooks** for logic
- 🔀 Use `react-router-dom` for navigation
- 💬 Place reusable forms, cards, and modals inside `components/`
- 📁 Follow clean folder separation by feature inside `features/`
- 🧪 Optional: Add `tests/` folder for unit tests

---

## 👨‍💻 Contributors

- Pankaj Rajpurohit (Lead Developer & Architect)
- Team SMC – Frontend Division

---

## ✅ To Do / Future

- Add Auth Guard & Role-based Routing
- Connect to live API endpoints
- Implement advanced form validation with Yup or Zod

---

For backend setup and API docs, refer to `../server/README.md`.

## 📞 Contact

For team support or onboarding:

```
team@shreemegacreation.com
```

or

```
Pankaj Rajpurohit
```

---

_Built with ❤️ by Shree Mega Creation Tech Team_
