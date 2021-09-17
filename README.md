# ekspress

**ekspress** is an experimental web framework developed without using dependency to learn how *middlewares* and *routers* work. 

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

## Usage

### Scripts

- `build`: builds using typescript compiler
- `start`: starts server
- `serve`: starts dev server (via nodemon)
- `clear`: removes built files
- `benchmark`: performs benchmark (via autocannon)

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

### Benchmark

Yes, it is not full featured but it outperforms express...

#### GET /
##### Ekspress


Running 10s test @ http://localhost:8000
10 connections

| Stat    | 2.5% | 50%  | 97.5% | 99%  | Avg     | Stdev   | Max   |
|---------|------|------|-------|------|---------|---------|-------|
| Latency | 0 ms | 0 ms | 1 ms  | 2 ms | 0.13 ms | 0.62 ms | 36 ms |


| Stat      | 1%     | 2.5%   | 50%     | 97.5%   | Avg     | Stdev  | Min    |
|-----------|--------|--------|---------|---------|---------|--------|--------|
| Req/Sec   | 4415   | 4415   | 15975   | 17199   | 14884.6 | 3585.4 | 4413   |
| Bytes/Sec | 618 kB | 618 kB | 2.24 MB | 2.41 MB | 2.08 MB | 502 kB | 618 kB |


Req/Bytes counts sampled once per second.

149k requests in 10.03s, 20.8 MB read


##### Express


Running 10s test @ http://localhost:8000
10 connections

| Stat    | 2.5% | 50%  | 97.5% | 99%  | Avg     | Stdev   | Max   |
|---------|------|------|-------|------|---------|---------|-------|
| Latency | 1 ms | 1 ms | 3 ms  | 4 ms | 1.13 ms | 0.66 ms | 25 ms |


| Stat      | 1%     | 2.5%   | 50%     | 97.5%   | Avg     | Stdev   | Min    |
|-----------|--------|--------|---------|---------|---------|---------|--------|
| Req/Sec   | 3983   | 3983   | 7791    | 8439    | 7192.5  | 1286.04 | 3982   |
| Bytes/Sec | 558 kB | 558 kB | 1.09 MB | 1.18 MB | 1.01 MB | 180 kB  | 557 kB |


Req/Bytes counts sampled once per second.

72k requests in 10.02s, 10.1 MB read

#### GET /users/5
##### Ekspress


Running 10s test @ http://localhost:8000/users/5
10 connections

| Stat    | 2.5% | 50%  | 97.5% | 99%  | Avg     | Stdev   | Max   |
|---------|------|------|-------|------|---------|---------|-------|
| Latency | 0 ms | 0 ms | 1 ms  | 1 ms | 0.19 ms | 0.45 ms | 16 ms |


| Stat      | 1%      | 2.5%    | 50%     | 97.5% | Avg     | Stdev   | Min     |
|-----------|---------|---------|---------|-------|---------|---------|---------|
| Req/Sec   | 8847    | 8847    | 12703   | 13751 | 12406.4 | 1343.29 | 8843    |
| Bytes/Sec | 1.93 MB | 1.93 MB | 2.77 MB | 3 MB  | 2.7 MB  | 293 kB  | 1.93 MB |


Req/Bytes counts sampled once per second.

124k requests in 10.02s, 27 MB read

##### Express


Running 10s test @ http://localhost:8000/users/5
10 connections

| Stat    | 2.5% | 50%  | 97.5% | 99%  | Avg    | Stdev   | Max   |
|---------|------|------|-------|------|--------|---------|-------|
| Latency | 1 ms | 1 ms | 4 ms  | 5 ms | 1.4 ms | 1.02 ms | 29 ms |


| Stat      | 1%     | 2.5%   | 50%     | 97.5%   | Avg     | Stdev  | Min    |
|-----------|--------|--------|---------|---------|---------|--------|--------|
| Req/Sec   | 2999   | 2999   | 5175    | 5699    | 5094.82 | 733.29 | 2999   |
| Bytes/Sec | 699 kB | 699 kB | 1.21 MB | 1.33 MB | 1.19 MB | 171 kB | 699 kB |


Req/Bytes counts sampled once per second.

56k requests in 11.03s, 13.1 MB read


#### GET /users/1/friends/2
##### Ekspress


Running 10s test @ http://localhost:8000/users/1/friends/2
10 connections


| Stat    | 2.5% | 50%  | 97.5% | 99%  | Avg     | Stdev   | Max   |
|---------|------|------|-------|------|---------|---------|-------|
| Latency | 0 ms | 0 ms | 1 ms  | 1 ms | 0.19 ms | 0.47 ms | 21 ms |


| Stat      | 1%      | 2.5%    | 50%     | 97.5%   | Avg      | Stdev  | Min     |
|-----------|---------|---------|---------|---------|----------|--------|---------|
| Req/Sec   | 10767   | 10767   | 12375   | 13063   | 12136.37 | 680.23 | 10763   |
| Bytes/Sec | 2.47 MB | 2.47 MB | 2.83 MB | 2.99 MB | 2.78 MB  | 156 kB | 2.46 MB |


Req/Bytes counts sampled once per second.

134k requests in 11.02s, 30.6 MB read


##### Express

Running 10s test @ http://localhost:8000/users/1/friends/2
10 connections



| Stat    | 2.5% | 50%  | 97.5% | 99%  | Avg    | Stdev   | Max   |
|---------|------|------|-------|------|--------|---------|-------|
| Latency | 1 ms | 1 ms | 4 ms  | 5 ms | 1.6 ms | 1.07 ms | 23 ms |





| Stat      | 1%     | 2.5%   | 50%     | 97.5%   | Avg     | Stdev  | Min    |
|-----------|--------|--------|---------|---------|---------|--------|--------|
| Req/Sec   | 3557   | 3557   | 4855    | 5559    | 4664.2  | 626.36 | 3556   |
| Bytes/Sec | 868 kB | 868 kB | 1.18 MB | 1.36 MB | 1.14 MB | 153 kB | 868 kB |



Req/Bytes counts sampled once per second.

47k requests in 10.02s, 11.4 MB read
Done in 35.69s.