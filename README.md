# 🚀 CodeBoost AI – Powered by IBM Bob

CodeBoost AI is a proof-of-concept project built for the IBM Bob Dev Day Hackathon.

It demonstrates how IBM Bob acts as an intelligent development partner to accelerate software delivery by automating key development tasks such as code understanding, documentation, testing, and refactoring.

---

## 🎯 Problem

Developers spend significant time on repetitive and non-value-added tasks:
- Understanding existing codebases
- Writing documentation
- Creating unit tests
- Refactoring legacy logic

These activities slow down development and reduce productivity.

---

## 💡 Solution

CodeBoost AI leverages IBM Bob to:

- 🧠 Understand full project context instantly  
- 📄 Generate high-quality documentation  
- 🧪 Automatically create unit tests  
- 🔧 Refactor and improve code quality  

---

## 🧱 Architecture

This project is a simple Node.js API structured as follows:

app.js → Application entry point  
routes/ → API endpoints  
services/ → Business logic (pricing)  

IBM Bob interacts directly with the codebase via the IDE, analyzing and transforming the project in real time.

---

## ⚙️ API Endpoints

### POST /orders

Calculate total order price.

### Example Request
{
  "items": [
    { "type": "A", "price": 100 },
    { "type": "B", "price": 200 }
  ]
}

### Example Response
{
  "total": 332.1
}

---

## 🧪 Testing

Unit tests were generated using IBM Bob to validate pricing logic, including edge cases such as:
- Empty input
- High-value discounts
- Unknown item types

---

## 🔧 Code Improvements

IBM Bob identified and resolved:
- Code duplication
- Hardcoded logic
- Poor readability
- Lack of modularity

The pricing service was refactored to follow best practices and improve maintainability.

---

## 📈 Impact

Using IBM Bob, this project demonstrates:

- ⏱️ Reduced development time  
- 📊 Improved code quality  
- 🚀 Faster onboarding for developers  
- 🔄 Automated repetitive tasks  

---

## 🤖 Why IBM Bob

IBM Bob goes beyond code generation by understanding the full development context, enabling smarter decisions and higher-quality outcomes.

---

## ▶️ How to Run

npm install  
npm start  

Server runs on: http://localhost:3000

---

## 📂 Hackathon Submission

This repository includes:
- Source code
- Bob-generated improvements
- /bob_sessions folder with task session reports for evaluation

---

## 🏁 Conclusion

CodeBoost AI shows how IBM Bob can transform the developer experience by turning ideas into working software faster, with better quality and less effort.
