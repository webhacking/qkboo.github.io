---
title: mongodb - Collection
date: 2017-04-21 09:00:00 +0900
layout: post
tags: [linux, mongodb]
categories:
- Linux
- Database
---


## Collection 

mongoDB는 
mongoDB는 Collection 이 데이터베이스 테이블과 같은 개념이다. 아래 테이블은 관계형 데이터베이스 MySQL과 MongoDB의 개념을 비교해 주고 있다. [^1]

|    MySQL   |            MongoDB          |
| ---------- | --------------------------- |
| Table      | Collection                  |
| Row        | Document                    |
| Column     | Field                       |
| Joins      | Embedded documents, linking |



### 늦은 데이터베이스 생성 Lazy Creation

`use` 명령은 데이터베이스가 존재하지 않으면 새로운 데이터베이스를 생성하고, 그리고 해당 데이터베이스로 전환한다.

```js
> use mydb
switched to db mydb
```

그러나 mongodb는 **lazy creation** 방식을 채용해서 실제 데이터가 CRUD로 조작 될 때 컬렉션이 데이터베이스에 생성된다.  `use DATABASE` 명령 만으로는 실제 데이터 저장공간이 만들어 지지 않는다. 아래같이 `show dbs` 를 실행해도 데이터베이스가 검색되지 않는다. 

```js
> use first;
switched to db first

> show dbs;
local   (empty)
test    0.203125GB
```

아래와 같이 `collection.save()` 함수로 새로운 컬렉션에 도큐멘트을 생성하면 데이터베이스 저장 공간에 컬렉션 안에 도큐멘트가 생성되면서 실제 데이터가 저장된다.

```js
> db.first.save({ hello: "Hello, Mongodb"});
> show dbs;
first   0.203125GB
local   (empty)
test    0.203125GB
```

현재 `use` 로 사용 중인 데이터베이스는 `dropDatabase()` 함수로 데이터베이스를 삭제할 수 있다.

```js
> use first
switched to db first
> db.dropDatabase()
{ "dropped" : "first", "ok" : 1 }
> show dbs
```


### Collection과 Documents

mongoDB에 저장되는 도큐멘트는 JSON ojbect 와 유사하게 *속성:값* 형태로 구성된다. 

```js
var a = {age: 25}; 
var n = {name: 'Ed', languages: ['c', 'ruby', 'js']}; 
var student = {name: 'Jim', scores: [75, 99, 87.2]};
```

mongoDB는 document를 컬렉션에 저장한다. 

#### collection.save()

아래는 `collection.save()` 함수로 *{a: 99}* 도큐멘트를 *scores* 렉션에 저장하라는 명령이다. 

```js
db.scores.save({a: 99}); 
```

실제 데이터베이스의 컬렉션에 도큐멘트가 저장될 때는 바이너리 직렬 구조인 *Binary JSON*이라는 BSON 으로 저장된다.[^5] 


그리고 해당 콜렉션의 담긴 도큐멘트를 `find()` 함수로 출력한다.

```js
db.scores.find();
```

반복문을 이용해서 여러개의 documents를 저장할 수 있다. 

```
for(i=0; i<100; i++) { db.scores.save( {a:  i, exam: 5 } ) }; 
```

컬렉션 내용을 find()를 실행하면 10개의 결과가 출력됩니다.

```js
> for(i=0;i<100;i++){db.scores.save({a:i,b:'bbb'})};
> db.scores.find();
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2d"), "a" : 0, "b" : 1 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2e"), "a" : 1, "b" : 2 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2f"), "a" : 2, "b" : 3 }

```

이렇게 데이터베이스에 저장된 컬렉션을 관계형 데이터베이스 처럼 CRUD 명령 셋트를 이용해 질의를 해서 사용한다.



### Basic Queries

관계형데이터 베이스와 NoSQL 데이터베이스는 Query Language가 다르다.

#### SQL과 NoSQL의 CRUD

SQL의 INSERT

```sql
INSERT INTO users (user_id, age, status) VALUES ('bcd001', 45, 'A')
```

mongoDB의 INSERT

```js
db.users.insert({ 
  user_id: 'bcd001',
  age: 45,
  status: 'A'})
```

SQL의 SELECT

```sql
SELECT * FROM users
```

mongoDB의 `find()`

```js
db.users.find()
```

SQL의 UPDATE

```sql
UPDATE users SET status = 'C' WHERE age > 25
```

mongoDB의 `update()`

```js
db.users.update(
  { age: { $gt: 25 } },
  { $set: { status: 'C' } },
  { multi: true }
)
```

SQL의 DELETE

```sql
DELETE FROM users WHERE user_id='bcd001'
```

mongoDB의 `remove()`

```js
db.users.remove({
  user_id:'bcd0001'
})
```

#### collection의 주요 CRUD 함수

컬렉션에 대한 query는 [Collection Method](https://docs.mongodb.com/manual/reference/method/js-collection/) 에 설명되어 있다. 아래 테이블은 주요 CRUD 함수.

|            Name              |                                                  |
| ---------------------------- | ------------------------------------------------ |
| db.collection.find()    | 컬렉션에서 쿼리를 행하고 결과를 cursor 객체로 반환 |
| db.collection.findOne() | 쿼리를 실행하고 도큐멘트 하나를 반환한다. |
| db.collection.findAndModify() | 자동으로 수정하고 도큐멘트 하나를 반환한다. |
| db.collection.save() | 새 도큐멘트를 삽입하기 위해 `insert()` 와 `update()`를 묶어 놓은 함수 |
| db.collection.insert() | 컬렉션 안에 새 문서를 생성한다. |
| db.collection.insertOne() | 컬렉션 안에 새 문서 하나를 생성한다. |
| db.collection.insertMany() | 컬렉션 안에 새 문서 여러개를 생성한다. |
| db.collection.update() | 컬렉션 안의 문서를 수정한다|
| db.collection.updateOne() | 컬렉션 안에 문서 하나를 수정한다|
| db.collection.updateMany() | 컬렉션 안에 여러 문서를 수정한다 |
| db.collection.remove() | 컬렉션에서 문서(들)을 삭제한다|
| db.collection.renameCollection() | 컬렉션 이름을 바꾼다|


#### 컬렉션 보기

`show collections` 명령은 콜렉션의 목록을 볼 수 있다.

```js
> show collections
foo
scores
system.indexes
users
```

`collection.renameCollection()`로 콜렉션명을 수정 할 수 있다.

```
db.[collectionName].renameCollection("newCollectionName");
```

콜렉션의 삭제는 아래와 같다.

```
> db.[collectionName].drop()
```



#### document 조회 – find()

`find()`는 컬렉션 안의 도큐멘트 전체 혹은 지정한 도큐멘트의 속성에 해당하는 도큐멘트를 반환한다.

```
db.[collectionName].find([Document]);
```

데이터베이스 컬렉션 *students* 안의 도큐멘트를 `find()` 함수로 보여준다.

```js
> db.students.find()
{ "_id" : ObjectId("513b38ad81dc4b8f06062146"), "name" : "james", "age" : 24, "grade" : "A" }
```

`find()`로 콜렉션에 지정한 속성 값만 검색할 수 있다.

```js
> db.students.save({name:'jessi', age:20, grade:'A'});
> db.students.find({name:'james'})
{ "_id" : ObjectId("513b38ad81dc4b8f06062146"), "name" : "james", "age" : 24, "grade" : "A" }
> 
```

컬렉션 *scores* 에서 a가 0인 데이터를 출력해 보자.

```js
> db.scores.find({a:0});

{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2d"), "a" : 0, "b" : 1 }
{ "_id" : ObjectId("4fc0549c58f371664400592a"), "a" : 0, "b" : "bbb" }
```

컬렉션 *scores* 에서 a:1, b:bbb인 데이터를 출력해 보자.

```js
> db.scores.find({a:1, b:'bbb'});
{ "_id" : ObjectId("4fc0549c58f371664400592b"), "a" : 1, "b" : "bbb" }
```

컬렉션 *scores* 안의 모든 도큐멘트를 a:1을 기준으로 정렬해서 반환한다.

```js
> db.scores.find().sort({a:1});
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2d"), "a" : 0, "b" : 1 }
{ "_id" : ObjectId("4fc0549c58f371664400592a"), "a" : 0, "b" : "bbb" }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2e"), "a" : 1, "b" : 2 }
{ "_id" : ObjectId("4fc0549c58f371664400592b"), "a" : 1, "b" : "bbb" }
```

컬렉션 *scores* 안의 도큐멘트 숫자를 반환한다.

```js
> db.scores.count();
110
```

#### findOne()

find()와 동일한 매개변수를 이용할 수 있습니다. 다른점은  find()는 커서를 리턴하지만, findOne()은 데이터베이스에서 첫번째 document나 null을 리턴합니다.

```js
> db.scores.findOne({a:0});
> ```

결국 이 쿼리는 

```js
> find({a:"0"}).limit(1).
```

와 동일한 결과를 얻습니다.

#### limit();

쿼리의 결과의 수를 제한된 수의 결과로 제한하게 해서 처리할 수 있습니다.

MongoDB cursors are not snapshots - operations performed by you or other users on the collection being queried between the first and last call to next() of your cursor may or may not be returned by the cursor. Use explicit locking to perform a snapshotted query.

mongo 쉘 에서 고급 기법에 대해서는 아래 링크를 참조하세요.

http://www.mongodb.org/display/DOCS/mongo+-+The+Interactive+Shell


#### Cursor 객체

find()는 cursor 객체를 리턴합니다. cursor 객체는 쿼리의 결과 집합에 대한 포인터라고 한다.[^3]
cursor는 여러 데이터의 집합이므로 아래 같이 이용 할 수 있다.

```js
> var cursor = db.scores.find();
> while(cursor.hasNext()) printjson(cursor.next());
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2d"), "a" : 0, "b" : 1 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2e"), "a" : 1, "b" : 2 }
```

 - `printjson()` 은 내장 함수로 데이터를 json 형식으로 출력해 준다.

mongo 쉘로 사용시 아래 처럼 foreach 콜백 함수를 이용할 수 있다.

```js
> db.scores.find().forEach(printjson);
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2d"), "a" : 0, "b" : 1 }
…
```

또한 cursor를 배열 처럼 이용 할 수 있다.

```js
> var cursor = db.scores.find();
> printjson(cursor[10]);
{ "_id" : ObjectId("4fc0549c58f371664400592a"), "a" : 0, "b" : "bbb" }
```

이 시점에 결과가 메모리에 적재되기 때문에 아주 큰 데이터를 다루면 out of memory를 만나게 될 수 있다. 배열 스타일의 접근을 위해 cursor 를 배열로 변경할 수 있다.

```js
> var arr = db.scores.find().toArray();
> arr[10];
{ "_id" : ObjectId("4fc0549c58f371664400592a"), "a" : 0, "b" : "bbb" }
```


#### 도큐멘트 - update

mongoDB에서 도큐멘트 갱신은 [update methods](https://docs.mongodb.com/manual/reference/update-methods/)를 참고한다.

update() 메서드는 다음 형식으로 되어 있다:

```
db.collection.update(query, update, options)
```

아래와 같은 두 개의 document가 있다.

```js
> db.books.save({name:'James',language:['Java','C++']});
> db.users.save({name:'Jenny',language:['HTML5','Actionscript']});
```

`update()` 업데이트를 하면 전체 문서에 대해서 갱신이 된다. 아래 쿼리는 `Jenny` 라는 name 속성을 가진 도큐멘트를 모두 주어진 도큐멘트 속서으로 변경한다.

```js
> db.users.update( {name:'Jenny'}, {name:'James',language:['Korea','English']});
> db.users.find();
{ "_id" : ObjectId("4fc05ff01708cc4a3eadd3c8"), "name" : "James", "language" : [ "Java", "C++" ] }
{ "_id" : ObjectId("4fc0601d1708cc4a3eadd3c9"), "name" : "James", "language" : [ "Korea", "English" ] }
```


데이터의 일정부분만 갱신하려면 `$set` 연산자 및 배열을 위한 `$push`, `$pull` 연산자를 함께 사용할 수 있다.

```js
> db.users.update( {name:'James'}, {'$set': {age:'30'}} );
> db.users.find();
{ "_id" : ObjectId("4fc0601d1708cc4a3eadd3c9"), "name" : "James", "language" : [ "Korea", "English" ] }
{ "_id" : ObjectId("4fc060fa1708cc4a3eadd3ca"), "name" : "James", "language" : [ "Java", "C++" ] }
{ "_id" : ObjectId("4fc060fe1708cc4a3eadd3cb"), "name" : "James", "language" : [ "Korea", "English" ] }
{ "_id" : ObjectId("4fc05ff01708cc4a3eadd3c8"), "age" : "30", "language" : [ "Java", "C++" ], "name" : "James" }


> db.users.update({name: 'Sue'}, {'$pull': {'languages': 'scala'} }); 
> db.users.update({name: 'Sue'}, {'$push': {'languages': 'ruby'} });
```

#### collection.remove()

도큐멘트의 항목을 삭제할 수 있다.

```js
> db.users.remove({name:'James'});
> db.users.find();
```

모든 데이터를 제거하려면 remove()만 호출합니다.

```js
> db.users.remove();
```

index  생성

```js
db.scores.encureIndex( {a:1, b:’bbb’});

group(), min(), max(), $where
```



### Query와 Projection 연산자

쿼리에 제약 혹은 확장을 할 수 있는 쿼리 선택자 (Query selector)는 비교, 논리, 요소, 배열 등에 대한 연산자로 지원된다. Projection 연산자는 쿼리의 특정 부분만을 투영할 수 있는 연산자를 지원하고 있다. [^4]


자세하고 더 많은 내용은 [Query and Projection operators](https://docs.mongodb.com/manual/reference/operator/query/)를 참조하라.


#### `$gt` 연산자

입력된 데이터에서 20보다 큰 데이터를 찾아 보겠습니다.

```js
> db.scores.find({a:{'$gt':30}});
{ "_id" : ObjectId("4fc0549c58f3716644005949"), "a" : 31, "b" : "bbb" }
{ "_id" : ObjectId("4fc0549c58f371664400594a"), "a" : 32, "b" : "bbb" }
{ "_id" : ObjectId("4fc0549c58f371664400594b"), "a" : 33, "b" : "bbb" }
…
```

#### `$gte` 연산자

`$gte`는 Greater Than or Equal로 크거나 같은 값을 비교하는 연산자

```js
> db.scores.find({a:{'$gte':22}});
{ "_id" : ObjectId("4fc0549c58f3716644005940"), "a" : 22, "b" : "bbb" }
{ "_id" : ObjectId("4fc0549c58f3716644005941"), "a" : 23, "b" : "bbb" }
```

#### `$lt`, `$lte` 연산자

`$lte` 연산자는 작거나 같은 값을 비교하는 연산자

```js
> db.scores.find( {a:{'$lte':5}} );
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2d"), "a" : 0, "b" : 1 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2e"), "a" : 1, "b" : 2 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2f"), "a" : 2, "b" : 3 }
```

#### `$ne` 연산자

`$ne` 연산자는 같지 않은 값을 비교하는 연산자

```js
> db.scores.find({b:{'$ne':'bbb'}});
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2d"), "a" : 0, "b" : 1 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2e"), "a" : 1, "b" : 2 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2f"), "a" : 2, "b" : 3 }
```

`$gte` 와 `$lte`를 동시에 쓰기도 한다

```js
> db.scores.find({a: {'$gte':5,'$lte':8}});
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e32"), "a" : 5, "b" : 6 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e33"), "a" : 6, "b" : 7 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e34"), "a" : 7, "b" : 8 }
```

#### `$in` in Array

`$in` 연산자는 주어진 컬렉션 값이 포함되었는지 비교한다.

```js
> db.scores.find({a:{'$in':[10,20,30,40]}});
{ "_id" : ObjectId("4fc0549c58f3716644005934"), "a" : 10, "b" : "bbb" }
{ "_id" : ObjectId("4fc0549c58f371664400593e"), "a" : 20, "b" : "bbb" }
{ "_id" : ObjectId("4fc0549c58f3716644005948"), "a" : 30, "b" : "bbb" }
{ "_id" : ObjectId("4fc0549c58f3716644005952"), "a" : 40, "b" : "bbb" }
```


반대로 `$nin` 연산자는 주어진 컬렉션에 포함 안된 값을 비교한다.


```js
> db.scores.find({a:{'$nin':[10,20,30]}});
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2d"), "a" : 0, "b" : 1 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2e"), "a" : 1, "b" : 2 }
{ "_id" : ObjectId("4fbe149b206a4e5abfad0e2f"), "a" : 2, "b" : 3 }
…
has more

```


{% comment %}

#### Query#populate

`query#populate` 는 쿼리 결과에서 특정한 쿼리를 다시 질의할 수 있다.

```
Query.populate( path, [fields], [model], [cond], [options] )
```

```js
Album.findOne().exec(function(err, doc) {
   // print undefind
   console.log( doc.artist.name) ;
});

Album.findOne().populate('artist').exec(function(err, doc) {
   // print fink flod
   console.log( doc.artist.name) ;
});
```

{% endcomment %}


## 참고

[^1]: [Terminology and Concepts](https://www.mongodb.com/compare/mongodb-mysql?jmp=docs)
[^3]: [Cursor](https://docs.mongodb.com/manual/reference/glossary/#term-cursor)
[^4]: [Query and Projection operators](https://docs.mongodb.com/manual/reference/operator/query/)
[^5]: [Term of BSON](https://docs.mongodb.com/manual/reference/glossary/#term-bson)

