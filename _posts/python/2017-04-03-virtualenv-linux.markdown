---
title: Python - Install virtualenv on Linux
date: 2017-04-03 09:00:00 +0900
layout: post
tags: [python, virtualenv, virtualenvwrapper]
categories: 
- Programming
---

Python 개발환경을 위해서 시스템에 설치된 python2.7, python3.x 에서 사용하는 패키지 모듈을 `pip`를 사용해서 패키지를 관리할 수 있다. 그리고 시스템 모듈과 별도의 버전 환경으로 버전 관리 도구인 `virtualenv`와 `virtualenvwrapper` 를 사용해 파이썬 가상 개발 환경을 구성하는 방법을 설명한다.

<br/>

## Python virtualenv 개발환경 구축하기

최근 리눅스 배포본은 python2.7, python3.x 버전이 내장되어 있다.

- raspbian-wheezy에는 Python 2.7과 Python 3.2가 설치되어 있다
- raspbian jessie에는 Python 2.7과 Python 3.3이 설치되어 있다.
- armbian Debian Jessie, Ubuntu Xenial 에도 Python 2.7과 Python3.3 이 설치되어 있다.

파이썬 개발환경은 `virtualenv` 를 기반으로 사용하는 것을 권장한다. 그리고 가상 개발 환경은,
 - 시스템 개발자 모듈 설치
 - 시스템 Python pip 설치
 - pip에서 시스템 Python virtualenv, virtualenvwrapper 설치
 - 가상환경 만들기

순서로 구성할 수 있다.



### Python 가상 개발 환경 설치

다양한 파이썬 버전을 위해 환경 구성을 해주는 유틸리티.

 - **pyenv** : "Simple Python Version Management", 로컬에 다양한 파이썬 버전을 설치하고 사용할 수 있도록 한다. pyenv를 사용함으로써 파이썬 버전에 대한 의존성을 해결할 수 있다.

 - **virtualenv** : “Virtual Python Environment builder”, 로컬에 다양한 파이썬 환경을 구축하고 사용할 수 있도록 한다. 일반적으로 Python Packages라고 부르는 ( pip install을 통해서 설치하는 ) 패키지들에 대한 의존성을 해결할 수 있다.

 - **autoenv** : 만약 pyenv와 virtualenv를 통해서 의존성을 해결한다고 하더라도 작업할때마다 설정해주는 것은 귀찮은 작업이다. 특정 프로젝트 폴더로 들어가면 자동으로 개발 환경을 설정해주는 autoenv라는 스크립트를 활용할 수 있다.

#### pyenv

http://pythonstudy.xyz/python/article/506-파이썬-가상환경



여기서는 `virtualenv`와 `virtualenvwrapper`를 사용해서 모듈을 설치하고 관리한다. `pip` 모듈을 사용해서 virtualenv 와 virtualenvwrapper 를 설치한다.

#### virtualenv 단독 사용

다음 참조. http://dgkim5360.tistory.com/entry/python-virtualenv-on-linux-ubuntu-and-windows

`virtualenv`는 가상환경이 설치된 위치로 이동해서, 설치한 폴더에서 `source` 명령을 통해 환경을 활성화해야 한다. 이런 점을 보완해 쉘 명령을 제공하는 `virtualenvwrapper`와 함께 쓰는 것을 권한다.

여기서는 `pip`로 `virtualenv`와 `virtualenvwrapper`를 설치해서 사용한다.

#### virtualenv와 virtualenvwrapper

virtualenv는 가상의 파이썬 작업환경을 만들어 준다. 작업환경을 따로따로 만들어, 시스템 파이썬 모듈이나 다른 가상의 작업환경에게 영향을 주지 않는다. 또한 `pip`는 시스템의 site-packages 폴더 /usr/lib/python2.7/site-packages에 모듈을 설치하는데 virtualenv를 이용하면 분리할 수 있다.

이제 `pip`로 `virtualenv`와 `virtualenvwrapper`를 설치한다.

```bash
$ pip3 install virtualenv
$ pip3 install virtualenvwrapper
```

`virtualenvwrapper`는 `virtualenv` 통합 환경을 쉽게 다룰 수 있게 해준다. 쉘 프로파일 `.bashrc`, `.profile` 등에 다음 라인을 추가한다.

```bash
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/Devel
source /usr/local/bin/virtualenvwrapper.sh
```

그리고 쉘 환경을 로딩하기 위해서 다시 로그인 하거나 다음 같이 source 명령을 이용해도 좋다.

```bash
$ source .profile
ebian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Fri Oct 23 18:17:41 2015 from 192.168.219.103
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


다음 에러가 발생하면 쉘에 VIRTUALENVWRAPPER_PYTHON 를 추가해 준다.

> /usr/bin/python: No module named virtualenvwrapper
virtualenvwrapper.sh: There was a problem running the initialization hooks.
> 
> If Python could not import the module virtualenvwrapper.hook_loader,
check that virtualenvwrapper has been installed for
VIRTUALENVWRAPPER_PYTHON=/usr/bin/python and that PATH is



#### Quick-Start

새로운 가상환경은 `mkvirtualenv` 명령으로 만든다. 가상환경으로 전환시 프롬프트가 `(NAME) $` 형태로 표시된다.

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


**workon** 명령으로 설치한 가상 환경 목록을 보거나 혹은 해당 가상환경으로 전환할 수 있다.

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

#### 가상환경 복사하기

```sh
$ cpvirtualenv django3 new_djang4
$ rmvirtualenv django3
```


### pyvenv

3.3에서부터 pyvenv에 기본으로 설치되어 있다. 다만 3.3에서는 pip를 가상 환경을 만들 때마다 설치해주어야 한다. 3.4에서는 pip까지 기본으로 설치되어 있다.

```sh
$ mkdir django_tests
$ cd django_tests
$ pyvenv-3.4 env
$ source env/bin/activate   # env의 파이썬 활성화
(env)$ deactivate           # 시스템 파이썬으로 복귀
```


### System service

Virtualevn 환경을 시스템 시작 스크립, 크론, 파이썬 스크립에서 사용하려면 해당 가상 환경 위치의 python 혹은 가상환경의 jupyter-notebook 같은 명령 위치를 지정하면 된다.

https://serverfault.com/questions/821575/systemd-run-a-python-script-at-startup-virtualenv


## 참조

[virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/)

