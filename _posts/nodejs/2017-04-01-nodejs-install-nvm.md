---
title: NodeJS / nvm 기반 개발환경 설치
date: 2017-04-01 09:00:00 +0900
layout: post
tags: [nodejs tutorials, nvm, nodejs]
categories: [Linux, NodeJS]
---

Node.js를 설치하고 관리할 수 있는 Node Version Manager를 사용한 개발환경 구성에 대해 살펴본다.



## 버전관리자를 통한 Node.js 개발환경

Node.js는 커뮤니티 개발을 위주로 업그레이드가 자주 된다. 개발중인 관련 모듈이 업그레이드를 따라가지 못할 경우가 자주 발생할 수 있다. 그래서 실제 개발하는 경우에 Node.js 버전의 변경을 자유롭게 하기 위해서 버전관리자(Node Version Manager) 환경에서 개발을 권장한다. 

주요한 버전관리자에는 Nvm, Nodist 등 여러 종류가 있는데, 대부분 리눅스와 맥에서 사용 가능하다. 그리고 윈도우 환경에서는 nvm-windows, nodist를 사용할 수 있다.

 - Linux/macOS: https://github.com/creationix/nvm
 - Windows: https://github.com/marcelklehr/nodist

버전관리자를 설치후 사용 방법은 대동소이 하다. 여기서는 **nvm**을 다룬다.

Shell 은 쉘 프롬프트로 사용자 권한 및 현재 위치를 표시하는데 보통 권한별로 아래 기호를 사용한다.<br/>

- `$` : 사용자 프롬프트
- `#` : root 프롬프트
- `~` : 사용자 홈 디렉토리
- `/` : 루트 디렉토리
- `.` : 현재 디렉토리
- `..` : 이전 디렉토리


### nvm 설치

Linux / MacOS는 다음 쉘 스크립을 실행해 설치한다.

curl 이용:

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
```

wget 이용:

```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
```

*install.sh* 스크립이 설치하는 nvm은 사용자 홈디렉토리 `~/.nvm` 에 설치된다. (이후 *$NVM_HOME*이라 하겠다)

> *$NVM_HOME/install.sh* 를 실행하면 업그레이드가 진행된다.

설치후 *~/.bash_profile*, *~/.profile* 등의 프로파일에 `nvm.sh` 가 실행되도록 아래 스크립이 추가된다.

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
```


#### Node.js 설치

원격 저장소의 node 목록

```sh
nvm ls-remote
nvm ls-remote v6        #v6.x 버전만 검색
```

`nvm install` 은 해당 node version를 다운로드하고 설치한다.

```sh
nvm install v5          # node version v5.x 버전중 최종버전
```

`nvm ls` 설치된 node 버전을 확인한다

```sh
$ nvm ls
   v0.9.12
   v0.11.0
   v6.9.1
current:    v6.9.1
```

`nvm use`로 사용할 node version을 지정한다 - 이것은 사용자의 `$PATH` 환경변수에 `node` 경로를 추가해준다.

```sh
nvm use 6.9.1       #v6 버전을 사용한다.
nvm use v7          #v7 버전중 최종 버번을 선택한다.
```

`node` 경로를 제거하려면,

```sh
nvm deactivate
```


로그인후 기본 node 환경으로 지정하려면

```sh
nvm alias default 6.9.1
```



#### npm

`node`를 설치후 `npm`을 업그레이드 해준다. npm 자체는 다음 같이 업그레이드 한다.

```sh
npm i -g npm
npm install npm@latest -g
```


#### Outdated module

현재 package.json 에 설치된 버전과 명시된 버전 그리고 최신 버전과 차이를 알 수 있다.

```sh
npm outdated
Package                  Current  Wanted  Latest  Location
body-parser               1.15.2  1.15.2  1.18.2  application-name
debug                      0.7.4   0.7.4   3.1.0  application-name
```

최신 버전으로 설치를 하려면 package.json을 버전코드로 변경하고 업데이트를 진행한다.

모든 패키지를 업데이트할 수 있다.

```
npm update
+ mongoose@4.13.1
added 1 package, removed 4 packages and updated 2 packages in 32.975s
```

특정 모듈만 업데이트하려면 패키지를 명시하면 된다.

```
npm update debug
```



#### lts 버전

Node.js 는 가용 버전이 장기지원을 위해서 [LTS(Long Term Support)](https://github.com/nodejs/Release) 프로그램을 진행하고 있다. 실제 운영 서버는 이런 LTS 버전을 중심으로 가동될 것이다. **nvm** 도 lts 만을 선별해서 설치하고 관리할 수 있다.

현재 LTS 버전중 최신버전만을 출력하려면,

```sh
nvm ls-remote --lts |grep Latest
```


#### 전역 패키지 통합

nvm에서 새로운 node 버전을 설치하면서 기존 node 버전에서 사용중인 패키지를 통합해서 설치 할 수 있다.  예를 들어 최신 8 버전을 설치하며 사용중인 기존 6버전 패키지를 함께 설치하려면,

```sh
nvm install 8 --reinstall-packages-from=6
```



#### Default alias 잘 못 된 경우

새로 로그인 혹은 버전 변경시 다음 메시지 출력,

```
N/A: version "N/A -> N/A" is not yet installed.
```

이 경우 가능성은 제거한 버전이 default 로 지정되서 그런듯 하다, 아래의 경우 default가 v8.7 인데 삭제해서 없기 때문이다.

```
$ nvm ls
->      v6.11.5
        v7.10.1
default -> v8.7.0 (-> N/A)
node -> stable (-> v7.10.1) (default)
stable -> 7.10 (-> v7.10.1) (default)
iojs -> N/A (default)
lts/* -> lts/boron (-> v6.11.5)
lts/argon -> v4.8.5 (-> N/A)
lts/boron -> v6.11.5
```

그래서 default 를 설치된 버전으로 변경해서 지정해 주면 위 메시지가 나오지 않는다.


<br/>
<br/>
### nodist

Nodist 는 윈도우즈 환경에서 Nvm과 비슷하게 nodejs의 버전을 관리할 수 있다.
 - https://github.com/marcelklehr/nodist
 - 윈도우즈 인스톨러로 다운로드 가능.
 - git 혹은 zip 으로 다운로드 가능.

#### 인스톨러로 설치시

[nodist releases](https://github.com/marcelklehr/nodist/releases) 에서 nodist 인스톨러를 다운받아 설치한다.

#### git으로 설치

윈도우즈 `git`으로 clone을 해오고, 윈도우의 환경설정 변수를 설정한다.

```
C:\>git clone git://github.com/marcelklehr/nodist.git
C:\>setx /M PATH "C:\users\thinkbee\nodist\bin;%PATH%"
C:\>setx /M NODIST_PREFIX "C:\users\thinkbee\nodist"
```

이제 `cmd`에서 `nodist`의 업데이트를 실행해주고 사용한다.

```
C:\>nodist selfupdate
```

기타 다른 환경에서 설치 및 사용법은 [nodist](https://github.com/marcelklehr/nodist) 에서 확인한다.


### Process manager

pm2와 nodemon을 살펴본다.

#### pm2 설치

node.js 앱을 시스템 서비스로 등록하기 위해서 **pm2** 를 설치한다.


```
npm i -g pm2
```

예를 들어 express 앱이 있으면 다음 같이 pm2로 시작한다.

```
cd www-app
pm2 start -n "www-app" bin/www
```


#### pm2 log format

pm2 이전 버전은 시작시 timestamp를 로그에 저장하고 싶으면 시작시 `--log-date-format` 옵션을 이용

```
pm2 start app.js --log-date-format 'DD-MM HH:mm:ss.SSS'
```

시작 설정 파일에 `log_date_format` 옵션을 줄 수 있다.

```
"log_date_format"   : "DD-MM HH:mm:ss.SSS",
```


pm2 2.x 이후 부터는 log 의 형식을 `--format` 옵션을 지정할 수 있다.

```
pm2 logs --format
```


#### pm2 startup

startup 시 pm2 start 로 생성되는 .pm2 디렉토리의 pid 와 app.js 파일을 실행해 준다. 

pm2 startup systemd 로 스타트를 하면 2개의 프로세스가 만들어 진다.

방법은,,,

1. 먼저 앱을 시작해 둔다.

```sh
pm2 start -n "www-app" bin/www
```


2. dump를 생성한다.

pm2로 현재 실행중인 프로세스 정보를 `save`로 덤프하게 저장한다. `systemd` 서비스 스크립을 작성하는데 유용하다.

```
pm2 save
```

3. pm2 startup 명령

`pm2 startup` 명령은 pm2로 실행중인 프로세스를 systemd 서비스 유니트 파일로 제어 할 수 있다. 명령을 실행하면 `sudo` 명령으로 실행할 수 있는 스크립을 출력해 준다.

```sh
$ pm2 startup systemd
...
sudo env PATH=$PATH:/home/foo/.nvm/versions/node/v8.8.1/bin /home/foo/.nvm/versions/node/v8.8.1/lib/node_modules/pm2/bin/pm2 startup systemd -u foo --hp /home/foo
```

이 스크립을 실행해 주면 **pm2-foo.service** 서비스 유니 파일이 생성된다.

```
Target path
/etc/systemd/system/pm2-foo.service
```

이 서비스 파일을 활성화하고 시작해준다.

```sh
systemctl enable pm2-foo
```

이제 시스템을 재시작해도 pm2 로 실행중인 프로세스는 자동으로 시작된다.
