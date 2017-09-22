---
title: Typescript / 5min in Typescript
date: 2017-09-01 01:00:00 +0900
layout: post
tags: [nodejs, TypeScript Tutorials, TypeScript]
categories: 
 - Programming
---

자바스크립트 개발자 또는 경험자를 위한 typescriptlang.org 의 Tutorials 를 정리했다.

 - 5분에 끝내는 TypeScript
 - [Gulp]({% post_url /nodejs/2017-09-01-typescript-2gulp %})
 - Migrating from Javascript
 - React & Webpack


## 5분에 끝내는 TypeScript

자바스크립트 개발자 또는 경험자가 알아야할 내용을 정리한 [TypeScript in 5min](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)을 정리했다.


### 설치

TypeScript는 Node.js를 사용하며, npm으로 typescript 지원 도구를 설치한다.

```sh
npm install -g typescript
```

개발자용 nightly build도 설치 할 수 있다.

```sh
npm install -g typescript@next
```

#### tsc 컴파일러 

TypeScript 소스를 `tsc` 컴파일러로 컴파일하고, 결과는 Javascript로 생성된다.

```sh
$ tsc -V
Version 2.5.2
```

최신버전 갱신은 [Typscript blog](https://blogs.msdn.microsoft.com/typescript/) 를 참조한다.


### 첫번째 TypeScript 파일

보통 Typescript 소스 확장자는 **.ts** 로 저장하고 `tsc` 컴파일러로 컴파일한다. **.ts** 파일을 컴파일 하면 **.js** 자바스크립트 소스파일이 생성된다.

예를 들어 아래 자바스크립트로 구성된 코드를 **greeter.ts** 파일에 입력한다.

```ts
function greeter(person) {
    return "Hello, " + person;
}

var user = "Jone James";

document.body.innerHTML = greeter(user);
```


그리고 컴파일 하면 자바스크립트 소스 **greeter.js** 가 생성된다.

```sh
$ tsc greeter.ts
```

> **greeter.ts** 소스와 컴파일 결과 **greeter.js** 소스는 일치한다.


### Type annotations

TypeScript에서 형(Types) 표기는 함수 혹은 변수에 의미를 부여하기 위한 방법으로, 아래 코드의 greeter 함수에 전달하는 인자가 `string` 형 이라고 의도하기 위해서 다음 같이 변수 다음 `:`으로 오른쪽에 형을 지정(annotation)해 선언한다 - 즉, 문자열로 전달할 거야 하는 의도를 선언한다고 이해하면 된다.

```ts
function greeter(person: string) {
    return "Hello, " + person;
}

var user = ['My', 1, 2, 3];
greeter(user);
```

이제 `tsc` 로 컴파일을 실행하면 아래 같이 형 지정 에러를 표시한다. 비슷하게 `greeter()` 함수의 매개변수를 모두 지우고 컴파일해도 비슷한 결과를 보여준다.


```sh
$ tsc greeter.ts
greeter_2.ts(7,9): error TS2345: Argument of type '(string | number)[]' is not assignable to parameter of type 'string'.
```

Typescript의 형 지정은 코드와 주어진 형 지정자를 기반으로 정적 분석을 제공한다.

이렇게 컴파일 에러는 발생하지만 **.js** 자바스크립트는 생성되는 것을 확인 할 수 있다. 코드에 에러가 있어도 TypeScript을 사용할 수 있다, 다만 *원래 의도데로 실행되지는 않는다*는 것을 경고해 준다.


### Interfaces

추상화를 위해 **interface** 를 사용해서 속성을 가진 개체를 선언 할 수 있다. 아래 Person 인터페이스는 firstName, lastName 속성으로 선언하고 있다. TypeScript에서는 내부 구조가 호환하면 두 객체는 호횐 된다고 한다. 이것은 명시적으로 `implements` 절을 사용하지 않고 인터페이스가 요구하는 형태를 가지면 인터페이스 통해 구현이 가능하다고 한다. 이제 greeter 함수를 인터페이스 Person 형으로 다음 같이 선언할 수 있다.

```ts
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user);
```

이 소스를 `tsc` 로 컴파일 해도 형이 일치한다고 판단해서 경고가 없다.


### Classes

자바스크립에는 없는 클래스 기반의 객체지향 프로그래밍을 지원한다. **class** 키워드로 선언하고 속성과 메서드를 가진다. 또한 생성자 `constructor()` 에 **public** 접근제한자를 지정해서 추상화 단계를 결정하게 해준다. 또한 생성자에 public 지정자는 해당 이름으로 자동으로 속성을 생성하게 해준다. 이것은 클래스가 인터페이스와 잘 결합되게 해준다.

```ts
class Student {
    fullName: string;
    constructor( public firstName: string, public middleInitial: string,
     public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);
```

`tsc`로 컴파일해도 아무 문제 없다.

다만, 클래스의 생성자 매개변수가 인자 수, 형 같이 다르면 다음 같이 에러를 발생한다.

```
greeter_4classes.ts(18,12): error TS2554: Expected 3 arguments, but got 2.
```


컴파일한 자바스크립은 HTML에서 실행할 수 있다.

```html
<!DOCTYPE html>
<html>
    <head><title>TypeScript Greeter</title></head>
    <body>
        <script src="greeter.js"></script>
    </body>
</html>
```

실제 실행하면 Person 객체는 세번째 매개변수가 없기 때문에 *undefined* 로 나타난다.

> Hello, Jane undefined


TypeScript에서 클래스 기반의 코드를 컴파일해서 자바스크립트 생성된 결과를 보면, 클래스는 자바스크립트의 프로토타입 기반의 객체지향 방법의 축약형이다.

```js
var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
```

## 참조

[Typescript in 5 min](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

