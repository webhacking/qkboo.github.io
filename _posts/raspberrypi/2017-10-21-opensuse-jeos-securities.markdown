---
title: "Raspberry Pi 3 64bit OS openSUSE: Basic Security"
date: 2017-10-21 09:00:00 +0900
layout: post
tags: [Raspberry Pi 3, openSUSE, Linux]
categories: [Raspberry Pi, Linux]
---

**Raspberry Pi 3 64bit OS openSUSE** 는 이글은 3개 글타래로 구성되며, openSUSE 설치 및 사용에 대해 작성한다.

Opensuse 에서 Raspberry Pi 3를 위한 64bit OS openSESE Leap 42.3 을 제공하고 있다.
 - https://en.opensuse.org/HCL:Raspberry_Pi3

  1. [Install 64bit openSUSE Leap 42.3 / JeOS]({% post_url /raspberrypi/2017-10-20-opensuse-jeos-install %})
  2. openSUSE: Managing Service daemon
  3. openSUSE: Basic OS Security for Server
  4. Install & Configuration - Nginx, Node JS
  5. Build MongoDB 3.4.x


## openSUSE: Basic OS Security for Server

이전 글에서 라즈베리파이 3에 설치한 64bit OS openSUSE LEAP / JeOS를 서버 구성을 위해서 보안 설정을 한다. 이 글은 다음 세가지 내용을 포함하고 있다.

 - ssh와 sshd 설정
 - 방화벽 설정: YaST Firewall 대비 ufw 설치
 - Fail2ban 설치 및 설정



### sshd_config

ssh 사용시 

{% link _my_collection/sshd-basic-securities.markdown %}



### 방화벽 설정

openSUSE는 SuSEfirewall2 가 기본으로 제공되어 서비스를 활성화 하면 사용할 수 있다. 아직 익숙치 않아서  SuSEFirewall2 을 우분투/데비안에서 익숙한 ufw 를 설치해 사용하겠다. 


```
Basic Syntax:
    yast2 firewall interactive
    yast2 firewall <command> [verbose] [options]
    yast2 firewall help
    yast2 firewall longhelp
    yast2 firewall xmlhelp
    yast2 firewall <command> help

Commands:
    broadcast     Broadcast packet settings
    disable       Disables firewall
    enable        Enables firewall
    interfaces    Network interfaces configuration
    logging       Logging settings
    masqredirect  Redirect requests to masqueraded IP
    masquerade    Masquerading settings
    services      Allowed services, ports, and protocols
    startup       Start-up settings
    summary       Firewall configuration summary
    zones         Known firewall zones
```

먼저 SuSEfirewall2 를 멈추고 비활성화 한다.

```
sudo yast firewall disable
```

```sh
systemctl stop SuSEfirewall2
systemctl disable SuSEfirewall2
```

그리고 ufw를 설치하고

```
zypper in ufw
```

```
ufw default deny
ufw enable
systemctl enable ufw
systemctl start ufw
```


### Fail2ban

rsyslog 를 설치한다.


https://en.opensuse.org/SDB:SSH_systematic_attack_protection

https://www.howtoforge.com/fail2ban_opensuse10.3




### ssh


### ufw



### fail2ban

zypper in fail2ban

## 참조

[OpenSSH Public Key Authentication](https://en.opensuse.org/SDB:OpenSSH_public_key_authentication)

https://doc.opensuse.org/documentation/leap/security/html/book.security/cha.security.firewall.html
