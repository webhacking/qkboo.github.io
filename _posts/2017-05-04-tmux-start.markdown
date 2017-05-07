---
title: Tmux Basic
date:   2017-05-04 05:16:00 +0900
layout: post
tags: tmux, terminal, linux
categories:
- Linux
- tmux
comments: true
# other options
---

Tmux는 terminal multiplexer로 서버에 여러 프로그램을 세션에 저장하고, 다른 작업 혹은 연결을 끊었다 다시 접속해서 세션을 열어 작업을 이어갈 수 있다.

![](https://tmux.github.io/ss-tmux2.png)

[그림. Tmux 실행 모습  (tmux.github.io)]

## 설치

여기서는 tmux 2.x 이상을 사용한다.

- Ubuntu 14.04, Raspbian Jessie, Armbian 등에서 tmux가 1.8, 1.9 버전이 제공
- Ubuntu 15, 16 Xenivior 버전은 Tmux 2.1


### Tmux 2.3 설치

이전 Ubuntu 14.04, Raspbian 등에서 tmux가 1.8, 1.9 버전이 제공되는데 package manager 같은 기능을 사용할 수 없다. 소스로 빌드해서 사용할 수 있다.

> Ubuntu 14.04 desktop, orangepi plus, raspberry pi jessie 초기 버전에서 빌드

#### 소스 설치

혹시 모르니 기존 낮은 버전의 tmux를 삭제하고 시작해 보자.

```
$ sudo apt remove --purge tmux
```

소스를 다운로드 하고 빌드한다.

```
sudo apt update
sudo apt install -y libevent-dev libncurses-dev
wget https://github.com/tmux/tmux/releases/download/2.3/tmux-2.3.tar.gz
tar xvzf tmux-2.3.tar.gz
cd tmux-2.3/
./configure && make
sudo make install
```


> #### deb 바이너리 설치
>
> 단, libtinfo5 6.x 설치시 의존성 라이브러리 문제로 패키지 삭제 문제 발생!!!
>
> https://launchpad.net/ubuntu/yakkety/amd64/tmux/2.2-3 에 빌드되어 있는 바이너리를 Ubuntu 14.04 설치하기 위해서 다음 패키지 버전이 필요하다.
> Depends on:
>  - libc6 (>= 2.14)
>  - libevent-2.0-5 (>= 2.0.10-stable)
>  - libtinfo5 (>= 6)
>  - libutempter0 (>= 1.1.5)
>
>
> 기본 설치후 업그레이드를 했다면 libc6 버전은 문제가 없는듯.
>
>
> ```
> $ sudo apt-cache show libc6
> $ sudo apt-cache show libtinfo5
> ```
>
> Ubuntu14.04.4 LTS 버전의 libtinfo5는 5.9로 다음 같이 설치해 준다.
>
> ```
> $ wget http://launchpadlibrarian.net/271601076/libtinfo5_6.0+20160625-1ubuntu1_amd64.deb
> ```
>
> 그리고 tmux 2.2 버전의 deb 를 다운로드한다.
>
> ```
> $ wget http://launchpadlibrarian.net/263289132/tmux_2.2-3_amd64.deb
> ```
>
> 설치
>
> ```
> $ sudo dpkb -i libtinfo5_6.0+20160625-1ubuntu1_amd64.deb
> $ sudo dpkb -i tmux_2.2-3_amd64.deb
> ```
>


### 시작

tmux는 세션으로 관리한다.

```
$ tmux              
$ tmux new -s foo        #create session foo and attach
$ tmux new -s foo -d     #create detached session foo
```


#### 세션 연결

세션 사용중에 세션을 빠져 나오려면 `META+d` 로 detach 하거나, 명령모드 `MEAT+:`에서 detach 명령을 준다.

detach한 세션 혹은 다른 세션에 접속하려면

```
$ tmux attach
$ tmux attach -t foo
```


세션을 완전히 종료 시키려면, tmux 세션에서 `META+:` 명령으로 *kill-session* 명령을 실행한다.
혹은 다른 터미널에서

```
$ tmux ls
...

$ tmux kill-session -t 3
```


## 사용

윈도우

prefix c : 윈도우 생성
prefix 0~9 : 해당 번호 윈도우로 이동
prefix n, prefix p : 다음 윈도우, 이전 윈도우로 이동
prefix l : 직전 사용하던 윈도우로 이동
prefix w : 윈도우 리스트를 띄우고 선택
prefix , : 윈도우 이름 바꾸기


pane

prefix % : 좌우로 나누기
prefix " : 상하로 나누기
prefix q : pane 번호를 표시하고 번호를 눌러서 이동
prefix o : pane을 순서대로 이동
prefix 방향키 : 해당 방향으로 이동
prefix Alt-방향키 : 해당 방향으로 크기 조절
prefix Alt-1~5 : 몇 가지 미리 설정된 레이아웃을 고를 수 있고, prefix space로 이 레이아웃을 순서대로 돌아가며 선택 가능


### Prefix key

The default prefix is C-b. If you (or your muscle memory) prefer C-a, you need to add this to ~/.tmux.conf:

#### remap prefix to Control + a

```
set -g prefix C-a
# bind 'C-a C-a' to type 'C-a'
bind C-a send-prefix
unbind C-b
```

앞르로 prefix라는 표시는 C-a 를 말한다.


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



#### 복사와 스크롤

prefix+[ : 우측상단에 페이지 표시 나타나고, 키보드 방향키나 Page Up/Down키로 스크롤 가능

![](/images/tmux/tmux-scroll.png)

마우스로 스크롤 하기 위해서는 `tmux.conf`에 다음을 추가하면 스크롤을 사용할 수 있습니다.

> set -g terminal-overrides 'xterm*:smcup@:rmcup@'

그리고 화면 내용을 복사라혀면

 `Ctrl+[`  : 카피 모드 진입하고 `Ctrl+PgDown PgUp


## Plugin manager

https://github.com/tmux-plugins/tpm

사용자 홈 디렉토리에 저장한다.

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


플러그인 설치를 위해서 `prefix-I` (대문자) 를 실행: prefix 누르고 Shft+i

플러그인 업그레이드를 위해서 `prefix + U` 를 실행: prefix 누르고 Shft+u


remove/uninstall plugins not on the plugin list

Press prefix + alt + u (lowercase u as in uninstall) to remove the plugin.


### Resurrection

tmux plugin manager로 설치하려면 tmux.conf에 다음을 추가

```
set -g @plugin 'tmux-plugins/tmux-resurrect'
```

플러그인 설치를 위해서 `prefix-I` 를 실행

#### Key bindings

prefix + Ctrl-s - save
prefix + Ctrl-r - restore


### 설정 저장

tmux 설정을 위힌 default 파일이 존재하지 않는다는 점이다. 그래서 tmux 기본 설정을 어딘가 추출해서 보관해두면 다시 돌아오는데 편리하다. 현재 tmux에 설정된 값은 다음 명령어로 추출할 수 있다.

```
$ tmux show -g | sed 's/^/set-option -g /' > ~/.tmux.current.conf
```

tmux.conf를 적용하는 명령은 source-file이다.

```
$ tmux source-file ~/.tmux.current.conf
```




# Tmux Command

mac 기준으로 Tmux 설치부터 기본적인 명령어를 알아가고자 한다.<br>
Tutorial용으로 참고할만한 블로그는 아래와같다.<br>
[Tmux-Part1](http://blog.hawkhost.com/2010/06/28/tmux-the-terminal-multiplexer/)
[Tmux-Part2](http://blog.hawkhost.com/2010/07/02/tmux-%E2%80%93-the-terminal-multiplexer-part-2/)


## Install
```
$ brew install tmux
```

## Command

default는 `ctrl+b`에 키조합을 한다.

무슨말이냐고 하면 아래와 같다.
```
e.g)
$ ctrl + b + %
$ ctrl + b + "
```


### create session

```
$ tmux new -s [name]
```

### kill session

```
$ tmux kill-session -t [name]
```

#### rename session

> usage: rename-session [-t target-session] new-name


```sh
$ tmux rename-session -t 1 t-site
```

## hide & visible tmux

```
$ ctrl + b + d      # hide
$ tmux a -t [name]  # visible
```

### Window(Tab)
Window는 터미널에서 탭개념이다.
```
$ ctrl + b + c # create Window
```

### window move
window간에 서로 이동할때
```
$ ctrl + b + [window number]
```

### Panes(Split)
Panes는 한 윈도우에서 화면분한을 할때 사용한다.
```
# horizontal split
#        |
#   1    |    2
#        |
$ ctrl + b + %  
```

```
# vertical split
#        1
# ----------------
#        2
$ ctrl + b + "
```


## Panes Move
화면 분할한 상태에서 이동하기
```
$ ctrl + b + [방향키]
```

## Panes Zoom
특정화면만 확대하기
다시 예전 Panes상태로 돌아오기
```
$ ctrl + b + z
```





#### 한글 문제

다음 솔루션은 잘 작동 안한다.

> UTF-8 환경에서 한글 자모만 출력되는 현상이 있다. 실행시 `-u` 옵션을 준다.
> > http://askubuntu.com/questions/410048/utf-8-character-not-showing-properly-in-tmux

한글 패치

http://seonhyu-blog.tumblr.com/post/34612062806/맥에서-tmux-한글-파일명-출력-문제-해결하기



## 참고

(1) http://gypark.pe.kr/wiki/Tmux
http://haruair.com/blog/3437
- [스크롤에 대한 의견](http://superuser.com/questions/209437/how-do-i-scroll-in-tmux)
