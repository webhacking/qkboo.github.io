---
title: Ubuntu/Debian Basic Security settings
date: 2017-04-03 20:00:00 +0900
layout: post
tags: [linux, firewall, security]
categories: 
- Linux
---

리눅스 시스템을 설치후 기본적인 보안 설정과 도구를 사용하는 과정을 정리했다.
 - firewall 과 sshd
 - rootkit
 - fail2ban

## Firewall과 ssh 보안 구성

사용자 로그인에 제약을 두고, 원격 접속에 대해서 방화벽과 sshd 보안을 강화한다.

### sudoer 등록

처음 로그인후 새로운 사용자 등록하고 suders에 직접 권한을 줄 수 있다. 


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


userdel 로 사용자 완전 삭제시

```
$ userdel -r sambaguest
```



#### visudo

**visudo** 명령으로 sudoers 파일을 편집할 수 있다. sudoer에 있는 root는 제외하고 사용자로 등록한다.

```sh
$ sudo visudo
# User privilege specification
pi  ALL=(ALL:ALL) ALL
```

sudo 사용자를 sudo 그룹에 등록해 둔다.

```sh
$ sudo usermod -aG sudo pi
```


### ufw를 사용한 방화벽 등록


```sh
$ sudo apt install ufw
```

방화벽 기본 규칙을 실행한다.

```sh
$ sudo ufw default deny incoming
$ sudo ufw default allow outgoing
```

리눅스 방화벽 구성에 대해서는 포스트 [UFW Firewall on Ubuntu/Debian](/linux/2017/04/03/ubuntu-firewall.html) 에 자세히 설명하고 있다.


```sh
$ sudo ufw allow ssh
$ sudo ufw allow http
$ sudo ufw allow https
```

그리고 ufw로 방화벽을 활성화 한다.

```
$ sudo ufw status
Status: inactive

$ sudo ufw enable
```

현재 서버의 열린 포트는 다음 같이 `netstat` 명령으로 확인이 가능하다.

```sh
$ netstat -tlnp
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


samba 허용

```
$ sudo ufw allow Samba
$ sudo ufw allow from 192.168.0.0/16 to any app Samba
```

```
$ sudo ufw logging on
Logging enabled
```

리눅스 방호벽에 ssh 허용한다. ufw를 사용한다면 다음 같이 해준다.

ssh 보안

ssh Brute-force Attack 방어

```
$ sudo ufw limit ssh
```


ssh를 특정 IP 주소에만 접속을 허용한다

```
sudo ufw allow from 192.168.0.100 to any port 22
```

```
sudo ufw allow from 192.168.0.100 to any port 22 proto tcp
```


### sshd 보안 구성

ssh 사용에 특정한 사용자, 호스트 등에서만 사용하도록 제한하게 구성한다.

#### sshd_config 수정

 /etc/ssh/sshd_config에서 다음 내용으로 수정한다.

포트, IP, Time out 시간을 지정할 수 있다.

```
#sshd 포트넘버 변경 (Port)
Port 2222

#sshd Listen Address
ListenAddress 192.168.0.200

# alive 메시지 사용 결정
TCPKeepAlive no  # 기본 yes.

# 클라이언트가 살아있는지 확인하는 간격.
ClientAliveInterval 60  # 기본 0.
# 클라이언트에서 응답이 없을 때 메시지를 보내는 횟수
ClientAliveCountMax 3    # 확인 횟수

# Login Prompt에서 사용자 입력을 기다리는 시간을 초 단위로 입력.
LoginGraceTime 20  #( 1m: 기본 1분지정, 0은 시간제한없음)
```

사용자 계정에 대한 접근

```
# no로 설정하면 root 계정으로 Login 불가능.
PermitRootLogin no

# SSH 접속을 통해 Login을 허용할 User를 지정. 지정된 User 외의 접속은 차단됨.
# 여러 계정 입력시 Space로 구분.
AllowUsers foo

# sudo(관리자)그룹만 로그인가능( 다른 유저들도 ssh로그인을 가능하게 하려면 이부분 삭제 )
AllowGroups sudo

# 모두 접속이 허용, 여기에 등록된 group만 접속 거부됨
#DenyGroups
# 모두 접속이 허용, 여기에 등록된 계정만 접속 거부됨
#DenyUsers 
```



#### issue 이용

ssh 로그인시 **Banner**로 지정한 Text File의 내용을 Login Prompt에 출력한다. 시스템 접근에 대한 사전 경고이다.


*/etc/ssh/sshd_config* 에 Banner를 추가한다.

```
# 설정한 경로에 존재하는 Text File의 내용을 Login Prompt에 출력.
Banner /etc/issue.net
```

그리고 */etc/issue.net* 파일에 다음 경고를 넣어준다.


```
> ***************************************************************************
>                             NOTICE TO USERS
> 
> This computer system is the private property of its owner, whether
> individual, corporate or government.  It is for authorized use only.
> Users (authorized or unauthorized) have no explicit or implicit
> expectation of privacy.
> 
> Any or all uses of this system and all files on this system may be
> intercepted, monitored, recorded, copied, audited, inspected, and
> disclosed to your employer, to authorized site, government, and law
> enforcement personnel, as well as authorized officials of government
> agencies, both domestic and foreign.
> 
> By using this system, the user consents to such interception, monitoring,
> recording, copying, auditing, inspection, and disclosure at the
> discretion of such personnel or officials.  Unauthorized or improper use
> of this system may result in civil and criminal penalties and
> administrative or disciplinary action, as appropriate. By continuing to
> use this system you indicate your awareness of and consent to these terms
> and conditions of use. LOG OFF IMMEDIATELY if you do not agree to the
> conditions stated in this warning.
> 
> ****************************************************************************

```


systemd 를 사용하면,

```sh
$ sudo systemctl restart sshd.service
$ sudo systemctl status sshd.service
```

upstart를 사용하면,

```sh
$ sudo service ssh restart
```


### 공개키 방식을 이용

일반 패스워드를 사용하는 로그인 방식보다 rsa 키를 이용한 접속이 보다 보안에 좋다. 그리고 일단 한번 설정해 놓으면 편하다.

서버에 `/etc/ssh/sshd_config ` 설정에서 rsa키 사용에 대한 설정이 제대로인지 살펴본다.

```
PubkeyAuthentication yes
RSAAuthentication yes
```

#### ssh 클라이언트

클라이언트에서 공개키 생성을 한다. 키의 크기를 높이려면 `-b` 옵션으로 1024, 2048, 4096 값을 제시한다. 

```
(CLIENT)$ mkdir ~/.ssh
(CLIENT)$ chmod 700 ~/.ssh
(CLIENT)$ ssh-keygen -t rsa -b 4096 -C "USER@CLIENT_HOST"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/daddy/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/daddy/.ssh/id_rsa.
Your public key has been saved in /Users/daddy/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:nBbRg+tTnmEbyuqzb0cqeBfzuaj1XOJP3n767Xmj3s0 USER@CLIENT_HOST
The key\'s randomart image is:
+---[RSA 4096]----+
|        .o       |
|        ..o      |
|        .. .     |
|       ..o=      |
|       oS= =     |
|       .B =      |
|     . ..B..o    |
|    . =.+=+= ..o*|
|     o+Oo.=o++=BE|
+----[SHA256]-----+
```

개인 비밀키와 공개키 파일이 *~/.ssh* 폴더에 기본 파일이름 *id_rsa.pub*, *id_rsa.prb* 파일로 저장된다.


#### 서버에서 할일

서버에서 비밀키를 생성한다.

```sh
(SERVER)$ ssh-keygen -t rsa -b 4096 -C "USER@SERVER"
(SERVER)$ chmod 700 ~/.ssh
```


#### 클라이언트 공개키를 서버 배포

서버로 id_rsa.pub를 scp 로 복사해서 authorized_keys 파일에 더해주면 된다. 아래 같이 할 수 있다.

```sh
cat ~/.ssh/id_rsa.pub | ssh USER@SERVER 'cat >> .ssh/authorized_keys'
```

scp로 복사하고 서버에서 authorized_keys 파일에 더해줄 수 있다.

```sh
(CLIENT)$ scp ~/.ssh/id_rsa.pub USER@SERVER:~/client.pub
(CLIENT)$ ssh userid@SERVER
(SERVER)$ cat client.pub >> .ssh/authorized_keys; rm client.pub
```

이제 해당 서버로 로그인해 본다.

> 아래 같이 시스템 명칭을 주고 생성할 수 도 있다.
> ```
> ssh-keygen -t rsa -C "Raspberry Pi #123"
> ```



권한은 아래와 같이 클라이언트와 서버 모두 설정한다.

```
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 644 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/known_host
```

그리고 클라이언트에서 서버로 ssh 접속을 해본다. 로그인 과정 없이 로그인되면 공개키 방식의 인증이 마무리되ㅓㅇㅆ다.

```sh
(CLIENT)$ ssh USER@SERVER
```


#### 개인키 파일을 이용한 로그인

*-i* 옵션을 이용하면 개인키를 여러개 만들어 두고 서버 마다 달리 로그인 할 수 있다.

```
ssh -i .ssh/개인키 id@host-Name  
```


## Root kit

### chkrootkit

- 루트킷 탐지 프로그램
- 일반적인 루트킷, 커널 기반 루트킷, Worm 까지도 탐지 가능


#### 설치

```sh
$ sudo apt install chkrootkit
```


컴파일로 빌드 설치시 `http://www.chkrootkit.org/` 에서 다운로드후 빌드한다.

```sh
$ tar -zxvf chkrootkit.tar.gz
$ cd chkrootkit-0.50
$ make sense
```

#### 루트킷 실행

```sh
$ sudo chkrootkit
```

`not infected`, `not found` 가 아닌 경우 잘 살펴보자.


### rkhunter

 Rootkit이 System에 설치되어 있는지 Check합니다. `chkrootkit` 에서 검사하지 않는 설정 파일들이나 서버 계정 등 을 검사 하기 때문에 chkrootkit 과 함께 사용하면 좋다.


```sh
$ sudo apt install rkhunter
```

 - 설치 시에 MTA(Matil Transfer Agent)인 Postfix가 의존성으로 같이 설치됩니다.

> RPi Jessie에서 설치시 *rkhunter Invalid SCRIPTWHITELIST configuration option: Non-existent pathname: /usr/bin/lwp-request* 경고 발생
> `lwp-request`는 명령행 HTTP 사용자 에이전트로 사용하지 않는다면 > /etc/rkhunter.conf에 있는 **SCRIPTWHITELIST /usr/bin/lwp-request** 주석 처리
> 참조: [lwp-request](http://search.cpan.org/dist/libwww-perl/bin/lwp-request)


#### 실행

```sh
$ sudo rkhunter -c
```


skip

```sh
$ sudo rkhunter -c --skip-keypress --pkgmgr dpkg
```

```sh
$ sudo rkhunter -c -sk                       // --skip-keypress
```



#### update

properties update

```
$ sudo rkhunter --propupd
```

업데이트 점검

```
$sudo rkhunter --update
```


#### cron 설정

```
$ sudo vi /etc/default/rkhunter

CRON_DAILY_RUN="true"
CRON_DB_UPDATE="true"
APT_AUTOGEN="true" 
```


자세한 결과가 저장된 /var/log/rkhunter.log의 내용을 토대로 Google에서 검색하거나 [Rkhunter Users Mailing List](https://lists.sourceforge.net/lists/listinfo/rkhunter-users)를 이용한다.

> /var/log/rkhunter.log


<br/>
## Fail2ban

로그를 검사해 의심스런 IP 를 찾아 Firewall rule에 등록해 관리하는 것은 어려운 과정이다. *Fail2ban*은 정규표현식을 사용해서 로그에서 의심스런 IP를 찾아 Firewall 등록 할 수 있도록 해준다.


###  설치

`fail2ban` 은 `iptables` 패키지와 함께 설치한다.

```sh
$ sudo apt install iptables fail2ban
```

그리고 `systemctl` 로 재대로 서비스가 시작되는지 확인해 본다.

```sh
$ sudo systemctl restart fail2ban.service    # 재시작
$ sudo systemctl status fail2ban.service     # running 상태 확인
```

설정을 위해서 `fail2ban` 설정 파일인 fail2ban.conf, 그리고 jail 파일 jail.conf 파일을 `.local` 파일로 복사한 사용자 정의 파일에서 사용한다.

```sh
$ cd /etc/fail2ban
$ sudo cp fail2ban.conf fail2ban.local       # 설정파일
$ sudo cp jail.conf jail.local               # jail 설정
```

#### /etc/fail2ban 디렉토리

주요 파일,
 - fail2ban.local : `fail2ban` 주요 설정 파일
 - jail.local: jail 설정 파일
 - jail.d/defaults-debian.conf: jail enable/disable 
 - paths-common.conf: 로그 파일 경로
 - paths-debian.conf: 로그 파일 경로

#### fail2ban.local

fail2ban 에서 전역 설정을 무선언해 줍니다. 예를 들어 검출된 IP중에 무시할 영역을 선언해 줍니다.

```
[DEFAULT]
ignoreip = 127.0.0.1/8 192.168.0.1/24
bantime = 2592000   # 금지 시간을 늘린다.
maxretry = 3        # 금지된 행위 시도 횟수
```


#### jail.local

**jail.d/defaults-debian.conf** 파일에 jail 을 활성화 혹은 비활성화 시킨다. 기본으로 **sshd** 만 활성화 되어 있다. 아래는 nginx 에 대해서도 활성화 했다.

```
[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-botsearch]
enabled = true
```


#### 시스템 서비스 포트 확인

현재 시스템의 활성화되어 있는 포트는 `netstat` 명령으로 확인할 수 있다.

```sh
$ sudo netstat -tulpen
tcp        0      0 127.0.1.1:53            0.0.0.0:*               LISTEN      0          12762       731/dnsmasq
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      0          16387       670/sshd
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      0          10674       708/nginx -g daemon

```

열려 있는 포트를 fail2ban 의 jail을 활성화해서 방화벽으로 감시하면 된다.


### fail2ban 사용

fail2ban-client, fail2ban-regex 명령을 이용해 jail의 ban 상태를 확인하거나 테스트 할 수 있다.


#### Jail 실행 확인

fail2ban-client 명령으로 해당 jail을 확인 할 수 있다.

```sh
$ sudo fail2ban-client status
Status
|- Number of jail:  6
 - Jail list:   nginx-noproxy, nginx-noscript, nginx-nohome, nginx-badbots, sshd
```

전체 jail 중에 특정한 것만 확인한다.

```
Status for the jail: ssh
|- filter
|  |- File list:        /var/log/auth.log
|  |- Currently failed: 208
|  `- Total failed:     4357
`- action
   |- Currently banned: 679
   |  `- IP list:       2.176.38.209 116.31.116.53 181.21.6.110 153.171.66.99 190.67.247.209 201.179.200.15 103.207...
```

#### 테스트

의심스런 동작을 Filter로 선언해서 사용하는데 해당 필터를 점검해야할 필요가 있다. 다음

```sh
$ sudo fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf
```


## 참조

 [^1]: [Ubuntu Server의 보안을 위해서 해야 할 것들 (Part 1)](https://davidhyk.github.io/blog/things-you-should-do-to-secure-ubuntu-part1)
 [^2]:  [Ubuntu Server의 보안을 위해서 해야 할 것들 (Part 2)](https://davidhyk.github.io/blog/things-you-should-do-to-secure-ubuntu-part2)
 [^3]:  [How To Protect SSH with Fail2Ban on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-ubuntu-14-04)
 [^4]:  [우분투 방화벽(UFW) 설정  ](http://webdir.tistory.com/206)