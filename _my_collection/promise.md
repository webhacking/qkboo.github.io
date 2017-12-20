
## Promise

자바스크립은 단일 스레드로 두 스크립트를 동시에 실행할 수 없고, 순차적으로 실행한다. 동시에 여러 작업를 처리하기 위해서 Event 와 Callback 을 사용해서 구현할 수 있다.

https://developers.google.com/web/fundamentals/primers/promises
https://codecraft.tv/courses/angular/es6-typescript/promises/

### Event 와 Callback

Javascript에서 비동기 처리를 위해서 함수에 콜백 패턴을 사용해 왔다. 어떤 버튼의 클릭 이벤트에 대해 처리할 수 있는 비동기 함수로 callback 함수를 등록해 사용하는 식이다. 

```js
var img1 = document.querySelector('.img-1');

img1.addEventListener('load', function() {
  // woo yey image loaded
});

img1.addEventListener('error', function() {
  // argh everything's broken
});
```


#### Nested callback

그런데 콜백이 다음 같은 복합 작업 결과를 하나의 결과로 가능 과정을 Nested callback 으로 사용해 왔다.

```js
db.query('SELECT A ...', function() {
    db.query('SELECT A ...', function() {
        db.query('SELECT A ...', function() {
            db.query('SELECT A ...', function() {
                db.query('SELECT A ...', function() {
                    db.query('SELECT A ...', function() {
                        db.query('SELECT A ...', function() {
                        });
                    });
                });
            });
        });
    });
});
```

이런 복잡도를 Promise는 중첩된 콜백 패턴을 대비해서 제안된 패턴이다. 

### Promise 패턴

Promise는 ECMA script 6, chrome 32 버전부터 native promise 가 지원되기 시작했다.
Node.js 0.11.13 이후 native promise 를 지원하고 있다. 그러므로 Typescript, Node.js, Chrome Developer console 등에서 Native `Promise` 객체를 사용할 수 있다.

가장 기본적인 프라미스는 다음을 제외하면 이벤트 리스너와 약간 유사합니다.

- 프라미스는 한 번만 성공 또는 실패할 수 있습니다. 두 번 성공 또는 실패할 수 없으며, 성공을 실패로 전환하거나 실패를 성공으로 전환할 수도 없습니다.
- 프라미스가 성공 또는 실패한 후에 성공/실패 콜백을 추가하면 이벤트가 더 일찍 발생한 경우에도 올바른 콜백이 호출됩니다.

이는 비동기 성공/실패에 매우 유용합니다. 여러분은 무언가 사용 가능해진 정확한 시간에 관심이 적고 결과에 대한 응답에 관심이 많기 때문입니다.


#### 

```js
img1.ready().then(function() {
  // loaded
}, function() {
  // failed
});

// and…
Promise.all([img1.ready(), img2.ready()]).then(function() {
  // all loaded
}, function() {
  // one or more failed
});
```

#### Promise

`Promise( callback() )` 은 *resolve*, *reject* 같은 완료(성공) 상태 반환 받는다.

> var promise = new Promise((resolve, reject) => { ... });
>   - resolve() : 상태가 성공이다.
>   - reject(): 상태가 실패임을 알린다.
>   - pending(): 수행중인 상태 (fullfilled, reject 전)
>   - fullfilled() : 완료된 상태
>   - settled() : 완료 여부와 상관없이 결론이 난 상태

다음 결과가 성공하면 `resolve()` 콜백에 실패하면 `reject()` 콜백을 반환하는 코드를 작성해 보자

```ts
/* Promise */
var _promise = function(param) {
    return new Promise( (resolve, reject) => {
        setTimeout(function() {
            if(param) {
                resolve("OK solved!");
            } else {
                reject(Error("Failed!"));
            }
        }, 3000);
    });
};
```

이 _promise 객체를 사용하면,

```ts
_promise(true)
.then(function(text) {
    console.log(text);
}, function(err) {
    console.log(err);
});
```

결과에 3초 후 성공으로 표시된다.

#### `.catch()` API

체이닝 상태에서 비동기 작업 수행중에 에러를 가로채기 위해서 `.then` 중간에 사용한다.

```ts
asyncThing1()
    .then(function() { return asyncThing2();})
    .then( () => { return asyncThing3();})
    .catch((err) => { return asyncRecovery1();})
    .then(function() { return asyncThing4();}, 
        function(err) { return asyncRecovery2(); })
    .catch(function(err) { console.log("Don't worry about it");})

    .then(function() { console.log("All done!");});
```


#### `Promise.all()`

비동기 작업이 여러개의 Promise 로 구성된다면, 모두 완료하도록 처리할 수 있는 `Promise.all()` 을 사용한다.
단, all() 에 전달되는 인자는 Promise 객체여야 한다. return 구문으로 반환되는 익명함수는 안된다.


```ts
var task1 = new Promise((resolve, reject) => {
    setTimeout(function() {
        resolve("Task1 OK solved!");
    }, Math.random() * 20000 + 1000);
});

var task2 = new Promise((resolve, reject) => {
    setTimeout(function() {
        resolve("Task2 OK solved!");
    }, Math.random() * 10000 + 1000);
});

Promise.all([task1, task2])
    .then((value) => {
    console.log("All tasks completes", value);
});
```


### Bluebird

크롬이나 Typescript 의 Native Promise 객체이외에 강력한 기능을 제공하는 Promise 라이브러리들이 있다. 그 중에서 [bluebird](http://bluebirdjs.com/docs/benchmarks.html) 는 기능과 성능에서 주목받고 있다.



### Mongoose Promise

Mongoose 4 는 기본으로 [mpromise](https://www.npmjs.com/package/mpromise)를 약속한다.



기본 사용에서 mpromise가 만족스러웠지만, 고급 사용자는 [ES6-style promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 같은 [bluebird](https://www.npmjs.com/package/bluebird) 라이브러리를 플러그인으로 넣거나 혹은 네이티브 ES6 를 사용하기를 바랬다. `mongoose.Promise` 로 좋아하는 ES6 스타일 프로마이즈를 사용할 수 있다.


Mongoose ES6 native promises, bluebird, and q를 테스트했다. 어떤 라이브러리도 이론적으로 
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



## 참조

- https://developers.google.com/web/fundamentals/primers/promises
- https://codecraft.tv/courses/angular/es6-typescript/promises/

http://programmingsummaries.tistory.com/325
