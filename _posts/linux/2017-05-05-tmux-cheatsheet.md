---
title: Tmux cheatsheet
date: 2017-05-05 09:00:00 +0900
layout: post
tags: [tmux, linux, terminal]
categories:
- Linux
---

> - 2017-07-14: 윈도우에서 session 관리
> - 2017-07-10: tmux copy & paste
{:.right-history}


터미널 명령은 `$ tmux` 로 표현하고, Tmux window 에서 Prefix key 키 조합은 는 *C*{:.keyword} 표기하고, Meta key인 `Alt`는 *M*{:.keyword}으로 표기한다 - [Tmux Start](http://localhost:4000/linux/tmux/2017/05/04/tmux-start.html) 참조.

여기서는 *.tmux.conf* 에서 기능키/메타키 연결해서 기본 Prefix key인 `Ctrl+b` 를 `Ctrl+a`로 묶었다.

```bash
set -g prefix C-a
bind C-a send-prefix
unbind C-b
```



## Tmux 명령

tmux는 세션을 만들고, 세션에서 window를 구성하고, window 안에 pane을 사용한다.

### 새로운 세션 시작하기

```bash
$ tmux                        #새로운 새션
$ tmux new -s session_name    #session_name으로 새로운 세션
```

세션을 dettach하면 세션은 저장된다. 사용하지 않으면 **kill**로 종료한다.

### 세션 이용하기

```sh
$ tmux ls
$ tmux list-session
$ tmux list-windows         # Window 목록
```

#### 열린 세션에 붙기.
 - 세션 번호중 낮은 번호에 우선해서 접속한다.

```sh
$ tmux attach
$ tmux at
$ tmux a
```

#### 특정 세션에 접속하기
 - 세션 번호 혹은 이름으로 접속한다.

```sh
$ tmux a -t session_name
```

#### 세션 마감하기

```sh
$ tmux kill-session session_name
```

Tmux로 접속한 session은 처음 한개의 Window를 갖는다. window 안에서 session, window, pane을 관리한다. 각 윈도우는 한 개 이상의 Pane 구획으로 나누어 사용할 수 있다.

<br/>

## Tmux Window

현재 세션 이용

```
C-s            #Session 목록
C-$            #Session 이름 변경
```

### window 사용하기

세션에서 여러 윈도우를 추가 해서 사용할 수 있다.

```
C-c          #새로운 윈도우 생성
```

여러 윈도우는 윈도우 순서에 따라 현재 윈도우 화면을 교환 할 수 있다.

```
C-w          #윈도우 목록
C-1 ...      #지정 윈도우 번호로 전환: 0,1,...
C-p          #이전 윈도우로 이동
C-n          #다음 윈도우로 이동
C-l          #가장 마지막 윈도우로 이동
C-,          #현재 윈도우 이름 변경
C-&          #현재 윈도우 제거
```

현재 세션에서 나온다. 세션은 백그라운드에서 실행된다.

```
C-d          #현재 세션을 빠져 나온다 (detach)
C-D          #빠져나올 세션을 선택할 수 있다.
```

### Tmux pane

Tmux window를 여러 분할면 pane으로 나눠 사용한다.

```
C-%          #수직으로 나누기
C-"          #수평으로 나누기
C-z          #현재 pane 확대 및 돌아오기
C-{          #현재 pane을 이전 pane 위치로 이동
C-}          #현재 pane을 다음 pane 위치로 이동
C-Arrow      #앞,뒤 pane을 방향키로 이동
C-M+Arrow    #pane 크기를 방향키에 따라 변경
C-spacebar   #pane 방향 전환 (수직<->수평)
C-!          #현재 pane을 새 window로 분리
C-x          #pane 종료
C-[          #pane에서 스크롤 기능을 활성화
```


### Session transition

Tmux window 상태에서 여러 세션 사이의 전환 단축키;

```
C-$          # 현재 세션 이름 바꾸기
C-(          # 이전 세션으로 전환
C-)          # 다음 세션으로 전환
C-L          # 사용한 세션중 마지막 세션으로 전환
C-s          # 사용 가능한 세션 목록
```


### Tmux copy & paste

`tmux` 는 자체 버퍼에 터미널에서 선택한 영역의 텍스트를 복사해서 사용할 수 있다.

```
C-[         # copy mode
Ctrl+space  # 복사할 영역을 선택한다. 터미널에 영역이 선택되어 보인다.
Ctrl+w      # 선택한 영역을 복사한다.
C-]         # 붙여 넣는다.
```

단, 시스템 버퍼는 별도의 플러그인을 사용한다.

#### Copy with mouse drag

**mouse mode**를 활성화 하면 터미널에서 마우스 드래그로 텍스트를 선택하면 tmux buffer에 복사되게 한다. *.tmux.conf* 파일에 다음 구성을 추가한다:

```sh
set -g mouse on
```


<!--
## 참조

 [spicycode/tmux.conf](https://gist.github.com/spicycode/1229612) 
 [My Tmux Configuration](http://zanshin.net/2013/09/05/my-tmux-configuration/)-->