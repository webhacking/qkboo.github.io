---
title: Angular 개발환경
date: 2017-09-02 09:00:00 +0900
layout: post
tags: [nodejs, angular4, TypeScript]
categories: [Programming, Angular]
---

## Angular

모바일, 데스크탑 웹 앱 구축을 지원하는 UI Framework 이다.

Version History

- Angular 2: Initial Release   14.09.2016
- Angular 4: Release on 23.03.2017
    + 2017년 3월에 기존 2.x 버전에 호환하는 Angular 4.0.0이 출시되었다. [^1] 
- Angular 5: Currently  in beta 4 release 16.08.2017

[Angular Changelog](https://github.com/angular/angular/blob/master/CHANGELOG.md) 에서 최신 정보를 얻을 수 있다.



### Angular4 특징

기존 Angular 2에 비해 새로운게 많이 추가되었다.

##### 작고 빠르게

Angular 4 앱은 이전 버전에 비해 더 작은 공간이 소모되고 빠른 실행이 된다.

##### View engine



##### 개선된 **\*nglf** 와 **\*ngFor** 

템플릿 바인딩이 변겨오디었는데 `if/else` 문법을 사용하고 관찰할 대상에 대해 변수를 대입할 수 있다.

```html
<div *ngIf="userList | async as users; else loading">
  <user-profile *ngFor="let user of users; count as count; index as i" [user]="user">
User {{i}} of {{count}}
  </user-profile>
</div>
<ng-template #loading>Loading...</ng-template>
```

##### Angular Universal

커뮤니티 안에서 개발되던 것을 angular team에서 받아들여, Universal 은 서버에서 Angular를 실행할 수 있게 해준다. `@angular/platform-server` 에 포함되어 있다.

Angular Universal 를 배우려면 먼저 @angular/platform-server 안의 [renderModuleFactory](https://github.com/angular/angular/blob/56f232cdd70a352cb9151bc7cfe8981bc2710ea6/modules/%40angular/platform-server/src/utils.ts#L63-L72) 메서드를 살펴보고,  Rob Wormald’s [Demo Repository](https://github.com/robwormald/ng-universal-demo/) 를 살펴보라.

##### TypeScript 2.1, 2.2 호환

최신 버전의 TypeScript 를 적용했다. 그러므로 ngc 스피드를 향샹 시켰고, 앱에서 형 점검을 더 좋게 했다.

##### 템플릿을 위한 소스 맵

템플릿에서 어떤 에러가 발생하면 소스 맵을 생성해서 원래 템플릿에서 의미있는 내용을 보여준다.

#### Flat ESM / FESM

펼친 모듈을 배보한다. [예제 파일](https://github.com/angular/core-builds/blob/85cbe3f8d6107af033b0f8b56456c181cbcb5eb7/%40angular/core.js) 참조.

##### ES2015 빌드

우리 패키지를 the ES2015 Flat ESM format 형식으로 배포하고 있다. 이것은 실험적인 선택사항이다. 이 패키지와 합친 경우 7% 번들 크기가 줄어드는 것으로 복되고 있다.


#### 4.0으로 업그레이드

Angular 의존성을 4.0.0으로 업그레이드는 쉽다.

##### Linux/Mac

```sh
npm install @angular/{common,compiler,compiler-cli,core,forms,http,platform-browser,platform-browser-dynamic,platform-server,router,animations}@latest typescript@latest --save 
```

##### Windows

```sh
npm install @angular/common@latest @angular/compiler@latest @angular/compiler-cli@latest @angular/core@latest @angular/forms@latest @angular/http@latest @angular/platform-browser@latest @angular/platform-browser-dynamic@latest @angular/platform-server@latest @angular/router@latest @angular/animations@latest typescript@latest --save
```

[Angular Update guide](https://angular-update-guide.firebaseapp.com/) 참조.

