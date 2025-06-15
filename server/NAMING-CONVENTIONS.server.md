# 🧰 Shree Mega ERP – Backend (Node + Mongoose) Naming Conventions Guide

Use this guide to name files, folders, schemas, and routes in the backend project.

---

## 🧾 GENERAL RULES

| Type          | Naming Style | Example                    |
| ------------- | ------------ | -------------------------- |
| Files/Folders | `kebab-case` | grey-order.controller.js   |
| Classes       | `PascalCase` | GreyOrder                  |
| Variables     | `camelCase`  | greyOrder, totalNeftAmount |
| Schema Name   | `PascalCase` | NeftEntry                  |
| Route Path    | `kebab-case` | /api/grey-order            |

---

## 📂 FOLDER STRUCTURE

```
src/
├── controllers/
│   ├── grey-order/
│   │   └── grey-order.controller.js
│
├── models/
│   └── grey-order/
│       └── GreyOrder.model.js
│
├── routes/
│   └── grey-order/
│       └── grey-order.routes.js
│
├── services/
│   └── grey-order/
│       └── grey-order.service.js
```

---

## ✅ CLASS & SCHEMA NAMING EXAMPLES

```js
class TaskManagerService {}

const NeftEntrySchema = new mongoose.Schema({...});
module.exports = mongoose.model('NeftEntry', NeftEntrySchema);
```

---

## 📚 VARIABLE NAMING EXAMPLES

```js
const greyOrder = req.body;
const totalAmount = calculateTotal(bills);
```

---

## 🚫 DON’Ts

- ❌ Don't use spaces or uppercase in filenames: `Grey Order.js`
- ❌ Don't mix styles: `Grey_order.Controller.js`
- ❌ Don’t pluralize filenames: use `agent.controller.js` not `agents.controllers.js`

---

## 🧠 TIPS

- Keep everything **predictable and readable**
- Group by **domain**, not just file type
- Always follow **singular nouns** in file names (e.g. `user.controller.js` not `users.controller.js`)

---

### ✅ Use This as a Rulebook for All New Modules
