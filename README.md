
# 🛠️ SAV Chat – PoC

Un **proof of concept (PoC)** d’un système de chat entre un client et un service après-vente (SAV), avec gestion des rôles, authentification sécurisée, et communication temps réel via WebSocket/STOMP.

---

## 📁 Structure du projet

```
sav-chat-poc/
├── backend/        # Spring Boot (Java 24, WebSocket, JWT)
├── frontend/       # Angular 20 (Angular Material, STOMP)
├── resources/      # Script SQL, Postman, README
```

---

## ⚙️ Prérequis

| Outil         | Version recommandée |
|---------------|---------------------|
| Java          | 24                  |
| Maven         | 3.9+                |
| PostgreSQL    | 14+                 |
| Node.js       | 20+                 |
| npm           | 10+                 |
| Angular CLI   | 20+                 |

---

## 🔧 Installation backend

### 1️⃣ Créer la base de données PostgreSQL

Connecte-toi avec un superutilisateur PostgreSQL et exécute :

```sql
CREATE DATABASE ycyw_db;

CREATE USER ycyw_user WITH PASSWORD 'ycyw_password';

GRANT ALL PRIVILEGES ON DATABASE ycyw_db TO ycyw_user;
```

### 2️⃣ Configurer le fichier `application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ycyw_db
    username: ycyw_user
    password: ycyw_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

### 3️⃣ Lancer le backend

Dans le dossier `backend/` :

```bash
mvn clean install
mvn spring-boot:run
```

---

## 🔧 Installation frontend

### 1️⃣ Installation des dépendances

```bash
cd frontend/
npm install
```

### 2️⃣ Lancer le frontend Angular

```bash
npm start
```

Par défaut, l’interface est disponible sur :  
👉 `http://localhost:4200`

---

## 🔐 Authentification

- L'application utilise **JWT** pour sécuriser les échanges.
- Un rôle `CLIENT` peut initier un chat.
- Un rôle `SAV` voit la file d’attente des chats à traiter.
- Les tokens JWT sont inclus dans le header `Authorization: Bearer <token>`.

---

## 💬 Fonctionnalités principales

- **Register / Login sécurisé** (JWT)
- **WebSocket avec STOMP + SockJS**
- **Client** : peut démarrer une session de chat
- **SAV** : voit les chats en attente, peut répondre en direct
- **Temps réel** via STOMP/WebSocket
- **Messages persistés** en base PostgreSQL

---

## 📝 Notes

- Le projet est un PoC, non prévu pour production.
- Le backend utilise `@EnableWebSecurity` avec Spring Security 6 et OAuth2 Resource Server.
- Les rôles sont définis dans les tokens JWT.
