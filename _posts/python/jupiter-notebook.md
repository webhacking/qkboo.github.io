## jupyter notebook

Python은 REPL 인터프리터를 사용할 수 있는데, REPL의 장점에 더해서 *syntax highlighting*,  *autocompletion*, *pretty printing*, *built-in documentation* 등의 기능을 사용할 수 있는 웹 기반의 IDE 환경이다. 


### Jupyter 소개

jupyter notebook 은 대화식 파이썬 인터프리터를 여러 환경에서 이용할 수 있도록 고려하고 탐구적인 컴퓨팅이 가능하도록 풍부한 도구를 제공하고 있다.
 - 강력한 대화식 파이썬 환경
 - Jupyter notebook 그리고 다른 프론트엔드에서 파이썬 코드로 동작하는 `Jupyter` 커널.
 - 커널은 '통신 모델'을 기반으로 여러 클라이언트가 '주피터'라는 웹 기반 노트북에 접속해서 처리를 해주는 파이썬 프로그램
 - 병렬 처리를 해주는 `ipyparallel` 패키지를 이용해 병렬 구조를 제공

> 현재 ipyhon notebook은 Jupyter라는 이름으로 변경되고 주피터(IPython >= 3의 다른 이름)에서는 하나의 서버에서 다수의 커널을 바꿔가며 실행할 수 있다.


#### 주요 특징

커널이라는 개념을 도입해서 현재는 여러 버전의 파이썬, 혹은 다른 언러를 동시에 사용할 수 있는 환경을 제공하고 있다. 그래서 별도의 가상환경으로 실행할 필요 없이 글로벌 설치를 통해 사용하면 된다.


### Jupyter 설치

Jupyter로 출시되며 하나의 노트북 서버에서 다수의 커널을 지원한다.

#### pip

pip를 이용해서 최근 버전의 jupyter를 설치할 수 있다. 먼저 pip를 업그레이드 한다.

> 단, 가상환경이 아닌 시스템 패키지로 설치된 경우 `sudo` 로 설치 될 것이다.

```
$ pip install --upgrade pip
$ pip install -U pip
```

그리고 

```
$ pip3 install jupyter
```

> 단 Python2 환경에서 설치시에는 pip 명령을 사용한다.

설치된 jupyter 명령으로 사용한다.

```
$ ipython3 --version
5.1.0
$ jupyter --version
4.2.0
```


#### Anaconda

anaconda를 다운로드해서 설치하고 jupyter notebook을 설치한다.

```
jupyter notebook
```



### Jupyter 실행

jupyter는 다음 같이 실행한다. 실행하는 호스트의 `localhost` 로 웹 서버가 실행되어 호스트의 브라우저로 바로 접속해서 사용할 수 있다.

```
$ jupyter notebook
[I 10:10:38.886 NotebookApp] Serving notebooks from local directory: /home/qkboo
[I 10:10:38.888 NotebookApp] 0 active kernels
[I 10:10:38.890 NotebookApp] The Jupyter Notebook is running at: http://localhost:8888/?token=95b1b58248730799df825e0a70d0029324eb804cdec3fe52
[I 10:10:38.891 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[C 10:10:38.896 NotebookApp]

    Copy/paste this URL into your browser when you connect for the first time,
    to login with a token:
        http://localhost:8888/?token=95b1b58248730799df825e0a70d0029324eb804cdec3fe52
```

접속시 *?token=* 파라미터로 고유한 토큰 값을 전달해야 브라우저 접속이 가능하다.

그리고 GUI가 아닌 터미널에서 실행하고 lynx 텍스트 브라우저가 설치되어 있으면 다음 같이 터미널에서 확인이 가능하다.

![](images/jupyter-terminal.png)

쥬피터는 기본적으로 로컬 데스크탑에서 실행하고 브라우저에서 접속하게 끔 되어 있어서 외부에서 접속이 안된다. 그래서  호스트 외부에서 쥬피터에 접속하려면 다음 같이 실행한다.


#### 원격접속을 위한 jupyter 

로컬 호스트 브라우저를 사용하지 않고 외부 IP에서 접속을 허용하는 옵션을 주고 실행한다. 원격 접속을 위해서는 `--ip=*` 선택 사항을 추가해서 실행합니다.

```
$ jupyter notebook --no-browser --ip=* --port=8888 ./iPython
[W 09:54:38.724 NotebookApp] WARNING: The notebook server is listening on all IP addresses and not using encryption. This is not recommended.
[I 09:54:38.764 NotebookApp] Serving notebooks from local directory: /home/qkboo/iPython
[I 09:54:38.766 NotebookApp] 0 active kernels
[I 09:54:38.767 NotebookApp] The Jupyter Notebook is running at: http://[all ip addresses on your system]:8585/?token=156a7e4c6fc34d34d51b0e1761ce36aa8aea2a3b653dbc78
[I 09:54:38.769 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[C 09:54:38.772 NotebookApp]

    Copy/paste this URL into your browser when you connect for the first time,
    to login with a token:
        http://localhost:8888/?token=156a7e4c6fc34d34d51b0e1761ce36aa8aea2a3b653dbc78
```

이제 외부 브라우저에서 쥬피터 서버로 접속하면 다음 그림 같이 패스워드 혹은 토큰 입력 창이 표시된다. 

![](images/jupyter5-run.png)

입력에 쥬피터 실행시 표시되는 토큰 값**?token=156a7e4c6fc34d34d51b0e1761ce36aa8aea2a3b653dbc78** 토큰을 주고 접속하면 된다.


```
$nohup jupyter notebook --no-browser --ip=* --port=8585 iPython/ &
```

그렇지만 누구나 접속 할 수 있으므로 사용자 비밀번호를 입력해서 접속하도록 하는 것을 권합니다.


### Jupyter 설정 이용

jupyter는 설치된 후에 jupyter 시스템 디렉토리와 사용자 데이터 디렉토리에 필요한 내용을 저장한다.

 - 시스템 디렉토리: /usr/local/share/jupyter/
 - **JUPYTER_DATA_DIR** 는 보통 ~/.jupyter

#### 새 사이트 설정

먼저 다음 같이 설정 파일을 생성합니다.

```
$jupyter notebook --generate-config
Writing default config to: /home/qkboo/.jupyter/jupyter_notebook_config.py
$ cd .jupyter && mv jupyter_notebook_config.py mynodebook.py
```

*mynotebook.py* 설정에 필요한 내용을 

```
#c.NotebookApp.notebook_dir = '/path/to/notebook_directory'
c.NotebookApp.base_url = 'http://www.yourdomain.com/notebok'
c.NotebookApp.password = ''
c.NotebookApp.port = 8888
c.NotebookApp.port_retries = 50
```

실행중인 쥬피터 노트북에서 `passwd()` 를 실행해 **패스워드 해시 값**을 얻는다.

![](images/jupyter-passwd.png)

python/IPython 다음 코드를 실행해서 패스워드 해시 값을 얻는다.

```
In [1]: from notebook.auth import passwd
In [2]: passwd()
Enter password:
Verify password:
Out[2]: 'sha1:67c9e60bb8b6:9ffede0825894254b2e042ea597d771089e11aed'
```


이 패스워드 해시 값을 jupyter_notebook_config.py 설정 파일의 `c.NotebookApp.password` 항목 주석을 풀고 해시 값을 입력합니다.

```
c.NotebookApp.password = 'sha1:4ee6bb2da3d7:ed76216b87228540e5f5f20fcfa8069cf82686f0'
```

이제 jupyter에 접속하려면 다음 같이 패스워드를 묻고 입력한 후에 사용할 수 있습니다.

![](/images/python/jupyter-login.png)

실행

```sh
$ jupyter notebook --config .jupyter/mybook_config.py ./iPython/
```


$ nohup jupyter notebook --no-browser --ip=* --port=8585 iPython/ > log-jupyter.log &



#### 웹 페이지에 내장하기

notebook을 웹 사이이트의 iframe 같은 곳에 사용할 수 있다. 이렇게 내장하려면 *Content-Security-Policy* 를 재정의해야 한다. 웹 사이트가 'http://my.example.com' 이라면 노트북 설정 파일인 jupyter_notebook_config.py 파일에 다음을 추가한다.

```
c.NotebookApp.tornado_settings = {
    'headers': {
        'Content-Security-Policy': "frame-ancestors 'https://my.example.com' 'self' "
    }
}
```

이렇게 iframe으로 내장해서 사용할 때 노트북은 단일 탭 모드로 설정되야 한다. 기본적으로 노트북에서 링크를 열게 되면 새로운 탭으로 연다. 다음 같이 `./.jupyter/custom/cstom.js` 에 싱글 탭 모드로 지정해 줘야 한다.

```
define(['base/js/namespace'], function(Jupyter){
    Jupyter._target = '_self';
});
```




### Supervisor

**Supervisor**는 유니스 계열 시스템에서 프로세스 제어를 지원해준다.



### SSL 생성

jupyter notebook 단독 서버에서 SSL을 이용하기 위해서 self-signed certificate를 생성 한다. OpenSSL을 이용해서 certificate을 생성할 수 있다. 유효기간은 365일이다.


```
$ openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout 20160712_picert.key -out 20160712_picert.pem
```

설정파일에 인증서 파일 위치를 입력합니다.

```
c.NotebookApp.certfile = '/absolute/path/to/your/certificate/mycert.pem'
```

그리고 쥬피터를 재시작 하면 된다.


명령라인에서 시작시 Cert 파일을 명령에서 지정할 수 있다.

```
$ jupyter notebook --certfile=mycert.pem --keyfile mykey.key
```








## 참고
 - http://jupyter-notebook.readthedocs.io/en/latest/public_server.html
 - http://goodtogreate.tistory.com/entry/IPython-Notebook-설치방법
 - https://github.com/ipython/ipython/wiki/IPython-kernels-for-other-languages

- [Jupyter-Nginx-Supervisor](http://www.albertauyeung.com/post/setup-jupyter-nginx-supervisor/)
- [Jupyter-Nginx Setup](https://aptro.github.io/server/architecture/2016/06/21/Jupyter-Notebook-Nginx-Setup.html)
