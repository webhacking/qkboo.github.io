---
title: Python - Install virtualenv on Linux
date: 2017-04-03 09:00:00 +0900
layout: post
tags: [python, virtualenv, virtualenvwrapper, macOS]
categories: 
- Python
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

<br/>
### Python 가상환경 설치

여기서는 Ubuntu/Debian을 사용한다고 가정하고, `apt`로 파이썬 개발용 패키지를 설치한 후에, `pip`를 사용해 가상환경을 구성한다.

#### 사전 준비

기본 개발자 모듈이 설치 안되어 있다면 설치한다.

```sh
$ sudo apt install build-essential
```

Python 개발을 위해서는 리눅스에 파이썬 헤더가 필요하다. 그래서 *python-dev* 패키지를 설치해 준다.

```bash
$ sudo apt install python-dev python3-dev
```

>  패키지 이름으로 Python 2.x는 'python-' 접두어를 사용하고 Python 3.x 패키지들은 'python3-' 를 사용한다.

파이썬 패키지 도구인 **pip**(Python Package Index, PyPI)는 파이썬 모듈을 검색, 설치, 관리 할 수 있다. 시스템에 설치된 python 버전 마다 sudo로 pip를 설치한다.

```sh
$ sudo apt install python-pip     # Python2.x
$ sudo apt install python3-pip    # Python3.x
```


##### pip 소스에서 설치

> Pip 소스로 설치
> 
> get-pip.py 소스를 다운받는다. 
> 
> ```bash
> $ wget https://bootstrap.pypa.io/get-pip.py
> ```
> 
> 시스템에 설치된 python 버전 마다 sudo로 pip를 설치애야 합니다. 
> Python3 을 위한 pip를 설치한다.
> 
> ```bash
> $ sudo python3 get-pip.py
> Successfully installed pip-8.1.2 setuptools-24.0.3 wheel-0.29.0
> ```
> 
> 다음은 Python2를 위한 pip를 설치합니다.
> 
> ```bash
> $ sudo python2.7 get-pip.py
> ```


#### site-packages

`pip --version` 버전 정보를 출력하면 버전과 pip로 설치하는 패키지가 저장되는 *site-packages* 위치를 확인할 수 있다.

```sh
$ pip3 --version
pip 8.1.2 from /usr/local/lib/python3.5/dist-packages (python 3.5)
$ pip2 --version
pip 8.1.2 from /usr/local/lib/python2.7/dist-packages (python 2.7)
```


`pip` 로 설치되는 패키지 모듈은 시스템의 site-packages 폴더에 설치된다. python2.7은 /usr/lib/python2.7/site-packages에 모듈을 설치한다. 현재 설치한 `pip` 를 업그레이드 하려면 다음 같이 `sudo`로 설치해준다.

```bash
$ sudo pip install --upgrade pip
$ sudo pip3 install --upgrade pip3.4
```

이후는 특별히 버전을 명시하지 않으면 `pip`는 **pip3.4**을 사용한다고 가정한다. 


### Python 가상 개발 환경 설치

다양한 파이썬 버전을 위해 환경 구성을 해주는 유틸리티.

 - **pyenv** : "Simple Python Version Management", 로컬에 다양한 파이썬 버전을 설치하고 사용할 수 있도록 한다. pyenv를 사용함으로써 파이썬 버전에 대한 의존성을 해결할 수 있다.

 - **virtualenv** : “Virtual Python Environment builder”, 로컬에 다양한 파이썬 환경을 구축하고 사용할 수 있도록 한다. 일반적으로 Python Packages라고 부르는 ( pip install을 통해서 설치하는 ) 패키지들에 대한 의존성을 해결할 수 있다.

 - **autoenv** : 만약 pyenv와 virtualenv를 통해서 의존성을 해결한다고 하더라도 작업할때마다 설정해주는 것은 귀찮은 작업이다. 특정 프로젝트 폴더로 들어가면 자동으로 개발 환경을 설정해주는 autoenv라는 스크립트를 활용할 수 있다.


여기서는 `virtualenv`와 `virtualenvwrapper`를 사용해서 모듈을 설치하고 관리한다. `pip` 모듈을 사용해서 virtualenv 와 virtualenvwrapper 를 설치한다.


#### virtualenv와 virtualenvwrapper

virtualenv는 가상의 파이썬 작업환경을 만들어 준다. 작업환경을 따로따로 만들어, 시스템 파이썬 모듈이나 다른 가상의 작업환경에게 영향을 주지 않는다. 또한 `pip`는 시스템의 site-packages 폴더에, /usr/lib/python2.7/site-packages에 모듈을 설치한다. virtualenv를 이용하면 분리할 수 있다.

여기서 `pip`로 `virtualenv`와 `virtualenvwrapper`를 설치한다.

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

그리고 쉘 환경을 로딩하기 위해서 다시 로그인 하거나 다음 같이 source 명령을 이용해도 좋습니다.

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



