# Manaliyo Backend – API Endpoints Reference

This document lists **all API endpoints** exposed by the current Strapi-based **manaliyo-backend**. Use it as the contract when rewriting the backend in **Java / Spring Boot / MySQL** so the existing React frontend keeps working without changes.

**Base URL:** `http://<host>:<port>/api` (default port: 1337)  
**Auth:** JWT in header: `Authorization: Bearer <token>` (except where marked *Public*).

---

## 1. Authentication (Strapi Users-Permissions Plugin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/local` | Public | Login. Body: `{ "identifier": "<username/email>", "password": "<password>" }`. Returns `{ jwt, user }`. |
| POST | `/auth/local/register` | Public | Register. Body: `{ "username", "email", "password", ... }`. Returns `{ jwt, user }`. |

*Note: Username is used as mobile number (formatted). JWT is used for all other authenticated endpoints.*

---

## 2. OTP & User (Custom – otp-verification API)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/otp/send` | Public | Send OTP to mobile. Body: `{ "mobile": "<number>" }`. Returns `{ message, data }`. In dev, OTP can be bypassed (see controller). |
| POST | `/otp/verify` | Public | Verify OTP. Body: `{ "mobile", "otp" }`. Returns `{ message, jwt, user }`. |
| GET | `/user/all-info/:mobile` | Public* | Get full user profile by mobile (with relations). Returns `{ code: 100, message, data: { user } }`. |
| POST | `/user/users-for-matches` | Public* | Get users for matching. Body: `{ "currentUserId", "searchOptions": { "gender?", "religion?", "district?", "age?" } }`. Returns `{ code: 100, data: { users } }`. |

*Paths are under the same API; in Strapi they live under the `otp-verification` content-type API.*

---

## 3. Chat (Custom + CRUD)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chat/create` | Required | Create chat message. Body: `{ "sender": <userId>, "receiver": <userId>, "message": "<text>" }`. Returns `{ code: 100, message, data }`. |
| GET | `/chat/userchat/:sender/:receiver` | Required | Get conversation between two users. Returns `{ code: 100, data: chats }`. |
| GET | `/chats` | - | List chats (Strapi CRUD). |
| GET | `/chats/:id` | - | Get one chat. |
| POST | `/chats` | - | Create chat (Strapi CRUD). |
| PUT | `/chats/:id` | - | Update chat. |
| DELETE | `/chats/:id` | - | Delete chat. |

---

## 4. Request (Match / Like – Custom + CRUD)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/request/create` | Required | Create or accept match request. Body: `{ "to_user": <id>, "from_user": <id> }`. Returns `{ code: 100|101|102, message[, data] }` (101 = match, 102 = already sent/connected). |
| GET | `/request/incoming/:to_user` | Required | Incoming requests for user. Returns `{ code: 100, data: requests }` (populated `from_user`). |
| GET | `/request/sent/:from_user` | Required | Sent requests. Returns `{ code: 100, data: requests }` (populated `to_user`). |
| GET | `/request/match/:from_user` | Required | Accepted matches (both directions). Returns `{ code: 100, data: requests }`. |
| GET | `/requests` | - | List requests (Strapi CRUD). |
| GET | `/requests/:id` | - | Get one request. |
| PUT | `/requests/:id` | - | Update request (e.g. accept). |
| DELETE | `/requests/:id` | - | Delete request. |

---

## 5. Hobby / Interests (Custom)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/hobby/create` | Required | Create multiple hobbies. Body: `{ "hobbyDetails": [ { ...hobbyFields }, ... ] }`. Returns `{ code: 100, message }`. |
| PUT | `/hobby/update` | Required | Update multiple hobbies. Body: `{ "hobbyDetails": [ { "id", ...hobbyFields }, ... ] }`. Returns `{ code: 100, message }`. |

---

## 6. Image Upload (Custom)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/upload/img` | Required | Upload image (multipart). Form: `img` (file), `userId`, `imageNumber`. Compresses (Tinify), uploads to S3, stores in `user-image` (image1–image4). Returns `{ message, userDataId }`. |

*Frontend also uses Strapi default upload:*

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/upload` | Required | Strapi default upload. Form: `files` (file(s)). Returns array of uploaded file objects (id, url, etc.). Used for profile_pic and gallery. |

---

## 7. Users (Strapi Users-Permissions)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | Required | Current user (with relations as configured). |
| GET | `/users/:id` | Required | User by id (permissions apply). |
| PUT | `/users/:id` | Required | Update user. Body: user fields (e.g. profile_pic, gallery, approve). |

*User model includes relations: basic_information, profile_pic, gallery, educations, personal_information, family_background, interests_and_hobbies, partner_preference, lifestyle_habit, location_information, occupation_and_finance, contact_information, to_requests, from_requests, etc.*

---

## 8. Content-Type CRUD Endpoints (Strapi Core Router)

All of these follow Strapi’s REST convention: list (with pagination), get one, create, update, delete. Query params: `pagination[page]`, `pagination[pageSize]`, `filters`, `populate`, etc.

| Resource | List | Get One | Create | Update | Delete |
|----------|------|---------|--------|--------|--------|
| **basicinformation** | GET `/basicinformations` | GET `/basicinformations/:id` | POST `/basicinformations` | PUT `/basicinformations/:id` | DELETE `/basicinformations/:id` |
| **behavioral-trait** | GET `/behavioral-traits` | GET `/behavioral-traits/:id` | POST `/behavioral-traits` | PUT `/behavioral-traits/:id` | DELETE `/behavioral-traits/:id` |
| **contactinformation** | GET `/contactinformations` | GET `/contactinformations/:id` | POST `/contactinformations` | PUT `/contactinformations/:id` | DELETE `/contactinformations/:id` |
| **education** | GET `/educations` | GET `/educations/:id` | POST `/educations` | PUT `/educations/:id` | DELETE `/educations/:id` |
| **family-background** | GET `/family-backgrounds` | GET `/family-backgrounds/:id` | POST `/family-backgrounds` | PUT `/family-backgrounds/:id` | DELETE `/family-backgrounds/:id` |
| **interests-and-hobbie** | GET `/interests-and-hobbies` | GET `/interests-and-hobbies/:id` | POST `/interests-and-hobbies` | PUT `/interests-and-hobbies/:id` | DELETE `/interests-and-hobbies/:id` |
| **lifestyle-habit** | GET `/lifestyle-habits` | GET `/lifestyle-habits/:id` | POST `/lifestyle-habits` | PUT `/lifestyle-habits/:id` | DELETE `/lifestyle-habits/:id` |
| **location-information** | GET `/location-informations` | GET `/location-informations/:id` | POST `/location-informations` | PUT `/location-informations/:id` | DELETE `/location-informations/:id` |
| **occupation-and-finance** | GET `/occupation-and-finances` | GET `/occupation-and-finances/:id` | POST `/occupation-and-finances` | PUT `/occupation-and-finances/:id` | DELETE `/occupation-and-finances/:id` |
| **otp-verification** | GET `/otp-verifications` | GET `/otp-verifications/:id` | POST `/otp-verifications` | PUT `/otp-verifications/:id` | DELETE `/otp-verifications/:id` |
| **partner-preference** | GET `/partner-preferences` | GET `/partner-preferences/:id` | POST `/partner-preferences` | PUT `/partner-preferences/:id` | DELETE `/partner-preferences/:id` |
| **personal-information** | GET `/personal-informations` | GET `/personal-informations/:id` | POST `/personal-informations` | PUT `/personal-informations/:id` | DELETE `/personal-informations/:id` |
| **subscription** | GET `/subscriptions` | GET `/subscriptions/:id` | POST `/subscriptions` | PUT `/subscriptions/:id` | DELETE `/subscriptions/:id` |
| **user-image** | GET `/user-images` | GET `/user-images/:id` | POST `/user-images` | PUT `/user-images/:id` | DELETE `/user-images/:id` |

*Request body for create/update uses Strapi format (e.g. `{ "data": { ...attributes } }` in v4). Frontend may send flat JSON; ensure Spring Boot accepts the same shape.*

---

## 9. WebSocket (Socket.IO)

- **URL:** Same host/port as HTTP server.
- **Auth:** `auth: { token: "<jwt>" }` on connect; connection is disconnected if no token.
- **Events:**
  - **Client → Server:** `sendMessage` – payload: `{ sender, receiver, data }` (message data).
  - **Server → Client:** `newMessage-<sortedIds>` – e.g. `newMessage-12-34` for users 12 and 34. Payload: message data.

*Used for real-time chat. Replicate in Spring Boot with WebSocket/STOMP or equivalent.*

---

## 10. Frontend Usage Summary (Paths relative to `/api`)

For the React app, these are the paths actually used (for parity in the new backend):

- `POST /auth/local`, `POST /auth/local/register`
- `POST /otp/send`, `POST /otp/verify`
- `GET /user/all-info/:mobile`
- `POST /user/users-for-matches`
- `GET /basicinformations`, `POST /basicinformations`, `PUT /basicinformations/:id`
- `GET /personal-informations`, `POST /personal-informations`, `PUT /personal-informations/:id`
- `GET /partner-preferences`, `POST /partner-preferences`, `PUT /partner-preferences/:id`
- `GET /lifestyle-habits`, `POST /lifestyle-habits`, `PUT /lifestyle-habits/:id`
- `POST /hobby/create`, `PUT /hobby/update`
- `GET /educations`, `POST /educations`, `PUT /educations/:id`
- `GET /occupation-and-finances`, `POST /occupation-and-finances`, `PUT /occupation-and-finances/:id`
- `GET /location-informations`, `POST /location-informations`, `PUT /location-informations/:id`
- `GET /family-backgrounds`, `POST /family-backgrounds`, `PUT /family-backgrounds/:id`
- `PUT /users/:id`
- `POST /upload` (Strapi upload for profile/gallery)
- `POST /chat/create`, `GET /chat/userchat/:sender/:receiver`
- `GET /request/incoming/:userId`, `GET /request/sent/:userId`, `GET /request/match/:userId`, `POST /request/create`
- `PUT /requests/:id`, `DELETE /requests/:id`

*Note: The frontend references `PUT /user-details/:id` and email OTP endpoints (`/user/send-email-verify/:userid`, `/user/verify-otp-email/:otp/:userid`); these are not implemented in the current backend and can be added in the Spring Boot version if needed.*

---

## 11. Response Conventions

- **Success (custom):** Often `{ code: 100, message: "<text>", data?: ... }`. Code `101` = match found, `102` = already sent/connected.
- **Strapi CRUD:** Returns `{ data }` (single or array), with optional `meta.pagination`.
- **Errors:** `4xx`/`5xx` with body `{ error: "<message>" }` or Strapi error format.

---

## 12. Database / Schema Notes for Spring Boot + MySQL

- **User** (from users-permissions): username (mobile), email, password, approve, profile_pic, gallery, and relations to all profile entities.
- **Profile entities** (one-to-one or one-to-many per user): basicinformation, personal-information, family-background, partner-preference, lifestyle-habit, location-information, occupation-and-finance, contactinformation, behavioral-trait, user-image (image1–image4 URLs).
- **education**, **interests-and-hobbie**: one-to-many per user.
- **request:** to_user, from_user, accepted (match request/connection).
- **chat:** sender, receiver, message.
- **otp-verification:** linked to user; stores latestOtp.

Replicate these relations and field names (or map them explicitly in Spring) so API request/response bodies stay compatible with the React app.

---

*Generated from the current manaliyo-backend (Strapi 4). Use this as the single source of truth for the Java/Spring Boot/MySQL rewrite.*
