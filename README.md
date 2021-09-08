# ekspress

**ekspress** is an experimental web framework developed to learn how *middlewares* and *routers* work. 

The router uses Radix Tree to lookup paths. It supports parameters but not wildcards.

The server is similar to **express**. 

## Implemented Extensions

- app
  - all
  - use
  - get
  - post
  - put
  - delete
  - head
  - options
  - trace
- req
  - params
- res
  - json
  - status
  - type
  - set

## Examples

### Requests

```bash
$ curl -X GET http://localhost:8000/users
{"method":"GET","url":"/users","params":{}}%                                    

$ curl -X GET http://localhost:8000/users/5
{"method":"GET","url":"/users/5","path":"/users/5","params":{}}%                

$ curl -X GET http://localhost:8000/users/6
{"method":"GET","url":"/users/6","path":"/users/:id","params":{"id":"6"}}%      

$ curl -X GET http://localhost:8000/users/6/friends
{"method":"GET","url":"/users/6/friends","params":{"uid":"6"}}%                 

$ curl -X GET http://localhost:8000/users/6/friends/7
{"method":"GET","url":"/users/6/friends/7","params":{"uid":"6","fid":"7"}}%  
```

### Logs

```bash
[1] GET /
[2] {}
[1] GET /users
[2] {}
[1] GET /users/5
[2] {}
[1] GET /users/6
[2] {"id":"6"}
[1] GET /users/6/friends
[2] {"uid":"6"}
[1] GET /users/6/friends/7
[2] {"uid":"6","fid":"7"}
```