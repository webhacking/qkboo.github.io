---
title: Ubuntu/Debian Basic Security settings
date: 2017-04-03 20:00:00 +0900
layout: post
tags: [linux, ssh, sshd, security]
categories: 
- Linux
---

ssh는 리눅스 오에스 환경에서 `telnet` 이후 대중적으로 사용하고 있는 보안이 되는 암호화 통신이 가능한 터미널 접속 도구이다.

## ssh 보안

ssh 사용에 특정한 사용자, 호스트 등에서만 사용하도록 제한하게 구성한다.

### sshd_config 수정

*/etc/ssh/sshd_config* 에 다음 내용으로 수정한다.
 - 포트, IP, Time out 시간을 지정할 수 있다.

```
Port 2222                     #sshd 포트넘버 변경 (Port)
ListenAddress 192.168.0.200   #sshd Listen Address
TCPKeepAlive no               # alive 메시지 사용 ㅓㅓㅓㅓ결정.기본 yes.

# 클라이언트가 살아있는지 확인하는 간격.
ClientAliveInterval 60  # 기본 0.
# 클라이언트에서 응답이 없을 때 메시지를 보내는 횟수
ClientAliveCountMax 3    # 확인 횟수

# Login Prompt에서 사용자 입력을 기다리는 시간을 초 단위로 입력.
LoginGraceTime 20  #( 1m: 기본 1분지정, 0은 시간제한없음)
```

사용자 계정에 대한 접근

```
PermitRootLogin no   # root 계정 로그인 허용 여부
MaxAuthTries 6       # 로그인 시도 횟수
AllowUsers foo       # 로그인 허용할 사용자 지정
AllowGroups sudo     # 로그인 허용할 그룹 지정

# 모두 접속이 허용, 여기에 등록된 group만 접속 거부됨
#DenyGroups
# 모두 접속이 허용, 여기에 등록된 계정만 접속 거부됨
#DenyUsers 
```

서버만 운용하며 X11 Forwarding을 사용하지 않는다면 [^3]

```
X11Forwarding=no
```


#### 공개키 방식을 이용

일반 패스워드를 사용하는 로그인 방식보다 rsa 키를 이용한 접속이 보다 보안에 좋다. 그리고 일단 한번 설정해 놓으면 편하다.

서버에 `/etc/ssh/sshd_config ` 설정에서 rsa키 사용에 대한 설정이 제대로인지 살펴본다.

```
PubkeyAuthentication yes
RSAAuthentication yes
```


#### issue 이용

ssh 로그인시 **Banner**로 지정한 Text File의 내용을 Login Prompt에 출력한다. 시스템 접근에 대한 사전 경고이다. */etc/ssh/sshd_config* 에 Banner를 추가한다.

```
# 지정한 Text File 내용을 Login Prompt에 출력.
Banner /etc/issue.net
```

그리고 */etc/issue.net* 파일에 다음 경고를 넣어준다. [^1]

```
***************************************************************************
                             NOTICE TO USERS
 
 This computer system is the private property of its owner, whether
 individual, corporate or government.  It is for authorized use only.
 Users (authorized or unauthorized) have no explicit or implicit
 expectation of privacy.
 
 Any or all uses of this system and all files on this system may be
 intercepted, monitored, recorded, copied, audited, inspected, and
 disclosed to your employer, to authorized site, government, and law
 enforcement personnel, as well as authorized officials of government
 agencies, both domestic and foreign.
 
 By using this system, the user consents to such interception, monitoring,
 recording, copying, auditing, inspection, and disclosure at the
 discretion of such personnel or officials.  Unauthorized or improper use
 of this system may result in civil and criminal penalties and
 administrative or disciplinary action, as appropriate. By continuing to
 use this system you indicate your awareness of and consent to these terms
 and conditions of use. LOG OFF IMMEDIATELY if you do not agree to the
 conditions stated in this warning.
 
****************************************************************************

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


### ssh 공개키방식 인증

공개키 방식의 통신은 서버의 공개키와 클라이언트의 개인키 합의에 의해 서버측 sshd 접속을 허용하는 체계이다. 서버측은 **authorized_key** 에 등록된 클라이언트 공개키에 일치하는 접속을 비밀번호 교환 없이 즉시 허용해 준다.

공개키를 사용한 sshd 접속은 아래 같은 관계를 갖는다.

![](https://user.xmission.com/~bdv/cygwin-sshd_files/no-passwd.png){:width="640"}

개인키 공개키를 방식의 authorized_key 를 이용한 합의 과정은 아래 같다.

![](https://smbjorklund.no/sites/smbjorklund/files/styles/full_width/public/images/webmaster/skitched-20110402-163622.png){:height="480"}

먼저 *서버*와 *클라이언트* 모두 개인키와 공개키를 모두 생성해야 한다.

#### 개인키 및 공개키 생성

공개키 생성은 `ssh-keygen`으로 한다. 생성되는 키는 보통 `~/.ssh` 디렉토리에 저장한다.

```
(CLIENT)$ mkdir ~/.ssh
(CLIENT)$ chmod 700 ~/.ssh
```

키의 종류 `-t` 는 보통 RSA, DSA 알고리즘을 사용하고, 키의 크기는 `-b` 옵션으로 1024, 2048, 4096 값을 제시한다. 

```
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

서버에서 공개키, 비밀키를 생성한다.

```sh
(SERVER)$ ssh-keygen -t rsa -b 4096 -C "USER@SERVER"
(SERVER)$ chmod 700 ~/.ssh
```

키 생성시 키의 표시로 서버 명칭을 주기도 한다.

> ```
> ssh-keygen -t rsa -C "Raspberry Pi #123"
> ```



#### 클라이언트 공개키를 서버 배포

서버로 id_rsa.pub를 scp 로 복사해서 *~/.ssh/authorized_keys* 파일에 더해주면 된다. 아래 같이 할 수 있다.

```sh
cat ~/.ssh/id_rsa.pub | ssh USER@SERVER 'cat >> .ssh/authorized_keys'
```

혹은 `scp`로 복사하고 서버에서 *~/.ssh/authorized_keys* 파일에 더해줄 수 있다.

```sh
(CLIENT)$ scp ~/.ssh/id_rsa.pub USER@SERVER:~/client.pub
(CLIENT)$ ssh userid@SERVER
(SERVER)$ cat client.pub >> .ssh/authorized_keys; rm client.pub;
```


권한은 아래와 같이 클라이언트와 서버 모두 설정한다.

```
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 644 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/known_host
```

그리고 클라이언트에서 서버로 ssh 접속을 해본다. 로그인 과정 없이 로그인 되면 공개키 방식의 인증을 마무리 했다.

```sh
(CLIENT)$ ssh USER@SERVER
```


#### 키 파일을 지정한 로그인

ssh 접속시 `-i` 옵션을 이용해서 지정한 개인키를 이용해 서버에 접속할 수 있다. 즉, 여러 키 파일을 만들어 두고 서버 마다 달리 로그인 할 수 있다.

```
ssh -i .ssh/개인키 id@host-Name  
```



## 참조

[^1]: [Ubuntu Server의 보안을 위해서 해야 할 것들 (Part 1)](https://davidhyk.github.io/blog/things-you-should-do-to-secure-ubuntu-part1)
[^2]:  [Ubuntu Server의 보안을 위해서 해야 할 것들 (Part 2)](https://davidhyk.github.io/blog/things-you-should-do-to-secure-ubuntu-part2)
[^3]: [openssh security](https://www.openssh.com/security.html)
