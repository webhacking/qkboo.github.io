---
title: Angular 개발환경
date: 2017-09-02 09:30:00 +0900
layout: post
tags: [nodejs, angular4, TypeScript]
categories: [Programming, Angular]
---

## Angular4 CLI

2017년 3월에 기존 2.x 버전에 호환하는 Angular 4.0.0이 출시되었다. [^1] 


<br/>
### CLI Quick Start

[Angular CLI](https://cli.angular.io/)는 명령행 인터페이스로 프로젝트를 생성, 파일 추가 그리고 개발 태스크 - 테스트, 번들, 개발에 대한 기능을 제공하고 있다.
여기서 Angular CLI로 TypeScript 에서 앱을 개발하는 과정을 [Style Guide](https://angular.io/guide/styleguide)가 권장하는데 맞게 진행해 보자

[예제 다운로드](https://angular.io/generated/zips/cli-quickstart/cli-quickstart.zip)


#### 개발환경 설정

[node.js와 npm](https://nodejs.org/en/download/)에 대해 사용이 가능해야 하고 구성해야 한다.

Angular CLI를 전역환경에 설치한다. 시간이 소요된다.

```sh
npm install -g @angular/cli
```

`ng` 명령을 사용할 수 있다.

```
ng -v
```


#### CLI에서 새 프로젝트 생성

`ng new` 명령으로 프로젝트를 생성한다 - 생성으로 관련 npm 패키지를 설치하는 과정이 길다. [^2]

```
ng new my-app
```

새로 생성한 프로젝트 디렉토리로 이동해서 서비스를 실행한다. *ng serve* 명령은 서버를 실행하고, 파일을 

```
cd my-app
ng serve --open
```



<br/>
#### Angular QuickStart Source

[Angular Quickstart Source](https://github.com/angular/quickstart.git) 를 사용해서 [CLI 없이 Angular 4를 시작](https://coursetro.com/posts/code/55/How-to-Install-an-Angular-4-App)할 수 있다. -- 여러 의존성 문제가 발생한다.
 - node v4.x.x 와 npm 3.x.x 이상을 필요로한다.


To use the Angular 2 Quickstart, you run:

```sh
$ git clone https://github.com/angular/quickstart.git my-proj
$ cd my-proj
```

Quickstart source 에 푸시하지 않으려면 *.git* 폴더를 삭제해도 무방하다.

```sh
rm -rf .git  # OS/X (bash)
rd .git /S/Q # windows
```

또한 테스트와 저장소 유지를 위해 사용하는 *non-essential*을 삭제해도 된다.

Linux (bash)

```
xargs rm -rf < non-essential-files.txt
rm src/app/*.spec*.ts
rm non-essential-files.txt
```

OS/X (bash)

```
xargs rm -rf < non-essential-files.osx.txt
rm src/app/*.spec*.ts
rm non-essential-files.osx.txt
```

Windows

```
for /f %i in (non-essential-files.txt) do del %i /F /S /Q
rd .git /s /q
rd e2e /s /q
```

패키지를 설치한다.

```
npm install
```

이제 최신 angular4 패키지를 설치하고 package.json 에 저장한다.

To upgrade, paste (Mac only):

```
npm install @angular/{common,compiler,compiler-cli,core,forms,http,platform-browser,platform-browser-dynamic,platform-server,router,animations}@next --save
```


```
npm install @angular/common@next @angular/compiler@next @angular/compiler-cli@next @angular/core@next @angular/forms@next @angular/http@next @angular/platform-browser@next @angular/platform-browser-dynamic@next @angular/platform-server@next @angular/router@next @angular/animations@next --save
```

npm install @angular/core  @angular/http --save


Typescript 이 설치되어 있지 않다면 역시 설치해 준다.

```
npm install typescript@2.3 --save
```

시작

```
npm start
```


### 앱 프로젝트 살펴보기

#### Angular component 수정

**app-root** 로 불리는 * ./src/app/app.component.ts.* 콤포넌트를 수정해 보자. 에디터에서 열고 **title** 속성을 수정해 보자.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '안녕하세요. Angular App';
}
```

*./app.component.css* 스타일시트 파일을 수정해 보자.

#### css 수정

*src/app/app.component.css* 에서 스타일을 수정해 보자.

```css
h1 {
  color: #369;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 250%;
}
```


#### 프로젝트 구성

`src` 폴더는 Angular components, templates, styles, images 등을 포함하고 있다.

|         파일         |                      설명                      |
| ------------------- | --------------------------------------------- |
| app/app.component.{ts,html,css,spec.ts} | **AppComponent**를 HTML 템플릿, CSS 스타일, 단위 테스트와 함게 선언한다. 이것은 앱에 관련한 계층적인 콤포넌트 트리가 되는 root 콤로넌트다. |


### ng 기본 명령

`ng serve` 로 서버를 제공한다. 기본 `http://localhost:4200/` 에서 확인한다. 그리고 변경된 내용은 자동으로 서버에 적용된다.

서비스 포트와 호스트는 기본 포트는 4200번으로 **.angular-cli.json** 파일에 **defaults** 섹션에 선언할 수 있다. 

```
{
  "defaults": {
    "styleExt": "css",
    "component": {},
    "serve": {
      "port": 4201,
      "host": 127.0.0.1
    }
  }
}
```


#### Code 발판

새로운 콤포넌트를 추가하려면 `ng generate component component-name` 명령을 실행하면 새로운 모듈이 추가된다. 

**ng generate** 명령

```
ng generate directive|pipe|service|class|guard|interface|enum|module
```

#### Build

Run `ng build` 명령은 프로젝트를 빌드한다. 빌드 결과물은  **dist/** 디렉토리에 저장된다. `-prod` 옵션을 사용하면 완성본을 구성할 수 있다.

#### Running unit tests

단위 테스트를 수행할 수 있는데, `ng test` 는 [Karma](https://karma-runner.github.io)를 통해서 단위테스트를 수행한다.


#### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.




## 참조

[CLI 없이 Angular 4를 시작](https://coursetro.com/posts/code/55/How-to-Install-an-Angular-4-App)

[^1]: [Angular 4.0.0 Now Available](http://angularjs.blogspot.kr/2017/03/angular-400-now-available.html)
[^2]: [Angular 4 Quick Start](https://angular.io/guide/quickstart)

