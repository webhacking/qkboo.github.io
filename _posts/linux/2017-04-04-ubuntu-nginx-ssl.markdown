---
title: Nginx - HTTPS and Certificate SSL
date: 2017-11-01 09:00:00 +0900
layout: post
tags: [linux, nginx, ssl, certificate ssl]
categories: 
- Linux
---

Nginx를 HTTPS를 사용할 수 있도록 사설 인증서와 그리고 공인 인증서를 이용해 SSL을 활성화 하는 과정을 정리했다.

Nginx 설치와 서버, 프락시 등의 사용 방법에 대해서는 [Nginx on Ubuntu/Debian]({% post_url linux/2017-04-03-ubuntu-nginx %}) 문서를 참조한다.

## TLS

TLS는 SSL의 새로운 이름이다. SSL(Secure Socket Layer)는 대칭키 혹은 공개키 방식의 인증을 이룬후 암호화된 통신이 가능하다. TLS에 대해서는 다음 블로그에 자세히 설명되어 있다.

 - [HTTPS, SSL 설명](https://opentutorials.org/course/228/4894)


### Nginx HTTPS

Nginx 에서 HTTPS를 상용하려면 인증기관을 통해 발급받은 SSL인증서가 필요하다. 여기서는 사용자 개인용 사설 인증서를 만들어 사용한다.

공인 서버 인증서에 대해서는 별도로 다룬다. [^2] 를 참조하면 사설 인증서와 공인 인증서에 대한 설명이 있다.


#### 사설 인증서 설정

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

설정 파일이 제대로 구성됐는지 테스트해본다.[^1]

```sh
sudo nginx -t
```


## Certified SSL

> 작업: macbook pro의 thinkbee@ ~/Documents/SslCert$

https://jetmirshatri.com/build-nginx-with-openssl-1-1-0-on-ubuntu-16-04/

### Lets' Encrypt

Lets' Encrypt는 HTTPS를 사용하기 위해 SSL을 구매해야 하는 부분이 HTTPS 보급에 방해된다고 생각해서 SSL을 무료로 제공해서 HTTPS를 보급하기 위해 작년 말에 만들어졌다. 초기에는 Mozilla, Cisco, Akamai, EFF, id entrust 등이 모여서 ISRG(Internet Security Research Group)라는 새로운 SSL 인증기관을 만들어서 올해 SSL을 무료로 제공하겠다고 발표했다. 지금은 이 Lets' Encrypt에 Facebook, 워드프레스를 만드는 Automattic, shopify 등 많은 회사가 스폰서로 참여하고 있다

https://www.nginx.com/blog/free-certificates-lets-encrypt-and-nginx/

#### Lets' Ecrypt 발급

Lets' Ecrypt는 Shell 기반의 발급 방법을 권장한다.

 웹을 통한 발급은 인증된 도메인 등록지에서 가능하다고 한다. 쉘 기반 발급을 위해서 ACME protocol client를 사용한다. 정식 클라이언트는 Certbot 을 사용한다.

Certbot을 설치할 수 없는 상황에서는 호환 클라이언트를 사용할 수 있다.



#### getssl


```
./getssl -c yourdomain.com
```



```
~/.getssl
~/.getssl/getssl.cfg
~/.getssl/yourdomain.com
~/.getssl/yourdomain.com/getssl.cfg
```


~/.getssl/getssl.cfg 를 필요시 수정한다.


~/.getssl/yourdomain.com/getssl.cfg 을 수정한다.



#### Recommended: Certbot

https://letsencrypt.org/docs/client-options/

여기서 getssl bash 스크립트를 사용해 본다.


openssl req -new -sha256 -key domain.key -subj "/" \
  -reqexts SAN -config <(cat /etc/ssl/openssl.cnf \
  <(printf "[SAN]\nsubjectAltName=DNS:thinkbee.kr,DNS:www.thinkbee.kr,DNS:blog.thinkbee.kr"))


#### Certbot-auto

https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04



https://www.nginx.com/blog/free-certificates-lets-encrypt-and-nginx/


## 참고

 - [TLS/SSL에 대해 알아보아요](http://btsweet.blogspot.kr/2014/06/tls-ssl.html)


[^2]: [SSL 인증서 종류](http://it79.egloos.com/1121724)

[^3]: [Enabling Https with Nginx](https://manual.seafile.com/deploy/https_with_nginx.html)
[^4]: [Create Self signed SSL](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04)
