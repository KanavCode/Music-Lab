# MusicLab API Reference
## AJT Semester Project — REST Endpoints (Unit 6/7)

| # | Endpoint | Method | AJT Unit | Description | Expected Status |
|---|----------|--------|----------|-------------|-----------------|
| 1 | /api/v1/market/tracks | GET | Unit 4, 7 | Fetch all marketplace tracks from Supabase | 200 OK |
| 2 | /api/v1/market/buy | POST | Unit 4, 7, 8 | Purchase track — ACID transaction + Strategy pattern pricing | 200 OK |
| 3 | /api/v1/market/buy (exclusive) | POST | Unit 4 | Insufficient funds — proves @Transactional rollback | 402 Payment Required |
| 4 | /api/v1/studio/save | POST | Unit 2, 4, 7 | Serialize project via ObjectOutputStream, persist to PostgreSQL BYTEA | 200 OK |
| 5 | /api/v1/studio/load/{projectId} | GET | Unit 2, 4, 7 | Load BYTEA from DB, deserialize via ObjectInputStream | 200 OK |
| 6 | /api/v1/studio/serialize | POST | Unit 2, 7 | Serialize project to Base64 bytes (no DB) | 200 OK |
| 7 | /api/v1/studio/deserialize | POST | Unit 2, 7 | Deserialize Base64 bytes back to project object | 200 OK |
| 8 | /api/v1/audio/upload | POST | Unit 2, 7 | Upload audio file via Java NIO, store with UUID filename | 201 Created |
| 9 | /api/v1/audio/stream/{filename} | GET | Unit 2, 7 | Stream audio file with correct MIME type | 200 OK |

## How to Run Tests
1. Install VS Code extension: **REST Client** by Huachao Mao
2. Open `API_TESTS.http`
3. Start backend: `cd backend && .\start-supabase.ps1`
4. Click **Send Request** above any request block
5. View response in the right panel

## Design Patterns Visible in API (Unit 8)
- **Strategy Pattern**: POST /api/v1/market/buy — licenseType selects StandardLeaseStrategy or ExclusiveRightsStrategy
- **Singleton Pattern**: AudioEngine and StudioSocketClient — single instance across all requests
- **Facade Pattern**: POST /api/v1/studio/save — ProjectManagementService hides I/O + JPA complexity
- **DAO Pattern**: All endpoints use Repository interfaces (JpaRepository)
