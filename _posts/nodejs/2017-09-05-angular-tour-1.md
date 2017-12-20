---
title: Angular4 Tutorial for Beginner -- (1)
date: 2017-09-05 09:00:00 +0900
layout: post
tags: [nodejs, angular4, TypeScript]
categories: [Programming, Angular]
---

Angular 이용에 대한 튜토리얼은 [Angular Tutorial for beginners to Professionals](https://www.tektutorialshub.com/angular-2-tutorial/) 를 요약하고 있다.

## Angular App

여기서는 angular cli를 사용해서 angular project를 생성하고 다루는데, 링크 [Angular Cli Usages]({% post_url /nodejs/2017-09-02-angular-cli %}) 에서 새 프로젝트 실행에 대해 살펴볼 수 있다.
> Anguar 의 개발 환경은 [Create Angular2](https://www.tektutorialshub.com/create-first-angular-2-application/) 를 참조한다.

#### 프로젝트 생성

`ng new` 명령으로 프로젝트를 생성한다. 

```
ng new myproducts
```

새로 생성한 프로젝트 디렉토리로 이동해서 서비스를 실행한다. *ng serve* 명령은 서버를 실행

```
cd myproducts
ng serve
```

브라우저로 localhost:4200 으로 접속


#### 디렉토리 구성

`ng new` 생성하는 템플릿은 이렇게 구성되 있다.

**Root** 폴더

- **Angular-cli.json**: Angular CLI를 위한 구성 파일.
**.editorconfig**:  에디터 설정 파일. http://editorconfig.org 참고.
**.gitignore**: git 소스 제어를 하지 않는 설정 파일.
- **karma.conf.js**: karma test runner 설정 파일.
- **package.json**: npm 패키지 목록 설정 파일
- **protractor.conf.js**: The Configuration file for protractor end to end test runner.
- **README.md**
- **tsconfig.json**: TypeScript compiler configuration for your IDE to pick up and give you helpful tooling.
- **tslint.json**: tslint is a static code analysis tool used in software development for checking Typescript code quality. To check if TypeScript source code complies with coding rules. TSLint checks your TypeScript code for readability, maintainability, and functionality errors
- **typings.d.ts**: Typescript type definition file

**e2e** 폴더

*protractor* 가 엔드투엔드 테스트하는데 필요한 파일을 포함한다. *Protractor*는 실제 브라우저에 대비해 앱을 테스트할 수 있게 한다. [여기](http://www.protractortest.org/#/)서 자세한 것은 배울 수 있다.


### 콤포넌트 분석

Angular CLI로 생성한 프로젝트는 여러 콤포넌트로 구성되어 있다. *src/app/* 밑에 콤포넌트 소스가 있다.

#### app.component.ts

앱의 뷰를 표현하고, 뷰는 화면의 한 부분이다. 3개로 구성되어 있다. class, class decorator, import statement

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
```

**export** 키워드로 AppComponent class는 다른 콤포넌트에서 사용할 수 있다. 이런 콤포넌트 클래스는 속성과 메서드를 가질 수 있다.

**@Component** decorator는 클래스 데코레이터로 이 콤포넌트에 대한 메타데이터를 제공한다. 이 메타데이터를 사용해서 Angular가 뷰를 생성한다.
 - templateUrl:
 - styleUrl:
 - selector: angular에게 템플릿을 표시할 곳을 말한다. 이 콤포넌트에서 app-root 셀렉터는 index.html에서 사용한다.

**import** 구문 외부 라이브러리를 콤포넌트에서 사용하고자 할 때 사용. 여기서 @angular/core 라이브러리에서 Component 데코레이터를 가져왔다.

#### Root 모듈

angular 앱은 모듈로 구성된다. *app.module.ts* 소스를 루트 모듈(root module)로 부른다.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Angular 모듈의 구조는 콤포넌트 클래스와 비슷하다. class, class decorator, import

**Module class** 는 콤포넌트와 비슷하게 *export*로 외부 모듈에서 사용할 수 있다.

```ts
export class AppModule { }
```

Angular 모듈은 **@NgModule** 데코레이터를 필요로 한다. 이 데코레이터로 모듈에 관련한 메타데이터를 전달한다. 소스에서 **@NgModule**은 *declarations*, *imports*, *providers*, *bootstrap* 네 가지 필드를 선언하고 있다.
 - **imports**: 이 모듈에서 사용하는 모듈을 선언한다.
 - **Declarations**: 이 모듈에 관련한 콤포넌트, 디렉티브, 파이프를 선언한다.
 - **Providers**: 서비스를 선언하면 다른 콤포넌트가 사용할 수 있다.
 - **Bootstrap**: 메타 데이터는 루트 콤포넌트를 식별한다.


#### Import 구문

**AppModuel** 에서 요구하는 외부 라이브러리를 들여오는데 사용한다. 또한 원하는 AppComponent를 들여오기 위해서 AppComponent가 필요하다.


### 부트스트래핑

루트 모듈을 부트스트랩 해보자. 먼저 화면에 보이기 위해서 템플릿 파일인 app.component.html 이 있다. 이것은 AppComponent에 바인딩 된다. 결국 AppComponent 가 AppModule이 로드될 때 부트스트랩된다고 알 수 있다.

그래서 앱이 올라올 때 Angular에게 AppModule을 적재하자고 묻는데 이것은 **src/main.ts** 파일에서 완성된다.


```ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
```

 - **platformBrowserDynamic** 콤포넌트: angular 앱에서 부트스트랩을 위해 필요한 모든 함수들.
 - **enableProdMode**: 기본적으로 개발자 모드로 실행하게 한다.
 - **environment**: *environment.ts* 는 개발자 모드 환경이 있다. 개발자 환경에서 environments.ts 파일을 사용한다. 실제 상업 모드에서는 environments.prod.ts 가 사용된다. **env** 맵의 목록에서 어떤 파일이 사용되는지 확인할 수 있는데 **angular-cli.json** 파일에 있다.


#### index.html

앱의 메인 페이지이다. **<app-root>** 셀렉터가 콤포넌트를 태그 처럼 사용하게 한다. app.component.ts에 선언한데로 이 셀렉터에 템플릿이 표시된다.


### 다른 파일

app 폴더 밑에 다른 파일을 살펴보자.

#### Assets 폴더

이미지 혹은 앱을 빌드하는데 필요한 자원을 넣어 두는 곳.

#### polyfills.ts

웹 표준을 다르게 구현/지원하는 여러 브라우저를 위해 일반화를 해준다. 브라우저 지원 가이드에 따라서 **core-js**, **zone.js** 로 관리한다.

#### styles.css

전역에 지원하는 스타일을 선언한다.

#### test.ts

단위 테스트를 위한 관문.

#### tsconfig.{applspec}.json

타입스크립 컴파일러 구성 과 테스트 구성파일.


### ng 명령

ng new, init, 

#### ng new 명령

```
ng new <project-name> [Options]
```

 - **--dry-run**, **-d**: 시험 실행, 실제 프로젝트 파일은 만들지 않고 출력 파일만 생성한다. 
 - **--verbose**, **-v**: 
 - **--skip** : 프로젝트 생성 후에 npm 명령 실행 못한다.
 - **--skip-git**: 이 프로젝트에는 git repository 생성 못한다.
 - **--** : 새 프로젝트를 생성할 부모 디렉토리.




## 참조

 - https://www.tektutorialshub.com/create-first-angular-2-application/
