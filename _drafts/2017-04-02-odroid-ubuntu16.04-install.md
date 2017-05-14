---
title: Odroid - Install Ubuntu 16.04
date: 2017-04-02 10:10:00 +0900
layout: post
tags: linux, odroid
categories: linux, odroid
---

# Odroid C2/buntu 16.04

다음은 Odroid C2에 Ubuntu 16.04 minimal 버전 설정에 대한 것이다.

## 설치

설치전에 SD Card는 가능하면 **UHX-1 Class 10** 를 사용하도록 한다.

### 준비사항

Odroid C2는 Micro SD Card 혹은 eMMC Card로 부팅 디스크를 구성할 수 있다.
 - Micro SD Card: **UHX-1 Class 10** 이상
 - SDHX Class 8에서 사용중인데, 큰 문제는 없지만 SD Card에 영향을 받는 듯 하다.

다운로드 사이트에서 [Download](http://dn.odroid.com/S905/Ubuntu/) 한다.

#### Write a image

macOS를 사용하고 있어서 macOS의 diskutil 명령을 사용해 SD Card에 접근했다.

```bash
diskutil list                        # 디스크 목록에서 SD Card의 디바이스 파일 찾는다.
```

그리고 쓸려는 SD Card를 Unmount 해준다.

```bash
diskutil unmountDisk /dev/disk1
```

다운받은 xz 파일을 dd 명령으로 SD Card 메모리 디스크에 쓴다.

```
xzcat ubuntu64-16.04-minimal-odroid-c2-20160815.img.xz | sudo dd of=/dev/rdisk1 bs=1M conv=fsync
```

> macOS는 /dev/disk[1,2..] 의 디바이스 파일과 /dev/rdisk[1,2...]의 raw disk 디바이스 파일이 있다. 실제 쓸때 rdisk 파일을 사용하도록 권장하고 있다.


#### Verifying the burned image with Linux

```
$ sudo dd if=</dev/path/of/card> bs=512 count=$((`stat -c%s <my/odroid/image.img>`/512)) | md5sum
167742+0 records in
167742+0 records out
85883904 bytes (86 MB, 82 MiB) copied, 0.153662 s, 559 MB/s
9b085251a00ad7ae16fe42fbfb25c042  -
$ dd if=<my/odroid/image.img> bs=512 count=$((`stat -c%s <my/odroid/image.img>`/512)) | md5sum
167742+0 records in
167742+0 records out
85883904 bytes (86 MB, 82 MiB) copied, 0.140843 s, 610 MB/s
9b085251a00ad7ae16fe42fbfb25c042  - 
```


### 첫번째 부팅

기본 유저는 root/odroid 로 설정되어 있다. **root의 기본 패스워드를 변경**하고, **sudo 사용자**를 추가해 사용하도록 하자.

#### upgrade 

upgrade시 `dist-upgrade` 는 꼭 해주도록 하자. kernel 관련 업그레이드를 완성시켜 준다.

```
# apt update && apt dist-upgrade && apt upgrade
```

업그레이드 하는 도중 아래 같은 에러가 발생하면,

> The following packages have been kept back:   linux-image-c2

기존 리눅스 이미지를 지우고 업그리이드 중 에러가 나서 이미지 업그레이드가 중단되어서 그렇다. 이전 버전 이미지를 찾아 삭제해 주면 다시 업그레이드가 된다.

```
# apt --installed list |grep linux

linux-image-3.14.65-73/unknown,now 20160802 arm64 [installed,automatic]
linux-image-3.14.79-94/unknown,now 20161121 arm64 [installed,automatic]
linux-image-c2/now 73-1 arm64 [installed,upgradable to: 94-1]
linux-libc-dev/xenial-updates,xenial-security,now 4.4.0-51.72 arm64 [installed]
util-linux/xenial-updates,now 2.27.1-6ubuntu3.1 arm64 [installed]
```


이전 버전 이미지를 지운다. 업그레이드 후 uname 확인

```
root@odroid64:~# apt autoremove linux-image-3.14.65-73
...
Preparing to unpack .../linux-image-c2_94-1_arm64.deb ...
Unpacking linux-image-c2 (94-1) over (73-1) ...
Setting up linux-image-c2 (94-1) ...

# uname -a
Linux odroid64 3.14.79-94 #1 SMP PREEMPT Mon Nov 21 17:13:27 BRST 2016 aarch64 aarch64 aarch64 GNU/Linux
```


### sudo 새 사용자 등록

sudo 사용자를 추가해서 사용하려면, adduser 혹은 useradd 명령을 사용해서 사용자를 등록 할 수 있다. 

#### 새 사용자 등록

먼저 adduser를 사용한 등록은,

```
# adduser qkboo
Adding user `qkboo' ...
Adding new group `qkboo' (1000) ...
Adding new user `qkboo' (1000) with group `qkboo' ...
Creating home directory `/home/qkboo' ...
Copying files from `/etc/skel' ...
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
Changing the user information for qkboo
Enter the new value, or press ENTER for the default
        Full Name []: Gangtai
        Room Number []:
        Work Phone []:
        Home Phone []:
        Other []:
Is the information correct? [Y/n] y
```


혹은 useradd 사용

> http://www.tecmint.com/add-users-in-linux/

‘useradd‘ 명령은 크게 두가지 일을 한다:

 - 추가한 사용자에 대한 /etc/passwd, /etc/shadow, /etc/group and /etc/gshadow 편집
 - 사용자 홈 디렉토리 생성

```
$useradd -M -s /bin/false
```


#### sudoer 등록

처음 로그인후 새로운 사용자 등록하고 suders에 직접 권한을 줄 수 있다.
새로 등록한 혹은 사용자를 *sudo 그룹*에 등록해 둔다.

```
# usermod -aG sudo USERNAME
```


혹은 **visudo** 명령으로 sudoers 파일을 편집할 수 있습니다. sudoer에 있는 root는 제외하고 사용자로 등록한다.

```
$ sudo visudo
# User privilege specification
pi  ALL=(ALL:ALL) ALL
```



#### 기본 에디터 변경

odroid의 ubuntu 16.04는 기본에디터로 joe가 설치되어 있다. vim 으로 변경한다.

```
# update-alternatives --config editor
There are 6 choices for the alternative editor (providing /usr/bin/editor).

  Selection    Path               Priority   Status
------------------------------------------------------------
* 0            /usr/bin/joe        70        auto mode
  1            /usr/bin/jmacs      50        manual mode
  2            /usr/bin/joe        70        manual mode
  3            /usr/bin/jpico      50        manual mode
  4            /usr/bin/jstar      50        manual mode
  5            /usr/bin/rjoe       25        manual mode
  6            /usr/bin/vim.tiny   10        manual mode

Press <enter> to keep the current choice[*], or type selection number: 6
```


#### bash-completion

minimal 버전에는 bash-completion 을 다시 설치해 준다.

```
$ sudo apt install bash-completion --reinstall
```


###  Swap 추가

여유 디스크에 swap을 추가하려면 

```
$ sudo mkswap /dev/sda1
$ sudo swapon /dev/sda1
$ sudo swapon -s
```

swap 파일로 만들려면 

```
$ sudo dd if=/dev/zero of=/data/swap4G bs=1G count=4
$ sudo chmod 600 /swapfile
$ sudo mkswap /swapfile
$ sudo swapon /swapfile
$ sudo swapon -s
```


## 참조
 - [sudo user create](> https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart)