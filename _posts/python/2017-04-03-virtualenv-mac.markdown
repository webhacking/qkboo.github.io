---
title: Python - Install virtualenv on macOS X
date: 2017-04-03 13:00:00 +0900
layout: post
tags: [python, virtualenv, virtualenvwrapper, macOS]
categories: 
- Programming
---

Python 개발환경을 위해서 macOS에 설치된 python2.7 그리고 brew 같은 유틸리티로 python3.x 를 설치하고, `pip`를 사용해서 패키지를 관리할 수 있다. 그리고 다양한 모듈과 시스템 모듈의 분리를 위해서 버전 관리 도구인 `virtualenv`와 `virtualenvwrapper` 를 사용해 가상 개발 환경을 구성하는 방법을 설명한다.

<br/>

## macOS에서 Python virtualenv 개발환경 구축하기

macOS 에는 python2.6, python2.7이 설치되어 있다. python3를 설치하려면 HomeBrew, MacPort 같은 시스템 유틸리티 관리자를 이용한다. 여기서는 HomeBrew 를 사용했다.

```sh
$ brew install python3
```

### 사전 준비

파이썬 패키지 도구인 **pip**(Python Package Index, PyPI)는 파이썬 모듈을 검색, 설치, 관리 할 수 있다.
설치된 *python* 버전에 따라 `pip`가 설치되어 있다. brew로 `python3`를 설치하면 `pip3` 버전이 설치된다. `pip --version` 버전 정보를 출력하면 버전과 *site-packages* 위치를 확인할 수 있다.

```sh
$ pip --version
pip 7.1.2 from /Library/Python/2.7/site-packages (python 2.7)
$ pip3 --version
pip 9.0.1 from /usr/local/lib/python3.6/site-packages (python 3.6)
```

#### site-packages

`pip` 로 설치되는 패키지 모듈은 시스템의 *site-packages* 폴더에 설치된다. 
 - python2.7은 /usr/lib/python2.7/site-packages
 - python3.4는 /usr/lib/python3.4/site-packages

그래서 시스템에 설치된 `pip`는 `sudo`로 설치한다.

`brew`로 설치한 python3의 pip3는 사용자 환경에서 접근이 가능해서 sudo 없이 설치해도 된다.

```bash
$ sudo pip install --upgrade pip
$ pip3 install --upgrade pip3.6
```

이후는 특별히 버전을 명시하지 않으면 `pip`는 **pip3.6**을 사용한다고 가정한다. 

<br/>

### Python 가상 개발 환경 설치

앞서 언급한데로 개발을 위해 site-package 모듈을 유지하고 개발을 위해 설치하는 패키지 모듈을 python 버전에 의존해 관리하는 버전 관리자로 `pyenv`, `virtualenv` 같은 버전 관리자를 사용한다. 버전 관리자는 사용자 환경에 시스템 모듈을 복사해 새로 설치되는 모듈을 기존 시스템 버전과 혼동되지 않게 해준다.


#### virtualenv와 virtualenvwrapper

여기서 `pip`로 `virtualenv`와 `virtualenvwrapper`를 설치한다.

```bash
$ pip3.6 install virtualenv
$ pip3.6 install virtualenvwrapper
```

쉘 프로파일 `.bashrc`, `.profile` 등에 다음 라인을 추가한다.

```bash
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/Devel
source /usr/local/bin/virtualenvwrapper.sh
```

그리고 쉘 환경을 로딩하기 위해서 다시 로그인 하거나 다음 같이 source 명령을 이용하면 아래 같이 virtualenvwrapper 에서 제공하는 환경변수가 설정된다.

아래는 `source` 명령으로 .profile을 컴파일한 결과를 보여준다.

```bash
$ source .profile
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/premkproject
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/postmkproject
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/initialize
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/premkvirtualenv
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/postmkvirtualenv
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/prermvirtualenv
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/postrmvirtualenv
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/predeactivate
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/postdeactivate
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/preactivate
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/postactivate
virtualenvwrapper.user_scripts creating /home/pi/.virtualenvs/get_env_details
```


다음 같이 에러가 발생하면 쉘에 VIRTUALENVWRAPPER_PYTHON 를 추가해 준다.

> /usr/bin/python: No module named virtualenvwrapper
virtualenvwrapper.sh: There was a problem running the initialization hooks.
> 
> If Python could not import the module virtualenvwrapper.hook_loader,
check that virtualenvwrapper has been installed for
VIRTUALENVWRAPPER_PYTHON=/usr/bin/python and that PATH is


#### Quick-Start

새로운 가상환경은 `mkvirtualenv NAME` 명령으로 만든다. 가상환경으로 전환시 프롬프트가 `(NAME) $` 형태로 표시된다.

```bash 
$ mkvirtualenv django2   #기본 python 버전의 환경 생성
...
(django2):~$               # 실행 가상 환경 쉘
```

`mkvirtualenv` 명령은 `-p` 옵션으로 파이썬 버전을 명시할 수 있다.

```bash 
$ mkvirtualenv -p python3 django3
```

`--system-site-packages` 옵션은 site-package 시스템 버전을 사용하게 한다.

```sh
$ mkvirtualenv --system-site-packages -p python3 django3
```


`workon NAME` 명령으로 설치한 가상 환경 목록을 보거나 혹은 해당 가상환경으로 전환할 수 있다.

```bash 
$ workon 
django2 django3
$ workon django3
...
(django3):~$
```


프로젝트 환경을 빠져 나오려면 `deactivate`를 실행한다.

```bash 
(django3):~$ deactivate
```


