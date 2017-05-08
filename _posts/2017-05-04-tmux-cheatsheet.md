---
title: Tmux cheatsheet
date: 2017-05-04 05:16:00 +0900
layout: post
comments: true
tags: tmux, iterm2, terminal, linux
categories:
- Linux
- tmux
---


여기서 `tmux` 터미널 명령은 `$ tmux` 로 표현하고, tmux window 에서 Tmux 명령은 기능키와 메타키 조합으로 `C-[c,b...]` 같이 표기한다.
여기서 C는 Control 키고, M은 META키인 Alt 키다.
 - 여기서 기능키 조합은 C-a를 사용했다. (기본 기능키 조합은 C-b)

`.tmux.conf` 에서 기능키/메타키 연결

```bash
# remap prefix to Control + a
set -g prefix C-a
# bind 'C-a C-a' to type 'C-a'
bind C-a send-prefix
unbind C-b
```


## Tmux 명령

tmux는 세션을 만들고, 세션에서 window를 구성하고, window 안에 pane을 사용한다.

##### 새로운 세션 시작하기

```bash
$ tmux                        #새로운 새션
$ tmux new -s session_name    #session_name으로 새로운 세션
```

세션을 dettach하면 세션은 저장된다. 사용하지 않으면 **kill**로 종료한다.

##### 세션 이용하기

```sh
$ tmux ls
$ tmux list-session
$ tmux list-windows         # Window 목록
```

열린 세션 사용하기. 세션 번호중 낮은 번호에 우선해서 접속한다.

```sh
$ tmux attach
$ tmux at
$ tmux a
```

특정 세션에 접속하기 - 세션 번호 혹은 이름으로 접속한다.

```sh
$ tmux a -t session_name
```

세션 마감하기

```sh
$ tmux kill-session session_name
```

Tmux로 접속한 session은 처음 한개의 Window를 갖는다. window 안에서 session, window, pane을 관리한다. 각 윈도우는 한 개 이상의 Pane 구획으로 나누어 사용할 수 있다.

## Tmux Window

현재 세션 이용

```sh
C-a s            #Session 목록
C-a $            #Session 이름 변경
```


##### window 사용하기

세션에서 여러 윈도우를 추가 해서 사용할 수 있다.

```
C+a c          #새로운 윈도우 생성
```

여러 윈도우는 윈도우 순서에 따라 현재 윈도우 화면을 교환 할 수 있다.

```
C-a w          #윈도우 목록
C-a 1 ...      #지정 윈도우 번호로 전환: 0,1,...
C-a p          #이전 윈도우로 이동
C-a n          #다음 윈도우로 이동
C-a l          #가장 마지막 윈도우로 이동
C-a ,          #현재 윈도우 이름 변경
C-a &          #현재 윈도우 제거
```

현재 세션을 나가려면

```
C-a d          # 세션 detach
```

##### Tmux pane

Tmux window를 여러 분할면 pane으로 나눠 사용한다.

```
C-a %          #수직으로 나누기
C-a "          #수평으로 나누기
C-a z          #현재 pane 확대 및 돌아오기
C-a {          #현재 pane을 이전 pane 위치로 이동
C-a }          #현재 pane을 다음 pane 위치로 이동
C-a M+Arrow    #pane 크기를 방향키에 따라 변경
C-a spacebar   #pane 방향 전환 (수직<->수평)
C-a !          #현재 pane을 새 window로 분리
C-a x          #pane 종료
C-a x          #pane 종료
```

pane에서 스크롤 기능을 활성화. 방향키 혹은 페이지키로 화면 버퍼 만큼 이동할 수 있고, `ESC`키로 빠져 나온다.

```
C-a [
```


## iTerm2 Tmux Integreation

macOS에서 사용하는 iterm2 에는 서버측 tmux와 통합할 수 있는 tmux client가 내장되어 있다. iterm으로 서버에 로그인하고 `tmux -CC` 명령을 통해 iterm2에서 모든 tmux session을 관리할 수 있다. 클라이언트 에서 서버의 세션을 조작할 수 있고, iterm에서 GUI로 가능하다는 장점이 있어 보인다.


### BUG: aggressive-resize

iterm2에서 `aggressive-resize` 버그 있어서, tmux의 설정 `.tmux.conf`에서 비활성화한다.

```
setw -g aggressive-resize off t
```

새 세션이라면 다음으로 넘어가고, 기존 세션이 있다면 tmux 로 설정을 다시 읽어 준다.

```
$ tmux source ~/.tmux.conf
```


### tmux -CC 실행

iterm에서 서버에 접속하고 *-CC* 옵션을 주면 iterm2에서 서버의 tmux 세션을 조작할 수 있다.

```sh
$ tmux -CC
$ tmux -CC attach [-t #]
```

## 참고

- [스크롤에 대한 의견](http://superuser.com/questions/209437/how-do-i-scroll-in-tmux)
- [TmuxIntegeration](https://gitlab.com/gnachman/iterm2/wikis/TmuxIntegration)
- [Tmux Integration aggressive-resize issue](https://github.com/tmux-plugins/tmux-sensible/issues/24)
