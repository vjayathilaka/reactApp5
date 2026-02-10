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




# Manaliyo Backend – Domain Entities, Attributes & Relationships

This document describes **all entities** (content types) in the Manaliyo backend: their attributes, types, and relationships. Use it to design your **MySQL schema** and **Spring Boot entities** when rewriting the backend.

**Conventions:**
- **Relation owner**: side that stores the foreign key (e.g. `user_Id` on BasicInformation points to User).
- **InversedBy** / **MappedBy**: Strapi terms for the other side of the relation; in MySQL the FK is on the “owner” side.
- **Enums** are listed with all allowed values.

---

## 1. Entity Relationship Overview

```
                    ┌─────────────────┐
                    │  Subscription   │
                    └────────┬────────┘
                             │ 1:N (users)
                             ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                    User                                             │
│  (core: username, email, password, role, approve, profile_pic, gallery, ...)        │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬─┘
   │      │      │      │      │      │      │      │      │      │      │      │
   │ 1:1  │ 1:1  │ 1:1  │ 1:1  │ 1:1  │ 1:1  │ 1:1  │ 1:1  │ 1:1  │ 1:N  │ 1:N  │ ...
   ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
 Basic  Contact Personal Family Partner Lifestyle Location Occup  Educ  Interests
  Info    Info     Info   Backgr  Pref    Habit     Info   &Fin   -ations  &Hobbies
   │      │         │        │      │        │        │      │        │
   └──────┴─────────┴────────┴──────┴────────┴────────┴──────┴────────┘
                    (each has user_Id → User)

   User 1:N Request (to_user, from_user)  →  Match/connection requests
   User 1:N Chat (sender, receiver)       →  Chat messages
   User 1:1 OtpVerification               →  Latest OTP
   User 1:1 UserImage                     →  image1–image4 URLs
   User 1:1 BehavioralTrait              →  (optional)
```

---

## 2. User (plugin::users-permissions.user)

**Table name (Strapi):** `up_users`  
**API:** `/users` (Strapi Users-Permissions plugin)

Central entity: app user (mobile/username, email, profile data, and relations to all profile entities).

### Attributes

| Attribute            | Type      | Required | Default | Notes |
|----------------------|-----------|----------|---------|--------|
| id                   | integer   | (PK)     | -       | Auto |
| username             | string    | yes      | -       | min 3, unique. In app = mobile number (e.g. 94771234567) |
| email                | email     | yes      | -       | min 6 |
| password             | password  | -        | -       | min 6, private (do not expose in API) |
| provider             | string    | -        | -       | e.g. "local" |
| resetPasswordToken   | string    | -        | -       | private |
| confirmationToken    | string    | -        | -       | private |
| confirmed            | boolean   | -        | false   | |
| blocked              | boolean   | -        | false   | |
| referenceNo          | string    | -        | -       | |
| publish              | boolean   | -        | true    | |
| approve              | boolean   | -        | true    | Profile visible in matches when true |
| payment_type         | enumeration | -      | -       | Values: `free` |
| profile_type         | enumeration | -      | -       | Values: `myself` |
| profile_pic          | media     | -        | -       | Single (images/files/videos/audios) |
| gallery              | media     | -        | -       | Multiple (images/files/videos/audios) |
| role                 | relation  | -        | -       | manyToOne → Role (plugin) |
| basic_information    | relation  | -        | -       | oneToOne ← BasicInformation (mappedBy) |
| contact_information | relation  | -        | -       | oneToOne ← ContactInformation (mappedBy) |
| personal_information| relation  | -        | -       | oneToOne ← PersonalInformation (mappedBy) |
| family_background    | relation  | -        | -       | oneToOne ← FamilyBackground (mappedBy) |
| interests_and_hobbies | relation | -        | -       | oneToMany ← InterestsAndHobbie (mappedBy) |
| lifestyle_habit      | relation  | -        | -       | oneToOne ← LifestyleHabit (mappedBy) |
| occupation_and_finance | relation | -        | -       | oneToOne ← OccupationAndFinance (mappedBy) |
| educations           | relation  | -        | -       | oneToMany ← Education (mappedBy) |
| location_information| relation  | -        | -       | oneToOne ← LocationInformation (inversedBy) |
| user_image           | relation  | -        | -       | oneToOne ← UserImage (inversedBy) |
| partner_preference   | relation  | -        | -       | oneToOne ← PartnerPreference (inversedBy) |
| behavioral_trait     | relation  | -        | -       | oneToOne ← BehavioralTrait (mappedBy) |
| otp_verification     | relation  | -        | -       | oneToOne ← OtpVerification (mappedBy) |
| to_requests         | relation  | -        | -       | oneToMany ← Request as to_user (mappedBy) |
| from_requests       | relation  | -        | -       | oneToMany ← Request as from_user (mappedBy) |
| sender_chats        | relation  | -        | -       | oneToMany ← Chat as sender (mappedBy) |
| receiver_chats      | relation  | -        | -       | oneToMany ← Chat as receiver (mappedBy) |
| chats               | relation  | -        | -       | oneToMany ← Chat as receiver (mappedBy) – alias |
| subscription        | relation  | -        | -       | manyToOne → Subscription (inversedBy users) |

*Strapi adds `createdAt`, `updatedAt` where applicable.*

---

## 3. BasicInformation (api::basicinformation.basicinformation)

**Table name (Strapi):** `basicinformations`  
**API:** `/basicinformations`

Core profile: name, demographics, location, religion, profession, media.

### Attributes

| Attribute   | Type     | Required | Notes |
|------------|----------|----------|--------|
| id         | integer  | PK       | Auto |
| firstName  | string   | -        | |
| lastName   | string   | -        | |
| age        | integer  | -        | |
| birthDate  | date     | -        | |
| description| text     | -        | |
| profession | string   | -        | |
| gender     | enumeration | -     | Values: `male`, `female`, `other`, `not-specify` |
| marital_status | enumeration | -  | Values: `single`, `married`, `divorced`, `widowed`, `separated` |
| religion   | enumeration | -     | Values: `buddhism`, `hinduism`, `islam`, `christianity` |
| district   | enumeration | -     | Values: `ampara`, `anuradhapura`, `badulla`, `batticaloa`, `colombo`, `galle`, `gampaha`, `hambantota`, `jaffna`, `kalutara`, `kandy`, `kegalle`, `kilinochchi`, `kurunegala`, `mannar`, `matale`, `matara`, `monaragala`, `mullaitivu`, `nuwara eliya`, `polonnaruwa`, `puttalam`, `ratnapura`, `trincomalee`, `vavuniya` |
| profilePic | media    | -        | Multiple (images/files/videos/audios) |
| gallery    | media    | -        | Multiple (images only) |
| user_Id    | relation | -        | oneToOne → User (inversedBy: basic_information). **FK on this side.** |

---

## 4. ContactInformation (api::contactinformation.contactinformation)

**Table name (Strapi):** `contactinformations`  
**API:** `/contactinformations`

Contact details.

### Attributes

| Attribute | Type     | Required | Notes |
|-----------|----------|----------|--------|
| id        | integer  | PK       | Auto |
| email     | email    | -        | |
| mobile    | string   | -        | |
| user_Id   | relation | -        | oneToOne → User (inversedBy: contact_information). **FK on this side.** |

---

## 5. PersonalInformation (api::personal-information.personal-information)

**Table name (Strapi):** `personal_informations`  
**API:** `/personal-informations`

Physical appearance.

### Attributes

| Attribute  | Type     | Required | Notes |
|------------|----------|----------|--------|
| id         | integer  | PK       | Auto |
| height     | integer  | -        | |
| weight     | integer  | -        | |
| complexion | string   | -        | |
| bodyType   | string   | -        | |
| user_Id    | relation | -        | oneToOne → User (inversedBy: personal_information). **FK on this side.** |

---

## 6. FamilyBackground (api::family-background.family-background)

**Table name (Strapi):** `family_backgrounds`  
**API:** `/family-backgrounds`

Family structure and background.

### Attributes

| Attribute        | Type     | Required | Notes |
|------------------|----------|----------|--------|
| id               | integer  | PK       | Auto |
| motherName       | string   | -        | |
| fatherName       | string   | -        | |
| parentsInformation | string | -        | |
| sistersCount     | integer  | -        | |
| brothersCount    | integer  | -        | |
| siblingsDetails  | string   | -        | |
| nativePlace      | string   | -        | |
| familyValues     | string   | -        | |
| user_Id          | relation | -        | oneToOne → User (inversedBy: family_background). **FK on this side.** |

---

## 7. PartnerPreference (api::partner-preference.partner-preference)

**Table name (Strapi):** `partner_preferences`  
**API:** `/partner-preferences`

Desired partner criteria.

### Attributes

| Attribute        | Type        | Required | Notes |
|------------------|-------------|----------|--------|
| id               | integer     | PK       | Auto |
| age              | json        | -        | e.g. [min, max] |
| height           | integer     | -        | |
| city             | string      | -        | |
| gender           | enumeration | -        | Values: `male`, `female`, `other`, `not-specify` |
| highest_education| enumeration | -        | Values: `none`, `ordinary-level`, `advanced-level`, `diploma`, `bachelors`, `postgraduate-diploma`, `masters`, `phd`, `above-phd` |
| religion         | enumeration | -        | Values: `buddhism`, `hinduism`, `islam`, `christianity` |
| marital_status   | enumeration | -        | Values: `none`, `single`, `married`, `divorced`, `widowed`, `separated` |
| drinking         | enumeration | -        | Values: `no`, `occasionally`, `yes` |
| smoking          | enumeration | -        | Values: `no`, `occasionally`, `yes` |
| district         | enumeration | -        | Same 25 districts as BasicInformation |
| user_Id          | relation    | -        | oneToOne → User (mappedBy: partner_preference). **FK on this side.** |

---

## 8. Education (api::education.education)

**Table name (Strapi):** `educations`  
**API:** `/educations`

One user can have multiple education entries (primary, secondary, professional).

### Attributes

| Attribute          | Type        | Required | Notes |
|--------------------|-------------|----------|--------|
| id                 | integer     | PK       | Auto |
| institute          | string      | -        | |
| description        | string      | -        | |
| qualification_level| enumeration | -        | Values: `none`, `ordinary-level`, `advanced-level`, `diploma`, `bachelors`, `postgraduate-diploma`, `masters`, `phd`, `above-phd` |
| completion_date    | date        | -        | |
| education_type     | enumeration | yes      | Values: `professional`, `primary`, `secondary` |
| user_Id            | relation    | -        | manyToOne → User (inversedBy: educations). **FK on this side.** |

---

## 9. InterestsAndHobbie (api::interests-and-hobbie.interests-and-hobbie)

**Table name (Strapi):** `interests_and_hobbies`  
**API:** `/interests-and-hobbies`

One user can have multiple hobbies/interests.

### Attributes

| Attribute  | Type     | Required | Notes |
|------------|----------|----------|--------|
| id         | integer  | PK       | Auto |
| hobby_name| string   | -        | |
| description| string   | -        | |
| user_Id    | relation | -        | manyToOne → User (inversedBy: interests_and_hobbies). **FK on this side.** |

---

## 10. LifestyleHabit (api::lifestyle-habit.lifestyle-habit)

**Table name (Strapi):** `lifestyle_habits`  
**API:** `/lifestyle-habits`

Drinking and smoking habits.

### Attributes

| Attribute | Type        | Required | Notes |
|-----------|-------------|----------|--------|
| id        | integer     | PK       | Auto |
| drinking  | enumeration | -        | Values: `no`, `occasionally`, `yes` |
| smoking   | enumeration | -        | Values: `no`, `occasionally`, `yes` |
| user_Id   | relation    | -        | oneToOne → User (inversedBy: lifestyle_habit). **FK on this side.** |

---

## 11. LocationInformation (api::location-information.location-information)

**Table name (Strapi):** `location_informations`  
**API:** `/location-informations`

Address and residency.

### Attributes

| Attribute      | Type        | Required | Notes |
|----------------|-------------|----------|--------|
| id             | integer     | PK       | Auto |
| streetAddress  | string      | -        | |
| zipCode        | string      | -        | |
| city           | string      | -        | |
| country        | string      | -        | |
| residencyStatus| enumeration | -        | Values: `resident`, `non-resident` |
| user_Id        | relation    | -        | oneToOne → User (mappedBy: location_information). **FK on User side** (LocationInformation is inversedBy). |

*In Strapi, relation is oneToOne with User; `mappedBy` means User owns the FK. In MySQL you can put `user_id` on `location_informations` for simplicity.*

---

## 12. OccupationAndFinance (api::occupation-and-finance.occupation-and-finance)

**Table name (Strapi):** `occupation_and_finances`  
**API:** `/occupation-and-finances`

Job and income.

### Attributes

| Attribute        | Type     | Required | Notes |
|------------------|----------|----------|--------|
| id               | integer  | PK       | Auto |
| occupation       | string   | -        | |
| occupationDetails| string   | -        | |
| employerName     | string   | -        | |
| salary           | integer  | -        | |
| user_Id          | relation | -        | oneToOne → User (inversedBy: occupation_and_finance). **FK on this side.** |

---

## 13. BehavioralTrait (api::behavioral-trait.behavioral-trait)

**Table name (Strapi):** `behavioral_traits`  
**API:** `/behavioral-traits`

Optional behavioral trait; relation owned by User.

### Attributes

| Attribute | Type     | Required | Notes |
|-----------|----------|----------|--------|
| id        | integer  | PK       | Auto |
| userId    | integer  | -        | Denormalized; relation is the source of truth |
| user      | relation | -        | oneToOne → User (mappedBy: behavioral_trait). **FK on User side.** |

---

## 14. UserImage (api::user-image.user-image)

**Table name (Strapi):** `user_images`  
**API:** `/user-images`

Stores up to 4 image URLs per user (e.g. S3 URLs from custom upload).

### Attributes

| Attribute | Type    | Required | Notes |
|-----------|---------|----------|--------|
| id        | integer | PK       | Auto |
| image1    | string  | -        | URL |
| image2    | string  | -        | URL |
| image3    | string  | -        | URL |
| image4    | string  | -        | URL |
| user_Id   | relation| -        | oneToOne → User (mappedBy: user_image). **FK on User side.** |

---

## 15. OtpVerification (api::otp-verification.otp-verification)

**Table name (Strapi):** `otp_verifications`  
**API:** `/otp-verifications` (also custom routes `/otp/send`, `/otp/verify`)

Stores latest OTP for a user (one row per user, updated on each send).

### Attributes

| Attribute          | Type     | Required | Notes |
|--------------------|----------|----------|--------|
| id                 | integer  | PK       | Auto |
| latestOtp          | string   | -        | e.g. "1234" |
| expirationTimestamp| integer  | -        | Optional expiry |
| user               | relation | -        | oneToOne → User (mappedBy: otp_verification). **FK on this side.** |

---

## 16. Request (api::request.request)

**Table name (Strapi):** `requests`  
**API:** `/requests` (and custom `/request/create`, `/request/incoming/:id`, etc.)

Match/connection request: one user sends a request to another; when accepted, it becomes a “match”.

### Attributes

| Attribute  | Type     | Required | Default | Notes |
|------------|----------|----------|---------|--------|
| id         | integer  | PK       | -       | Auto |
| to_user    | relation | -        | -       | manyToOne → User (inversedBy: to_requests). **FK on this side.** Recipient. |
| from_user  | relation | -        | -       | manyToOne → User (inversedBy: from_requests). **FK on this side.** Sender. |
| accepted   | boolean  | yes      | false   | true = match (both can chat) |

---

## 17. Chat (api::chat.chat)

**Table name (Strapi):** `chats`  
**API:** `/chats` (and custom `/chat/create`, `/chat/userchat/:sender/:receiver`)

A single chat message between two users.

### Attributes

| Attribute | Type     | Required | Notes |
|-----------|----------|----------|--------|
| id        | integer  | PK       | Auto |
| message   | text     | yes      | |
| sender    | relation | -        | manyToOne → User (inversedBy: sender_chats). **FK on this side.** |
| receiver  | relation | -        | manyToOne → User (inversedBy: receiver_chats). **FK on this side.** |

---

## 18. Subscription (api::subscription.subscription)

**Table name (Strapi):** `subscriptions`  
**API:** `/subscriptions`

Subscription plan; many users can have one subscription.

### Attributes

| Attribute   | Type     | Required | Notes |
|-------------|----------|----------|--------|
| id          | integer  | PK       | Auto |
| name        | string   | -        | |
| code        | string   | -        | |
| description | text     | -        | |
| price       | decimal  | -        | |
| discount    | decimal  | -        | |
| users       | relation | -        | oneToMany ← User (mappedBy: subscription). **FK on User side.** |

---

## 19. Media / Upload (Strapi core)

Strapi uses a **media library** for `profile_pic`, `gallery`, and `profilePic`/`gallery` on BasicInformation. Typically stored in a table like `files` or `upload_file` with: id, name, url, mime, size, etc. In Spring Boot you can store URL or file id and serve files from disk/S3.

---

## 20. Role (plugin::users-permissions.role)

**Table name (Strapi):** `up_roles`  
Users have a manyToOne to Role (Authenticated, Public, etc.). For the app you may only need one “user” role; FK on User.

---

## 21. Summary: Foreign Keys for MySQL

| Table (entity)           | Holds FK to   | Column name(s)     |
|--------------------------|---------------|---------------------|
| basicinformations        | User          | user_id             |
| contactinformations      | User          | user_id             |
| personal_informations    | User          | user_id             |
| family_backgrounds       | User          | user_id             |
| partner_preferences      | User          | user_id             |
| educations               | User          | user_id             |
| interests_and_hobbies   | User          | user_id             |
| lifestyle_habits         | User          | user_id             |
| location_informations    | User          | user_id             |
| occupation_and_finances  | User          | user_id             |
| user_images              | User          | user_id             |
| otp_verifications        | User          | user_id             |
| behavioral_traits       | User          | user_id (if FK here)|
| requests                 | User          | to_user_id, from_user_id |
| chats                    | User          | sender_id, receiver_id  |
| up_users                 | Role          | role_id             |
| up_users                 | Subscription  | subscription_id     |

---

## 22. Enum Reference (for MySQL ENUM or lookup tables)

| Enum name           | Values |
|---------------------|--------|
| gender              | male, female, other, not-specify |
| marital_status      | single, married, divorced, widowed, separated (plus `none` in partner_preference) |
| religion            | buddhism, hinduism, islam, christianity |
| district            | ampara, anuradhapura, badulla, batticaloa, colombo, galle, gampaha, hambantota, jaffna, kalutara, kandy, kegalle, kilinochchi, kurunegala, mannar, matale, matara, monaragala, mullaitivu, nuwara eliya, polonnaruwa, puttalam, ratnapura, trincomalee, vavuniya |
| qualification_level / highest_education | none, ordinary-level, advanced-level, diploma, bachelors, postgraduate-diploma, masters, phd, above-phd |
| education_type      | professional, primary, secondary |
| drinking / smoking  | no, occasionally, yes |
| residencyStatus    | resident, non-resident |
| payment_type       | free |
| profile_type       | myself |

---

*Use this document together with **API_ENDPOINTS.md** for the Spring Boot + MySQL rewrite.*

---

*Generated from the current manaliyo-backend (Strapi 4). Use this as the single source of truth for the Java/Spring Boot/MySQL rewrite.*
