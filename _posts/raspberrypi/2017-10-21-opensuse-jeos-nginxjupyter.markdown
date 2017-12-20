---
title: "Raspberry Pi 3 64bit OS openSUSE: Nginx, Node JS, Jupyter "
date: 2017-10-21 09:00:00 +0900
layout: post
tags: [Raspberry Pi 3, openSUSE, jupyter notebook, python ]
categories: [Raspberry Pi, Linux]
---

**Raspberry Pi 3 64bit OS openSUSE** 는 이글은 5개 글타래로 구성되며, openSUSE 설치, 개발도구 구성 및 서버 구축 사용에 대해 작성한다.

Opensuse 에서 Raspberry Pi 3를 위한 64bit OS openSESE Leap 42.2 을 제공하고 있다.
 - https://en.opensuse.org/HCL:Raspberry_Pi3

  1. [Install 64bit openSUSE Leap 42.3 / JeOS]({% post_url /raspberrypi/2017-10-20-opensuse-jeos-install %})
  2. openSUSE: Managing Service daemon
  3. openSUSE: Basic OS Security for Server
  4. **Install & Configuration - Nginx, Node JS, Jupyter**
  5. Build MongoDB 3.4.x


## Nginx, Node JS, Jupyter Notebook

 - Raspberry Pi 3
 - openSUSE LEAP 42.2 / JeOS

Target services

 - Nginx
 - Nginx Proxy
    - www app : nodejs (PORT 50000)
    - jupyter notebook: PORT 8585
 - Node.js with nvm
 - Python and virtualenv, jupyter notebook



### nginx

nginx는 1.8 버전으로 당연히 사용하던 데비안 계열과 설정 파일 구성이 조금 다르다.

 - nginx 사용자: nginx
 - /etc/nginx/nginx.conf 가 sites-* 폴더가 아닌 vhost* 폴더를 가르킨다.
     + 여기서는 sites-* 폴더를 그대로 사용한다.
 - 기존 데비안 계열 형식 `sites-*` 폴더를 사용하고 사용자먄 `nginx` 사용.

#### 설치

zypper 로 nginx 배포본을 설치한다. 현재는 1.8.1-10.5.1 버전이다.

```sh
sudo zypper in nginx
```

설치하면 사용자 *nginx:nginx* 가 추가된다. 

#### nginx.conf

nginx 설정은 [Nginx - Install, WebDAV, Proxy on Ubuntu/Debian]({% post_url /linux/2017-04-03-ubuntu-nginx %}) 에 설명되어 있다. 이 구성을 기초로 우분투/데비안 계열 같이 `site-*` 폴더를 구성해서 사용한다.

```sh
cd /etc/nginx
mv nginx.conf nginx.orig
```

nginx.conf 에 include 지시자를 사용해 *sites-enabled* 를 추가한다.

```
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
```

그리고 `sites-available`, `sites-enabled` 폴더를 생성하고 사이트 파일을 만든다.

```sh
cd /etc/nginx
sudo mkdir sites-available sites-enabled
sudo touch sites-available/my-site
```

my-site 가상호스트 파일은 [my-site]({{ site.baseurl }}/2017/04/03/ubuntu-nginx#my-site) 내용의 파일을 site-available 에 작성하고, 그 링크를 site-enabled에 링크를 걸어 준다.

```sh
cd /etc/nginx
sudo -s /etc/nginx/sites-available/my-site /etc/nginx/sites-enabled/my-site
```

<br>
<br>
### node.js

nvm을 설치한다. 

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
```

Node.js 설치와 개발환경 설치에 대해서는 [NodeJS / nvm 기반 개발환경 설치]({% post_url /nodejs/2017-04-01-nodejs-install-nvm %}) 글을 참조할 수 있다.


####  node.js 설치

최신 v8 버전을 설치한다.

```
> nvm install v8
Downloading and installing node v8.8.1...
Creating default alias: default -> v8 (-> v8.8.1)
```


```
> which node
/home/qkboo/.nvm/versions/node/v8.8.1/bin/node
```


#### pm2 설치

node.js 앱을 시스템 서비스로 등록하기 위해서 **pm2** 를 설치한다.


```
npm i -g pm2
```

예를 들어 express 앱이 있으면 다음 같이 pm2로 시작한다.

```
cd www-app
pm2 start -n "www-app" bin/www
```

#### pm2 startup

startup 시 pm2 start 로 생성되는 .pm2 디렉토리의 pid 와 app.js 파일을 실행해 준다. 

pm2 startup systemd 로 스타트를 하면 2개의 프로세스가 만들어 진다.

방법은,,,

1. 먼저 앱을 시작해 둔다.

```sh
pm2 start -n "www-app" bin/www
```


2. dump를 생성한다.

pm2로 현재 실행중인 프로세스 정보를 `save`로 덤프하게 저장한다. `systemd` 서비스 스크립을 작성하는데 유용하다.

```
pm2 save
```

3. pm2 startup 명령

`pm2 startup` 명령은 pm2로 실행중인 프로세스를 systemd 서비스 유니트 파일로 제어 할 수 있다. 명령을 실행하면 `sudo` 명령으로 실행할 수 있는 스크립을 출력해 준다.

```sh
$ pm2 startup systemd
...
sudo env PATH=$PATH:/home/foo/.nvm/versions/node/v8.8.1/bin /home/foo/.nvm/versions/node/v8.8.1/lib/node_modules/pm2/bin/pm2 startup systemd -u foo --hp /home/foo
```

이 스크립을 실행해 주면 **pm2-foo.service** 서비스 유니 파일이 생성된다.

```
Target path
/etc/systemd/system/pm2-foo.service
```

이 서비스 파일을 활성화하고 시작해준다.

```sh
systemctl enable pm2-foo
```

이제 시스템을 재시작해도 pm2 로 실행중인 프로세스는 자동으로 시작된다.

<br>
<br>
### Python

Python 개발 환경을 virtualenv 를 이용해서 구성하고, jupyter 를 설치한다. 그리고 시스템 시작 스크립으로 자동으로 시작하는 jupyter notebook 환경 구성까지 진행한다.

#### python3 설치

openSUSE에 python2.7 만 설치되어 있어서, python3 를 설치한다. 다른 버전을 설치하면 openSUSE에서는 자동으로 update-alternatives로 `pip`를 등록해준다.

```sh
sudo zypper in python3

update-alternatives: using /usr/bin/pip3.4 to provide /usr/bin/pip (pip) in auto mode
```


#### 개발자 패키지 설치

jupyter 등 개발, 서버 개발에 필요한 시스템 개발도구를 설치한다. 

```sh
sudo zypper in devel_basis
```

파이썬 개발과 패키지등에서 필요한 파이썬 헤더를 설치한다.

```sh
sudo zypper in python3-devel python-devel 
```

jupyter에서 필요한 zmq 라이브러리를 설치한다.

```sh
sudo zypper in python-distutils-extra libczmq3 libgdal20
```

 - libzmq3 : jupyter 에서 필요
 - libgdal : geospatial analysis with geopandas.

**openSUSE 에서**는 curses 관련 파이썬 모듈을 설치해야 한다.

```sh
sudo zypper in python-curses python3-curses
```

 - python-curses: Python이 (N)Curses Libr에 대한 인터페이스이다


#### virtualenv

`pip` 로 user scheme 에서 설치했다.

```sh
pip install --user virtualenv virtualenvwrapper
```


#### Scientific 과 Pandas 개발환경

사용하려는 Python 버전에 따라 혹은 모두 아래 과학계산용 모듈을 시스템 패키지로 설치한다.

```sh
sudo zypper in python-decorator python-numpy python-scipy python-matplotlib
sudo zypper in python3-decorator python3-numpy python3-scipy python3-matplotlib
sudo zypper in python3-sympy python3-nose
```

> 라즈베피라이, 오드로이드 등 환경에서 pip로 위 모듈을 설치시 시간이 많이 걸린다.
> > pip install --user pandas decorator numpy scipy matplotlib sympy nose
> 그래서 시스템 패키지로 설치했다.

겨로가적으로 앞선 scipy, matplotlib 설치하며 아래 모듈이 의존성에 따라 함게 설치된다.

```
python3-requests python3-pil python3-scrapy python3-geopy python3-shapely python3-pyproj
```


### Jupyter Notebook

Jupyter notebook 으로 파이선, typescript, javascript, c/c++ 등의 IDE 역할을 할 수 있다. 도한 Markdown 을 지원해서 문서화에도 휼륭한 플랫폼이다.


#### *jupyter* 가상환경 만들기

`mkvirtualenv` 명령으로 *jupyter* 라는 가상환경을 만드는데, 과학계산용 라이브러리를 시스템 패키지로 설치했으므로 여기서는 가상환경 생성시 시스템 패키지를 함께 참조하도록 생성한다.

```sh
mkvirtualenv -p python3 --system-site-packages jupyter
(jupyter) $
```

가상환경에서 파이썬 버전을 확인하고 과학계산 개발 등에 필요한 라이브러리가 설치됐는지 확인하자.

```sh
(jupyter) $ python --version
Python 3.4.6
```

필수 모듈이 설치되고 사용이 가능한지 확인한다. 버전 정보가 출력되면 관련 라이브러리가 제대로 설치되었고 가상환경에서 잘 접근되는 것이다. 다음 두 모듈이 없으면 jupyter 설치가 제대로 안된다. 
 > 설치가 안되었으면 앞의 파이썬 개발자 패키지 설치 단락을 확인한다.

```sh
python -c "import numpy;print(numpy.__version__)"
1.9.3
```

```sh
python -c "import numpy;print(numpy.__version__)"
0.16.0
```

그리고 Jupyter 가상환경에서  `pip` 로 **Jupyter**를 설치한다.

```sh
(jupyter)$ pip install jupyter 
```

주피커 노트북 파일이 저장되는 위치가 `iPython` 디렉토리라고 하면 아래 같이 시작할 수 있다.

```sh
(jupyter)$ jupyter-notebook --no-browser --ip=* --port=8000 ./iPython
```
옵션은
 - `--no-browser` : 로컬 브라우저는 시작하지 않는다.
 - `--ip` : 접속 가능 `*`는 모든 곳에서 접근 가능
 -  `--port`:

이런 시작 구성을 설정 파일을 이용해서 저장할 수 있고 이 파일을 이용해서 시작하는 것을 권장한다.


#### Jupyter 설정 파일 이용

사용자 **JUPYTER_DATA_DIR** 인 홈 디렉토리 밑 `~/.jupyter` 에 설정 파일을 구성해야 한다.

```sh
(jupyter)$ jupyter notebook --generate-config
(jupyter)$ cd .jupyter && mv jupyter_notebook_config.py mynotebook.py
```

#### systemd

jupyter notebook을 시스템 서비스로 등록해 보자. `jupyter.service`라는 시스템 서비스 파일을 `/etc/systemd/system/jupyter.service` 에 생성하고 아래 내용을 입력한다.

```
[Unit]
Description=HomePi Jupyter-Notebook

[Service]
Type=simple
PIDFile=/run/homepi-jupyter.pid
ExecStart=/home/foo/.virtualenvs/jupyter/bin/jupyter-notebook --config=/home/foo/.jupyter/mybook_config.py
User=qkboo
Group=users
WorkingDirectory=/home/foo/iPython
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

그리고 이 시스템 서비스 파이을 활성화하고 시작한다.

```sh
sudo systemctl enable jupyter.service
sudo systemctl daemon-reload
sudo systemctl restart jupyter.service
```


#### Typescript kernel

jupyter notebook에서 Typescript 을 작성하고 컴파일한 결과를 확인할 수 있다. 

먼저 Nodejs용 itypescript 모듈을 global로 설치한다.

```sh
npm install -g itypescript
```

its 명령으로 Jupyter kenel로 설치해 준다. 

```sh
its --ts-install=local
```



## 참조

 - [How to deploy nodejs app with pm2](https://www.howtoforge.com/tutorial/how-to-deploy-nodejs-applications-with-pm2-and-nginx-on-ubuntu/)


{% comment %}
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04

https://linuxconfig.org/how-to-force-fsck-to-check-filesystem-after-system-reboot-on-linux
{% endcomment %}

