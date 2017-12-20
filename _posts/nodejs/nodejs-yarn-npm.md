
## Yarn

[Yarn](https://yarnpkg.com/)은 Facebook, Google, Exponent, Tilde가 만든 npm을 대체 할 수 있는 새로운 패키지 관리자 이다. npm의 두 가지 큰 문제를 해결하고자 한다,[^Yarn vs npm: Everything You Need to Know]
 - npm 의 패키지 설치가 만족스럽게 빠르지 않다.
 - 보안 문제가 우려되고 있다. 설치시에 코드가 실행되도록 하고 있다.

### 다른 듯 같은 점

yarn의 버전 표기가 다르기 때문에 같은 패키지를 서로 다른 버전으로 설치하는 잘못이 발생할 수도 있다. 

npm 5 이후 많은 개선이 이루어 졌다. [^npm 5 vs yarn]
 - `npm i` 는 자동으로 package.json에 의존성을 저장한다.
 - `npm-shrinkwrap` 가 사라지고 yarn 같이 `package-lock.json` 파일이 추가되었다.


#### package.json

이 파일은 npm과 yarn에서 의존성을 유지하기 위해 사용한다. 그러나 버전 번호가 다를 수 있다. 버전을 major와 minor 로 선택할 수 있고,  표기가 다음 같이 다르다 [^npm-vs-yarn]

> node version: v8.0.0
> npm verison: 5.0.0
> yarn verison: 0.24.6

[^npm-vs-yarn]: https://github.com/appleboy/npm-vs-yarn


npm, yarn 양쪽 버전이 package.json에 명시되어 설치되는 문제가 생길 수 있다. 이것을 피하기 위해 정확히 yarn으로 설치되는 버전은 `yarn.lock` 에 관리된다.

npm에서도 `npm shrinkwrap` 명령이 lock 파일을 생성해서 npm install 이 package.json을 읽기 전에 읽어 설치하는 것은 yarn.lock 을 먼저 읽는 것과 같다. 다만 yarn은 기본적으로 yarn.lock을 생성하고 업데이트 한다는 것이다.

#### 병렬 설치

npm 이 패키지를 설치하는 작업은 각 패키지를 설치하고 순차적으로 진행한다. yarn은 설치 작업을 별령로 진행한다.

express 패키지 42개를 설치할 때

```
npm: 9 seconds
Yarn: 1.37 seconds
```

gulp package 는 의존하는 195개 패키지를 설치한다.

```
npm: 11 seconds
Yarn: 7.81 seconds
```

#### 출력

npm 설치 과정은 장황스럽게 표시된다. yarn은 기본적으로 조금 단순하고 자세한 출력 옵션은 별도로 있다.

### CLI 의 다른 점

#### yarn global

글러벌 설치시 npm은 `-g`, `--global` 을 사용하는데, yarn은 `global` 첨자를 사용한다이다. 그리고 npm과 같이 글로벌 설치시에는 프로젝트 지정 의존성이 글로벌로 설치되지 않는다.

`global` 앞첨자는 `yarn add`, `yarn bin`, `yarn ls` `yarn remove` 에서만 동작한다.


#### yarn install

npm install 은 package.json 에 명시된 패키지들의 의존성을 설치한다. yarn은 순서데로 yarn.locak 혹은 package.json에 명시된 의존성을 설치한다.


#### yarn add [-dev]

npm은 package.json에 의존성을 추가하려면 `npm install --save` 별도의 플래그를 사용한다. yarn은 `yarn add <package>` 는 패키지를 설치하고 package.json에 의존성으로 추가한다. 그리고 `--dev` 플래그를 주면 developer dependency에 추가해 준다.


#### yarn licenses [ls|generate-disclaimer]

`yarn license ls` 는 패키지의 라이센스를 목록을 출력한다. `yarn license generate-disclaimer` 는 모든 패키지의 라이센스 내역에 대한 면책조항을 생성한다.

#### yarn why

의존성 그래프와 그림을 출력해 준다.


#### yarn upgrade <pacakge>

`npm update`와 비슷하게, `yarn upgrade` 는 package.json에 명시된 패키지를 업그레이드하고 yarn.lock을 재 생성한다.

주목할 점은 패키지를 명시해서 업그레이드 하면 최신 릴리즈로 갱신하고 package.json에 태그를 선언해 둔다. 메이저 릴리즈로 패키지를 업데이트 해준다는 의미이다.


#### yarn generate-lock-entry

yarn generate-lock-entry 명령은 package.json을 기초로 yarn.lock 을 생성한다. 이것은 npm shirinkwrap 과 비슷하다. 다만 주의해서 사용해야 하는데 yarn.lock 파일은 yarn add, yarn upgrade 시 생성되거나 업데이트 된다.


<br>
### 설치

https://yarnpkg.com/en/docs/install#linux-tab 에 설명되어 있다.

#### macOS

```
brew install yarn
```

nvm 같은 가상환경을 사용하면 node.js 설치를 제외한다.

```
brew install yarn --without-node
```


#### Ubuntu 16.04이하, 데비안 정식버전 에서

```sh
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

```sh
sudo apt update && sudo apt install yarn
sudo apt-get update && sudo apt-get install yarn
```

#### openSUSE

On openSUSE, you can install Yarn via our RPM package repository.

```sh
sudo zypper ar -f https://dl.yarnpkg.com/rpm/ Yarn
sudo zypper in yarn
```


#### 스크립 혹은 npm

```
curl -o- -L https://yarnpkg.com/install.sh | bash
```


설치후 경로에 추가한다.
export PATH="$PATH:/opt/yarn-[version]/bin"


#### 사용

The following command uses Yarn to install the express package:

yarn add express


## 참조

[^Yarn vs npm: Everything You Need to Know]:https://www.sitepoint.com/yarn-vs-npm/

[^npm 5 vs yarn]: http://blog.scottlogic.com/2017/06/06/does-npm5-deprecate-yarn.html

