# Social Bunny 🐰

## Table of Contents 📚
1. [Project Description](#project-description-) 📝
2. [Project Requirements](#project-requirements-) 📋
   - [Functional Requirements](#functional-requirements-) ✅
   - [Non-Functional Requirements](#non-functional-requirements-) ❌
3. [Technologies Used](#technologies-used-) ⚙️
4. [Installation and Configuration Instructions](#installation-and-configuration-instructions-) ⚙️
5. [Authentication and Security](#authentication-and-security-) 🔒
6. [API Documentation](#api-documentation-) 📖
7. [Demonstrative Video](#demonstrative-video-) 🎥
8. [Links to Repositories](#links-to-repositories-) 🔗

## Project Description 📝
Social Bunny is a platform that allows users to share thoughts, interact with others, and stay connected in a dynamic and intuitive way. This project consists of developing a social network where users can create posts with text and images, comment on others' posts, and react to them. 

## Project Requirements 📋

### Functional Requirements ✅
1. **User Management** 👤
   - User registration with full name, unique username, mobile number, unique email, date of birth, and secure password.
   - Secure authentication and logout using JWT.
   - Password encryption with BCrypt.
   - Age validation for registration.

2. **Posts** 📝
   - Creation of posts with mandatory text, optional image, and customizable tags.
   - Editing and deleting posts only by the author.
   - Sorting posts by chronology or relevance.

3. **Interactions** 💬
   - Comments on posts with a character limit.
   - Tagging users in comments.
   - "Like" functionality on posts.
   - Summary of interactions on each post.

4. **User Following** 👥
   - Functionality to follow and unfollow other users.
   - Viewing posts only from followed users.
   - Lists of followers and followed users.

5. **Notifications** 🔔
   - Notifications for comments, "likes", mentions, and new followers.

### Non-Functional Requirements ❌
- **Technologies to Use** ⚙️
  - **Backend:** Spring Boot 3.2.3, Spring Data JPA, PostgreSQL o MySQL, Swagger, Spring Security With JWT.
  - **Frontend:** Tailwind CSS, ReactJS, Responsive Design, Dark and Light Mode.

## Technologies Used ⚙️
- **Backend:** 
  - Spring Boot 3.2.3
  - Spring Data JPA
  - PostgreSQL
  - Swagger For API Documentation
  - Spring Security With JWT
  - WebSockets For Notifications
- **Frontend:** 
  - ReactJS
  - Tailwind CSS
  - Responsive Design Optimized For Mobile And Desktop

## Installation and Configuration Instructions ⚙️
1. Clone the backend.
2. Configure the database in `application.properties` of the backend.

```properties

spring.datasource.username=postgres

spring.datasource.password=campus2023

```

3. Create a new database in PostgreSQL with the name `SocialBunny`.

```sql
CREATE DATABASE "SocialBunny";
```	

4. Execute The DDL Script Located In The Backend Repository To Create The Tables.

[DDL Script](https://github.com/JuanJTorresB/Social-Bunny-Project-Back/blob/main/DatabaseConfiguration/DDL.sql)

5. Execute The DML Script Located In The Backend Repository To Insert The Data.

[DML Script](https://github.com/JuanJTorresB/Social-Bunny-Project-Back/blob/main/DatabaseConfiguration/DML.sql)

6. Run the backend Spring.

7. Login With The Credentials Of An User Or Create Your Own.

## Authentication and Security 🔒
- User registration validates that they are at least 14 years old.
- Passwords are encrypted using BCrypt.
- JWT is used for user authentication and authorization.

## API Documentation 📖
The API documentation is available on.
[Swagger PDF](DocumentationAssets/Social%20Bunny%20Api%20Documentation.pdf)

## Demonstrative Video 🎥
[Demonstrative Video](https://drive.google.com/drive/folders/1QG8rMr4tZQtxQQ-728NkrRv84p94TPoh?usp=sharing)

## Links to Repositories 🔗
- **Backend:** [Backend Repository](https://github.com/JuanJTorresB/Social-Bunny-Project-Back.git)
- **Frontend:** [Frontend Repository](https://github.com/JuanJTorresB/Social-Bunny-Project-Front.git)

**Latest commit hashes:**
- Backend: ``
- Frontend: ``