---
title: "Raspberry Pi 3 64bit OS openSUSE: Build MongoDB 3.4"
date: 2017-10-30 09:00:00 +0900
layout: post
tags: [Raspberry Pi 3, openSUSE, Linux, MongoDB]
categories: [Raspberry Pi, Linux, Database]
---

**Raspberry Pi 3 64bit OS openSUSE** 는 이글은 4개 글타래로 구성되며, openSUSE 설치 및 사용에 대해 작성한다.

Opensuse 에서 Raspberry Pi 3를 위한 64bit OS openSESE Leap 42.2 을 제공하고 있다.
 - [https://en.opensuse.org/HCL:Raspberry_Pi3](https://en.opensuse.org/HCL:Raspberry_Pi3)

  1. [Install 64bit openSUSE Leap 42.2 / JeOS]({% post_url /raspberrypi/2017-10-20-opensuse-jeos-install %})
  2. openSUSE: Managing Service daemon
  3. openSUSE: Basic OS Security for Server
  4. Install & Configuration - Nginx, Node JS
  5. Build MongoDB 3.4.x



## MongoDB Community Edition 설치

Opensuse 용 MongoDB가 제공되지만 AMD64, X64 관련한 플랫폼에 지원될 뿐이다. Raspberry Pi 3에 JeOS를 설치하고 네이티브로 빌드해보기로 했다. 


### 준비

MongoDB 빌드를 위해서 git, gcc 등, Scons 가 필요하다.

#### 컴파일 환경 준비

최신 **master branch**는,

- 최신 C++11 compiler:
    - VS2015 Update 2 or newer
    - GCC 5.3.0
    - Clang 3.4 (or Apple XCode 5.1.1 Clang) or newer
- Python 2.7
- SCons 2.3.5 or newer (for MSVC 2015 support)


**branch 3.2, 3.0** 는

 - C++11 compiler:
    - VS2013 Update 4 or newer. Note that VS2015 is currently not compatible with the 3.0 and 3.2 branches. You must use VS2013.
    - GCC 4.8.2 or newer. Note that versions of GCC newer than 4.8.2 may produce warnings when building these branches, which are promoted to errors. Please use the --disable-warnings-as-errors build option if necessary to allow the build to succeed despite the warnings.
 - Python 2.7
 - SCons 2.3.0 or newer


### 필요한 패키지

여기서는 터미널에서 openSUSE `yast` 사용해 관련 패키지를 설치한다. `yast`를 시작한다. 
*YaST -> Software -> Software Management* 를 선택한다.

![][/images/opensuse/yast-sw2.png]

#### gcc

gcc 을 선택한다. gcc를 선택하면 gcc-4.8 을 기본으로 설치한다.

![][/images/opensuse/yast-sw-gcc.png]

여러 버전을 설치하면 gcc 를 선택하기 위해 `update-alternatives`을 사용한다. 링크 [update-alternatives]({{ site.baseurl }}{% link _my_collection/linux-update-alternatives.md %}) 에서 설명을 볼 수 있다.

```
$ sudo update-alternatives --install /usr/bin/gcc gcc \
/usr/bin/gcc-4.8 10 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8
$ sudo update-alternatives --install /usr/bin/gcc gcc \
/usr/bin/gcc-6 30 --slave /usr/bin/g++ g++ /usr/bin/g++-6
```


#### python

검색어에 다음 패키지를 넣고 찾아 하나씩 **+** 키로 패키지를 선택한다.

```
git python python-pip python-devel python3 python3-pip python3-devel
```

*Search Phrase*에 다음 패키지를 찾아 개발관련 라이브러리를 설치한다. 

```
build-essential libboost-filesystem-dev libboost-program-options-dev
 libboost-system-dev libboost-thread-dev -y
```

*yast-sw-devel_basis* 패키지를 찾아 설치한다.

![](/images/opensuse/yast-sw-devel_basis.png){:width="640"}


*Search Phrase* 에 gcc 를 넣고 적절한 버전을 선택한다.

![](/images/opensuse/yast-sw-gcc.png){:width="640"}


그리고 Action 탭에서 설치를 실행한다.

![](/images/opensuse/yast-sw-gcc3.png){:width="640"}

ssl 지원을 위해서 Debian과 Ubuntu systems에서 SSL 지원을 위해서 **libssl-dev** 가 필요하다.

```
sudo zypper install libopenssl-devel
```

{% comment %}

#### zypper 로 설치



zypper in devel_basis

Opensuse for Ubuntu/Debian users
> 
개발관련 라이브러리를 설치한다. 
> 
```
git python python-pip python-dev python3 python3-pip python3-dev
```

```
build-essential libboost-filesystem-dev libboost-program-options-dev libboost-system-dev libboost-thread-dev -y
```

{% endcomment %}

#### SCons

mongodb 3.x는 scons를 최신버전으로 요구한다. Suse LEAP은 `scons` 가 2.3 버전이지만, 여기서 최신 버전 2.5.1 버전을 다운로드해서 설치했다.

```sh
wget http://prdownloads.sourceforge.net/scons/scons-2.5.1.tar.gz
tar xvf scons-2.5.1.tar.gz
cd scons-2.5.1
sudo python setup.py install
scons --version
SCons by Steven Knight et al.:
  script: v2.5.1.rel_2.5.1:3735:9dc6cee5c168[MODIFIED], 2016/11/03 14:02:02, by bdbaddog on mongodog
```

### Build 시작

[github mongodb](https://github.com/mongodb) 소스를 사용하고, 라즈베리파이세 Fan을 달라 

> 혹시, 이 글을 보고, 또 필요해서 꼭 라즈베리파이에서 MongoDB를 빌드하고자 하면
> 필자는 빌드를 시작해서 9일이 걸렸다.


#### 소스 다운로드


```sh
git clone https://github.com/mongodb/mongo.git mongodb-src
git checkout v3.4.9
```


pip 패키지 설치

opensuse에서 배포하는 pip는 7.x 버전으로 최신버전으로 업그레이드한다.

```sh
sudo pip install --upgrade pip
```

최신 3.4 master 브랜치를 설치하려면 소스를 다운로드한 후에 pip로 설치한다.

```sh
pip install -r buildscripts/requirements.txt
```

그리고 scons에서 에러코드 점검에 사용하는 다음 패키지를 설치한다.

```sh
pip install --user regex
```


swap이 필요하다. 다음은 block size 1G 크기 파일을 4회에 걸쳐 만들기 때문에 4G 파일이 생성된다.

```
sudo dd if=/dev/zero of=/data/swap4G bs=1G count=4
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo swapon -s
```


#### Build 시작


```
~> w
 11:14:58 up 1 day,  2:26,  2 users,  load average: 7.27, 7.30, 7.52
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
qkboo    pts/0    192.168.11.102   10:30    2.00s  1.56s  0.07s w
qkboo    pts/1    tmux(9980).%0    05:08    6:06m  4:48   0.72s /usr/lib64/gcc/

~> free
             total       used       free     shared    buffers     cached
Mem:        803988     771156      32832          0       6528     355580
-/+ buffers/cache:     409048     394940
Swap:      2594940    1158396    1436544
```


그리고 드디어, 빌드가 끝나고 나니 **9일**이 걸렸다 Bravo!!!

```sh
Linking build/opt/mongo/mongod
Install file: "build/opt/mongo/mongod" as "mongod"
scons: done building targets.

real    13514m39.223s
user    751m26.374s
sys     180m32.031s
```

빌드한 바이너리는 build/opt/mongo 밑에 생성된다. 이 바이너리에는 디버깅용 심볼 정보가 포함되어 있다. 이 부분을 제거하기 위해서 `strip` 명령을 사용한다. 여기서는 `mongod` 만 빌드해서 

```sh
~> cd build/opt/mongo
~> strip -s mongod
```

### MongoDB 설치

소스를 빌드한 바이너리를 설치한다. 먼저 `mongod` 를 복사한다.

```sh
~> sudo cp mongo mongod mongos /usr/local/bin/
~> sudo chown root:root /usr/local/bin/mongo*
~> sudo chmod 755 /usr/local/bin/mongo*
```


#### User mongodb

사용자를 추가하기 openSUSE `yast`라는 시스템 도구로 할 수 있지만 여기선 `adduser` 명령을 사용해서 사용자 추가한다. 자세한 것은 [useradd 명령](http://www.tecmint.com/add-users-in-linux/)을 참조한다.

`useradd` 는 홈 디렉토리, 쉘 등에 대한 옵션을 주고 사용자를 등록하는데, 사용자 아이디를 */etc/passwd*, */etc/shadow*, */etc/group*과 */etc/gshadow*에 추가해준다.

로그인이 필요없는 사용자므로, 로그인, 패스워드, 홈디렉토리를 비활성화한다.

```bash
~> sudo useradd -M -N -s /dev/zero -g nogroup mongodb
```


#### 디렉토리와 설정

mongod 가 사용하는 로그 디렉토리,

```sh
~> sudo mkdir /var/log/mongodb
~> sudo chown mongodb:nogroup /var/log/mongodb
```

데이터 디렉토리 

```sh
~> sudo mkdir /var/lib/mongodb
~> sudo chown mongodb:root /var/lib/mongodb
~> sudo chmod 775 /var/lib/mongodb
```

이제 `mongod` 데몬을 시작해 보자, 먼저 다음 같이 명령을 입력해 시작한다.

```sh
~> sudo /usr/local/bin/mongod --dbpath /var/lib/mongodb
```

데이터베이스 엔진에서 발생하는 로그가 화면에 출력되는 것을 확인할 수 있다.

`mongo` 클라이언트 혹은 mongobooster 같은 클라이언트에서 데이터베이스에 접속해 보고 잘 동작하는지 확인한다.


확인후 log 파일을 지정해 확인한다.

```sh
~> sudo /usr/local/bin/mongod --dbpath /var/lib/mongodb/ --logpath /var/log/mongodb/mongod.log
```


#### mongod.conf

보통 MongoDB는 데이터베이스 엔진 실행시 필요한 설정으로 로그 파일, 데이터 디렉토리 등의 내용을 */etc/mongod.conf* 설정 파일에 선언해서 사용한다.

```
~> sudo vi /etc/mongod.conf
```

다음 내용으로 작성한다. 설정 파일 내용에 대해서는 [mongodb.conf](https://docs.mongodb.com/manual/reference/configuration-options)를 참조한다. 

```
storage:
  dbPath: /data/mongodata
  journal:
    enabled: true
#  engine: mmapv1
#  mmapv1:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.5

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0

security:
  authorization: disabled
```

설정 파일을 주고 시작해 본다.

```sh
~> sudo /usr/local/bin/mongod --config /etc/mongod.conf
```

잘 동작한다.


### create systemd / service entry

이제 systemd unit 파일 `mongod.service` 를 생성해서 데몬으로 등록해 보자. */usr/lib/systemd/system* 디렉토리는 서비스 유닛 파일이 설치되는 곳으로, 활성화 되면 */etc/systemd/system/* 밑에 설치된다.

> Ubuntu/Debian 계열은 */lib/systemd/system* 이다

```sh
~> cd /usr/lib/systemd/system
~> sudo vi mongod.service
```

다음 내용을 입력한다:

```
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target
Documentation=https://docs.mongodb.org/manual

[Service]
#User=mongodb
#Group=nogroup
ExecStart=/usr/local/bin/mongod --config /etc/mongod.conf
# file size
LimitFSIZE=infinity
# cpu time
LimitCPU=infinity
# virtual memory size
LimitAS=infinity
# open files
LimitNOFILE=64000
# processes/threads
LimitNPROC=64000
# total threads (user+kernel)
TasksMax=infinity
TasksAccounting=false

[Install]
WantedBy=multi-user.target
```

`mongod` 에 대한 제약은 [Recommended limits for for mongod](http://docs.mongodb.org/manual/reference/ulimit/#recommended-settings) 를 참조한다.


서비스 유닛 파일이 제대로 위치하는지 검증하기 위해 다음 명령으로 확인한다.

```sh
$ sudo systemctl list-unit-files --type=service  |grep mongod
mongodb.service             disabled
```

이제 `mongod.service` 를 할성화 한다.

```sh
sudo systemctl enable mongod.service
```

활성화 되면 */etc/systemd/system/multi-user.target* 밑에 설치된다.

```sh
$ sudo systemctl status mongod.service
● mongod.service - High-performance, schema-free document-oriented database
   Loaded: loaded (/usr/lib/systemd/system/mongodb.service; enabled; vendor preset: disabled)
   Active: inactive (dead)
     Docs: https://docs.mongodb.org/manual
```

이제 mongodb 를 시작한다.

```sh
sudo systemctl start mongod.service
```


중지는,

```
sudo systemctl stop mongod.service
sudo systemctl restart mongod.service
```

그리고 *mongod.service* 내용을 수정하면 다시 로딩을 해야 한다.

```
sudo systemctl daemon-reload
```

일단 여기까지 데몬으로 잘 실행된다. 다만 사용자가 아닌 `root` 에서만... ㅠ.ㅜ


{% comment %}
#### Data disk

MLC를 지원하는 USB memory 를 장착하고, 2017-04-03-odroid-lvm2 에서 설명한데로 디렉토리를 구성해서 데이터 파일시스템으로 사용하고 있다.
{% endcomment %}



### 기념사진

우분투/데비안 계열에 익숙해 있다가 Raspberry Pi 3 에 openSUSE 를 개발자용 패키지들을 설치하고, 맘 먹고 빌드를 시작해서 9일이 걸렸다. *9일 동안 꿋꿋이 버텨준* **Raspberry Pi 3/openSUSE** machine!!!

![](/images/opensuse/rpi3-opensuse-machine.JPG){:width="550"}


## 참조

[^1]: [Mongodb on Raspberry pi](http://koenaerts.ca/compile-and-install-mongodb-on-raspberry-pi/)


