---
title: mongodb - User Authentication
date: 2017-04-20 09:00:00 +0900
layout: post
tags: [linux, mongodb]
categories:
- Linux
- Database
---


## mongoDB 접근제어

mongoDB 는 설치과정 중에 인증과 관련해 설정하는 부분이 없어서 설치 후 누구나 DB에 접속 할 수 있다.  인증을 추가해 데이터베이스 관리자와 데이터베이스 사용자로 구분해서 이용하고, 각 데이터베이스의 사용자는 허가된 역할(Role)을 가지고 데이터베이스에 접근 가능하도록 구성한다.

Ubuntu/Debian 리눅스에서 mongoDB Community Edition 설치는 [mongoDB 3.0 on Armbian]({% post_url linux/2017-04-11-mongodb-3.x-install-armv8 %}) 를 참고 할 수 있다.

여기서는 다음 두 가지를 다루고 있다.
 **(1) 데이터베이스 관리자 추가** 
 **(2) 데이터베이스 사용자 추가**

### mongodb 설치

여기서 mongodb 3.x 를 대상으로 

##### Ubuntu/Debian 계열

```sh
sudo apt install mongodb
```

서비스 시작은 systemd 를 사용한다.

```sh
sudo systemctl start mongodb.service
```


##### macOS

Homebrew 를 사용해 설치한다.

```sh
brew search mongodb
brew install mongodb@3.2
```

그리고 서비스를 시작한다.

```sh
brew services start mongodb@3.2
```

mongod --config /usr/local/etc/mongod.conf


### 데이터베이스 관리자

명령라인에서 `mongod`를 시작할 때는, mongoDB를 비인증 모드로 시작한다.

```sh
mongod --port 27017 --dbpath /data/db1
```

*systemd* 사용시에는 *mongod.conf* 파일에 `security.authorization` 이 없이 systemd 로 서비스를 재시작 한다.

```sh
$ sudo systemctl restart mongod.service
$ sudo systemctl status mongod.service
```


mongoDB 데이터베이스 관리자 추가를 위해 **admin** 데이터베이스 사용자에 `userAdminAnyDatabase` 롤을 추가해준다.

#### mongoDB 2.4 이전 관리자 계정 추가

mongoDB 2.4 까지는 새로운 사용자는  `db.addUser()` 로 추가한다.[^1]

```js
$ mongo     // mongo client 로 접속
>use admin  // admin DB 사용
>db.addUser( { user: "<username>", // admin name
              pwd: "<password>",
              roles: [ "userAdminAnyDatabase" ] // Database role
          } )
```

> mongoDB 2.6까지 32bit 버전을 지원하고 있다.

[^1]: [Add User Administrator(v2.4 )](https://docs.mongodb.com/v2.4/tutorial/add-user-administrator/)


#### mongoDB 2.6 이후 관리자 계정 추가

mongoDB 2.6 이후는 `db.createUser()` 로 사용자를 추가한다. [^2]
다음은 admin 데이터베이스에서 사용자를 관리하는 admin 계정을 생성하고 있다.

```js
$ mongo     // mongo client 로 접속
> use admin
switched to db admin
> db.createUser({ user:'admin', 
                   pwd:'****', 
                   roles:['userAdminAnyDatabase']
               })
Successfully added user: { "user" : "admin", "roles" : [ "userAdminAnyDatabase" ] }
>
> db.getUsers() // 데이터베이스 사용자 확인
[
    {
        "_id" : "admin.admin",
        "user" : "admin",
        "db" : "admin",
        "roles" : [
            {
                "role" : "userAdminAnyDatabase",
                "db" : "admin"
            }
        ]
    }
]
```


[^2]: [Enable Authentication after Creating the User Administrator(v2.6)](https://docs.mongodb.com/v2.6/tutorial/enable-authentication-without-bypass/)

#### mongoDB v2.4 인증모드로 시작


mongoDB v2.4는 다음 같이 인증 모드로 시작한다. `mongod` 명령라인에서 `--auth` 옵션을 붙여 DB 인스턴스(`mongod`)를 시작 혹은 재시작한다.


```sh
$ mongod --auth --port 27017 --dbpath /data/db1
Thu Jul 16 15:40:19 [initandlisten] MongoDB starting : pid=18189 portrayed=27017 dbpath=/data/db1/ 32-bit
```

혹은  *mongod.conf* 설정 파일에서 **auth** 를 활성화 한다.

```
auth = true
```

auth 모드로 시작한 후에 다음 같이 인증 정보없이 로그인 하면 데이터베이스 사용시 에러를 만난다.

```js
$ mongo
> show dbs;
Tue Sep 27 23:22:40.683 listDatabases failed:{ "ok" : 0, "errmsg" : "unauthorized" } at src/mongo/shell/mongo.js:46
>
> show users
Tue Sep 27 23:22:44.667 error: { "$err" : "not authorized for query on test.system.users", "code" : 16550 } at src/mongo/shell/query.js:128
```


#### mongoDB v2.6 이후

`mongod` 명령라인으로 시작할 수 있다.

```sh
$ mongod --auth --port 27017 --dbpath /data/db1
```


mongoDB v2.6 이후에서 *mongod.conf* 파일 사용할 때는, *mongod.conf* 에 `security.authorization` 를 활성화 한다. 

systemd 로 mongoDB 서비스를 재시작 한다.

```sh
$ sudo systemctl restart mongod.service
$ sudo systemctl status mongod.service
```


#### 인증 로그인

이제 데이터베이스 관리자 계정으로 로그인해서 사용하려는 데이터베이스를 `use`로 선택하고 해당 데이터베이스 사용자를 추가해준다.

`mongo` 클라이언트 로그인시 `-u <username>`, `-p <password>` 와 `--authenticationDatabase <database>` 를 지정해 주어야 한다.

```sh
$ mongo --port 27017 -u "admin" -p "****" --authenticationDatabase "admin"
MongoDB shell version v3.4.0
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.4.0
```

혹은 인증없이 `mongo` 클라이언트로 데이터베이스에 접속한 후에 `db.auth()` 명령을 사용할 수 있다.

```json
> use admin
switched to db admin
> db.auth("admin", "****")
1
> show users
{
    "_id" : ObjectId("5733676238ac1ddf4cf745c2"),
    "user" : "admin",
    "readOnly" : false,
    "pwd" : "24413999168dccff96dcc735720c85ce"
}
>
```



#### 원격지에서 접근

외부에서 mongodb로 접근시 authentication을 적용한 상태라면 다음과 같은 URL로 접근할 수 있다:

> "username:password@HOST_NAME/mydb"


> 그러나 외부접근시 클라이언트 버전과 서버의 Credential 버전이 맞지 않은 경우 다음 같이 실패 메시지를 확인할 수 있다.
> 
> 2016-05-16T00:53:10.338+0900 I ACCESS   [conn2] Failed to authenticate student@student with mechanism MONGODB-CR: AuthenticationFailed: MONGODB-CR credentials missing in the user document
> 2016-05-16T00:53:10.352+0900 I NETWORK  [conn2] end connection 220.121.140.59:51634 (0 connections now open)
> 


이제 각 데이터베이스에 사용자를 생성해서 사용해서 인증한 사용자만 데이터베이스를 사용하게 할 수 있다. 


### Database 사용자 추가

mongoDB v2.4와 그 이후는 사용자 추가 방법이 조금 다르다.

#### mongoDB v2.4 사용자 추가

사용하려는 데이터베이스의 계정으로 접근제어를 추가해 주어야 한다. mongoDB 2.4 까지는 새로운 사용자는  `db.addUser()` 로 추가한다.[^3]


[^3]: [Add User To Database(v2.4)](https://docs.mongodb.com/v2.4/tutorial/add-user-to-database/)

아래는 데이터베이스 관리자 계정 *admin*으로 로그인해서, 필요하면 students 데이터베이스를 생성합니다. 그리고 students 데이터베이스 사용자 *student* 계정을 추가하고 있다.

```js
> use students
switched to db students
> db.addUser('student', '****')
{
    "user" : "student",
    "readOnly" : false,
    "pwd" : "7a70591507db46bdd3df47a213d8922f",
    "_id" : ObjectId("57336a71c1ef2bed6688d296")
}
> db.auth('student', '012345')
1
> db.student.save({name:'qkboo', class:'Database', grade:'A'})
> db.student.find()
{ "_id" : ObjectId("57336b7d1be9091521cbeb36"), "name" : "qkboo", "class" : "IoT", "grade" : "A" }
>
```

이제 `mongo` 클라이언트로 생성한 *students* 에 데이터베이스 사용자 *student*로 로그인한다. 

```sh
$ mongo student -u student -p ****
MongoDB shell version: 2.4.10
connecting to: student
```

만약 해당 데이터베이스 사용자가 아닌 계정에서 데이터베이스 접근시 다음 같이 인증되지 않은 접근으로 에러를 발생한다.

```js
$ mongo
MongoDB shell version: 2.4.10
connecting to: test
> use student
switched to db student
> show dbs
Tue Sep 27 23:45:38.269 listDatabases failed:{ "ok" : 0, "errmsg" : "unauthorized" } at src/mongo/shell/mongo.js:46
>
```


### mongoDB v3.x 사용자 관리

mongoDB v2.6 히우는 대부분 mongoDB v3.4와 호환되는 사용자 관리 명령을 사용한다. 여기서는 [User Management Methods (v3.4)](https://docs.mongodb.com/manual/reference/method/js-user-management/)를 참고하고 있다.


| Name | Description |
| ----------------- | --------------------------------------|
| db.auth() | 데이터베이스에 사용자 인증 |
| db.createUser() | Creates a new user. |
| db.updateUser() | Updates user data. |
| db.changeUserPassword() | 사용자 패스워드 변경 |
| db.dropAllUsers() | 데이터베이스에 관련된 모든 사용자를 삭제한다. |
| db.dropUser() | 한 사용자를 삭제한다 |
| db.grantRolesToUser() | 롤과 권한을 사용자에 허용한다 |
| db.revokeRolesFromUser() | 사용자에 부여한 롤을 삭제한다 |
| db.getUser() | 지정한 사용자의 정보를 반환한다|
| db.getUsers() | 데이터베이스에 관련된 모든 사용자의 정보를 반환한다 |


#### createUser()

`db.createUser()` 는 두 개의 도큐멘트를 인자로 사용한다:

> db.createUser(user, writeConcern)

여기서 **user** 도큐멘트는 아래 같은 형식을 갖는다:

```json
{ user: "<name>",
  pwd: "<cleartext password>",
  customData: { <any information> },
  roles: [
    { role: "<role>", db: "<database>" } | "<role>",
    ...
  ]
}
```
 - **customData**: 선택적으로 추가할 정보를 담은 도큐멘트.

다음은 *product* 데이터베이스로 전환해서 *product* 데이터베이스 사용자를 추가하고 있다. *customeData* 를 주목하자.

```js
use products
db.createUser( { user: "user1",
                 pwd: "changeMe",
                 customData: { employeeId: 12345 }, // prducts 
                 roles: [ { role: "clusterAdmin", db: "admin" },
                          { role: "readAnyDatabase", db: "admin" },
                          "readWrite"] },
               { w: "majority" , wtimeout: 5000 } )
```

다양한 사례는 [createUser() Exmaple](https://docs.mongodb.com/manual/reference/method/db.createUser/#examples) 를 참고하자.
