checked boxes indicate the path has been tested in postman

if userid is needed for a path it should be stored in the fetch request's headers authentication field as a bearer token. e.g `` `Bearer ${token}` ``

## /user

- [x] GET ---- API_URL/user/
  - userid stored in bearer token
- [x] POST --- API_URL/user/signup
  - JSON body example: `{"email":"test@test.com", "username":"test", "password":"test123"}`
- [x] POST --- API_URL/user/login
  - JSON body example: `{"email":"test@test.com", "password":"test123"}`
- [x] PUT ---- API_URL/user/update
  - JSON body example: `{"email":"test@test.org", "username":"test1"}`
- [ ] DELETE - API_URL/user/delete
  - userid stored in bearer token
- [ ] PUT ---- API_URL/user/password
  - JSON body example: `{"password":"test123"}`

## /trip

- [ ] GET - API_URL/trip/
  - userid stored in bearer token
- [ ] POST - API_URL/trip/
  - JSON body example:
- [ ] PUT - API_URL/:tripID
  - JSON body example:
- [ ] DELETE - API_URL/
  - JSON body example:

## /timeline

## /expense
