<a name="readme-top"></a>
<div align="center">
  <img src="frontend/public/IntelliSpendLogo.png" alt="logo" width="140"  height="auto" />
  <br/>

  <h3><b>IntelliSpend</b></h3>

</div>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Showcase](#showcase)
- [💻 Getting Started](#getting-started-docker)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Create .env files](#create-env-files)
  - [Usage](#usage)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)

<!-- PROJECT DESCRIPTION -->

# 📖 IntelliSpend <a name="about-project"></a>

Our project aims to empower users with AI-powered financial insights that go beyond mere expense tracking. Our system will analyse spending behavior and offer personalised budgeting recommendations to help users optimise their finances effortlessly.


## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://nextjs.org/">Next.js</a></li>
    <li><a href="tailwindcss.com">TailwindCSS</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://djangoproject.com/">Django</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

<details>
<summary>Version Control/CICD</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
    <li><a href="https://www.git-scm.com/">Git</a></li>
    <li><a href="https://www.github.com/">GitHub</a></li>
  </ul>
</details>

<!-- Features -->

### Key Features <a name="key-features"></a>

- **[User Login/Registration]**
- **[User Profile Management]**
- **[REST APIs for Expenses and their Categories]**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🚀 Showcase <a name="showcase"></a>
Will be converted into a live demo in future milestones


Login

![Image](https://github.com/user-attachments/assets/349f89d4-1d3c-4eaf-86d9-d6b13a742ee4)


Register

![Image](https://github.com/user-attachments/assets/bf632460-5d5e-4bcd-8828-4207218418ba)


Homepage

![Image](https://github.com/user-attachments/assets/390d21b0-5a51-4f28-9e1c-0c92229f2753)


User Profile

![Image](https://github.com/user-attachments/assets/9dd90020-7264-48a1-b87a-f41d726ec2a7)


Edit User

![Image](https://github.com/user-attachments/assets/870a060f-95a5-489a-b7bf-57b00215adc4)


Expenses, creating a new category

![Image](https://github.com/user-attachments/assets/a724c1da-7f73-4ef3-8c83-b86b6d4d0273)

![Image](https://github.com/user-attachments/assets/5abadff2-0d8c-4889-b902-649ac91c86cf)


Editing an existing expense

![Image](https://github.com/user-attachments/assets/08bffd34-acb6-4bb1-aff8-39c0b648196a)

![Image](https://github.com/user-attachments/assets/7bb24eb2-d144-4b96-bf1a-1e3155e985b5)


<!-- GETTING STARTED -->

## 💻 Getting Started (Docker) <a name="getting-started-docker"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need to install the following:

- PostgreSQL 13+
- Node.js 18+
- Python 3.10+
- Docker
- Docker Desktop

### Setup

Clone this repository to your desired folder:

```sh
  cd my-folder
  git clone https://github.com/yh13431/intellispend.git
```

### Create .env files

Create .env files for the root folder, the backend (Django) and frontend (Next.js) by copying their respective example.env files and updating their variables based on your local environment.

```sh
  cp example.env .env
  cp backend/example.env backend/.env
  cp frontend/example.env frontend/.env
```

### Usage

To run the entire app, execute the following command from the root folder:

```sh
  docker-compose up --build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started (Non-Docker) <a name="getting-started-non-docker"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need to install the following:

- PostgreSQL 13+
- Node.js 18+
- Python 3.10+

### Setup

Clone this repository to your desired folder:

```sh
  cd my-folder
  git clone https://github.com/yh13431/intellispend.git
```

### Create .env files

Create .env files for both the backend (Django) and frontend (Next.js) by copying their respective example.env files and updating their variables based on your local environment.

```sh
  cp backend/example.env backend/.env
  cp frontend/example.env frontend/.env
```

### Usage

To run the database, ensure you have a local PostgreSQL server running. Log in:

```sh
  psql -U postgres  
```

And create a new database:

```sh
  CREATE DATABASE intellispend_db;
  CREATE USER intellispend_user WITH PASSWORD 'your_password';
  GRANT ALL PRIVILEGES ON DATABASE intellispend_db TO intellispend_user;
```

The DATABASE_URL you will use for your backend/.env file is: 

```sh
  DATABASE_URL=postgres://intellispend_user:your_password@localhost:5432/intellispend_db
```

To run the backend, execute the following commands from the root folder:

```sh
  cd backend
  python -m venv venv
  .\venv\Scripts\activate
  pip install -r requirements.txt

  python manage.py makemigrations
  python manage.py migrate
  python manage.py runserver
```

To run the frontend, execute the following commands from the root folder:

```sh
  cd frontend
  npm install --force
  npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>

👤 **Thia Yi Hong [A0309206L]**  

👤 **Lim Wee Kit [A0309127H]**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

### Milestone 2

- [ ] **[Smart Budgeting]**
- [ ] **[Goal Setting and Progress Tracking]**
- [ ] **[Personal Finance Tips]**

### Milestone 3

- [ ] **[Joint Budgeting System]**
- [ ] **[Bill Reminders]**

<p align="right">(<a href="#readme-top">back to top</a>)</p>
