# 📚 Smart Library System

A full-stack Smart Library Management System built with **Spring Boot + React + MySQL**.  
This project helps manage users, books, bookings, and library operations through a modern web interface.

---

# 🚀 Running the Project on Another PC

## 📌 Prerequisites

Install these tools before running the project:

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 17 | https://adoptium.net |
| Maven | 3.9+ | https://maven.apache.org |
| MySQL | 8.x | https://mysql.com |
| Node.js | 18+ | https://nodejs.org |
| Git | Latest | https://git-scm.com |

---

# 📥 Step 1: Clone the Project

```bash
git clone https://github.com/YOUR_USERNAME/smart-library-system.git
cd smart-library-system
```

---

# 🗄️ Step 2: Setup Database

Open MySQL and run:

```sql
CREATE DATABASE smart_library_db;
```

---

# ⚙️ Step 3: Configure Backend

Open file:

```bash
smart-library/src/main/resources/application.properties
```

Update these lines with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_library_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

app.jwt.secret=YourJWTSecretKey
app.jwt.expiration=86400000
```

---

# 🖥️ Step 4: Run Backend

```bash
cd smart-library
mvn clean install
mvn spring-boot:run
```

✅ Backend Starts At: http://localhost:8080

---

# 🌐 Step 5: Run Frontend

Open new terminal:

```bash
cd library-frontend
npm install
npm start
```

✅ Frontend Starts At: http://localhost:3000

---

# 🔧 Quick Troubleshooting

| Problem | Fix |
|--------|------|
| Port 8080 already in use | Add `server.port=8081` in `application.properties` |
| MySQL connection refused | Make sure MySQL service is running |
| npm not found | Install Node.js first |
| Java version mismatch | Install JDK 17 and set JAVA_HOME |
| Frontend can't reach backend | Check API base URL in React config |

---

# 🛠️ Tech Stack

- Java Spring Boot  
- Spring Security + JWT  
- MySQL Database  
- React.js  
- Bootstrap / CSS  
- Maven  

---

# 📌 Notes

- Make sure backend runs first before frontend.  
- Database tables will auto-create using JPA.  
- Change JWT secret in production.  

---

# 👨‍💻 Author

- Uchit Yadav
- Kartik Kashyap
