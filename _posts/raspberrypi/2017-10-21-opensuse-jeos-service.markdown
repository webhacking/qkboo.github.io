---
title: "Raspberry Pi 3 64bit OS openSUSE: Service 관리"
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

openSUSE는 `systemd` 를 사용한 서비스/데몬 시작/종료/활성화/비활성화 작업을 할 수 있다. 서비스에 대한 작업은 `systemctl` CLI 혹은 YaST에서 가능하다.



### yast

openSUSE는 yast 로 서비스 데몬도 설치/실행/멈춤 을 할 수 있다.

![](/opensuse/yast-service1.png){:width="640"}

서비스는 
![](/opensuse/yast-service2.png){:width="640"}


### systemd

https://doc.opensuse.org/documentation/leap/reference/html/book.opensuse.reference/cha.systemd.html



https://www.digitalocean.com/community/tutorials/systemd-essentials-working-with-services-units-and-the-journal

```sh
systemctl list-unit-files --type=service #현재 사용 가능한 모든 서비스
```

이 작업은 


```
systemctl stop SuSEfirewall2
systemctl disable SuSEfirewall2
zypper in ufw
ufw default deny
ufw enable
systemctl enable ufw
systemctl start ufw
```



## 참조

[^1]: [systemd: Enable/Disable Services](https://doc.opensuse.org/documentation/leap/reference/html/book.opensuse.reference/cha.systemd.html#sec.boot.systemd.basics.services_enabling)
