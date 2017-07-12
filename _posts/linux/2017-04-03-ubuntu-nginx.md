---
title: Nginx - Install, SSL, WebDAV, Proxy on Ubuntu/Debian
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

#### /etc/nginx/sites-available/my-site

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


사이트 활성화

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


##  SSL

Nginx SSL 제공을 해주자.
 - [HTTPS, SSL 설명](https://opentutorials.org/course/228/4894)

여기서는 사용자 개인용 사설 인증서를 만들어 사용한다.
공인 서버 인증서에 대해서는 별도로 다룬다. [^2] 를 참조하면 사설 인증서와 공인 인증서에 대한 설명이 있다.


#### SSL 설정

SSL Certificate 파일을 생성하고 저장해 둔다. [^4]

```bash
$ sudo mkdir /etc/nginx/ssl
$ cd /etc/nginx/ssl
```

OpenSSL을 사용해서 SSL Certificate를 생성한다.

```sh
$ sudo openssl genrsa -out privkey.pem 2048
$ sudo openssl req -new -x509 -key privkey.pem -out cacert.pem -days 1095
```


Generate DH params - 시간이 소요된다 (armv7 1Ghz 에서 30분 이상)

```sh
$ sudo openssl dhparam 2048 > /etc/nginx/ssl/dhparam.pem
```

{% comment %}

> $ sudo openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
> $ sudo openssl rsa -passin pass:x -in server.pass.key -out server.key
> $ sudo rm server.pass.key
> $ sudo openssl req -new -key server.key -out server.csr
> $ sudo openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

{% endcomment %}


#### Nginx 설정에 SSL 활성화

/etc/nginx/site-available/yoursite.com

```
# 80번 요청을 모두 443 SSL 서버로 바꾼다.
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    add_header Strict-Transport-Security max-age=2592000;
    rewrite ^/.*$ https://$host$request_uri? permanent;
}

# SSL을 이용한 444번 포트 사용 사이트 정의 
server {
    listen      443 default;
    server_name my-site.localhost;

    ssl on;
    ssl_certificate /etc/nginx/ssl/cacert.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    ssl_session_timeout 5m;
    ssl_session_cache shared:SSL:5m;
    # Diffie-Hellman parameter for DHE ciphersuites, recommended 2048 bits
    ssl_dhparam /etc/nginx/ssl/dhparam.pem;

    # secure settings (A+ at SSL Labs ssltest at time of writing)
    # see https://wiki.mozilla.org/Security/Server_Side_TLS#Nginx
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-
RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-
SHA256:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:DHE-RSA-AES256-GCM-S
HA384:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-CAMELLIA256-SHA:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-SHA
256:DHE-RSA-AES128-SHA:DHE-RSA-SEED-SHA:DHE-RSA-CAMELLIA128-SHA:HIGH:!aNULL:!eNULL:!LOW:!3DES:!MD5:!EXP:!PSK:!SRP:!
DSS';
    ssl_prefer_server_ciphers on;

    proxy_set_header X-Forwarded-For $remote_addr;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    proxy_buffers 16 64k;
    proxy_buffer_size 128k;

    server_tokens off;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    location / {
        try_files $uri $uri/ =404;
        client_max_body_size 0;
    }
}

```



## Nginx with Node.js

Nginx를 메인 웹 서버로 사용하고 여기에 연결되는 URL, Location에 따라 nginx 외부의 다른 서비스에서 처리하게 하는 방법을 proxy 를 연결하는 것이다. 즉, nginx에서 Node.js, Django, Tomcat 같은 웹 서비스의 통로로 사용한다.

### proxy

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

[^2]: [SSL 인증서 종류](http://it79.egloos.com/1121724)

[^3]: [Enabling Https with Nginx](https://manual.seafile.com/deploy/https_with_nginx.html)
[^4]: [Create Self signed SSL](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04)
[^5]: [Http Auth](https://www.digitalocean.com/community/tutorials/how-to-set-up-http-authentication-with-nginx-on-ubuntu-12-10)
[^6]: [서버 프로세스 관리에 대해](http://www.codeok.net/서버%20프로세스를%20관리하는%20올바른%20방법)
