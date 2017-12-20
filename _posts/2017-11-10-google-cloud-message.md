---
title: Google Cloud Message Service
date: 2017-11-10 09:00:00 +0900
layout: post
tags: [android, google cloud message]
categories: Android
---

4kb  정도의 데이터를 서버에서 대상 단말의 애플리케이션에 알려준다.


## Getting started
 - http://developer.android.com/guide/google/gcm/gs.html

GCM 에서 제공하는 서버-클라이언트 라이브러리를 어떻게 이용하는지에 대한 설명을 제공한다.

![](https://i.stack.imgur.com/TsFav.jpg){:width="640"}

[그림. GCM workflow [stackoverflow](https://stackoverflow.com/questions/38812375/how-android-gcm-works)]

(1) 모바일 등 장치가 Sender ID를 전송한다.
   - GCM 서버에 등록한다.
(2) 등록이 성공하면 등록 ID를 모바일 단말에 알려준다.

(3) 수신한 등록 ID를 서비스 서버에 알려준다.

(4) 서비스 측은 클라이언트 등록 ID를 저정하고, 등록ID에 GCM 메시지를 송신하려면 GCM 서버에 등록ID와 함께 요청한다.

GCM 서비스 활성화해서 사용하려면,

1) Google API console 페이지에서Services  선택
2) Google Cloud Messaging 을 ‘On’
3) 서비스 약관 동의


### Google API project 생성

1) [api console](https://code.google.com/apis/console
)에서 새로운 프로젝트를 생성한다.

https://code.google.com/apis/console

![](/images/google/gcm-api-start-01.png)



기존에 존재하는 프로젝트는 대시보드가 표시된다.

2) Create project 를 시작한다.

브라우져에서 다음과 비슷한 주소로 연결된다.

```
https://code.google.com/apis/console/#project:4815162342
```

 - url에서 #project 다음 숫자가 새로운 프로젝트의 아이디이다. 그리고 이 아이디를 GCM의 sender ID로 사용하게 된다.





#### API key 얻기

1) Google APIs 에서 API Library 를 선택한다.

![](/images/google/gcm-api-library-key01.png)

Google Cloud Messaging API 라이브러리를 찾는ㄷ

![](/images/google/gcm-api-libraries-gcm.png)

사용하도록 한다.


2) 사용자 인증정보

사용자 인증정보로 가서

![](/images/google/gcm-api-auth01.png){:width="640"}

 **사용자 인증 정보 만들기** 메뉴

![](/images/google/gcm-api-auth02.png){:width="640"}

API 키를 선택한다.

![](/images/google/gcm-api-auth03.png){:width="640"}

키 생성후 모바일 용인지 서버용인지 등의 키 제한이 필요하면 선택한다.

![](/images/google/gcm-api-auth04.png){:width="640"}

제한 사항을 선택한다.

![](/images/google/gcm-api-auth05.png){:width="640"}


### Node 에서

https://github.com/ToothlessGear/node-gcm

$ npm install node-gcm --save


```js
var gcm = require('node-gcm');

// Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
var sender = new gcm.Sender('YOUR_API_KEY_HERE');

// Prepare a message to be sent
var message = new gcm.Message({
    data: { key1: 'msg1' }
});

// Specify which registration IDs to deliver the message to
var regTokens = ['YOUR_REG_TOKEN_HERE'];

// Actually send the message
sender.send(message, { registrationTokens: regTokens }, function (err, response) {
  if (err) console.error(err);
  else console.log(response);
});
```


## 참조
 - http://blog.saltfactory.net/implementing-push-notification-service-for-android-using-google-play-service/
 - 