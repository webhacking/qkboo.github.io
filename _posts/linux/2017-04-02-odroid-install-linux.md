---
title: Odroid - Install Linux
date: 2017-04-02 10:10:00 +0900
layout: post
tags: [linux, odroid, armbian, install]
categories: Linux
---

> 2017-07-24: exFAT 추가
{:.right-history}


Odroid C2 

![](http://odroid.com/dokuwiki/lib/exe/fetch.php?tok=53e4d9&media=http%3A%2F%2Fdn.odroid.com%2Fhomebackup%2F201602%2FODROID-C2.png){: width="600"}

[그림. armv8 Odroid C2]


다음은 Odroid C2에 Ubuntu 16.04 minimal 버전, 그리고 Ambian Jessie를 설치하고, 처음 설정에 대한 것이다.

 - Odroid에서 제공하는 64bit Ubuntu 설치
 - Ambian 64bit Debian jessi 설치
 - sudoer 사용자 사용
 - hostname 설정
 - swap 사용




## Ambian for Odroid

Armbian에서 데스크탑 버전으로 Ubuntu 와 서버 버전으로 Debian Jessie를 다운로드 가능하다.

![](/images/odroid/odroidc2-armbian-download.png){: width="600"}

여기서는 Debian Jessie 버전을 사용한다.

### Install

Micro SD Card를 사용하면 가능하면 **UHX-1 Class 10** 를 사용하도록 한다.

#### 준비사항

Odroid C2는 Micro SD Card 혹은 eMMC Card로 부팅 디스크를 구성할 수 있다.
 - Micro SD Card: **UHX-1 Class 10** 이상
 - SDHX Class 8에서 사용중인데, 큰 문제는 없지만 SD Card에 영향을 받는 듯 하다.


#### Download

[Ambian Download](http://www.armbian.com/download/) 에서 [Odroid C2 이미지](https://www.armbian.com/odroid-c2/) 에서 *Debian server*를 다운 받는다. 

서버는 7z 파일로 되어 있어서 
 - Windows에서는 **7-Zip** 프로그램, macOS에서는 **Keka**
 - Linux에서 **7z**

linux 7z은  ```apt-get install p7zip-full``` 으로 설치한다.

모든 플랫폼에서 사용 가능한 저수준 이미지 쓰기 프로그램 **[Etcher](https://etcher.io)**도 권장한다.

#### Etcher 사용

[Etcher](https://etcher.io) 에서 다운로드해서 실행하고, SD Card를 준비한다.

![](https://etcher.io/static/screenshot-1x.gif){: width="600"}

그리고 다운로드한 Debian_jessie_default.7z 이미지 파일을 선택하고 선택한 SD Card에 이미지를 쓴다.

#### Write a image

여기서 macOS를 사용하고 있다. 다운로드한 Debian_jessie_default.7z 이미지를 압축 해제하고, SD Card를 슬롯에 넣고, SD Card의 디스크 번호를 확인하고, 마운트를 해제한다.

```bash
$ diskutil list                           #디스크 번호 확인
$ diskutil unmountDisk /dev/disk1         #마운트 해제
```

dd를 사용해 오에스이미지를 쓴다.

```
$ sudo dd if=Debian_jessie_default.img of=/dev/rdisk1 bs=1M conv=fsync
```


#### Verifying the burned image with Linux

오에스 이미지 파일의 md5 값과 디스크에 쓴 이미지의 해시 값을 비교할 수 있다.

```
$ sudo dd if=</dev/path/of/card> bs=512 count=$((`stat -c%s <my/odroid/image.img>`/512)) | md5sum
167742+0 records in
167742+0 records out
85883904 bytes (86 MB, 82 MiB) copied, 0.153662 s, 559 MB/s
9b085251a00ad7ae16fe42fbfb25c042  -
$
$ dd if=<my/odroid/image.img> bs=512 count=$((`stat -c%s <my/odroid/image.img>`/512)) | md5sum
167742+0 records in
167742+0 records out
85883904 bytes (86 MB, 82 MiB) copied, 0.140843 s, 610 MB/s
9b085251a00ad7ae16fe42fbfb25c042  - 
```

두 값이 일치해야 한다.

### 첫번째 로그인

기본 아이디 root / 1234 로 로그인 가능하고 즉시 비밀번호를 변경해야 한다. 또한 사용자 계정을 만들어 사용해야 한다.

```
Welcome to ARMBIAN Ubuntu 16.04 LTS 3.4.112-sun8i

System load:   1.17             Up time:       2 min
IP:            192.168.11.122
CPU temp:      51°C
Usage of /:    17% of 7.3G

Changing password for root.
(current) UNIX password:
Enter new UNIX password:
Retype new UNIX password:

Thank you for choosing Armbian! Support: www.armbian.com

Creating new account. Please provide a username (eg. your forename): qkboo
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
    Full Name []: Qkboo
    Room Number []:
    Work Phone []:
    Home Phone []:
    Other []:
Is the information correct? [Y/n] y

Dear Qkboo, your account qkboo has been created and is sudo enabled.
Please use this account for your daily work from now on.

```


### upgrade 

```
# apt update && apt dist-upgrade && apt upgrade
```

업그레이드 중 

```
The following packages have been kept back:   linux-image-c2
```

기존 리눅스 이미지를 지우고 업그리이드 중 에러가 나서 이미지 업그레이드가 안되었으므로, 이전 버전 이미지를 찾아 삭제해 주면 다시 업그레이드가 된다.

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


### 설정

#### hostname

debian 계열에서 hostname을 변경하려면 `hostnamectl` 을 사용한다.

```
$ sudo -s
# hostnamectl set-hostname dlp
# show settings
root@debian:~# hostnamectl 
   Static hostname: dlp
         Icon name: computer-vm
           Chassis: vm
        Machine ID: 5f47b11299ed4689a48a7f78197e452a
           Boot ID: bdeed3b6c079405bb45d79eff3e870a5
    Virtualization: vmware
  Operating System: Debian GNU/Linux 8 (jessie)
            Kernel: Linux 3.16.0-4-amd64
      Architecture: x86-64

```

#### Timezone

```
# dpkg-reconfigure tzdata
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

##### swapoff

swap 을 지우려면

```
swapoff /swapfile
rm /swapfile
```


## Ubuntu 16.04 설치

Micro SD Card를 사용하면 가능하면 **UHX-1 Class 10** 를 사용하도록 한다.

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

Odroid의 Ubuntu는 root 계정을 기본으로 제공하고 있다. 일반 사용자를 등록해 sudoer로 사용하도록 한다.

### sudo 새 사용자 등록

sudo 사용자를 추가해서 사용하려면, adduser 혹은 useradd 명령을 사용해서 사용자를 등록 할 수 있다. 

#### 새 사용자 등록

먼저 adduser는 추가할 사용자에 대한 정보를 하나씩 물어 가며 등록이 진행되고, 사용자 홈을 생성해 준다.

```
$ sudo adduser qkboo
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


`useradd` 는 홈 디렉토리, 쉘 등에 대한 옵션을 주고 사용자를 등록한다.

> http://www.tecmint.com/add-users-in-linux/

‘useradd‘ 명령은 크게 두가지 일을 한다:

 - 추가한 사용자에 대한 /etc/passwd, /etc/shadow, /etc/group and /etc/gshadow 편집
 - 사용자 홈 디렉토리 생성

```
$sudo  useradd -m qkboo
```

그리고 패스워드를 등록한다.

```
$ sudo passwd qkboo
New password:
Retype new password:
passwd: password updated successfully
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
root  ALL=(ALL:ALL) ALL
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


### exFAT

리눅스테어 외부 USB 디스크를 *exFAT*로 포맷하고 사용한다면, *exfat-fuse*와 *exfat-utils*를 설치해 준다.

```sh
$ sudo apt install exfat-fuse exfat-utils
```

그리고 대부분 최신 리눅스 데스크탑은 USB 디스크를 더블클릭하면 자동마운트 해준다.

터미널에서는

```sh
$ sudo mkdir /media/my_usb
$ sudo mount -t exfat /dev/sdb1 /media/my_usb
$ sudo umount /dev/sdb1
```


### VNC server

```
sudo apt install tightvncserver
```

그리고 `vncserver` 명령으로 기본 패스워드를 생성한다.

```
vncserver

```




#### grc

터미널 컬러 처리

https://github.com/garabik/grc




## 참조
 - [sudo user create](> https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart)
 - [armbian docs](https://docs.armbian.com)