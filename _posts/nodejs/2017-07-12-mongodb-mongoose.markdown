---
title: NodeJS - mongoose
date: 2017-07-12 12:00:00 +0900
layout: post
tags: [nodejs, mongodb, mongoose]
categories: [NodeJS, Database]
---

이 글은 [mongoose doc](http://mongoosejs.com/docs/) 에서 필요한 부분만 요약 정리했다.

## MongoDB와 Mongoose

Node.js에서 Mongodb에 연결하기 위해서 Driver가 필요

### mongoose

MongoDb를 위한 Node.js 커넥터로 Object Data Mapping (ODM)을 통해 MVC를 구현해 준다. 
 - [using-mongodb-and-mongoose](https://dzone.com/articles/using-mongodb-and-mongoose)

#### 설치

프로젝트 폴더에서 npm으로 mongoose 모듈를 설치한다.

```sh
$ npm i mongoose
```

> npm < 5 이하 버전은 `-S` 혹은 `--save` 옵션으로 모듈 의존성을 *package.json* 에 추가한다.

```js
"dependencies": {
    "body-parser": "~1.13.2",
    "cookie-parser": "~1.3.5",
    "debug": "~2.2.0",
    "express": "~4.13.1",
    "jade": "~1.11.0",
    "mongoose": "^4.4.16",
    "morgan": "~1.6.1",
    "serve-favicon": "~2.3.0"
}
```

### Scheme 사용

Scheme 는 [Model](http://mongoosejs.com/docs/models.html) 로 변환해야 한다. [^models] 
`mongoose.model()` 메서드는 모델 이름과 스키마를 받아 변환한다.

> mongoose.model(modelName, schema);


```js
var schema = new mongoose.Schema({ name: 'string', size: 'string' });
var Tank = mongoose.model('Tank', schema);
```

model()에 전달한 **modelName**은 mongoose가 자동으로 컬렉션에서 복수형으로 찾는다. 예를 들어 위의 *Tank*는 *tanks* 컬렉션을 참조한다.

[^models]:http://mongoosejs.com/docs/models.html


#### mongodb 3.x 연결

Promise를 선언하고 connect()를 연결한다.

```js
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/somecollection')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
```

#### mongodb 2.x 연결

mongodb 2.x 버전에서 createConnection(), connect() 메서드를 사용해 연결한다.

```js
var mongoose = require('mongoose'); 
var connection = mongoose.createConnection('mongodb://localhost/sensors');

//Schemas
var BookScheme = new mongoose.Schema({
    title: String,
    author: String,
    year: String
}); 

// Models
var BookModel = mongoose.model( 'Book', BookScheme);
```

또 여러 연결을 사용할 수 있다.

```js

var conn      = mongoose.connect('mongodb://localhost/testA');
var conn2     = mongoose.connect('mongodb://localhost/testB');

var SensorModel = conn.model( 'qkboo_sensor', Sensorcheme);

var ModelB    = conn2.model('Model', new mongoose.Schema({
  title : { type : String, default : 'model in testB database' }
}));
```


### API

#### save()

[Model#save()](http://mongoosejs.com/docs/api.html#model_Model-save)는 주어진 도큐멘트를 저장한다.
 - return: Promise

#### create()

[Model.create()](http://mongoosejs.com/docs/api.html#model_Model.create) 는 하나 혹은 그 이상의 도큐멘트를 저장할 수 있다. `MyModel.create(docs)` 는 주어지는 도큐멘트 마다 `new MyModel(doc).save()` 를 수행한다.



#### methods

Model의 인스턴스는 documents 로 [내장 메서드](http://mongoosejs.com/docs/api.html#document-js)가 제공되지만, 사용자가 새로운 메서드를 추가할 수 있다.

```js
var animalSchema = new Schema({ name: String, type: String });

animalSchema.methods.findSimilarTypes = function(cb) {
  return this.model('Animal').find({ type: this.type }, cb);
};
```

이제 animalSchema 의 인스턴스는 새 메서드 `findSimilarTypes` 사용이 가능하다.

```js
var Animal = mongoose.model('Animal', animalSchema);
var dog = new Animal({ type: 'dog' });

dog.findSimilarTypes(function(err, dogs) {
  console.log(dogs); // woof
});
```


#### Statics

static method도 추가할 수 있다.

```js
// assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function(name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
};

var Animal = mongoose.model('Animal', animalSchema);
Animal.findByName('fido', function(err, animals) {
  console.log(animals);
});
```


#### Db.prototype.authenticate

mongodb 3.6 이후는 인증시 Socket을 통한 인증을 거부한다. 그래서 Db.prototype.authenticate 을 사용하지 않고 .MongoClient.connect 에서 인증 서명서와 함께 사용해야 한다.



### Promise

```
(node:24499) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
```

이것은 `.save()`, `query` 결과가  [Promises/A+ conformant promises](https://promisesaplus.com/) 를 반환한다는 것이다. 반환된 결과로 MyModel.findOne({}).then() and yield MyModel.findOne({}).exec() 같은 작업을 할 수 있다는 의미가 된다.

Mongoose 4 는 기본으로 [mpromise](https://www.npmjs.com/package/mpromise)를 약속한다.

```js
var gnr = new Band({
  name: "Guns N' Roses",
  members: ['Axl', 'Slash']
});

var promise = gnr.save();
assert.ok(promise instanceof require('mpromise'));

promise.then(function (doc) {
  assert.equal(doc.name, "Guns N' Roses");
});
```

#### Queries are not promises

Mongoose queries are not promises. 그러나 대신 양보와 비동기/대기를 위해 `.then()` 함수를 가지고 있다. fully-fledged promise 가 필요하다면 `.exec()` 함수를 사용하라. 



```js
var query = Band.findOne({name: "Guns N' Roses"});
assert.ok(!(query instanceof require('mpromise')));

// A query is not a fully-fledged promise, but it does have a `.then()`.
query.then(function (doc) {
  // use doc
});

// `.exec()` gives you a fully-fledged promise
var promise = query.exec();
assert.ok(promise instanceof require('mpromise'));

promise.then(function (doc) {
  // use doc
});
```



#### Plugging in your own Promises Library

> New in Mongoose 4.1.0

기본 사용에서 mpromise가 만족스러웠지만, 고급 사용자는 [ES6-style promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 같은 [bluebird](https://www.npmjs.com/package/bluebird) 라이브러리를 플러그인으로 넣거나 혹은 네이티브 ES6 를 사용하기를 바랬다. `mongoose.Promise` 로 좋아하는 ES6 스타일 프로마이즈를 사용할 수 있다.


> Mongoose ES6 native promises, bluebird, and q를 테스트했다. 어떤 라이브러리도 이론적으로 
 Any promise library that exports an ES6-style promise constructor should work in theory, but theory often differs from practice. If you find a bug, open an issue on GitHub


```js
var query = Band.findOne({name: "Guns N' Roses"});

// Use native promises
mongoose.Promise = global.Promise;
assert.equal(query.exec().constructor, global.Promise);

// Use bluebird
mongoose.Promise = require('bluebird');
assert.equal(query.exec().constructor, require('bluebird'));

// Use q. Note that you **must** use `require('q').Promise`.
mongoose.Promise = require('q').Promise;
assert.ok(query.exec() instanceof require('q').makePromise);
```




## 참고
 - [mongoose doc](http://mongoosejs.com/docs/)
 - [mongoose api doc](http://mongoosejs.com/docs/api.html)
 - [mpromise](https://www.npmjs.com/package/mpromise)
 - bluebird](https://www.npmjs.com/package/bluebird)
 - [ES6-style promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[^1]: [Promise 란](http://programmingsummaries.tistory.com/325)
