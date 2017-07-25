---
title: Ubuntu/Debian - How to port Knocking
date: 2017-07-14 22:00:00 +0900
layout: post
tags: [linux, firewall, security, ssh]
categories: 
- Linux
---

[How To Use Port Knocking to hide your ssh daemon from attackers on ubuntu](https://www.digitalocean.com/community/tutorials/how-to-use-port-knocking-to-hide-your-ssh-daemon-from-attackers-on-ubuntu) 기사를 요약 했다.

> Ubuntu 12.04 이전을 사용하면 최소 Ubuntu 14.04로 업그레이드를 권장하고, 이 문서도 그에 따른다.

> Redhat 계열은 [How to Secure SSH Connections with Port Knocking on Linux CentOS](https://tecadmin.net/secure-ssh-connections-with-port-knocking-linux/) 를 참고.


## Port Knocking 이란?

방화벽이 서비스 포트에 접근을 막지만 각 서비스에 특화되어 있지는 않다. 이런 의문을 갖을 수 있다 - 어떻게 원하는 접근을 서비스에 제공하고 다른 모든 사람들에 노출되지 않게 할 수 없을까? 내가 필요할 때만 접근하고, 그 외는 모두 막고자 한다.

**Port Knocking**이 하나의 방법이 될 수 있다. 이것은 내가 원할 때 네트워크 트래픽의 특수한 순서를 통해 포트를 열고 그 외는 서비스를 막아 둘 수 있다. 여기서는 SSH daemon을 가려주는 포트노킹을 어떻게 *knocked*{:.keyword} 에서 구현하는지 살펴본다.

### Port knocking의 원리



## 참조
[knockd](http://www.zeroflux.org/projects/knock)

[How to Secure SSH Connections with Port Knocking on Linux CentOS](https://tecadmin.net/secure-ssh-connections-with-port-knocking-linux/)
