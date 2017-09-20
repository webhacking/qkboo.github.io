---
title: synergy build
date: 2017-09-17 14:00:00 +0900
layout: post
tags: [synergy]
categories: Linux
---

> 2017-09-17: 최초 작성
{:.right-history}

## Synergy

[Synergy]()는 키보드와 마우스 자원을 공유할 수 있는 클라이언트 서버 프로그램이다.

- 홈페이지: https://symless.com/synergy
- Github: https://github.com/symless/synergy-core

![](https://symless.com/img/synergy/homepage-explainer-graphic.png){:width="600"}

[그림. Synergy 통한 결합 (symless.com)]

https://symless.com/synergy 에서 유료 가입도 가능하고, 소스 기반의 배포본을 직접 빌드해서 사용할 수 있다.

사용하는 Mac과 Arm 기반의 Orangepiplus, Raspberry Pi 사이의 키보드/마우스 공유를 위해서 Synergy를 사용하는데, Arm 기반의 바이너리가 없어서 빌드를 하는 과정을 기록했다.

### Build

여기서는 다음 저장소의 버전을 사용.

https://github.com/brahma-dev/synergy-stable-builds

위 페이지의 releases 페이지에 MacOS 버전은 dmg 로 제공받을 수 있다. 다만 Arm 기반 머신의 바이너리는 없어서 소스 빌드를 해야 한다.

다운로드한 소스에서 README 파일을 참고해서 빌드를 한다.

#### 사전 준비

소스 빌드를 위해서 개발용 패키지가 필요하다. 여기서 Ubuntu, Debian 계열에서 필요한 패키지만 나열했다. [^1]

Ubuntu 10.04 to 15.10

```sh
sudo apt-get install cmake make g++ xorg-dev libqt4-dev libcurl4-openssl-dev libavahi-compat-libdnssd-dev libssl-dev libx11-dev
```

Debian 7/8

```sh
sudo apt-get install build-essential cmake libavahi-compat-libdnssd-dev libcurl4-openssl-dev libssl-dev lintian python qt4-dev-tools xorg-dev fakeroot
```

#### Orangepi Plus

현재 Orangepiplus 머신에 Armbian 릴리즈를 설치해서 사용중이다.  그런데 빌드중 gtest, qmake 관련한 에러가 발생해서 libgtest와 qt4-qmake 를 설치했다.

```sh
sudo apt install libgtest-dev
sudo apt install qt4-qmake libqt4-dev
```


### build

소스를 git으로 다운로드한다.

```sh
git clone https://github.com/brahma-dev/synergy-stable-builds.git synergy
cd synergy
cat README
```

README에서 "hm conf" 와 "hm build" 로 빌드한다고 한다. 쉘 유틸리티 `hm.sh` 를 사용한다.

```sh
./hm.sh 
```

먼저 빌드환경을 설정 - `hm.sh genlist` 결과 중에서 선택한다.

```sh
$ ./hm.sh genlist
1: Unix Makefiles
2: Eclipse CDT4 - Unix Makefiles
```

해당 빌드환경으로 선택해 설정을 시작한다.


```sh
$ ./hm.sh conf -g 1
Mapping command: conf -> configure
Running setup...
Setup complete.
cmake version 3.5.1
```

빌드를 진행한다 - 거의 1시간 이상 소요 허...ㄱ 허...ㄱ

```sh
$ ./hm.sh build
```


> 빌드중 다음같은 qmake 에러가 발생하면
> 
> ```
> Going back to: /home/qkboo/Hdd/synergy-stable-builds
> Error: Could not test for cmake: qmake: could not exec '/usr/lib/arm-linux-gnueabihf/qt4/bin/qmake': No such file or directory
> ```
> 
> qt4-qmake를 설치해 준다.
> 
> ```sh
> sudo apt install qt4-qmake libqt4-dev
> ```

빌드가 완료되면 *build/bin* 디렉토리 밑의 실행 파일을 적당한 곳에 옮겨 놓고 `synergy` 를 실행하면 된다.

### synergy 사용

보통 서버는 마우스/키보드를 공유할 컴퓨터이고, 클라이언트는 공유 마우스/키보드를 사용할 컴퓨터이다.
그러므로 같은 네트워크에 있는 컴퓨터여야 한다. ( 같은 허브, 라우터 등)

아래 같이 해주면 기본적으로 마우스/키보드를 서버-클라이언트에서 사용할 수 있다.

(1) 먼저 클라이언트에서 `synergy`를 실행해서 클라이언트 screen name을 정한다. 보통 호스트 이름이 그대로 사용된다.
이 screen name으로 서버에서 접속을 허용되므로 주의해야 한다.

(2) 서버에서 `synergy`를 실행해 클라이언트를 추가하고 클라이언트의 screen name을 입력해준다.

![](/images/linux/synergy-server-setup.png){:width="600"}


<br/>
## 참조

[^1]: [실제 공식 컴파일 위키](https://github.com/symless/synergy-core/wiki/Compiling)
