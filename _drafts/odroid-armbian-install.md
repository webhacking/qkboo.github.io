---
title: Odroid - Install Ambian
date: 2017-04-02 12:10:00 +0900
layout: post
tags: linux, odroid
categories: linux, odroid
---

# Ambian for Odroid

Armbian에서 서버/데스크탑 버전 다운로드 가능
 - Ubuntu Xenial 16.04
 - Debian Jessie 


## Install

### Write a image

Mac에서 

```bash
diskutil list
```


```bash
diskutil unmountDisk /dev/disk1
```


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
9b085251a00ad7ae16fe42fbfb25c042  - ```

Compare above two MD5 values. They must be ident

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





#### apt autocompetion

bash-completion 이 빠져 있으면

```
$ sudo apt install bash-completion
```

apt-get 명령은 자동완성이 되지만 apt 명령은 안된다면

```
$ sudo apt install --reinstall bash-completion
```



###  디스크

#### tune2fs

fsck로 마지막 체크한 시간 확인은 `tune2fs` 명령을 이용

```
$sudo tune2fs -l /dev/sdbX | grep Last\ c
Last checked:             Sun Dec 13 09:14:22 2015
```

마운트 횟수

```
tune2fs -l /dev/sdbX | grep Mount
Mount count:              157
```

```
tune2fs -l /dev/sdbX | grep Max
Maximum mount count:      -1
```

> 참조: https://linuxconfig.org/how-to-force-fsck-to-check-filesystem-after-system-reboot-on-linux


#### fsck

루트 파티션을 강제로 fsck 하게 하려면 루트 파티션에 `forcefsck` 파일을 생성해 둔다.

```
$sudo touch /forcefsck
```

forcefsck 파일은 단 한번만 부팅시 루트 파일시스템을 체크한다. 만약 지속적으로 파일 시스템을 체크하도록 하려면 tune2fs 를 사용해서 'Maximum mount count' 파라미터를 사용하도록 한다.

아래 명령은 부팅시마다 루트 파티션을 체크하게 된다.

```
tune2fs -c 1 /dev/sdb1
```

이렇게 하면 fsck Maxium mount 값을 양의 값으로 지정하게 된다. 그리고 10번째 부팅시 체크하도록 하려면 -c 10 을 준다.


```
tune2fs -c 10 /dev/sdb1
```


#### SWAP

swap 파일로 만들려면 

```
$ sudo dd if=/dev/zero of=/data/swap4G bs=1G count=4
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo swapon -s
```


```
sudo mkswap /dev/sda1
sudo swapon /dev/sda1
sudo swapon -s
```






