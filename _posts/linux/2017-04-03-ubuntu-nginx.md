---
title: Nginx - Install, WebDAV, Proxy on Ubuntu/Debian
date: 2017-04-03 09:10:00 +0900
layout: post
tags: [linux, nginx, ssl, webdav]
categories: 
- Linux
---

`nginx`를 사용해서 일반 웹 서비스, SSL, WebDav 서비스와 다른 외부 웹 서비스와 연동하는 설정을 해보자.
 - 여기서 `node.js` 애플리케이션을 연동한다.

<br/>
## Nginx 설치와 구성

우분투/데비안 계열에서 `apt-get install` 명령으로 설치한다.

### Nginx 설치

```bash
$ sudo apt-get install nginx
```

우분투/데비안 계열은 `/etc/nginx` 밑에 nginx 설정 파일이 위치한다.

```
nginx/
├── conf.d/
├── htpasswd
├── nginx.conf
├── sites-available/
│   └── default
├── sites-enabled/
│   └── default -> /etc/nginx/sites-available/default
└── ssl/
```
 - htpasswd: apache-utils의 `htpasswd` 유틸리티로 생성한 Basic auth 계정 파일
 - ssl/ : SSL 인증서 파일
 - nginx.conf : nginx의 전역 설정 파일, 사이트 설정 및 가상 호스트 설정은 sites-available 에 선언.
 - sits-available: 웹 사이트 설정 파일
 - sites-enabled: 
 - 


### 새 사이트 정의

가장 좋은 방법은 기존 default 설정 파일을 복사해 수정한 후 사용한다.

```sh
$ cd /etc/nginx/
$ cp site-available/default cp site-available/my-site
```

#### my-site

가상 호스트 파일을 /etc/nginx/sites-available/ 폴더에 추가하고 site-enabled에 링크를 해주면 된다. 아래 내용으로 /etc/nginx/sites-available/my-site 파일을 다음 같이 추가해 준다.

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /home/qkboo/my-site;

    index index.html index.htm index.nginx-debian.html;

    server_name my-site.localhost;

    location / {
        try_files $uri $uri/ =404;
    }
}
```


사이트 활성화는 /etc/nginx/site-enabled 폴더에 소프트 링크를 걸어준ㄷ.

```sh
$ sudo ln -s /etc/nginx/sites-available/my-site /etc/nginx/sites-enabled/my-site 
$ sudo service nginx reload # 설정 다시 가져오기
```

Debian, Ubuntu 계열은 Ubuntu 15.x, Debian Wizzy 이후? 시스템 서비스를 `systemd` 로 다룬다. nginx도 systemd 스크립트로 관리할 수 있다. systemd 관련 내용 참조 - [^6]

```sh
$ sudo systemctl reload nginx.service
$ sudo systemctl status nginx.service
```


만약 설정 파일에 문제가 있으면 `systemctl status nginx.service` 결과에 어느 줄에서 문제가 있는지 확인할 수 있다.



### Nginx for Node.js

Nginx를 메인 웹 서버로 사용하고 여기에 연결되는 URL, Location에 따라 nginx 외부의 다른 서비스에서 처리하게 하는 방법을 proxy 를 연결하는 것이다. 즉, nginx에서 Node.js, Django, Tomcat 같은 웹 서비스의 통로로 사용한다.

http://www.albertauyeung.com/post/setup-jupyter-nginx-supervisor/

#### proxy

```
server {

    listen 80;
    server_name test.example.com;

    location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-NginX-Proxy true;

      proxy_pass http://127.0.0.1:52222/;
      proxy_redirect off;
    }

    log_not_found off;

    gzip on;
    gzip_comp_level 2;
    gzip_proxied any;
    gzip_min_length  1000;
    gzip_disable "MSIE [1-6]\.(?!.*SV1)";
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript text/x-js;
 }

```


설정 파일이 제대로 구성됐는지 테스트해본다. `sudo nginx -t` [^1]



<br/>
<br/>
## WebDAV

Nginx에서 WebDAV는 `nginx-extras` 패키지를 설치한다.

```sh
$ sudo apt-get install nginx nginx-extras
$ sudo mkdir /home/qkboo/WebDav
$ sudo chown www-data /home/qkboo/WebDav
```

혹은 chgrp로 그룹만 변경할 수 있다.

```sh
$ chgrp www-data /home/qkboo/WebDav
```


### Basic Auth

HTTP Auth 는 htpasswd 유틸리티로 사용자 이름과 아이디를 등록해서 사용한다. [^5]

```sh
$ sudo apt-get install apache2-utils
$ sudo htpasswd -c /etc/nginx/htpasswd exampleuser
```

### WebDav용 설정

위에서 사용한 my-site 설정에 다음 같이 WebDav 디렉토리 위치를 추가한다.

```
server {
    # SSL configuration

    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;

    ssl on;

    #... 생략

    # WebDav directory and URL
    location /myfiles {
        alias /home/qkboo/WebDav;
        #root /home/qkboo/;

        #client_body_temp_path /var/dav/temp;
        dav_methods     PUT DELETE MKCOL COPY MOVE;
        dav_ext_methods   PROPFIND OPTIONS;
        create_full_put_path  on;
        dav_access    user:rw group:rw all:rw;
        autoindex     on;

        # Basic auth
        auth_basic "restricted";
        auth_basic_user_file /etc/nginx/htpasswd;

        send_timeout  36000s;

        proxy_connect_timeout  36000s;
        proxy_read_timeout  36000s;
        proxy_send_timeout  36000s;
        # large file uploads
        proxy_request_buffering off;
    }
}

```



## more configures

http://nginx.org/en/docs/http 에 있는 세부 설정중 사용한 것.

### Upload size

POST로 multi-part 업로드시에 다음 에러가 보이면 nginx의 기본 업로드 크기를 2M 이하로 설정되어 그렇다.

```
[error] 31354#0: *10899 client intended to send too large body: 1198151 bytes, client: <IP address>, server: example.com, request: “POST /wp-admin/async-upload.php HTTP/1.1”, host: “example.com”, referrer: “http://example.com/wp-admin/post.php?post=<post id>&action=edit”
```

`client_max_body_size` 속성을 server, location 에 설정해 준다:

```
client_max_body_size 20M;
```


### limit_rate

[limit_rate](http://nginx.org/en/docs/http/ngx_http_core_module.html#limit_rate), limit_rate_after 는 함께 사용

```
location /flv/ {
    flv;
    limit_rate_after 500k;
    limit_rate       50k;
}
```


<br/>
<br/>
## 참조

[^1]: [nginx command](https://www.nginx.com/resources/wiki/start/topics/tutorials/commandline/)
[^5]: [Http Auth](https://www.digitalocean.com/community/tutorials/how-to-set-up-http-authentication-with-nginx-on-ubuntu-12-10)
[^6]: [서버 프로세스 관리에 대해](http://www.codeok.net/서버%20프로세스를%20관리하는%20올바른%20방법)
