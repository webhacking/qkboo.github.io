---
title: Tmux Start
date: 2017-05-04 07:00:00 +0900
layout: post
tags: [tmux, terminal, linux, install]
categories:
- Linux
---

> 2017-07-10: tmux-continum 추가
{:.right-history}

Tmux는 terminal multiplexer로 서버에 여러 프로그램을 세션에 저장하고, 다른 작업 혹은 연결을 끊었다 다시 접속해서 세션을 열어 작업을 이어갈 수 있다.

![](https://tmux.github.io/ss-tmux2.png){: width="600"}

[그림. Tmux 실행 모습  (tmux.github.io)]

## 설치

여기서는 tmux 2.x 이상을 사용한다.

- Ubuntu 14.04, Raspbian Jessie, Armbian 등에서 tmux가 1.8, 1.9 버전이 제공
- Ubuntu 15, 16 Xenivior 버전은 Tmux 2.1
- macOS는 `brew` 를 사용한다.


### Tmux 2.3 설치

이전 Ubuntu 14.04, Raspbian 등에서 tmux가 1.8, 1.9 버전이 제공되는데 package manager 같은 기능을 사용할 수 없다. 소스로 빌드해서 사용할 수 있다.

> Ubuntu 14.04 desktop, orangepi plus, raspberry pi jessie 초기 버전에서 빌드

#### 소스 설치

혹시 모르니 기존 낮은 버전의 tmux를 삭제하고 시작해 보자.

```
$ sudo apt remove --purge tmux
```

소스를 [https://github.com/tmux/tmux/releases/](https://github.com/tmux/tmux/releases/) 에서 최신 버전으로 다운로드 하고 빌드한다.

```sh
sudo apt update
sudo apt install -y libevent-dev libncurses-dev
wget https://github.com/tmux/tmux/releases/download/2.3/tmux-2.3.tar.gz
tar xvzf tmux-2.3.tar.gz
cd tmux-2.3/
./configure && make
sudo make install
```


#### deb 바이너리 설치

> 단, libtinfo5 6.x 설치시 의존성 라이브러리 문제로 패키지 삭제 문제 발생!!!

https://launchpad.net/ubuntu/yakkety/amd64/tmux/2.2-3 에 빌드되어 있는 바이너리를 Ubuntu 14.04 설치하기 위해서 다음 패키지 버전이 필요하다.

Depends on:
 - libc6 (>= 2.14)
 - libevent-2.0-5 (>= 2.0.10-stable)
 - libtinfo5 (>= 6)
 - libutempter0 (>= 1.1.5)

> 기본 설치후 업그레이드를 했다면 libc6 버전은 문제가 없는듯.


```
$ sudo apt-cache show libc6
$ sudo apt-cache show libtinfo5
```

Ubuntu14.04.4 LTS 버전의 libtinfo5는 5.9로 다음 같이 설치해 준다.

```
$ wget http://launchpadlibrarian.net/271601076/libtinfo5_6.0+20160625-1ubuntu1_amd64.deb
```

그리고 tmux 2.2 버전의 deb 를 다운로드한다.

```
$ wget http://launchpadlibrarian.net/263289132/tmux_2.2-3_amd64.deb
```

설치

```
$ sudo dpkb -i libtinfo5_6.0+20160625-1ubuntu1_amd64.deb
$ sudo dpkb -i tmux_2.2-3_amd64.deb
```

이제 `tmux` 명령으로 다중 터미널 명령을 사용할 수 있다.


#### macOS에서 tmux 설치

homebrew를 사용해서 tmux를 설치한다. 2017년 현재 2.4 버전이 설치된다.

```
$ brew install tmux
```

이제 tmux 명령으로 시작할 수 있다.


## 시작

tmux 를 시작하면 하나의 세션에 하나의 윈도우가 만들어 진다.

```
$ tmux                   # 세션을 시작하고 참가한다.
$ tmux new -s foo        # 세션 foo를 시작하고 참가한다
```

세션에 참가하면 하나 혹은 그 이상의 윈도우에서 Pane을 배치해 사용할 수 있다.

![](/images/tmux/tmux-screen-layout.png){: width="600"}
[그림. Tmux window layout]

#### Control와 Meta key

Tmux 세션 참가후 Window에서는 Prefix key로 Session, Window, Pane 관련 명령을 키로 조합해 사용한다. 기본 Prefix key는 `Control+b` key고 옵션으로 사용하는 Meta key는 `Alt` 키 이다. 

여기서 Prefix key는 **C**와 조합으로 표기하고, Meta key인 `Alt`는 **M**으로 표기한다.

윈도우 명령 control, meta 키 조합과 병행해 윈도우에서 명령모드를 사용할 수 있다. 명령모드는 **C-:** 키로 시작하고, 명령모드에서 **명령 자동 완성**을 지원한다.

![](/images/tmux/tmux-screen-command-window2.png){: width="600"}
[그림. Window command mode]


#### Pane 다루기

윈도우는 수직/수평으로 구획을 나눌수 있다. **C-"** 키로 현재 Pane 아래에 수평으로 새 Pane을 나눈다. 그리고 **C-%**키로 수직으로 새 Pane을 나눌 수 있다.

![](/images/tmux/tmux-screen-pane.png){: width="600"}
[그림. Tmux Window Pane]

- C-q : pane 번호를 표시하고 번호를 눌러서 이동
- C-o : pane을 순서대로 이동
- C-방향키 : 해당 방향으로 이동
- C-M-방향키 : 해당 방향으로 크기 조절
- C-M-1~5 : 몇 가지 미리 설정된 레이아웃을 고를 수 있고, prefix space로 이 레이아웃을 순서대로 - 돌아가며 선택 가능
- C-z : 특정화면만 확대하기 다시 예전 Panes상태로 돌아오기 

Pane을 지우려면 터미널 `exit` 명령 혹은 **C-x** 키로 빠져 나올 수 있다.

#### Window 다루기

윈도우는 명령모드에서 `new-window` 혹은 **C-c** 키로 새 윈도우를 추가할 수 있다.

![](/images/tmux/tmux-screen-new-window2.png){: width="600"}
[그림. new Window ]

윈도우 사이의 이동은 윈도우 번호에 따라 단축키 **C-0,1,2...9**를 사용하거나 **C-w**로 윈도우 목록에서 선택해 이동할 수 있다.

- C-n, C-p : 다음 윈도우, 이전 윈도우로 이동
- C-l : 직전 사용하던 윈도우로 이동
- C-w : 윈도우 리스트를 띄우고 선택
- C-, : 윈도우 이름 바꾸기

세션 사용중에 세션을 빠져 나오려면 **C-d** 로 detach 하거나, 명령모드 `C-:`에서 detach 명령을 준다.


#### 복사와 스크롤

Tmux 화면 버퍼는 한 화면분 밖에 안되서, 이전 화면 내용을 보려면 스크롤 기능을 켜야 한다. **C+[** 키는 스크롤 키고, 우측상단에 페이지 표시가 나타난다. 키보드 방향키나 Page Up/Down키로 스크롤이 가능하다.

![](/images/tmux/tmux-scroll.png)


#### 세션 연결

세션은 하나 혹은 그 이상 만들고 `attach` 명령으로 세션에 참가할 수 있다. 

```
$ tmux new -s foo -d     # 세션 foo를 시작하고 빠져나온다.
$ tmux ls                # 세션 목록을 출력한다.
0: 1 windows (created Fri May 12 10:26:00 2017) [80x24] (attached)
foo: 1 windows (created Fri May 12 10:34:18 2017) [80x24]
```

터미널에서 세션에 참가하려면 `attach` 명령과 대상 세션을 지정해 준다. 대상 세션은 `tmux ls` 명령에 표시되는 세션번호 혹은 세션이름을 지정한다.

```
$ tmux attach
$ tmux attach -t 0       # 세션 0번에 참여한다
$ tmux attach -t foo     # 세션 foo에 참여한다.
```

세션을 완전히 종료 시키려면, tmux 세션에서 명령모드 **C-:** 에서 *kill-session* 명령을 실행한다.
혹은 다른 터미널에서 세션번호 혹은 세션 이름으로 종료한다.

```
$ tmux kill-session -t 3   # 세션번호 3을 종료한다.
```



### 설정파일 **.tmux.conf**

사용자 홈디렉토리에 *.tmux.conf* 파일에 tmux에 대한 설정을 명시할 수 있다.

#### Control + a 사용하기

Capslock키를 Control 키로 대체해 사용하면, Control+a 키 조합이 편하다. .tmux.conf 에 키 조합을 변경한다.

```
#Control+a에 'prefix' 연결
set -g prefix C-a
#send-prefix를 Control+a에 전달
bind C-a send-prefix
unbind C-b
```

위에서 prefix는 **C-a** 로 재배치된다.


#### Mouse On/Off

```
# Toggle mouse on with META m
bind m \
    set-option -g mouse on \;\
    display 'Mouse: ON'

# Toggle mouse off with META M
bind M \
    set-option -g mouse off \;\
    display 'Mouse: OFF'
```




## Plugin manager

[Tmux Pluin Manager](https://github.com/tmux-plugins/tpm) 를 설치하고, tmux 기능을 확장할 수 있다.

### tpm 설치

먼저 사용자 홈 디렉토리에 저장한다.

```
$ git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

다음 설정을 tmux.conf 에 저장한다.

```
# List of plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'

# Initialize TMUX plugin manager (keep this line at the very bottom of tmux.conf)
run '~/.tmux/plugins/tpm/tpm'
```

#### plugin 관리

플러그인 설치를 위해서 **C-I** (대문자) 를 실행
플러그인 업그레이드를 위해서 **C-U** 를 실행
 - 플러그인 목록에서 플러그인을 선택하고 C-M-u (소문자)


### Tmux-Resurrection

*tmux-resurrect*{:.keyword}는 tmux 세션을 백업/복구 할 수 있는 플러그인이다. tmux.conf에 다음을 추가

```sh
set -g @plugin 'tmux-plugins/tmux-resurrect'
```

플러그인 설치를 위해서 **C-I** 를 실행하면 설치를 시작한다.

Resurrection 플러그인으로 백업/복구하는 키는 다음 같이 지정되어 있다:

 - C-s : save
 - C-r : restore


### Tmux-continuum

*tmux-resurrect*{:.keyword} 에서 저장한 환경을 자동으로 저장/복구할 수 있는 플러그인이다.
 - [tmux-continuum](https://github.com/tmux-plugins/tmux-continuum)

*tmux-continuum*{:.keyword} 의 주요 기능은:

 - *tmux*{:.keyword} 환경을 15분 마다 자동 저장
 - 컴퓨터/서버 시작시 *tmux*{:.keyword} 자동 시작
 - *tmux*{:.keyword} 시작시 자동 복구
 - **tmux 1.9** 이상, bash, **tmux-resurrect** plugin

#### 설치

**.tmux.conf** 파일에 아래 플러그인을 추가:

```sh
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
```

tmux 에서 플러그인 설치를 위해서 **C-I** (대문자) 를 실행

그리고 **.tmux.conf** 파일에 continuum-restore 을 on으로 해준다.

```sh
set -g @continuum-restore 'on'
```

tmux 세션을 모두 나와서 tmux 서버를 모두 `kill-session` 같은 명령으로 종료시킨후 tmux를 다시 시작하면 `.tmux/resurrect` 에 저장된 마지막 세션이 복구되는 것을 확인할 수 있다.

이제부터 15분 마다 자동 저장하고 서버를 재시작한 후에 tmux를 다시 시작하면 저장한 환경을 자동으로 복구해 준다.

#### tmux status 표시

tmux-continuum 의 상태를 tmux status line에 표시할 수 있다.

```sh
set -g status-right 'Continuum status: #{continuum_status}'
```

#### Linux에서 tmux 자동 시작

tmux-continuum 은 Linux systemd, macOS 에서 자동 시작을 지원한다.

Linux는 `.tmux.conf` 파일에 다음 부트 옵션을 추가한다.

```sh
set -g @continuum-boot 'on'
```

그리고 현재 실행중인 세션에 변경한 설정을 적용하려면

```sh
$ tmux source-file ~/.tmux.conf
```


#### macOS에서 tmux 자동 시작

`.tmux.conf` 파일에 다음 부트 옵션을 추가한다.

```sh
set -g @continuum-boot 'on'
```

그리고 현재 실행중인 세션에 변경한 설정을 적용한다.

```sh
$ tmux source-file ~/.tmux.conf
```

맥이 재시작 하면 자동으로 `Terminal.app` 이 실행된다. 터미널 크기는 다음 옵션으로 지정한다:

```sh
set -g @continuum-boot-options 'fullscreen' # terminal window will go fullscreen
set -g @continuum-boot-options 'iterm'    # start iTerm instead of Terminal.app
set -g @continuum-boot-options 'iterm,fullscreen' # start iTerm in fullscreen

```

#### 다중 tmux 서버는 지원하지 않는다.

tmux 로 서버를 하나 시작하고, `tmux -S /tmp/foo` 같이 다른 소켓을 사용했다고 자동 저장/복구가 별도로 진행되지 않는다. [^10]


> 여기까지 설정한 내용은 [qkboo/tmux.conf](https://gist.github.com/qkboo/9915a6f76cd9b7e4986965e8f5e95f2e) gist 에서 확인 가능.


<br/>
### 설정 저장

tmux 설정을 위힌 default 파일이 존재하지 않는다는 점이다. 그래서 tmux 기본 설정을 어딘가 추출해서 보관해두면 다시 돌아오는데 편리하다. 현재 tmux에 설정된 값은 다음 명령어로 추출할 수 있다.

```
$ tmux show -g | sed 's/^/set-option -g /' > ~/.tmux.current.conf
```

tmux.conf를 적용하는 명령은 source-file이다.

```
$ tmux source-file ~/.tmux.current.conf
```



## 참고

- [Tmux-Part1](http://blog.hawkhost.com/2010/06/28/tmux-the-terminal-multiplexer/)
- [Tmux-Part2](http://blog.hawkhost.com/2010/07/02/tmux-%E2%80%93-the-terminal-multiplexer-part-2/)
- [Tmux 소개](http://gypark.pe.kr/wiki/Tmux)
- [tmux 사용에 도움되는 설정과 플러그인 정리](http://haruair.com/blog/3437)
- [스크롤에 대한 의견](http://superuser.com/questions/209437/how-do-i-scroll-in-tmux)
- [tmux-한글-파일명-출력-문제-해결하기](http://seonhyu-blog.tumblr.com/post/34612062806/맥에서-tmux-한글-파일명-출력-문제-해결하기)




[^10]: [Behaviro when running multiple tmux servers](https://github.com/tmux-plugins/tmux-continuum/blob/master/docs/multiple_tmux_servers.md)

