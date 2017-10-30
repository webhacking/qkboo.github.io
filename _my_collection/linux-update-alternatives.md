---
title: Linux - update-alternatives
date: 2017-04-05 09:00:00 +0900
layout: post
tags: [cross compiler]
categories: [Linux, Programming]
---

이 글은 우분투, 리눅스 박스에서 여러버전의 도구를 관리할 수 있는 `update-alternatives` 를  다루고 있다.


## update-alternative

`update-alternative` 유틸리티로 리눅스 기본 제공 개발 환경의 gcc, cross compiler용 gcc 등 여러 버전의 gcc를 사용할 수 있게 구성할 수 있다.
이들 버전의 환경을 교체해서 사용하기를 원한다. `update-alternative` 도구를 사용할 수 있다.


### update-alternative 사용

여러 버전의 gcc를 `update-alternative`를 사용해서 선택적으로 사용할 수 있다. `gcc` 로 등록된 현재 버전 목록을 질의 한다.

```sh
$ update-alternatives --query gcc
```


#### 등록

여기서 사용하는 여러 gcc 버전들을 설치한 후에 다음과 같은 명령어로 등록을 할 수 있다.

```
update-alternatives --install <link> <name> <path> <priority>
```

 - <link> 실행파일 이름으로 /etc/alternatives/<name> 을 가리킨다. (예: /usr/bin/pager)
 - <name>   해당 링크 그룹의 대표 이름으로, 여러 가지 버전의 패키지들을 대표하는 이름으로 보면 될 것 같다.(예: pager)
 - <path> alternatives 로 실제 연결할 실행파일 이름으로, 시스템에 설치한 패키지의 실행파일 이름이다.(예: /usr/bin/less)
 - <priority> automatic 모드에서 어떤 것을 자동으로 선택해서 사용할지 결정할 때 사용되는 우선순위로, 높은 수가 더 높은 우선순위이다.

#### gcc 등록

Ubuntu 14.04 최신 버전에 gcc4.7, 4.8 를 사용하려고 설치했다고 가정한다.

```sh
sudo apt-get update
sudo apt-get install gcc-4.7 g++-4.7
sudo apt-get install gcc-4.8 g++-4.8
```

그리고 gcc 그룹에 4.8를 우선도가 높게 50으로 준다.

```sh
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 50 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8
```

여기서 gcc를 master로 g++을 slave로 준비했다. `--slave` 옵션은 `--install` 로 지정한 master에 종속해서 여러개의 슬레이브를 마스터에 추가할 수 있고, 마스터의 링크가 바뀌면 슬레이브도 함께 바뀐다.


두번째 버전은 gcc-4.7 버전을 우선도가 40 정도로 하자.

```sh
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.7 50 --slave /usr/bin/g++ g++ /usr/bin/g++-4.7
```


{% comment %}
```sh
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 100 \
--slave /usr/bin/g++ g++ /usr/bin/g++-4.8 \
--slave /usr/bin/gcc-ar gcc-ar /usr/bin/gcc-ar-4.8 \
--slave /usr/bin/gcc-nm gcc-nm /usr/bin/gcc-nm-4.8 \
--slave /usr/bin/gcc-ranlib gcc-ranlib /usr/bin/gcc-ranlib-4.8
```
{% endcomment %}





Here, 4.6 is still the default (aka "auto mode"), but I explicitly switch to 4.5 temporarily (manual mode). To go back to 4.6:

update-alternatives --auto g++
update-alternatives --auto gcc
update-alternatives --auto cpp-bin



#### 설정된 버전 표기

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

udo update-alternatives --remove-all gcc 

https://askubuntu.com/questions/26498/choose-gcc-and-g-version






### 테스트

`update-alternatives --config arm-linux-gnueabihf` 로 교체해서 다음을 컴파일 해보자.


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


#### C++ std 14

아래는 std++14 이상 컴파일이 필요한 lambda 제너릭 코드이다.

```cpp
// Generic lambda is C++14 code
#include <iostream>

int main()
{
    auto lambda = [](auto x){ return x; };
    std::cout << lambda("Hello generic lambda!\n");
    return 0;
}
```

g++-4.9를 사용해서

위 코드를 표준 C++ 로 컴파일 하면 아래 같이 구문 분석에서 에러가 난다.

```
$ g++ -std=c++1y test_cpp14.cpp -o test_cpp14
hello_cpp14.cpp:6:27: error: parameter declared ‘auto’
```

c++14 옵션을 사용해서

```
$ g++ -std=c++14 test_cpp14.cpp -o test_cpp14
```

## 참조

