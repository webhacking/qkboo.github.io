---
title: "Raspberry Pi 3 64bit OS openSUSE: Install"
date: 2017-10-20 09:10:00 +0900
layout: post
tags: [Raspberry Pi 3, openSUSE, Linux]
categories: [Raspberry Pi, Linux]
---

> 2017-10-30: swap 추가, timezone 수정
{:.right-history}

Opensuse 에서 Raspberry Pi 3를 위한 64bit OS openSESE Leap 42.2 을 제공하고 있다.
 - https://en.opensuse.org/HCL:Raspberry_Pi3

이글은 5개 글타래로 구성되며, openSUSE 설치 및 사용에 대해 작성한다.

  1. **Install 64bit openSUSE Leap 42.2 / JeOS**
  2. openSUSE: Managing Service daemon
  3. openSUSE: Basic OS Security for Server
  4. [Install & Configuration - Nginx, Node JS, Jupyter]({% post_url /raspberrypi/2017-10-21-opensuse-jeos-nginxjupyter %})
  5. openSUSE: Build MongoDB 3.4.x


## Install 64bit openSUSE Leap 42.2 / JeOS

openSUSE는 **Raspberry Pi 3**를 위한 Opensuse community edition은 정식 버전 **Leap 42.2 image**, 개발버전 *Tumbleweed image*, 커뮤니티버전 non-upstream openSUSE Tumbleweed image* 으로 구성되어 있다.

이들 버전은 용도에 따라 JeOS, E20, LXQT X11 이미지로 다운받을 수 있다.

- Just Enought Operating System (JeOS)
  - jeOS 이미지는 기본 오에스만을 포함하고 있다.
  - https://www.suse.com/products/server/jeos/

- E20
  - 데스크탑 환경으로 Enlightenment 을 사용하 GUI 이미지


- LXQt
  - LXDE-Qt 와 RazorQt 병합한 데스크탑 환경
  - https://en.opensuse.org/LXQt

<br>
### Download and Install

[Download Page](https://en.opensuse.org/HCL:Raspberry_Pi3) 의 두번째 *Installing the 64-bit openSUSE Leap image* 단락에 있는 JeOS image 를 다운로드 한다.

#### Writing image to SD Card

[Etcher](http://etcher.io) 등을 이용해서 다운받은 이미지 파일을 SD Card에 쓴다.

![](/images/opensuse/etcher-image-writing.png){:width="640"}

##### `dd` 를 사용한다면,

다운받은 `.xz` 파일을 `dd` 를 이용해서 SD Card에 쓴다.

```
xzcat openSUSE-Leap42.2-ARM-JeOS-raspberrypi3.aarch64.raw.xz | sudo dd of=/dev/rdisk1 bs=4m; sync
```

<br>
#### Serial console

여기서는 **Serial console**에서 네트워크 확인 및 초기 설정을 하고 **ssh** 로 서버에 로그인해서 시스템 구성을 진행한다.

> SD Card를 라즈베리파이에 꽃고 HDMI, Keyboard 및 Mouse 가 별도로 준비되어 있으면 직접 모니터를 보고 작업을 진행하면 좋다. 

USB to Serial 케이블을 사용해서 Raspberry Pi의 Serial Console에 연결한다.

![](/images/raspberrypi/rpi-usb-serial.png){:width="640"}

그리고 시리얼 포트를 통해 tty 연결을 위해 터미널 프로그램에서 baud rate 115200 으로 연결한다. 아래는 macOS의 `screen` CLI 명령으로 usb serial 포트에 연결하고 있다.

```
$ screen /dev/cu.usbserial 115200
```

이제 SD Card를 넣고 부팅을 하면, 터미널에 부트 단계가 진행되고 처음 5분 정도 소요된다. 

![](/images/opensuse/opensuse-boot33.png){:width="640"}

Raspberry Pi를 위한 이미지는 처음 계정은 `root/linux` 이다. 

터미널에서 uname 은 **aarch64** 임을 확인 할 수 있다.

```sh
root# uname -a
Linux homepi 4.4.90-18.32-default #1 SMP Fri Oct 6 13:30:08 UTC 2017 (465b410) aarch64 aarch64 aarch64 GNU/Linux
```

처음으로 라즈베리파이에서 64bit 환경으로 운영해 볼 수 있게 됐다.

<br>
<br>
### 설치 후 서버 구성을 위해 할 일

JeOS를 서버로 구성하기 위해서 다음 같은 작업을 수행해 준다.
 - root 패스워드 변경
 - sudoer 사용자 생성
 - DHCP를 고정 IP로 변경


#### root 패스워드

root 사용자의 패스워드를 변경한다.

![](/images/opensuse/opensuse-root-passwd.png){:width="640"}


####  Update

Ubuntu/Debian 계열의 패키지 명령 `apt`,`apt-get` 과 비슷한 openSUSE 명령라인 패키지 관리자는 **zypper** 가 있다. 

```sh
zypper help search     # to print help for the search command
zypper refresh, ref    # Refresh all repositories.
zypper update,  up     # to update all installed packages
zypper lp              # to see what patch updates are needed
zypper patch           # to apply the needed patches
zypper se sqlite       # to search for sqlite
zypper rm sqlite2      # to remove sqlite2
zypper in sqlite3      # to install sqlite3
zypper in yast*        # to install all packages matching 'yast*'
```

- [zypper usages](https://en.opensuse.org/SDB:Zypper_usage) 에서 사용방법을 자세히 알 수 있다.

먼저 최근 업그레이드된 필요한 패키지를 다운로드하고 설치한다.[^1]

```sh
# zypper update
or
# zypper up
```

> 지원중단된 패키지, 나뉘어진 패키지 등의 의존성을 고려한 업그레이드를 하려면 `dup` 명령을 사용한다.
> 
> ```sh
> zypper dup             # distribution upgrade
> zypper dist-upgrade
> ```


#### ip 주소 확인

ifconfig 명령으로 현재 IP Address를 확인하고 이 IP Address에 `ssh` 를 사용해 접속한다.

```bash
linux:~ # ifconfig
eth0      Link encap:Ethernet  HWaddr B9:40:EB:BA:10:02
          inet addr:192.168.1.104  Bcast:192.168.1.255  Mask:255.255.255.0
          inet6 addr: fe90::ba37:ebff:feba:1012/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:83136 errors:0 dropped:0 overruns:0 frame:0
          TX packets:27300 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:120797947 (115.2 Mb)  TX bytes:2369690 (2.2 Mb)
linux:~ #
linux:~ # shutdown now
```

좀더 편리한 사용을 위해 `ifconfig` 명령으로 찾은 IP address에 ssh 로그인을 해서 작업을 진행한다.

```sh
$ ssh root@192.168.1.104
```

<br>
<br>
### 시스템 설정

이제 sudoer 사용자로 시스템을 서버에 적합하게 구성해 보자.

 - sudoer 추가
 - yast 소개
 - timezone
 - Network 구성: 호스트 이름, IP 주소
 - swap 개선
 - yast로 사용자 추가


#### sudoer

**root** 사용자가 아닌 일반사용자를 `sudoer`로 등록해 관리자 기능을 대행 할 수 있다. 그러기 위해서 먼저 사용자를 추가한다. openSUSE `yast`라는 시스템 도구로 할 수 있지만 여기선 `useradd` 명령을 사용해서 사용자 추가한다. `useradd`에 대해서는 [useradd 명령](http://www.tecmint.com/add-users-in-linux/)을 참조한다.

`useradd` 는 홈 디렉토리, 쉘 등에 대한 옵션을 주고 사용자를 등록한다.
 - 추가한 사용자를 /etc/passwd, /etc/shadow, /etc/group and /etc/gshadow 추가
 - 그리고 `-m` 옵션으로 으로 사용자 홈 디렉토리 까지 생성한다.

```bash
root#  useradd -m foo
```

그리고 패스워드를 등록한다.

```sh
root# passwd foo
New password:
Retype new password:
passwd: password updated successfully
```


#### sudoer 등록

`visudo` 명령으로 */etc/sudoers* 파일을 편집한다. 

```sh
$ sudo visudo
```

*sudoer* 파일에 있는 *User privilege* 항목 아래에 새로운 사용자 foo를 아래 같이 등록한다.

```
# User privilege specification
root  ALL=(ALL) ALL
foo  ALL=(ALL) ALL
```

이제 root에서 로그아웃하고 새로 추가한 사용자로 로그인한다.

```sh
$ ssh foo@192.168.1.104
Password:
Have a lot of fun...
foo@linux:~>
```

openSUSE는 관리자용 명령을 직접 내리면 찾지 못한다고 한다.

```sh
foo@linux:~> yast2 timezone
-bash: yast2: command not found
```

그리고 처음으로 sudoer 사용자가 관리자 권한이 필요한 명령을 사용하기 위해 `sudu` 로 명령을 내리면 아래 같은 경고가 나온다.

```sh
foo@linux:~> sudo /sbin/yast2 timezone

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.
```

openSUSE는 시스템 관리 도구로 `yast` 를 사용해서 소프트웨어 설치, 네트워크 구성, 시간 관리, 보안 및 사용자 등을 다루는 소프트웨어로 GUI와 CLI 모두 사용할 수 있다. 

시스템 네트워크를 구성하기 위해서 `yast` 명령을 사용해보자,

#### yast

yast는 GUI 혹은 ClI에서 사용이 가능하다 . 다음은 `sudo yast` 를 실행하면 Ncurse 로 표시되는 yast 화면이다.

![](/images/opensuse/yast-cli-ui.png){:width="640"}

TAB 키로 각 항목을 이동할 수 있고, Enter로 실행한다. 전체 화면에서 F9는 Cancel, F10은 OK 기능을 수행한다.


#### Timezone

처음 설치후 *CET* 시간대로 되어 있어서 Asia/Seoul로 변경하고자 한다.

```sh
linux:~ # date
Sun Oct 29 09:19:31 CET 2017
```

시스템 시간대를 설정하려면 `yast` 를 시작해 *System -> Date and Time* 을 실행해 시간대를 지정한다. 혹은 `yast timezone` 모듈 명령을 주면 해당 Date and Time 화면으로 이동할 수 있다.

![](/images/opensuse/yast-date_time.png){:width="640"}

시간대를 변경후 확인해 보면,

```
linux:~ # date
Sun Oct 29 17:22:11 KST 2017
```

ntp로 동기화하려면 *Other Settings...* 항목을 선택해 *ntp server* 를 설치하고 활성화 한다.

![](/images/opensuse/yast-date_time-ntp1.png){:width="640"}
![](/images/opensuse/yast-date_time-ntp2.png){:width="640"}


{% comment %}
참고로 ClI로 `yast` 명령을 사용할 수 있다. 예를 들어 timezone 사용 가능한 시간대는

```sh
sudo yast2 timezone list
```

해당 하는 시간대 문자열을 이용해 시간대를 지정한다.

> sudo yast2 timezone set timezone=[TIMEZONE]

우리나라 시간대 'Asia/Seoul (Seoul)'는 이렇게 지정할 수 있다.

```sh
~> sudo yast2 timezone set timezone='Asia/Seoul (Seoul)'
```
{% endcomment %}


#### yast로 네트워크 설정하기

시스템 네트워크 구성을 설정하려면 `yast` 에서 *System -> Network Settings* 을 실행한다.

![](/images/opensuse/yast-network1.png){:width="640"}

네트워크 구성 상태를 가져오는 시간이 걸린다.

![](/images/opensuse/yast-network2.png){:width="640"}

네트워크 구성을 시작한다. TAB으로 `Edit` 를 선택하고,

![](/images/opensuse/yast-network-settings.png){:width="640"}

*Statically Assigned IP Address*를 선택하고, 아래 IP Address, Subnet Mask, Hostname 을 입력한다.

![](/images/opensuse/yast-network-ip-address.png){:width="640"}

TAB으로 이동해 **Next** 버튼을 누른다. 그리고 TAB으로 **Hostname/DNS** 탭 으로 이동해서 Name Server를 입력한다. 보통 DHCP를 지원하는 공유기/라우터에서 DNS server 역할을 하므로 게이트웨이 IP를 입력해도 무방하다.

![](/images/opensuse/yast-network-host.png){:width="640"}

마지막으로 **Routing** 탭을 이동해 Gateway를 입력해 준다.

![](/images/opensuse/yast-network-gw.png){:width="640"}

완료됐으면 *F10* 혹은 TAB으로 **OK 버튼**으로 이동해 설정한 내용을 저장한다. 이로서 수동 IP 주소 입력을 마친다.

`yast` ClI 명령으로 Host 이름을 변경할 수 있다.

> yast dns edit hostname=HOSTNAME

또한 `yast` ClI 명령으로 소프트웨어 패키지를 설치 할 수 있다.

```sh
sudo yast -i <package_name>
sudo yast --install <package_name>
```


#### swap 개선

JeOS는 별도의 파티션에 swap을 가지고 있다.

```
~> sudo swapon -s
Filename        Type    Size  Used  Priority
/dev/mmcblk0p3                          partition 497384  1816  -1
```

별도의 swap 을 1GB 크기 Swap file로 추가하려면 

```
$ sudo dd if=/dev/zero of=/var/swapfile1G bs=1G count=1
$ sudo chmod 600 /var/swapfile1G
$ sudo mkswap /var/swapfile1G
Setting up swapspace version 1, size = 1024 MiB (1073737728 bytes)
no label, UUID=3b192470-5297-42ef-a033-b19b0de03590

$ sudo swapon /var/swapfile1G
$ sudo swapon -s
```

`mkswap` 명령 결과에 있는 *UUID=...* 부분을 복사해 /etc/fstab 에 종속적으로 등록해 주면 재시동 후에도 사용 가능하다.

```
UUID=3b192470-5297-42ef-a033-b19b0de03590 swap swap defaults 0 0
```


#### yast 사용자 추가

앞에서 `adduser` 명령으로 사용자를 추가했는데 openSUSE에서는 `yast`에서 사용할 수 있다. `yast` 를 시작해서 사용자 관리로 가거나, 아래 같이 바로 사용자 관리 화면으로 시작할 수 있다.

```sh
sudo yast2 users
```

yast 화면에서 사용자 관리 화면,

![](/images/opensuse/yast-user.png){:width="650"}


다음 서버로 운영을 위해서 openSUSE에서 sshd 보안 강화, 방화벽, 필터링 등의 기본적인 보안 작업을 진행한다. *다음 openSUSE: Basic Security for Server*



#### Memory

rpi3 가 1GB 메인메모리로 출시, raspbian 실제 메모리 정보는,

```
$ cat /proc/meminfo
MemTotal:         949572 kB
MemFree:          386192 kB
MemAvailable:     711148 kB
```

rpi3에 openSUSE LEAP 42.2에서

```
> cat /proc/meminfo
MemTotal:         803988 kB
MemFree:          661276 kB
MemAvailable:     684504 kB
```

[여기](https://raspberrypi.stackexchange.com/questions/56266/raspberry-pi-3-has-less-than-1gb-memory-available-at-os-level) 에 따르면 GPU 때문 인듯...


### tune2fs

fsck로 마지막 체크한 시간 확인은 `tune2fs` 명령을 이용

```
$sudo tune2fs -l /dev/sdbX | grep Last\ c
Last checked:             Sun Dec 13 09:14:22 2015
```

#### e2fsck 점검

부팅시 e2fsck로 점검할 마운트 횟수가 설정되 있다. `-l` 옵션으로 확인한다.

```
tune2fs -l /dev/sdbX | grep Mount
Mount count:              157
```

```
tune2fs -l /dev/sdbX | grep Max
Maximum mount count:      -1
```

이 마운트 회수를 지정할 수 있다.

```
tune2fs -c 10 /dev/sdb1
```


<br>

## 참고

[Raspberry Pi 3: Installing 64bit openSuse Leap Image](https://en.opensuse.org/HCL:Raspberry_Pi3#Installing_the_64-bit_openSUSE_Leap_image)

[^1]: [System Upgrade](https://en.opensuse.org/SDB:System_upgrade)
[^2]: [net-tools deprecated](https://software.opensuse.org/package/net-tools-deprecated)
[^4]: [Static route in Opensuse](http://www.susegeek.com/networking/how-to-setup-persistent-static-routes-in-opensuse-110/)
