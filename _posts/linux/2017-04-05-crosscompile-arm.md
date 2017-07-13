---
title: Ubuntu/Debian ARM Cross compile 환경
date: 2017-04-05 09:00:00 +0900
layout: post
tags: [linux, cross compiler, Raspberry Pi, Odroid, Orange Pi, ARM]
categories: 
- Linux
---

이 글은 우분투, 리눅스 박스에서 GNU ARM Cross compiler 를 설치하고 관리하는 방법을 다루고 있다.

## gcc-arm-linux toolchains

우분투/데비안 리눅스에서 제공하는 ARM Toolchain 환경은 Linaro 툴체인을 바탕으로 만들어져 있어서 두가지 버전으로 제공된다. *Hard Float*을 지원하는 버전과 그렇지 않은 버전이다.[^1]

**(1) gcc-arm-linux-gnueabi** 

이 툴체인은 EABI가 gcc의 `-mfloat-abi=soft` 혹은 `-mfloat-abi=softfp` 옵션으로 생성한다는 의미이다.

**(2) gcc-arm-linux-gnueabihf**

이 툴체인은 EABI가 `gcc -mfloat-abi=hard` 옵션으로 생성한다는 의미이다. 이 의미는 Function Calling Convention이 double, float 사용시 FPU 레지스터에 올려서 전달하고 반환도 FPU 레지스터를 사용하게 된다는 것이다.


### Ubuntu14.04 에서 arm toolchain 설치

Ubuntu 14.04 에서 테스트했다. 그 이상 버전도 충분히 가능하다.

ARM 

```sh
$ sudo apt-get install gcc-arm-linux-gnueabi
$ sudo apt-get install g++-arm-linux-gnueabi
```

Coretex ARM

```sh
$ sudo apt-get install gcc-arm-linux-gnueabihf
$ sudo apt-get install g++-arm-linux-gnueabihf
```

Bare metal ARM

```sh
$ sudo apt-get install gcc-arm-none-eabi
$ sudo apt-get install g++-arm-none-eabi
```


{% comment %}

### Linaro toolchain
 - http://www.linaro.org/downloads/#008


Download
Linaro has been very good at changing the location and availability of just about everything, making it very hard to keep a wiki up to date which refers to it. So the below download locations might be stale already.
Currently, the main selection page is here.
It lists the following toolchains:
gcc-linaro 4.5 (4.5-2012.03): Test me
gcc-linaro 4.6 (4.6-2013.05): Test me
gcc-linaro 4.7 (4.7-2014.06): Test me
gcc-linaro 4.8 (4.8-2014.04): Test me
gcc-linaro 4.9 (4.9-2014.07): Test me (this link will go dead the quickest.)
When in doubt, try 4.7 first.
WARNING: Do not use the 4.8 gcc versions of the linaro toolchain to build legacy kernels (sunxi-3.4 etc.), those seem to have issues building the kernel. Use an earlier version instead. (TODO: Verify that this is still true today).

{% endcomment %}


### update-alternative

`update-alternative` 유틸리티로 리눅스 기본 제공 개발 환경의 gcc, cross compiler용 gcc 등 여러 버전의 gcc를 사용할 수 있게 구성할 수 있다.
이들 버전의 환경을 교체해서 사용하기를 원한다. `update-alternative` 도구를 사용할 수 있다.


[How to switch gcc using update alternatives](https://codeyarns.com/2015/02/26/how-to-switch-gcc-version-using-update-alternatives) 를 참고했다.


#### update-alternative 사용

여러 버전의 gcc를 `update-alternative`를 사용해서 선택적으로 사용할 수 있다. `gcc` 로 등록된 현재 버전 목록을 질의 한다.

```sh
$ update-alternatives --query gcc
```


#### 등록

여기서 사용하는 여러 gcc 버전들을 설치한 후에 다음과 같은 명령어로 등록을 할 수 있다.

> update-alternatives --install <link> <name> <path> <priority>
> 
> <link> 실행파일 이름으로 /etc/alternatives/<name> 을 가리킨다. (예: /usr/bin/pager) 
> <name>   해당 링크 그룹의 대표 이름으로, 여러 가지 버전의 패키지들을 대표하는 이름으로 보면 될 것 같다.(예: pager)
> <path> alternatives 로 실제 연결할 실행파일 이름으로, 시스템에 설치한 패키지의 실행파일 이름이다.(예: /usr/bin/less)
> <priority> automatic 모드에서 어떤 것을 자동으로 선택해서 사용할지 결정할 때 사용되는 우선순위로, 높은 수가 더 높은 우선순위이다.

Ubuntu 14.04 최신 버전에 gcc4와 gcc5가 설치되어 있는데 이 환경을 구성해 보자

먼저 첫번째 버전은 gcc-4.8 버전을 `gcc`로 연결하게 한다.

```sh
$ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 20 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8
```

여기서 gcc를 master로 g++을 slave로 준비했다. `--slave` 옵션은 `--install` 로 지정한 master에 종속해서 여러개의 슬레이브를 마스터에 추가할 수 있고, 마스터의 링크가 바뀌면 슬레이브도 함께 바뀐다.

이제 두 번째 버전은 gcc-5 를 `gcc`로 등록한다.

```sh
$ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-5 10 --slave /usr/bin/g++ g++ /usr/bin/g++-5
```

설정된 버전 표기

```sh
$ sudo update-alternatives --list gcc
/usr/bin/gcc-4.8
/usr/bin/gcc-5
```


```sh
$ sudo update-alternatives --display gcc
```


#### gcc 버전 교체하기

이렇게 gcc 버전들을 등록해서 설정한 후에 gcc를 교체해서 사용할 수 있다. `--config` 옵션을 주고 목록에 있는 gcc 버전을 선택한다.


```
$ update-alternatives --config gcc
There are 2 choices for the alternative gcc (providing /usr/bin/gcc).

  Selection    Path              Priority   Status
------------------------------------------------------------
* 0            /usr/bin/gcc-4.8   20        auto mode
  1            /usr/bin/gcc-4.8   20        manual mode
  2            /usr/bin/gcc-5     10        manual mode

Press <enter> to keep the current choice[*], or type selection number: 2


$ g++ --version
g++ (Ubuntu 5.4.0-6ubuntu1~16.04.4) 5.4.0 20160609
Copyright (C) 2015 Free Software Foundation, Inc.
```


#### 삭제

설정한 내역을 지워버리고 싶을 때에는 `--remove` 옵션을 사용한다.

```sh
$ sudo update-alternatives --remove <name> <path>
```



### arm-linux-gnueabi-gcc 등록

여러 개발 보드의 cross compiler를 사용하기 위해서 해당 버전의 접두어를 사용해 보자. arm 을 사용하는 보드는 arm-linux-gnueabi-gcc 명칭을 사용한다. 

```sh
$ update-alternatives --list arm-linux-gnueabi-gcc
```

새로운 *arm-linux-gnueabi-gcc-* 를 등록하자.

#### arm-linux-gnueabi-gcc- 등록하기

arm-linux-gnueabi-gcc-5 등록하기

```sh
$ sudo update-alternatives --install /usr/bin/arm-linux-gnueabihf-gcc arm-linux-gnueabihf-gcc /usr/bin/arm-linux-gnueabihf-gcc-5 100 \
--slave /usr/bin/arm-linux-gnueabihf-g++ arm-linux-gnueabihf-g++ /usr/bin/arm-linux-gnueabihf-g++-5 \
--slave /usr/bin/cpp-arm-linux-gnueabihf cpp-arm-linux-gnueabihf /usr/bin/arm-linux-gnueabihf-cpp-5
```

arm-linux-gnueabi-gcc-4.8 등록하기

```sh
$ sudo update-alternatives --install /usr/bin/arm-linux-gnueabihf-gcc arm-linux-gnueabihf-gcc /usr/bin/arm-linux-gnueabihf-gcc-4.8 90 \
--slave /usr/bin/arm-linux-gnueabihf-g++ arm-linux-gnueabihf-g++ /usr/bin/arm-linux-gnueabihf-g++-4.8 \
--slave /usr/bin/cpp-arm-linux-gnueabihf cpp-arm-linux-gnueabihf /usr/bin/arm-linux-gnueabihf-cpp-4.8
```


arm-linux-gnueabi-gcc-4.7 등록하기

```sh
$ sudo update-alternatives --install /usr/bin/arm-linux-gnueabihf-gcc arm-linux-gnueabihf-gcc /usr/bin/arm-linux-gnueabihf-gcc-4.7 80 \
--slave /usr/bin/arm-linux-gnueabihf-g++ arm-linux-gnueabihf-g++ /usr/bin/arm-linux-gnueabihf-g++-4.7 \
--slave /usr/bin/cpp-arm-linux-gnueabihf cpp-arm-linux-gnueabihf /usr/bin/arm-linux-gnueabihf-cpp-4.7
```

이제 *arm-linux-gnueabi-gcc-* 버전을 교환할 수 있는 환경이 준비됐다.

```
$ sudo update-alternatives --display arm-linux-gnueabihf-gcc
$ sudo update-alternatives --list arm-linux-gnueabihf-gcc
/usr/bin/arm-linux-gnueabihf-gcc-5
```


#### Raspberry pi arm-linux-gnueabi-gcc 등록하기

Raspberry pi 배포본에서 제공하는 arm gcc compiler도 등록해 보자 [^2]. 다운로드 한 후에 적절한 위치에 놓고, 해당 경로를 확인한다.

```
$ cd ~/rpi-arm/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin/
$ arm-linux-gnueabihf-gcc --version
arm-linux-gnueabihf-gcc (crosstool-NG linaro-1.13.1+bzr2650 - Linaro GCC 2014.03) 4.8.3 20140303 (prerelease)
Copyright (C) 2013 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

*arm-linux-gnueabihf-gcc* 그룹에 Linaro-x64 compiler 등록

```
$ sudo update-alternatives --install /usr/bin/arm-linux-gnueabihf-gcc arm-linux-gnueabihf-gcc ~/rpi-arm/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin/arm-linux-gnueabihf-gcc-4.8.3 120 \
--slave /usr/bin/arm-linux-gnueabihf-g++ arm-linux-gnueabihf-g++ ~/rpi-arm/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin/arm-linux-gnueabihf-g++ \
--slave /usr/bin/arm-linux-gnueabihf-gcc-ar arm-linux-gnueabihf-gcc-ar ~/rpi-arm/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin/arm-linux-gnueabihf-gcc-ar \
--slave /usr/bin/arm-linux-gnueabihf-gcc-ranlib arm-linux-gnueabihf-gcc-ranlib ~/rpi-arm/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin/arm-linux-gnueabihf-gcc-ranlib
```

크로스 플랫폼 환경에서 소스를 빌드하다 보면 GNU Tools 를 해당 그룹에 추가할 필요가 있다. 여기서 예로 든 python 3.6 빌드시 `readelf` 유틸리티를 요구하는데 우분투 배포본에 *arm-linux-gnueabihf-gcc* 그룹에 슬레이브로 `arm-linux-gnueabihf-readelf` 바이너리를 추가해 준다.

```
--slave /usr/bin/arm-linux-gnueabihf-readelf arm-linux-gnueabihf-readelf ~/rpi-arm/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin/arm-linux-gnueabihf-readelf
```

혹은 `PATH` 환경 변수에 경로를 추가해 주거나 절대경로를 컴파일 옵션으로 제공하면 된다.


### 테스트

#### hello world

``` c
#include "stdio.h"
 
int main(void) {
  printf("Hello world !\n");
  return 0;
}
```


```
$ arm-linux-gnueabihf-gcc hello.c -o hello
```


#### hello world c++

``` cpp
#include "iostream"
 
using namespace std;
 
int main(int argc, char *argv[]) {
    cout << "Hello world !" << endl;
    return 0;
}
```

g++로 컴파일 하고

```
$ arm-linux-gnueabi-g++ hello.cc -o hello
```



#### Hardfloat 확인


```sh
$ arm-linux-gnueabi-gcc -S -O -o hello_float_gnueabi.s hello_float.c
```

fadd [s | d] 전후에서 범용 레지스터와 FPU 레지스터의 전송을 실시하고 있습니다.

```sh
$ arm-linux-gnueabi-gcc -S -O -o hello_float_gnueabi.s hello_float.c
```


컴파일 옵션을 자세히 보려면 gcc에 -v 옵션을 쓰면 내부적으로 실행되는 명령과 옵션을 확인할 수 있습니다.

arm-linux-gnueabihf-gcc 는 기본적으로 -march = armv7-a -mthumb이므로 Thumb2 코드가 생성됩니다. fpu 유형은 vfpv3-d16 그래서 NEON 없이도 움직일 수있게되어 있네요.


<br/>
<br/>
## Build with crosscompile

앞서 구성한 우분투 크로스컴파일 환경에서 타겟용 애플리케이션을 빌드해서 타켓 보드에서 실행해 보자.


### hardfloat

Linaro 툴체인은 *Hard Float (hf)* 을 지원하는데 크로스 컴파일 시에는 아래 처럼 사용한다:

```sh
$ make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf-
```

사용하는 툴체인이 *hardfloat* 이 아리라면 `arm-linux-gnueabi-` 을 `arm-linux-gnueabihf-` 로 변경해서 사용한다.


### Python3.6 빌드

[Python build setup](https://docs.python.org/devguide/setup.html) 을 참고.


#### 파이썬 의존성 패키지 설치

우분투에서 `build-dep` 명령으로 의존성 패키지를 설치할 수 있다.

```sh
$ sudo apt-get build-dep python3.6
```

호스트 머신에 python3.6 배포본이 없다면 3.5 버전으로 실행한다.

```sh
$ sudo apt-get build-dep python3.5
```

Fedora, RHE

```sh
$ sudo yum install yum-utils
$ sudo yum-builddep python3
```

DNF 기반 시스템

```sh
$ sudo dnf install dnf-plugins-core  # install this to use 'dnf builddep'
$ sudo dnf builddep python
```



#### Python source

소스를 받고, 호스트에 3.6이 없으면 호스트에 3.6 을 설치해야 한다.

`./configure --help` 로 필요한 구성을 알아보자

```
System types:
  --build=BUILD     configure for building on BUILD [guessed]
  --host=HOST       cross-compile to build programs to run on HOST [BUILD]
  --target=TARGET   configure for building compilers for TARGET [HOST]
```



```
cd Python-3.6/
./configure
./configure --enable-optimizations
```


#### Cross compile


호스트에서 빌드하고 설치한 소스에서 크로스 컴파일을 위해 다음 작업을 한다.

```
make python Parser/pgen
mv python hostpython
mv Parser/pgen Parser/hostpgen  
make distclean
```

그리고 빌드를 시작한다.

```
CC=arm-linux-gnueabihf-gcc CXX=arm-linux-gnueabihf-g++ AR=arm-linux-gnueabihf-ar RANLIB=arm-linux-gnueabihf-ranlib READELF=arm-linux-gnueabihf-readelf ./configure --host=arm-linux --build=arm-linux-gnueabihf --prefix=../output/python --disable-ipv6 ac_cv_file__dev_ptmx=no ac_cv_file__dev_ptc=no ac_cv_have_long_long_format=yes --enable-shared
```

{% comment %}

```
CC=arm-linux-gnueabihf-gcc CXX=arm-linux-gnueabihf-g++ AR=arm-linux-gnueabihf-ar RANLIB=arm-linux-gnueabihf-ranlib READELF=~/rpi-arm/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin/arm-linux-gnueabihf-readelf ./configure --host=arm-linux --build=arm-linux-gnueabihf --prefix=/home/qkboo/Works/rpi-arm/output/python --disable-ipv6 ac_cv_file__dev_ptmx=no ac_cv_file__dev_ptc=no ac_cv_have_long_long_format=yes --enable-shared
```

{% endcomment %}


빌드한 결과물은 *../output/python* 에 결과물이 저장된다 이것을 tar로 묶어 라즈베리파이, 오렌지파이 등의 ARM 보드에 올린다.

타겟보드에 업로드한 결과물을 /usr/local/python3.6 폴더로 압축을 푼다.

#### 경로 추가

`.profile` 에 python3.6 디렉토리에 대한 PATH, LD_LIBRARY_PATH, MANPATH 를 구성해 준다.

```
# Python3.6
export PATH="/usr/local/python3.6/bin:$PATH"
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/python3.6/lib"
export MANPATH="$MANPATH:/usr/local/python3.6/share/man"
```

쉘을 재시작 혹은 로그아웃후 로그인하면 해당 경로가 설정된다. 이제 파이썬 3.6을 사용할 수 있다.


## 참조

 - [Linux Kernel Cross Compilation](https://mentorlinux.files.wordpress.com/2013/02/kernel-compilation-ml.pdf)
 - [Cross-compiling Python 3.3.1 for Beaglebone (arm-angstrom)](https://datko.net/2013/05/10/cross-compiling-python-3-3-1-for-beaglebone-arm-angstrom/)


[^1]: [Linaro Arm Toolchain](http://nairobi-embedded.org/050_linaro_arm_toolchain.html)


[^2]: [Cross compile for raspberry PI](https://github.com/Yadoms/yadoms/wiki/Cross-compile-for-raspberry-PI)
