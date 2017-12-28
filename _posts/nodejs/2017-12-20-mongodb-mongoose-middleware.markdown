---
title: NodeJS - mongoose middleware
date: 2017-12-20 09:00:00 +0900
layout: post
tags: [linux, mongodb, mongoose, middleware]
categories: [NodeJS, Database]
---

## Middleware

이 글은  [mongoose middleware](http://mongoosejs.com/docs/middleware.html)를 한글로 요약 정리한 것이다. 실제 본문을 요약하여 번역해 정리했으므로 이해가 안되는 부분은 위 링크의 내용을 참조하기 바란다.

### mongoose middleware

*pre*, *post* hook 이라고 불리는 [mongoose middleware](http://mongoosejs.com/docs/middleware.html)는 비동기 함수의 실행중 제어권을 다룰 수 있다. 미들웨어는 스키마 수순에서 사용고 [plugins](http://github.com/Automattic/mongoose) 를 작성하는데 유용하다.

Mongoose 4.x 은 4종류의 미들웨어를 지원한다: 
 - document middleware
 - model middleware
 - aggregate middleware
 - query middleware

Document middleware는 아래 도큐멘트 함수를 지원한다. 도큐멘트 미들웨어에서 `this` 는 도큐멘트를 가르킨다.

 - init
 - validate
 - save
 - remove

Query middleware 는 아래 모델과 쿼리 함수를 지원한다. 쿼리 미들웨어 함수에서 `this` 는 쿼리를 가르킨다.

 - count
 - find
 - findOne
 - findOneAndRemove
 - findOneAndUpdate
 - update

Aggregate middleware 는 `MyModel.aggregate()` 를 위한것이다. Aggregate middleware는 aggregate 객체에서 `exec()` 를 호출할 때 실행된다.. 여기서 `this` 는 aggregation object를 가르킨다.

 - aggregate

Model middleware 는 아래 모델 함수에 대해 지원한다. 여기서 `this`는 모델을 가르킨다.

 - insertMany

> Note: There is no query hook for remove(), only for documents. If you set a 'remove' hook, it will be fired when you call myDoc.remove(), not when you call MyModel.remove(). Note: The create() function fires save() hooks.


모든 미들웨어 형식은 `pre`와 `post` 훅(hook)을 지원한다.


<br>
<br>
### Pre middleware

Serial과 parallel 이라는 두가지 `pre` 훅이 있다.

<br>
#### Serial

Serial middleware는 각 미들웨어가 `next()`를 호출하면 하나 다음 다른 하나를 실행한다.

```js
var schema = new Schema(..);
schema.pre('save', function(next) {
  // do stuff
  next();
});
```

그렇지만 `next()` 함수가 미들웨어의 다음 코드 실행을 멈추지 않기 때문에 `return` 패턴을 사용해서 코드 진행을 멈추면 된다.

```js
var schema = new Schema(..);
schema.pre('save', function(next) {
  if (foo()) {
    console.log('calling next!');
    // `return next();` will make sure the rest of this function doesn't run
    return next();
  }
  console.log('after next');
});
```


<br>
#### Parallel

Parallel middleware는 제어를 더욱 정밀하게 할 수 있다.

아래는 Pre 훅에 `true` 인자를 전달해 parallel 미들웨어를 사용하게 하고, 이것은 `save` 인 경우 각 미들웨어에서 done 호출 전까지 실행하지 않는다는 의미이다.

```js
var schema = new Schema(..);

// `true`: parallel middleware.
schema.pre('save', true, function(next, done) {
  // calling next kicks off the next middleware in parallel
  next();
  setTimeout(done, 100);
});
```


<br>
#### Use Cases

미들웨어는 원자화 모델과 비동기 코드의 중첩을 회피하는데 유용한다. 아래 같은 사례:

 - 복합 유효성 확인
 - 의존하는 문서 삭제 (사용자에 관련한 모든 문서를 삭제)
 - asynchronous defaults
 - asynchronous tasks that a certain action triggers
    - triggering custom events
    - notifications

<br>
#### 에러 처리

미들웨어에서 `Error` 형식 매개변수로 next(), done() 을 호출할 때 에러로 처리가 가로채지면 콜백 함수에 에러가 전달된다.

아래 같이 에러 발생시 `new Error()`를 생성해야 다음 `next()` 가 호출되지 않는다.

```js
schema.pre('save', function(next) {
  var err = new Error('something went wrong');
  next(err);
});

// later...
myDoc.save(function(err) {
  console.log(err.message) // something went wrong
});
```


<br>
<br>
### Post middleware

post middleware 는 pre middle 웨어가 완료되어 훅 메서드가 처리된 뒤에 실행된다. post 는 제어를 직접 하지 못한다. 예를 들어 next(), done() callback이 전달되면 post 훅은 이들 메서드를 이벤트 리스너에 등록하는 방법이다. 

```js
schema.post('init', function(doc) {
  console.log('%s has been initialized from the db', doc._id);
});
schema.post('validate', function(doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});
schema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});
schema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});
```

<br>
#### Asynchronous Post Hooks

post가 선언된 순서에 따라 post hook이 비동기 적으로 실행되는데, callback function에 두 개의 인자를 전달하면 mongoose는 두번째를 `next()` 로 가정하고 순서에 따라 next를 트리거 호출한다.

```js
// Takes 2 parameters: this is an asynchronous post hook
schema.post('save', function(doc, next) {
  setTimeout(function() {
    console.log('post1');
    // Kick off the second post hook
    next();
  }, 10);
});

// Will not execute until the first middleware calls `next()`
schema.post('save', function(doc, next) {
  console.log('post2');
  next();
});
```

<br>
#### Save/Validate Hooks

The `save()` 함수는 `validate()` hook을 유발하는데 이것은 `pre('save')` hook이 호출되면서  `pre('validate')` 와 `post('validate')` hook이 호출된다는 것이다.

```js
schema.pre('validate', function() {
  console.log('this gets printed first');
});
schema.post('validate', function() {
  console.log('this gets printed second');
});
schema.pre('save', function() {
  console.log('this gets printed third');
});
schema.post('save', function() {
  console.log('this gets printed fourth');
});
```

<br>
#### Notes on findAndUpdate() and Query Middleware

Pre 와 post save() hook은 `update()`, `findOneAndUpdate()` 등에서 호출되지 않는다. Mongoose 4.0 은 이들 함수에 다른 훅을 가지고 있다.

```js
schema.pre('find', function() {
  console.log(this instanceof mongoose.Query); // true
  this.start = Date.now();
});

schema.post('find', function(result) {
  console.log(this instanceof mongoose.Query); // true
  // prints returned documents
  console.log('find() returned ' + JSON.stringify(result));
  // prints number of milliseconds the query took
  console.log('find() took ' + (Date.now() - this.start) + ' millis');
});
```


document middleware에서 `this` 는 갱신하는 도큐멘트를 가르킨다. 그래서 `update()` 에 타임스탬프를 추가하고자 하면 아래 pre hook을 사용한다.

```js
schema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});
```


### Error Handling Middleware

> New in 4.5.0

일반적으로 next() 호출시 첫번째 error에서 멈추는데 특별한 post middleware로 "error handling middleware" 가 있다.
Error handling middleware는 부가적으로 콜백 함수의 매개변수에 `error`가 전달되는데, 첫번째 인자로 `error` 를 전달한다.

```js
var schema = new Schema({
  name: {
    type: String,
    // Will trigger a MongoError with code 11000 when
    // you save a duplicate
    unique: true
  }
});

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(error);
  }
});

// Will trigger the `post('save')` error handler
Person.create([{ name: 'Axl Rose' }, { name: 'Axl Rose' }]);
```

Error handling middleware는 query middleware와도 동작한다. 예를 들어 update() 호출시 키 중철 에러를 처리하는 훅를 고려하면:

```js
// The same E11000 error can occur when you call `update()`
// This function **must** take 3 parameters. If you use the
// `passRawResult` function, this function **must** take 4
// parameters
schema.post('update', function(error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(error);
  }
});

var people = [{ name: 'Axl Rose' }, { name: 'Slash' }];
Person.create(people, function(error) {
  Person.update({ name: 'Slash' }, { $set: { name: 'Axl Rose' } }, function(error) {
    // `error.message` will be "There was a duplicate key error"
  });
});
```

<br>
<br>
## 참조

 - [mongoose middleware](http://mongoosejs.com/docs/middleware.html)
 - [plugins](http://github.com/Automattic/mongoose) 
