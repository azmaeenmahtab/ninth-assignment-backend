# Backend — Pet Adoption Platform - PawPals

This document describes the backend service for the Pet Adoption platform: architecture, folder layout, available operations (API), environment variables, dependencies, and local run/deployment instructions.

## Overview
The backend is a Node.js + Express API that uses MongoDB for persistence. It exposes RESTful JSON endpoints used by the Next.js frontend. Authentication/authorization is done via JWTs verified with JWKS (see `middlewares/verifyTokenMiddleware.js`). The service handles pet listings, adoption requests, and owner approval flows.

## Architecture (high level)
- Server: Express app (`index.js`) that mounts route handlers and middlewares
- Database: MongoDB connection managed in `db.js`
- Auth: JWT verification middleware (`middlewares/verifyTokenMiddleware.js`) using JWKS/JWT tokens
- Routes: Each route file under `routes/` implements a specific resource operation (listed below)

Diagram (conceptual)

Frontend (Next.js) -> HTTP(S) -> Backend (Express) -> MongoDB

## Folder structure
- `index.js` — app entry, middleware & route registration
- `db.js` — MongoDB connection helper
- `middlewares/verifyTokenMiddleware.js` — JWT verification middleware
- `routes/` — route handlers:
  - `add-pet.route.js`
  - `get-all-pets.route.js`
  - `get-single-pet.route.js`
  - `get-listing.route.js`
  - `update-pet.route.js`
  - `delete-listing.route.js`
  - `request-adoption.route.js`
  - `adoption-requests.route.js`
  - `cancel-request.route.js`

## API surface (inferred from route files)
Note: the exact path prefixes are defined in `index.js` and the route files — check the files for precise paths. The mappings below are conventional and reflect the route filenames.

- Add a pet
  - Method: POST
  - Path: `/api/pets` (implemented in `add-pet.route.js`)
  - Auth: required (owner)
  - Body (example):
    ```json
    {
      "name": "Buddy",
      "type": "Dog",
      "age": 3,
      "description": "Friendly lab mix",
      "images": ["/url/to/image.jpg"]
    }
    ```

- Get all pets
  - Method: GET
  - Path: `/api/pets` (`get-all-pets.route.js`)
  - Query params: `q` (search), `type`, `page`, `limit`, etc.

- Get single pet
  - Method: GET
  - Path: `/api/pets/:id` (`get-single-pet.route.js`)

- Get listing (possibly owner view)
  - Method: GET
  - Path: `/api/listing/:id` (`get-listing.route.js`)

- Update a pet
  - Method: PUT
  - Path: `/api/pets/:id` (`update-pet.route.js`)
  - Auth: required (owner)

- Delete a listing
  - Method: DELETE
  - Path: `/api/pets/:id` (`delete-listing.route.js`)
  - Auth: required (owner)

- Request adoption
  - Method: POST
  - Path: `/api/pets/:id/request` (`request-adoption.route.js`)
  - Auth: required (requester)

- Adoption requests (list / owner actions)
  - Method: GET / POST
  - Path: `/api/requests` or `/api/requests/:id` (`adoption-requests.route.js`)
  - Actions: owner can view requests and approve; approving should update pet status to `adopted`.

- Cancel request
  - Method: DELETE
  - Path: `/api/requests/:id` (`cancel-request.route.js`)

Response format
- Standard responses are JSON. Typical shape:
  ```json
  { "success": true, "data": { ... }, "message": "Optional message" }
  ```

## Authentication / Authorization
- The backend expects an `Authorization: Bearer <token>` header for protected endpoints.
- Tokens are verified using JWKS/JWT in `middlewares/verifyTokenMiddleware.js`. The middleware attaches the verified user principal to the request (e.g., `req.user`) for downstream handlers.

## Environment variables
Create a `.env` in the `backend/` directory (copy from `.env.example` if present) and set the following:
- `MONGODB_URI` — MongoDB connection string
- `PORT` — port for the Express server (optional, default often 3000 or 4000)
- `BASE_URL` — backend base URL (used for JWKS or callback generation)
- `FRONTEND_URL` — allowed CORS origin

## Dependencies
Main dependencies (check `package.json` for exact versions):
- `express` — web framework
- `mongodb` (or `mongoose`) — database driver
- `dotenv` — environment loading
- `cors` — CORS support
- `jose` — JWT/JWKS verification
- `nodemon` — dev server auto-reload (dev)

## Local development
1. Copy environment variables:
```bash
cd backend
copy .env.example .env
```
2. Install and run:
```bash
npm install
npm run dev
```
3. By default the server will listen on `http://localhost:<PORT>`.

Tips
- Ensure `MONGODB_URI` is reachable (local MongoDB or MongoDB Atlas).
- Set `FRONTEND_URL` to your frontend dev URL (e.g., `http://localhost:3000`) to allow CORS.

## Example curl requests
- List pets
```bash
curl -sS "http://localhost:4000/api/pets"
```
- Add pet (authenticated)
```bash
curl -X POST "http://localhost:4000/api/pets" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Buddy","type":"Dog","age":3}'
```
- Request adoption
```bash
curl -X POST "http://localhost:4000/api/pets/<PET_ID>/request" \
  -H "Authorization: Bearer <TOKEN>"
```

## Deployment
- Deploy the backend to Render, Heroku, Fly, or your preferred Node host.
- Set production environment variables (`MONGODB_URI`, `BASE_URL`, `FRONTEND_URL`).
- Use a process manager (or the host's build/deploy flow) to run `npm start`.

## Troubleshooting
- If routes return 401, verify the `Authorization` header and token pairing with configured JWKS.
- If DB connection fails, verify `MONGODB_URI` and network access (IP allowlist on Atlas).

## Next steps / Improvements
- Add automated tests for routes (supertest + jest).
- Add request validation (e.g., `express-validator` or `zod`).
- Centralize response format and error handling middleware.

---
If you'd like, I can (1) add an example Postman collection, (2) include real sample responses by inspecting route handlers, or (3) add unit/integration test stubs. Which would you prefer?
