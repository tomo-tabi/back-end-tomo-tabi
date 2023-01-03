checked boxes indicate the path has been tested in postman

if userid is needed for a path it should be stored in the fetch request's headers authentication field as a bearer token. e.g `` `Bearer ${token}` ``

## /user

- [x] GET - API_URL/user/
  - userid stored in bearer token
- [x] POST - API_URL/user/signup
  - JSON body example: `{"email":"test@test.com", "username":"test", "password":"test123"}`
- [x] POST - API_URL/user/login
  - JSON body example: `{"email":"test@test.com", "password":"test123"}`
- [x] PUT - API_URL/user/update
  - JSON body example: `{"email":"test@test.org", "username":"test1"}`
- [ ] DELETE - API_URL/user/delete
  - userid stored in bearer token
- [ ] PUT - API_URL/user/password
  - JSON body example: `{"password":"test123"}`

## /trip

- [x] GET - API_URL/trip/
  - userid stored in bearer token
- [ ] GET - API_URL/trip/:limit
- [x] POST - API_URL/trip/
  - JSON body example: `{"startDate": "2022-12-20","endDate": "2022-12-31","name": "testTrip"}`
- [x] PUT - API_URL/trip/:tripID
  - JSON body example: `{"startDate": "2022-12-19","endDate": "2022-12-30","name": "testTrip1"}`
- [x] DELETE - API_URL/trip/:tripID
  - userid stored in bearer token

## /timeline

- [x] GET - API_URL/timeline/:tripid
- [ ] GET - API_URL/timeline/:tripid/:limit
- [x] POST - API_URL/timeline/create
- [x] PUT - API_URL/timeline/update/:eventid
- [x] DELETE - API_URL/timeline/delete/:eventid

## /expense

- [x] GET - API_URL/expense/:tripid
- [ ] GET - API_URL/expense/:tripid/:limit
- [x] POST - API_URL/expense/create
- [x] PUT - API_URL/expense/update/:expenseid
- [x] DELETE - API_URL/expense/delete/:expenseid
- [x] GET - API_URL/expense/average/:tripid
