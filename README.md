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
- [💻 Getting Started](#getting-started-docker)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Create .env files](#create-env-files)
  - [Usage](#usage)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)

<!-- PROJECT DESCRIPTION -->

# 📖 IntelliSpend <a name="about-project"></a>

Our project aims to empower users with AI-powered financial insights and other features that go beyond mere expense tracking. Our all-in-one system will analyse spending behavior and offer personalised budgeting recommendations to help users optimise their finances effortlessly, along with various other features that aim to help our users improve their spending habits.


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
<summary>LLM</summary>
  <ul>
    <li><a href="https://www.ollama.com/">Ollama</a></li>
  </ul>
</details>

<details>
<summary>Async Workers</summary>
  <ul>
    <li><a href="https://www.redis.io/">Redis</a></li>
    <li><a href="https://github.com/celery/celery/">Celery</a></li>
  </ul>
</details>

<details>
<summary>Containerization</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
  </ul>
</details>

<details>
<summary>CI</summary>
  <ul>
    <li><a href="https://github.com/features/actions/">GitHub Actions</a></li>
  </ul>
</details>

<details>
<summary>Version Control</summary>
  <ul>
    <li><a href="https://www.git-scm.com/">Git</a></li>
    <li><a href="https://www.github.com/">GitHub</a></li>
  </ul>
</details>


<!-- Features -->

### Key Features <a name="key-features"></a>

- **[User Login/Registration]**
- **[User Profile Management]**
- **[REST APIs for users, expenses, categories, incomes and goals]**
- **[Smart Goal Setting using rule-based heuristics and LLM]**
- **[CSV Export with TTL auto deletion using async workers]**
- **[Calendar View]**
- **[Containerization and CI Pipeline]**


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->

## 💻 Getting Started (Docker) <a name="getting-started-docker"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need to install the following:

- PostgreSQL 13+
- Node.js 18+
- Python 3.10+
- Ollama
- Docker
- Docker Desktop

### Setup

Clone this repository to your desired folder:

```sh
  cd my-folder
  git clone https://github.com/yh13431/intellispend.git
```

### Create .env files

Create .env files for the root folder, the backend (Django) and frontend (Next.js) by copying their respective example.env files.

```sh
  cp example.env .env
  cp backend/example.env backend/.env
  cp frontend/example.env frontend/.env
```

Here is an example of the environment variables that you can use, but it would be better to customise them based on your local environment.

```
POSTGRES_USER=is_user
POSTGRES_PASSWORD=is_password
POSTGRES_DB=is_db
DB_NAME=is_db
DB_USER=is_user
DB_PASSWORD=is_password
DB_HOST=db
DB_PORT=5432
OLLAMA_API_URL=http://localhost:11434/api/generate
CELERY_BROKER_URL=redis://redis:6379/0
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```



### Usage

To run the entire app, execute the following command from the root folder:

```sh
  docker-compose up --build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>

👤 **Thia Yi Hong [A0309206L]**  

👤 **Lim Wee Kit [A0309127H]**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

### Milestone 3

- [ ] **[Joint Budgeting System]**
- [ ] **[Bill Reminders]**
- [ ] **[Continuous Deployment]**

<p align="right">(<a href="#readme-top">back to top</a>)</p>
