# TransCampus API - Quick Reference & CURL Examples

## Quick Start

### 1. Start Backend
```bash
cd backend
java -jar target/transcampus-1.0.0.jar
```
Wait for logs: "✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!"

### 2. Start Frontend
```bash
cd project
npm run dev
```

### 3. Access Frontend
```
http://localhost:5173
```

---

## Test Accounts

| Role | Email | Password | Expected Redirect |
|------|-------|----------|-------------------|
| Admin | admin@transcampus.dz | password123 | /admin |
| Responsable | responsable@transcampus.dz | password123 | /responsible |
| Driver | chauffeur1@transcampus.dz | password123 | /driver |
| Student | ahmed@univ.dz | password123 | /student |

---

## API Testing with CURL

### Step 1: Get JWT Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@transcampus.dz",
    "password": "password123"
  }'
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@transcampus.dz",
    "nom": "Admin",
    "prenom": "TransCampus",
    "role": "ADMIN"
  }
}
```

**Store Token**:
```bash
export TOKEN="<token_from_response>"
```

---

### Step 2: Test Authenticated Endpoints

#### Get Admin KPIs Dashboard
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/dashboard/kpis
```

**Expected Response**:
```json
{
  "totalInscrits": 8,
  "inscriptionsEnAttente": 4,
  "inscriptionsValidees": 4,
  "revenusTotal": 16000.0,
  "lignesActives": 3,
  "busActifs": 4,
  "tauxRemplissage": 3.3333333333333335
}
```

#### Get All Students
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/etudiants
```

#### Get All Drivers
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/chauffeurs
```

#### Get All Buses
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/bus
```

#### Get Responsable Dashboard
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/dashboard/responsable
```

**Expected Response**:
```json
{
  "totalBus": 4,
  "totalLignes": 3,
  "totalTrajets": 0,
  "busActifs": 4,
  "lignesActives": 3
}
```

---

### Step 3: Test Public Endpoints (No Auth Required)

#### Get All Lines
```bash
curl http://localhost:8080/api/lignes
```

**Expected Response**:
```json
[
  {
    "id": "...",
    "nom": "Ligne A - Campus Centre",
    "description": "Liaison centre-ville / campus principal",
    "pointDepart": "Place des Martyrs",
    "pointArrivee": "Campus Principal",
    "estActive": true,
    "arrets": [...]
  },
  ...
]
```

#### Get All Tariffs
```bash
curl http://localhost:8080/api/tarifs
```

**Expected Response**:
```json
[
  {
    "id": "...",
    "typeAbonnement": "MENSUEL",
    "montant": 2000.0,
    "description": "Abonnement mensuel"
  },
  {
    "id": "...",
    "typeAbonnement": "SEMESTRIEL",
    "montant": 10000.0,
    "description": "Abonnement semestriel"
  },
  {
    "id": "...",
    "typeAbonnement": "ANNUEL",
    "montant": 18000.0,
    "description": "Abonnement annuel"
  }
]
```

---

## Testing Driver Dashboard

### 1. Login as Driver
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "chauffeur1@transcampus.dz",
    "password": "password123"
  }'
```

### 2. Get Driver Dashboard
```bash
export DRIVER_TOKEN="<token_from_driver_login>"

curl -H "Authorization: Bearer $DRIVER_TOKEN" \
  http://localhost:8080/api/dashboard/driver
```

**Expected Response**:
```json
{
  "chauffeurNom": "Hadj",
  "chauffeurPrenom": "Mohamed",
  "trajetId": "N/A",
  "ligneName": "N/A",
  "busImmatriculation": "N/A",
  "trajetStatus": "PENDING"
}
```

---

## CORS Test

### Verify CORS Headers
```bash
curl -i -X OPTIONS http://localhost:8080/api/dashboard/kpis \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET"
```

**Expected Response Headers**:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-Client-Info
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

---

## Data Verification

### Check Database Data

Access H2 Console:
```
http://localhost:8080/api/h2-console
```

**Login**:
- Driver: org.h2.Driver
- JDBC URL: jdbc:h2:mem:transcampus
- User Name: sa
- Password: (empty)

**Run SQL Queries**:

Count all users:
```sql
SELECT COUNT(*) as total FROM utilisateur;
-- Expected: 13
```

Count students:
```sql
SELECT COUNT(*) as total FROM utilisateur WHERE role = 'STUDENT';
-- Expected: 8
```

Count buses:
```sql
SELECT COUNT(*) as total FROM bus;
-- Expected: 4
```

Count inscriptions:
```sql
SELECT COUNT(*) as total FROM inscription;
-- Expected: 8
```

Count payments:
```sql
SELECT COUNT(*) as total FROM paiement;
-- Expected: 8
```

---

## Frontend DevTools Testing

### Check Authentication Token
1. Open browser DevTools (F12)
2. Go to Application → LocalStorage
3. Look for key: `token`
4. Verify it contains JWT value

### Check Network Requests
1. Open DevTools → Network tab
2. Login
3. Check requests to `/api/auth/login`
4. Verify response includes token

### Check API Call to Dashboard
1. Navigate to admin dashboard
2. Open Network tab
3. Look for request to `/api/dashboard/kpis`
4. Verify response contains real numbers (not 0s)

### Check for CORS Errors
1. Open DevTools → Console
2. No red errors should appear
3. Warnings about deprecated APIs are OK

---

## Common Issues & Solutions

### 401 Unauthorized
```
Issue: All API calls return 401
Solution: 
- Re-login to get new token
- Clear localStorage: localStorage.clear()
- Check token in DevTools
```

### CORS Errors
```
Issue: "Access to XMLHttpRequest has been blocked by CORS policy"
Solution:
- Clear browser cache (Ctrl+Shift+Delete)
- Restart both backend and frontend
- Verify http://localhost:5173 in cors.allowed-origins
```

### 404 Not Found
```
Issue: GET /api/etudiants returns 404
Solution:
- Endpoint is /etudiants (not /students) - both work now
- Verify token has ADMIN or RESPONSIBLE role
- Check backend is running
```

### All KPIs Show 0
```
Issue: Dashboard shows 0 students, 0 revenue, 0 buses
Solution:
- Check backend logs for "DATABASE SEEDING COMPLETED"
- Restart backend
- Clear H2 database (restart clears it in-memory)
```

---

## Quick Validation Checklist

- [ ] Backend starts without errors
- [ ] DataInitializer logs show seeding complete
- [ ] Admin login successful
- [ ] Redirect to /admin works
- [ ] Dashboard shows: 8 students, 4 buses, 16000 revenue
- [ ] GET /api/etudiants returns 8 records
- [ ] GET /api/lignes returns 3 records
- [ ] GET /api/tarifs returns 3 records
- [ ] GET /api/chauffeurs returns 3 records
- [ ] No CORS errors in console
- [ ] Student, driver, responsable logins work
- [ ] Each role redirects to correct path

---

## Performance Expectations

| Operation | Expected Time |
|-----------|---------------|
| Backend Startup | 20-30 seconds |
| Data Seeding | ~2 seconds |
| Login Request | <500ms |
| Dashboard Load | <300ms |
| API List Endpoints | <200ms |
| CORS Preflight | <100ms |

---

## Example: Complete Test Flow

```bash
# 1. Start backend
cd backend && java -jar target/transcampus-1.0.0.jar &

# 2. Wait for seeding
sleep 5

# 3. Login as admin
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@transcampus.dz","password":"password123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 4. Test KPIs endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/dashboard/kpis | jq .

# 5. Test public endpoints
curl http://localhost:8080/api/lignes | jq . | head -20
curl http://localhost:8080/api/tarifs | jq .

# 6. Start frontend
cd ../project && npm run dev &

# 7. Open browser
# http://localhost:5173/login
# admin@transcampus.dz / password123
```

---

**Ready to Test!** 🚀
