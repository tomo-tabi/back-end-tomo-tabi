checked boxes indicate the path has been tested in postman

if userid is needed for a path it should be stored in the fetch request's headers authentication field as a bearer token. e.g `` `Bearer ${token}` ``

## /user

- [ ] GET ---- API_URL/user/
  - userid stored in bearer token
- [x] POST --- API_URL/user/signup
  - e.g `{"email":"test@test.com", "username":"test", "password":"test123"}`
- [x] POST --- API_URL/user/login
  - e.g `{"email":"test@test.com", "password":"test123"}`
- [ ] PUT ---- API_URL/user/update
- [ ] DELETE - API_URL/user/delete

## /trip

- [ ] GET - API_URL/trip/

## /timeline

## /expense
