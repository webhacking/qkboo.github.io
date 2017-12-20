---
title: UFW Firewall on Ubuntu/Debian
date: 2017-04-03 14:00:00 +0900
layout: post
tags: [linux, firewall, security]
categories: 
- Linux
---

일반적인 리눅스 배포본의 방화벽인 ufw` 를 사용해서 리눅스에 방화벽을 구축하는 방법을 기술하고 있다.

> - 2017-09-10: Log, export 추가서
{:.right-history}


여기서 사용, 테스트한 리눅스 배포본은 Ubuntu 14.04, 15.04, 16.04 계열에서 동작하리라 믿는다. 실제 Raspbian Weezy, Jessie, Armbian Ubuntu 16.04, Debian Jessie 에서 사용중이다.

<br/>
<br/>
## UFW - Uncomplicated Firewall

Ubuntu의 기본 방화벽 두고는 UFW이다. 데스크탑을 위한 GUI 버전 [Gufw](https://help.ubuntu.com/community/Gufw) 도 있다. [^2]


### ufw 설치

서버로 운영중인 ARM 계열의 SBC 컴퓨터인 Raspberry Pi, Odroid, OrangePi 등의 배포본에는 ufw가 빠져 있다.

```sh
$ sudo apt install ufw
```

방화벽은 다음 같이 설정한다
 - 기본 규칙
 - 프로토콜, 포트 규칙 추가
 - 방화벽 활성화


#### 방화벽 기본 설정

기본 정책을 설정 한다 - (들어오는 패킷은 차단, 나가는 패킷은 허용)

```sh
$ sudo ufw default deny incoming
$ sudo ufw default allow outgoing
```

현재 방화벽 기본 정책을 확인한다.

```sh
$ sudo ufw show raw
```

설정한 규칙과 이에 따른 액션을 확인해 보려면 다음과 같이 입력한다.

```sh
$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing)
New profiles: skip
```

`Default` 부분이 방화벽의 기본 규칙으로 현재 들어오는 것은 막고, 나가는 것은 열어 놓은 상태이다.



### 방화벽 규칙 허용

서비스, 포트, 프로토콜, 프로그램등에 예외 규칙을 적용할 액션을 추가한다.

> ufw [allow,deny] <port>/<optional: protocal>

혹은 서비스 이름으로 가능하다

> ufw [allow,deny] <service name>

ssh, http, https 허용 (ssh 포트를 변경해서 사용한다면 반드시 직접 포트를 입력하자)

```sh
$ sudo ufw allow ssh
$ sudo ufw allow http
$ sudo ufw allow https
```

포트를 변경해 사용하거나 특정 포트를 허용 할 수 있다. ssh 프로토콜은 tcp 22번 포트를 사용한다.


```sh
$ sudo ufw allow 8080
$ sudo ufw allow 22
```

규칙과 액션 상태를 확인한다.

```
$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing)
New profiles: skip

To                         Action      From
--                         ------      ----
22                         LIMIT IN    Anywhere
22                         LIMIT IN    Anywhere (v6)
```

새로운 설정을 적용하려면 disable > enable 해도 좋고 아래와 같이 reload 가 가능하다

```sh
$ sudo ufw reload
```




먼저 ufw를 활성화하고 규칙을 추가한다.

#### UFW 활성화

방화벽은 커널 수준에서 패킷을 다루기 때문에 아래 같이 활성화 명령을 통해 네트워크 패킷을 ufw가 다룰 수 있게 해준다.

ufw 활성화 상태를 확인하고 inactive 상태면 활성화 한다.

```sh
$ sudo ufw status
Status: inactive

$ sudo ufw enable
Firewall is active and enabled on system startup
```

방화벽을 끌 때는 아래와 같은 명령어를 입력한다

```sh
$ sudo ufw disable
```




#### ssh 허용

sh 허용

```
$ sudo ufw allow ssh
or
$ sudo ufw allow 22
```

ssh를 특정 IP 주소에만 접속을 허용한다

```
sudo ufw allow from 192.168.0.100 to any port 22
```

```
sudo ufw allow from 192.168.0.100 to any port 22 proto tcp
```


#### limit

ufw는  Brute-force Attack 방어를 도와주는 Brute-force Attack을 방어하기 위한다면 다음과 같이 실행한다.

```sh
$ sudo ufw limit ssh
```



<br/>
#### samba 허용

```sh
$ sudo ufw allow Samba
$ sudo ufw allow from 192.168.0.0/16 to any app Samba
```



이렇게 설정하고 실제 열린 포트는 다음 같이 `netstat` 명령으로 확인이 가능하다.

```
$ netstat -tlnp
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN      5034/python3
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:1883            0.0.0.0:*               LISTEN      -
tcp6       0      0 ::1:8080                :::*                    LISTEN      5034/python3
tcp6       0      0 :::22                   :::*                    LISTEN      -
tcp6       0      0 ::1:25                  :::*                    LISTEN      -
tcp6       0      0 :::1883                 :::*                    LISTEN      -
```

#### IP 주소 제어

특정 IP 대역에서 허용/거부 하기

>ufw [allow,deny] from <ip address>

특정 IP만 허용할 경우 

```
$ sudo ufw allow from 192.168.0.100
```

특정 ip 또는 특정 ip 대역에 대해 특정 포트 허용/거부하기

> ufw [allow,deny] from <ip address> to port <port number>

```sh
$ sudo ufw allow from 192.168.0.100 to any port 22
$ sudo ufw allow from 192.168.0.100 to any port 22 proto tcp
$ sudo ufw allow from 192.168.0.100 to any port 8080
```


특정 IP 혹은 IP 범위에 대한 접근 제어도 가능하다.

> ufw allow from <ip address> to <protocol> port <port number>
> ufw allow from <ip address> to <protocol> port <port number> proto <protocol name>

포트의 범위를 규칙으로 사용할 경우

```
$ sudo ufw allow 9200:9300/tcp
```

특정 아이피에만 일정 범위의 포트를 tcp 패킷만 허용할 경우

```
$ sudo ufw allow from 192.168.0.101 to any port 9200:9300 proto tcp
```

서브넷을 특정 포트에 허용할 경우

```
$ sudo ufw allow from 192.168.0.0/24 to any port 27017 proto tcp
```


#### ping (icmp) 허용/거부

UFW 기본설정은 ping 요청을 허용하도록 되어있다. 이것은 `/etc/ufw/before.rules` 파일에 정의되어 있는데 여기서 icmp 프로토콜 관련한 항목을 DROP으로 처리하거나 삭제하면 **ping**을 방지할 수 있다.

```
   # ok icmp codes
  -A ufw-before-input -p icmp --icmp-type destination-unreachable -j ACCEPT
  -A ufw-before-input -p icmp --icmp-type source-quench -j ACCEPT
  -A ufw-before-input -p icmp --icmp-type time-exceeded -j ACCEPT
  -A ufw-before-input -p icmp --icmp-type parameter-problem -j ACCEPT
  -A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT
```


### 방화벽 규칙 삭제

등록된 규칙을 삭제할 때는 2가지 방법이 있다. 첫번째는 등록 시 사용한 규칙을 그대로 입력하는 방법

```sh
$ sudo ufw delete allow ssh
$ sudo ufw delete allow 8080
```

22/tcp 설정이 되어있다고 가정하고, 해당 포트/포로토콜을 삭제한다.

```sh
$ sudo ufw delete deny 22/tcp
```


두번째는 각 규칙의 번호를 확인하고 번호로 지우는 방법으로 status numbered 명령으로 규칙 번호를 확인한다.

```
$ sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22                         ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443/tcp                    ALLOW IN    Anywhere
[ 4] 22 (v6)                    ALLOW IN    Anywhere (v6)
[ 5] 80/tcp (v6)                ALLOW IN    Anywhere (v6)
[ 6] 443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

등록된 규칙의 번호는 줄 맨앞에 있는 [숫자]로 이 숫자를 delete 명령에 준다.

2번 규칙 80/tcp 를 지우려면

```sh
$ sudo ufw delete 2
```


#### UFW 설정 파일

**/etc/ufw/** 밑에 `before.rule`, `before6.rule` 파일이 있다. 기본적으로 ufw 시작시 before.rules, that allows loopback, ping, and DHCP을 활성화 하고

또한 ufw 명령이 실행된 후에 추가되는 룰이 `after.rule`, IPv6용 `after6.rule` 파일이 있다.

그리고 **/etc/default/ufw** 파일은 IPv6 를 활성화 하거나 비활서화 한다.



### Logging



```sh
$ sudo ufw logging on
Logging enabled
```

로그 수준은 `ufw logging low|medium|high` 로 지정한다.

기록되는 로그는  */var/logs/ufw* 에 위치한다.

```sh
Sep 16 15:08:14 <hostname> kernel: [UFW BLOCK] IN=eth0 OUT= MAC=00:00:00:00:00:00:00:00:00:00:00:00:00:00 SRC=123.45.67.89 DST=987.65.43.21 LEN=40 TOS=0x00 PREC=0x00 TTL=249 ID=8475 PROTO=TCP SPT=48247 DPT=22 WINDOW=1024 RES=0x00 SYN URGP=0
```

- **UFW BLOCK**: This location is where the description of the logged event will be located. In this instance, it blocked a connection.
- **IN**: If this contains a value, then the event was incoming
- **OUT**: If this contain a value, then the event was outgoing
- **MAC**: A combination of the destination and source MAC addresses
- **SRC**: The IP of the packet source
- **DST**: The IP of the packet destination
- **LEN**: Packet length
- **TTL**: The packet TTL, or time to live. How long it will bounce between routers until it expires, if no destination is found.
- **PROTO**: The packet’s protocol
- **SPT**: The source port of the package
- **DPT**: The destination port of the package
- **WINDOW**: The size of the packet the sender can receive
- **SYN URGP**: Indicated if a three-way handshake is required. 0 means it is not.


## 참조

[How to configure ufw - Ubuntu 14.04](https://www.vultr.com/docs/how-to-configure-ufw-firewall-on-ubuntu-14-04)

[IP address from mac address](http://stackoverflow.com/questions/13552881/can-i-determine-the-current-ip-from-a-known-mac-address)


[^2]: [UFW Help](https://help.ubuntu.com/community/UFW)
[^3]: [Check blocked IP in iptables](http://www.cyberciti.biz/faq/linux-howto-check-ip-blocked-against-iptables/)


