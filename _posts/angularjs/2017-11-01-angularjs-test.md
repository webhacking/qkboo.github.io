---
title: Angularjs - Karma Unit Testing
date: 2017-11-01 09:00:00 +0900
layout: post
tags: [nodejs, angularjs, unit testing, karma, jasmine]
categories: [Programming, Angularjs]
---

angularjs 단위 테스트에 대해 정리한다.
 - angularjs 1.6.x 에서 진행했다.
 - macOS, Linux 환경에 적합하다.

node.js 를 nvm 가상환경에서 구축하고 사용하는 방법에 대해서는 [Node.js Install with nvm]({% post_url /nodejs/2017-04-01-nodejs-install-nvm %}) 를 참조하면 된다.

angularjs 단위 테스트에 대해 참고한 문서는 아래 **참고** 섹션에 제공했다.

## Angularjs Testing

angularjs는 unit test와 E2E (end to end) 테스트를 제공하고 있다.

| Unit testing | E2E testing |
| --------------------------------- | ---------------------------------- |
| 코드/모듈/함수 레벨 테스트팅             | 웹 UI 테스팅                         |
| 서비스, 클래스, 오브젝트 테스트에 적합      | 웹 서버 필요                    |
| 샌드박스, 독립 테스트에 적합             | 통합 테스트에 적합                       |
|     | 랜더링 결과와 angularjs 데이터 부합 확인 |
| fast                              | 느리다 |

### Karma

자바스크립트 단위 테스트 도구로 테스트 러너 설정시 번거로운 부분을 쉽게 할 수 있다.

#### 시작

nodejs가 설치되었으면 새 프로젝트 폴더에서 npm init 로 프로젝트를 초기화 하고 

```sh
$ mkdir angularjs-karma-test 
$ cd angularjs-karma-test
$ npm init
```

글로벌로 karma와 jasmine framework를 설치한다.

```sh
$ npm i –g karma
$ npm i -g jasmine jasmine-core
```

> 만약 karma를 프로젝트의 로컬 dev 모드로 설치한다면 jasmine도 같이 로컬로 설치하자.
> 
> ```sh
> $ npm i -D jasmine jasmine-core
> $ npm i -D karma
> ```

프로젝트에 angularjs 모듈과 mock 모듈을 설치해 준다.

```sh
$ npm i angular
$ npm i -D angular-mocks
```

그리고 karma.conf.js 파일을 만들기 위해 `karma init` 명령을 실행하면 선택 입력 항목을 물어 온다. 기본 설정으로 진행한다.

```sh
Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> jasmine

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no

Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> Chrome
>

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
>

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
>

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> yes

Config file generated at "/Users/qkboo/www-app/angularjs-karma/karma.conf.js".
```

현재 설정을 테스트하기 위해 start 명령으로 시작하면 karma 서버가 시작된다.

```sh
$ karma start
20 12 2017 12:41:02.798:INFO [karma]: Karma v1.7.1 server started at http://0.0.0.0:9876/
```

데스크탑 환경이면 karma.conf.js 에 지정한 브라우저가 실행되어 보여준다.

#### 테스트 스펙 작성

실제 테스트 시나리오를 기술하는 jasmine 테스트 스펙 파일은 아래 같은 구조를 가지고 있다.

```js
describe('테스트 대상 설명', function() {
  // 테스트 전처리
  before(function() {
  });

  // 테스트 후처리
  after(function() {
  });

  // it 마다 매번 실행하는 전처리
  beforeEach(function() {
  });

  // it 마다 매번 실행하는 후처리
  afterEach(function() {
  });

  it('테스트 내용 설명', function() {
    // 테스트
  });

  it('테스트 내용 설명', function() {
    // 테스트
  });
});
```


#### 테스트 코드 작성

app/src/app.js

```js
angular.module('myapp', [
    'myapp.service'
]);
```

서비스 모듈을 생성하고 테스트 해보자, test/test.service.js 테스트 스펙을 작성해 보자.

**app/src/test/test.service.js**

```js
describe("서비스 테스트", function() {
  beforeEach(module('myapp.service')); //모듈 로드

  describe('서비스 모듈 버전 테스트', function() {
    it('현재 버전 반환', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
  
});
```


myapp.service.js를 작성한다.

**app/src/service/myapp.service.js**

```js
angular.module('myapp.service', [])
.value('version', '0.1')  //버전
;
```

karma를 종료했다 다시 실행한다 -- (소스 및 스펙 변경이 바로 적용 안된다면...)

이제 테스트 스크립을 실행해 보기 위해 karma.conf.js에 소스 파일들을 명시하자. files는 karma가 실행될 때 로드되는 파일의 path를 가지고 있는 배열이다. 

```js
  files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/src/app.js',
      'app/src/service/myapp.service.js',
      'app/src/test/test*.js'
  ],
```

앞서 실행한 karma 를 종료하지 않아도 된다. 소스를 추가하고 변경하면 테스트가 자동으로 시작된다. 브라우저는 angular-mock으로 테스트하는 프레임워크로 브라우저 내용에는 별다른 정보가 나타나지 않는다, 

터미널에 테스트가 실패하면 

```
Chrome 63.0.3239 (Mac OS X 10.12.6) 서비스 테스트 서비스 모듈 버전 테스트 현재 버전 반환 FAILED
  Expected '0.1' to equal '1.0'.
```

버전 정보를 요구되는 값으로 변경하고 저장하면 로그에 다음 같이 테스트 스크립 성공 여부가 표시된다.

```sh
Chrome 63.0.3239 (Mac OS X 10.12.6): Executed 1 of 1 SUCCESS (0.016 secs / 0.012 secs)
```




#### 컨트롤러 테스트 작성

컨트롤러는 Scope을 통해 데이터 바인딩이에 대해 ...

**app/src/test/test.service.js** 테스트 스펙을 작성해 보자.
 - 1. 컨트롤러 모듈을 들여오고
 - 2. 필요한 모듈, 여기서 $scope를 주입하고
 - 3. 모듈에 적재되었는지 테스트한다.

```js
describe("서비스 테스트", function() {
  var scope;

  // 1. 모듈을 들여오고
  beforeEach(module('myapp.controller')); //모듈 로드

  describe('컨트롤러 모듈 테스트', function() {
    //2. 필요한 모듈, 여기서 $scope를 주입하고
    it('컨트롤러 들여오기', inject( ['$rootScope', '$controller', 
      function($rootScope, $controller) {
        // 새 스코프
        scope = $rootScope.$new();
        // 대상 컨트롤러에 의존성을 주입하고 들여온다.
        userListController = $controller('userListController', {
          $scope : scope
        });
      }])
    );
    //3. 모듈에 적재되었는지 테스트한다.
    it('userListController 컨트롤러가 정의되어 있다.', function() {
      expect(userListController).toBeDefined();
    })
  });
});
```

실제 컨트롤러 소스 가 없으므로 아래 같이 에러가 발생한다.

```
Chrome 63.0.3239 (Mac OS X 10.12.6) 서비스 테스트 컨트롤러 모듈 테스트 userListController 컨트롤러가 정의되어 있다. FAILED
  ReferenceError: userListController is not defined
      at UserContext.<anonymous> (app/src/test/test.controller.js:18:14)
Chrome 63.0.3239 (Mac OS X 10.12.6): Executed 2 of 3 (2 FAILED) (0 secs / 0.013 sec
Chrome 63.0.3239 (Mac OS X 10.12.6): Executed 3 of 3 (2 FAILED) (0 secs / 0.018 sec
Chrome 63.0.3239 (Mac OS X 10.12.6): Executed 3 of 3 (2 FAILED) (0.026 secs / 0.018 secs)
```

이제 **app/src/controller/myapp.controller.js** 소스를 작성한다.

```js
angular.module('myapp.controller', [])

.controller('userListController', ['$scope', function($scope) {
    $scope.test = "Hello Test!";
}])
;
```

이제 myapp.controller.js 를 karma.conf.js에 추가해 준다.

```js
  files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',

      'app/src/app.js',
      'app/src/service/myapp.service.js',
      'app/src/controller/myapp.controller.js',
      'app/src/test/test*.js'
  ],
```

karma를 종료했다 다시 실행한다 -- (소스 및 스펙 변경이 바로 적용 안된다면...) 실제 테스트가 제대로 수행되면 알개 같이 SUCCESS 메시지를 볼 수 있다.

```
Chrome 63.0.3239 (Mac OS X 10.12.6): Executed 3 of 3 SUCCESS (0.018 secs / 0.013 secs)
```


#### 컨트롤로 메서드 단위 테스트

myapp.service 에 'UserService' 를 선언한다.

```js
angular.module('myapp.service', [])

.factory('UserService', [function() {
  return {};
}])
```

컨트롤러에 userList 배열을 선언해 주낟.

```js
.controller('userListController', ['$scope', function($scope) {
    $scope.test = "Hello Test!";

    $scope.userList = [];    
}])
```

test.controller.js 스펙에

```js
describe("서비스 테스트", function() {

  var userListController, scope, mockService;

  beforeEach(module('myapp.controller')); //모듈 로드

  describe('컨트롤러 모듈 테스트', function() {
    it('컨트롤러 들여오기', inject( ['$rootScope', '$controller', 
      function($rootScope, $controller) {
        scope = $rootScope.$new();

        //임의 사용자 조회 서비스를 만든다.
        mockService = {
          getUserList: function(callback) {
            callback.call(null, [{name : 'Hello'}]);
          }
        }

        // 대상 컨트롤러에 의존성을 주입하고 'UserService' 서비스를 주입한다.
        userListController = $controller('userListController', {
          $scope : scope,
          UserService: mockService
        });
      }])
    );
    it('userListController 컨트롤러가 정의되어 있다.', function() {
      expect(userListController).toBeDefined();
    });
    // 사용자 조회 함수를 테스트 한다.
    it('사용자를 조회한다.', function() {
      scope.searchUsers();
      // 1건의 결과가 있다.
      expect(scope.userList.length).toEqual(1);
    });
  });
});
```

컨트롤러에 searchUsers() 함수가 없으므로 에러가 발생한다.

```
  TypeError: scope.searchUsers is not a function
```

컨트롤러에 UserService를 주입하고, searchusers() 함수를 선언해 준다.

```js
.controller('userListController', ['$scope','UserService', function($scope, UserService) {
    $scope.test = "Hello Test!";

    $scope.userList = [];

    $scope.searchUsers = function() {
      UserService.getUserList(function(data) {
        $scope.userList = data;
      })
    }
}])
```


#### 서비스 단위 테스트

앞서 서비스로 UserService 팩토리를 선언했다. 제대로 들여오는지 테스트 스펙에 다음 같이 선언할 수 있다. test.service.js 스펙에 다음을 추가하자.

```js
it('UserService가 정의되어 있다', inject(function(UserService) {
  expect(UserService).toBeDefined();
}));
```

이제 getUserList() 함수를 테스트해보자

```js
  var users;

  it('UserService.getUserList 가 사용자를 조회한다', inject(function(UserService, $httpBackend) {
    // http 응답
    $httpBackend.when('GET', 'sample.json')
      .response([{ name : 'test'}]);

    //서비스를 호출한다.
    UserService.getUserList(function(data) {
      users = respond.data;
    });
    $httpBackend.flush();

    // http 응답에 1건이 있으므로
    expect(d.length).toBe(1);
  }))
```

실제 getUserList() 함수가 구현 안되어 있으므로 다음 같이 실패가 나타난다.

```
20 12 2017 14:59:44.061:INFO [watcher]: Changed file "/Users/qkboo/www-app/angularjs-karma/app/src/test/test.service.js".
Chrome 63.0.3239 (Mac OS X 10.12.6) 서비스 테스트 UserService.getUserList 가 사용자를 조회한다 FAILED
  TypeError: UserService.getUserList is not a function
```

실제 서비스 객체에 함수를 선언해 주자.

```js
.factory('UserService', ['$http', function($http) {
  return {
    getUserList: function(callback) {
      $http.get('sample.json')
        .then(callback);
    }
  };
}])
```


#### Directive 테스트


```js
describe("디렉티브 테스트", function() {

  beforeEach(module('myapp.directives')); //모듈 로드

  describe('app-version 디렉티브 테스트', function() {
    it('현재 버전 출력', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });

      inject( ['$compile', '$rootScope', 
        function($compile, $rootScope) {
          var element = $compile('<span app-version></span>')($rootScope);
          expect(element.text()).toEqual('TEST_VER');
      }]);

    });//it
  });
});
```

디렉티브 모듈을 선언한다

```js
angular.module('myapp.directives', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);
```

추가한 소스를 karma.config.js 에 추가해 준다.

```js
files: [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',

        'app/src/app.js',
        'app/src/service/myapp.service.js',
        'app/src/controller/myapp.controller.js',
        'app/src/directive/myapp.directive.js',
        'app/src/test/test*.js'
    ],
```


#### 필터 테스트

필터를 테스트 할 때는 필터를 inject 한 후에 호출하면서 진행한다. 먼저 테스트 스펙을 작성해 보자.

```js
describe("필터 테스트", function() {

  beforeEach(module('myapp.filters')); //모듈 로드

  var $filter;

  describe('length 필터 테스트', function() {
    beforeEach(inject(function( _$filter_) {
      $filter = _$filter_;
    }));

    it('null 이면 0을 반환', function() {
      var length = $filter('length');
      expect(length(null)).toEqual(0);
    })
  });
});
```


length 필터를 선언한 myapp.filters.js 소스

```js
angular.module('myapp.filters', [])
.filter('length', function() {
  return function(text) {
    return ('' + (text || '')).length;
  }
})
```


karma.config.js 에 필터 소스를 추가해 준다. 

추가한 소스를 karma.config.js 에 추가해 준다.

```js
files: [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',

        'app/src/app.js',
        'app/src/service/myapp.service.js',
        'app/src/controller/myapp.controller.js',
        'app/src/filter/myapp.filters.js',
        'app/src/test/test*.js'
    ],
```


새 컨트롤이 추가된 후 karma를 재시작해서 테스트를 진행한다.


{% comment %}

<br>
<br>
### 샘플 테스팅 프로젝트 


#### (윈도우)

> [테스트 프로젝트](https://github.com/eu81273/angularjs-testing-example.git) [^Angularjs 테스팅 - 이론부터 실전] 를 사용하자.

nodejs가 설치되었으면 테스트 프로젝트 폴더에서 karma를 설치한다.

```
$ cd angularjs-testing-example
$ npm i –g karma
```

그리고 필요하다면 karma 실행 파일 경로를 찾아서 PATH 환경변수에 추가해 준다.

```
$ which karma
/Users/qkboo/.nvm/versions/node/v8.9.1/bin/karma
```


#### $inject 를 사용한 컨트롤러 예제

http://guswnsxodlf.github.io/how-to-test-angularjs-using-karma-jasmine

app/src/app.js

```js
angular.module('myapp', [
    'test.controller'
]);

angular.module('test.controller', []);
```

app/src/controller/myapp.controller.js

```js
angular.module('test.controller').controller('MainCtrl', ['$scope', function($scope){
    $scope.test = "Hello!";
}]);
```

그리고 karma 테스트 스펙을 작성한다. 테스트 스펙은 외부 모듈을 [ngMock](https://docs.angularjs.org/api/ngMock/function/angular.mock.inject) 를 사용해서 들여온다.

app/src/test/testController.js

```js
describe("컨트롤러 테스트", function() {
  beforeEach(module('test.controller')); //모듈 로드

  var $controller;
  beforeEach(inject(function(_$controller_){ // inject 
    $controller = _$controller_;
  }));

  describe('MainCtrl', function() { // 컨트롤러가 로드됐는지...
    it('MainCtrl이 정의되어 있다', function(){
      var $scope = {};
      var MainCtrl = $controller('MainCtrl', { $scope: $scope });
      expect(MainCtrl).toBeDefined();
      expect($scope.test).toEqual("Hello Test!"); // 변수 테스트
    });
  });
});
```

이제 테스트 스크립을 실행해 보기 위해 karma.conf.js에 소스 파일들을 명시하자. files는 karma가 실행될 때 로드되는 파일의 path를 가지고 있는 배열이다. 

```
 files: [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'app/src/app.js',
        'app/src/controller/MainCtrl.js',
        'app/src/test/test*.js'
    ],
```

앞서 실행한 karma 를 종료하지 않아도 된다. 소스를 추가하고 변경하면 테스트가 자동으로 시작된다. 브라우저는 angular-mock으로 테스트하는 프레임워크로 브라우저 내용에는 별다른 정보가 나타나지 않는다, 

터미널에 테스트가 실패하면 

```
Chrome 63.0.3239 (Mac OS X 10.12.6) 컨트롤러 테스트 MainCtrl MainCtrl이 정의되어 있다 FAILED
  Expected 'Hello!' to equal 'Hello Test!'.
```

{% endcomment %}


## 참고
 - [Angularjs 테스팅 - 이론부터 실전]: http://programmingsummaries.tistory.com/327
 - [angularjs Unit Testing](https://docs.angularjs.org/guide/unit-testing)
 - [Angularjs 테스팅](http://webframeworks.kr/tutorials/angularjs/angularjs_unit_test/)
 - https://blog.outsider.ne.kr/1020


[^Angularjs 테스팅 - 이론부터 실전]: http://programmingsummaries.tistory.com/327

