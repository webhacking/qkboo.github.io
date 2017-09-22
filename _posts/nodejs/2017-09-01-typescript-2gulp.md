---
title: Typescript / Gulp
date: 2017-09-01 01:00:00 +0900
layout: post
tags: [nodejs, TypeScript Tutorials, TypeScript]
categories: 
 - Programming
---

자바스크립트 개발자 또는 경험자를 위한 typescriptlang.org 의 Tutorials 를 정리했다.

 - [5분에 끝내는 TypeScript]({% post_url /nodejs/2017-09-01-typescript-1quickstart %})
 - Gulp
 - Migrating from Javascript
 - React & Webpack


## Gulp

[Gulp](http://gulpjs.com/) 와 함께 TypeScript 를 빌드할 수 있고 Gulp pipeline에 Browserify, uglify, or Watchify 를 추가할 수 있다. 여기서 Babelify를 사용한 Babel 함수화에 대한 함수화를 추가할 것이다.

> Node.js와 npm을 다룰 수 있다고 가정한다.

### 프로젝트

새로운 프로젝트 디렉토리 *proj* 를 만들고, 

```
mkdir proj
cd proj
mkdir src
mkdir dist
```

이 프로젝트 아래 *src*,*dist* 를 추가한다.

```
proj/
   ├─ src/
   └─ dist/
```

그리고 package.json 파일을 만들기 위해 초기화 한다.

```
npm init
```

여러가지를 묻는데 그 중 시작점을 `./dist/main.js`로 지정한다.


#### 의존성 설치

**gulp-cli** 를 글로벌로 설치한다.


```
npm install -g gulp-cli
```


이어서 **typescript**, **gulp**, **gulp-typescript** 를 설치하고 dev 의존성으로 저장한다.

```
npm install --save-dev typescript gulp gulp-typescript
```


#### 간단한 예제

src 폴더에 main.ts 를 작성하자.

```ts
function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
```

proj 폴더의 루트에 tsconfig.json을 작성한다.

```json
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

proj 폴더 루트에 gulpfile.js 를 작성한다.

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
```

빌드하고 node로 실행한다.

```
gulp
node dist/main.js
```


#### 모듈을 추가한다

모듈을 추가해 보자, src/greet.ts 소스를 작성한다.

```ts
export function sayHello(name: string) {
    return `Hello from ${name}`;
}
```

`export` 는 함숭름 sayHello를 외부에서 사용할 수 있게 해준다. 이 모듈을 src/main.tx 에서 `import` 로 들여와서 사용한다. ES2015 모듈 문법을 사용하는데 Typescript은 CommonJS 모듈을 이어받아 사용한다.

```ts
import { sayHello } from "./greet";

console.log(sayHello("TypeScript"));
```

모듈은 tsconfig.json 에 등록해주어야 한다.

```
{
    "files": [
        "src/main.ts",
        "src/greet.ts"
    ],
    ...
}
```

빌드하고 node로 실행한다.

```
gulp
node dist/main.js
```


### Browserify

이제 Node 앱을 브라우저로 이전해 보자. 우리 모든 번들을 자바스크립으로 무꺼어야 한다. 이것은 Browserify가 수행해 준다. 이 모듈도 또한 CommonJS 모듈시스템을 사용한다. 그러므로 TypeScript과 Node.js 설정을 쉽고 변경없이 이전이 가능하다.

먼저 tsify와 vinyl-source-stream 을 설치한다. tsify 는 Browserify 플러그인으로 타입스크립트 컴파일러에 접근하게 해준다. vinyl-source-stream은 browserify의 결과 파일을 gulp가 이해하는 vinyl 형식으로 호환해준다.

```
npm install --save-dev browserify tsify vinyl-source-stream
```


#### 페이지 생성

src에 index.html 파일을 만든다.

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello World!</title>
    </head>
    <body>
        <p id="greeting">Loading ...</p>
        <script src="bundle.js"></script>
    </body>
</html>
```


main.ts 를 페이지에 접근할 수 있게 갱신한다.

```ts
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
```


그리고 gulfile.js 를 변경한다.

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var paths = {
    pages: ['src/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
});
```

 - 기본 의존성으로 copy-html 태스크를 추가한다: 가장먼저 copy=html 이 실행된다.
 - Browserify를 호출해서 gulp-typescript 대신 tsify 플러그인을 사용한다.
 - bundle()이 호출되고 vinyl-source-stream을 사용해 bundle.js 로 소스를 모은다.

> Notice that we specified debug: true to Browserify. This causes tsify to emit source maps inside the bundled JavaScript file. Source maps let you debug your original TypeScript code in the browser instead of the bundled JavaScript. You can test that source maps are working by opening the debugger for your browser and putting a breakpoint inside main.ts. When you refresh the page the breakpoint should pause the page and let you debug greet.ts.

마지막으로 `gulp` 로 빌드하고 dist/index.html을 브라우저에서 실행해 보자.


### Watchify, Babel, Uglify

Browserify로 코드를 묶었다. 다음 Browserify 플러그인으로 더 확장된 빌드를 구현할 수 있다.

 - Watchify: gulp 를 시작하고 증분 컴파일을 할 수 있다. 수정-저장-갱신 사이클을 브라우저에서 유지할 수 있다.
 - Babel: ES2015  와 ES5, ES3 으로 변환할 수 있는 컴파일러 이다. Typescript 이 지우너하지 않는 사용자화 변경과 확장을 추가할 수 있다.
 - Uglify: 다운로드 시간을 줄일 수 있도록 코드를 압축한다.

#### Watchify

다음 같이 설치한다.

```
npm install --save-dev watchify gulp-util
```

gulpfile.js 를 watchify 와 gulp-util 을 사용하게 변경한다.

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var paths = {
    pages: ['src/*.html']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});


function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
```

- We wrapped our browserify instance in a call to watchify, and then held on to the result.
- We called watchedBrowserify.on("update", bundle); so that Browserify will run the bundle function every time one of your TypeScript files changes.
- We called watchedBrowserify.on("log", gutil.log); to log to the console.


이제 gulp 를 실행하며 watchify에 의해 소스 변경을 점검하고 변경시 컴파일을 한다.

```sh
$ gulp
[04:39:43] Using gulpfile ~/Works/typescript/proj/gulpfile.js
[04:39:43] Starting 'copy-html'...
[04:39:43] Finished 'copy-html' after 105 ms
[04:39:43] Starting 'default'...
[04:39:52] 3199 bytes written (0.38 seconds)
[04:39:52] Finished 'default' after 8.66 s
```

#### Uglify

uglify 는 코드를 난독화 시키고, 용량을 줄여 준다.

```
npm install --save-dev gulp-uglify vinyl-buffer gulp-sourcemaps
```

gulpfile.js에 추가한다.

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist"));
});
```

uglify 는 한번 호출하는데 - sourcemaps를 유지하기 위해 버퍼링하고 소스맵을 하기 위해 호출한다. 이것으로 분리된 소스맵 파일을 생성한다. gulp를 실행해 bundle.js 를 통해 최소화된 파일로 출력되는지 점검할 수 있다. 

```
gulp
cat dist/bundle.js
```



#### Babel

Babel과 Bebel preset ES2015를 설치한다. 기본 설정으로 Uglify 같이 코드를 난독화 한다. 역시 vinyl-buffer, gulp-sourcemaps 가 필요하다. 파일 확장자 .js, .es, .es6 and .jsx 에 대해서만 다룬다. 그러므로 **.ts** 확장자도 추가할 필요가 있다.

```
npm install --save-dev babelify babel-preset-es2015 vinyl-buffer gulp-sourcemaps
```

gulpfile.js 를 

```js
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

gulp.task('copyHtml', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['copyHtml'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});
```

그리고 tsconfig.js에 typescript 의 대상을 *"target": "es5"*에서 ES2015로 명시해 준다.
Babel’s ES5 output should be very similar to TypeScript’s output for such a simple script.

