# 📘 SMC ERP Project

Welcome to the **SMC ERP** system. This guide will help new developers understand the folder structure, Git usage, and how to start working on the project.

---

## 🗂️ Folder Structure

```
Project Mega Creation/
├── client/        # React Frontend
├── server/        # Node + Express Backend
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/pankajraj01/smc-erp.git
cd smc-erp
```

### 2. Install Dependencies

Install for both **client** and **server**:

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Start Development Servers

Frontend:

```bash
cd client
npm start
```

Backend:

```bash
cd server
npm run dev
```

---

## 🛠️ Git Workflow

### Branch Naming Convention:

```
<user>/<Projecr-Part>/<module>/<task>
```

Examples:

- `pankaj/client/neft-manager/ui-design`
- `chirayu/server/login/auth-api`
- `sanket/client/party-master/table-view`

### Creating a New Branch:

```bash
git checkout -b <your-branch-name>
```

### Committing Changes:

```bash
git add .
git commit -m "feat: add login UI"
git push origin <your-branch-name>
```

### Sample Commit Message Prefix:

| Prefix   | Meaning              |
| -------- | -------------------- |
| feat     | New feature          |
| fix      | Bug fix              |
| chore    | Minor cleanups       |
| refactor | Code restructure     |
| docs     | Documentation change |

### Pull Main Updates (Don't Edit Main):

```bash
git checkout main
git pull origin main
```

### Merge Main Into Your Branch:

```bash
git checkout your-branch
git merge main
```

---

## ❌ Do NOT:

- Edit or push to `main` directly.
- Push broken or untested code.

---

## ✅ Do:

- Use your branch for features.
- Write clear commits.
- Regularly pull latest changes.

---

If you face any issue, contact **@Pankaj** or your team lead.

Happy Coding 🚀
