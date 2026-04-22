# MusicLab — AJT Semester Project Demo Guide

## Tech Stack
- **Backend**: Spring Boot 3.4.3, Java 17, PostgreSQL (Supabase), Flyway, WebSocket (STOMP)
- **Frontend**: Next.js 16, React 19, Tone.js, Zustand, Tailwind CSS
- **Database**: Supabase (hosted PostgreSQL)

---

## How to Start the Project

### Step 1 — Start Backend
```powershell
cd D:/Music-Lab/backend
.\start-supabase.ps1
```
Wait for: `Started MusicLabApplication on port 8080`
Flyway will print: `Successfully applied 2 migrations` (or `Schema is up to date`)

### Step 2 — Start Frontend
```bash
cd D:/Music-Lab/frontend
npm run dev
```
Open: http://localhost:3000

---

## AJT Syllabus — What to Show the Professor

### Unit 2 — Java I/O (ObjectOutputStream / ObjectInputStream)

**What it does**: Saves and loads entire music projects as serialized Java objects stored in PostgreSQL.

**How to demo**:
1. Open http://localhost:3000 (Studio page)
2. Click `+ Add Track` button in the left panel
3. Click `Save` button in the top toolbar
4. Open `backend/API_TESTS.http` in VS Code
5. Click `Send Request` on the GET `/api/v1/studio/load/demo-project-001` block
6. Show the professor the JSON response — this was a Java object stored as bytes in DB

**Code to point to**:
- `backend/src/main/java/com/musiclab/backend/service/ProjectIioService.java`
  - `serializeProject()` — uses ObjectOutputStream
  - `deserializeProject()` — uses ObjectInputStream
- `backend/src/main/java/com/musiclab/backend/entity/ProjectEntity.java`
  - `serialized_data` column — stores the byte array

---

### Unit 3 — Java Networking (WebSockets / STOMP)

**What it does**: Real-time sync between browser tabs when a track is muted.

**How to demo**:
1. Open http://localhost:3000 in **two browser tabs** side by side
2. In Tab 1: Click the `M` (Mute) button on any track in the Studio
3. In Tab 2: The same track shows as muted automatically
4. Open Browser DevTools → Network tab → WS → click the ws-studio connection
5. Show the STOMP frames being sent/received

**Code to point to**:
- `backend/src/main/java/com/musiclab/backend/config/WebSocketConfig.java`
- `backend/src/main/java/com/musiclab/backend/controller/LiveStudioController.java`
- `frontend/src/lib/api/socketClient.ts`

---

### Unit 4 — JDBC/JPA + ACID Transactions

**What it does**: All database operations use Spring Data JPA with @Transactional boundaries.

**How to demo**:
1. Open `backend/API_TESTS.http` in VS Code
2. Run `GET /api/v1/market/tracks` — show tracks coming from Supabase
3. Run `POST /api/v1/market/buy` with licenseType `standard` — show 200 OK + transactionId
4. Run `POST /api/v1/market/buy` with licenseType `exclusive` — show **402 Payment Required**
5. Explain: the wallet deduction was rolled back because of InsufficientFundsException inside @Transactional

**Code to point to**:
- `backend/src/main/java/com/musiclab/backend/service/MarketplaceService.java`
  - `@Transactional purchaseTrack()` — shows the ACID flow
- `backend/src/main/resources/db/migration/` — Flyway V1 and V2 migrations

---

### Unit 6/7 — Servlets and REST API

**What it does**: Full RESTful API with proper HTTP methods, status codes, and JSON responses.

**How to demo**:
1. Open `backend/API_TESTS.md` — show the full endpoint table
2. Run any 3-4 requests from `API_TESTS.http` live
3. Show the Marketplace page at http://localhost:3000/marketplace
4. Point to the **green "Live DB" badge** in the header — proves frontend reads from Supabase

**Code to point to**:
- `backend/src/main/java/com/musiclab/backend/controller/` — all 4 controllers
- `backend/src/main/java/com/musiclab/backend/exception/GlobalExceptionHandler.java`

---

### Unit 8 — Design Patterns

**What it does**: Four design patterns implemented across the codebase.

**How to demo**:

**Strategy Pattern** — License Pricing
- Go to Marketplace, click any track card
- Show Standard Lease price vs Exclusive Rights price (10x difference)
- Code: `backend/src/main/java/com/musiclab/backend/strategy/`
  - `LicensePricingStrategy.java` — interface
  - `StandardLeaseStrategy.java` — returns base price
  - `ExclusiveRightsStrategy.java` — multiplies by 10

**Singleton Pattern** — AudioEngine
- Code: `frontend/src/lib/audio/AudioEngine.ts`
  - `static getInstance()` — enforces single instance
- Code: `frontend/src/lib/api/socketClient.ts`
  - `static getInstance()` — same pattern for WebSocket

**Facade Pattern** — ProjectManagementService
- Code: `backend/src/main/java/com/musiclab/backend/service/ProjectManagementService.java`
  - Single method `saveProjectState()` hides: serialization + DB write + transaction management

**DAO Pattern** — Repositories
- Code: `backend/src/main/java/com/musiclab/backend/repository/`
  - All 4 interfaces extend JpaRepository — standard DAO implementation

---

## Known Limitations (tell the professor honestly)

| Limitation | Reason | Impact |
|-----------|--------|--------|
| Login is mock (localStorage) | JWT auth is out of AJT scope | Functional for demo, not production |
| Audio upload needs backend running | Files stored locally | Works in demo environment |
| MetaMask errors in browser console | Browser extension conflict, not our code | No impact on project |
| WebSocket needs both tabs on same machine | Localhost only | Works in demo environment |

---

## File Structure Overview
Music-Lab/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/musiclab/backend/
│   │   ├── config/                   # CORS, WebSocket, Storage config
│   │   ├── controller/               # REST controllers (Unit 6/7)
│   │   ├── domain/                   # MusicProject, AudioTrack (Unit 2)
│   │   ├── entity/                   # JPA entities (Unit 4)
│   │   ├── exception/                # GlobalExceptionHandler
│   │   ├── repository/               # DAO pattern (Unit 8)
│   │   ├── service/                  # Business logic + Facade pattern
│   │   └── strategy/                 # Strategy pattern (Unit 8)
│   ├── src/main/resources/
│   │   ├── db/migration/             # Flyway V1 (schema) + V2 (seed data)
│   │   └── application.properties   # Supabase config
│   ├── API_TESTS.http                # Live API tests
│   ├── API_TESTS.md                  # Endpoint documentation
│   └── start-supabase.ps1           # Backend startup script
├── frontend/                         # Next.js application
│   ├── src/
│   │   ├── app/                      # Pages (Studio, Marketplace, etc.)
│   │   ├── components/               # UI components
│   │   ├── lib/                      # API clients, AudioEngine, constants
│   │   └── store/                    # Zustand state management
│   └── package.json
├── DATABASE_SCHEMA.sql               # Full Supabase schema (run to reset DB)
└── DEMO_GUIDE.md                     # This file
