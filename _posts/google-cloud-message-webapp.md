---
title: webapp push message
date: 2017-11-10 09:00:00 +0900
layout: post
tags: [android, google cloud message]
categories: Android
---



## Getting started

- https://developers.google.com/web/fundamentals/codelabs/push-notifications/?hl=ko

샘플을 다운로드 한다.

```sh
git clone https://github.com/GoogleChrome/push-notifications.git
```

### 웹 서버 설치 및 인증


다운로드한 위치 `push-notifications/app` 폴더를 웹서버에서 연결한다. 

express에서 사용할 예정이라 정적 폴더로 다음 같이 설정했다.

```
app.use('/pushmanager', express.static(path.join(__dirname, 'push-notifications/app')))
```

이제 브라우저 - Chrome 에서 http://localhost:3000/pushmanager 같이 접근이 가능하다.


#### 서비스 워커 갱신

개발 중에 서비스 워커가 항상 최신 버전이고 최신 변경 사항이 적용된 상태인지 확인하는 것이 유용합니다.

크롬 DevTools(마우스 오른쪽 버튼 클릭 > Inspect)를 열고 Application 패널로 이동하고 Service Workers 탭을 클릭한 후 Update on Reload 확인란을 선택하세요. 

![](/images/google/pushserver-01.png){:width="640"}


#### 서비스 워커 등록

app 디렉토리에는 `sw.js`로 명명된 빈 파일이 있습니다. 이 파일이 자신의 서비스 워커이며 지금은 빈 상태로 있을 수 있습니다. 이후에 코드를 추가해나갈 것입니다.

먼저 이 파일을 서비스 워커로 등록해야 합니다.

app/index.html 페이지에서 scripts/main.js를 로드하는데, 서비스 워커를 등록할 이 자바스크립트 파일에 들어 있습니다.

다음 코드를 scripts/main.js에 추가하세요.

```js
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
```

이 코드는 현재 브라우저에서 서비스 워커와 푸시 메시지를 지원하는지 확인하며, 지원한다면 sw.js 파일을 등록합니다.

그리고 브라우저 Dev tools에서 콘솔에 Registered 로 표시되는지 확인한다.

![](/images/google/pushserver-02.png){:width="640"}

#### Server Public Key

https://web-push-codelab.glitch.me/ 에서 연습용 공개키, 비공개키를 생성한다. 공개키를 아래 필드에 입력한다.

```
const applicationServerPublicKey = '<Your Public Key>';
```

> 참고: 절대로 비공개 키를 웹 앱에 두면 안 됩니다!


#### 상태 초기화


scripts/main.js에서 두 개의 함수

 - initialiseUI라는 함수로서 사용자가 현재 구독한 상태인지 확인하고, 
 - updateBtn이라는 함수로서 사용자가 구독한 상태인지 여부에 따라 버튼을 활성화하고 텍스트를 변경합니다

```js
function initialiseUI() {
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}
```

이 메서드로 사용자가 이미 구독한 상태인지 확인하고 몇 가지 상태를 설정하고 updateBtn()을 호출하여 도움말 역할을 하는 텍스트와 함께 버튼을 활성화할 수 있습니다.

updateBtn() 함수를 구현하세요.

```js
function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}
```

서비스 워커가 등록될 때 initialiseUI()를 호출하는 것입니다.

```js
navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initialiseUI();
})
```


웹 앱을 열면 ‘Enable Push Messaging' 버튼이 활성화되어 있을 것이며


#### 사용자 구독

다음과 같이 initialiseUI() 함수에서 버튼에 클릭 리스너를 추가하세요.

```js
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });

```



사용자가 현재 구독하지 않은 상태

```js
function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed:', subscription);

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}
```

subscribe()를 호출하면 다음 단계 후 확인될 프라미스가 반환됩니다.

사용자가 알림을 표시할 권한을 허용했습니다.
브라우저가 PushSubscription 생성을 위한 세부 정보를 얻기 위해 푸시 서비스로 네트워크 요청을 보냈습니다.


메서드 updateSubscriptionOnServer는 실제 애플리케이션에서 백엔드로 구독을 보내는 메서드

```js
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}
```

이제 브라우저에서 실행하면 권한 프롬프트를 보여준다.

![](https://developers.google.com/web/fundamentals/codelabs/push-notifications/img/227cea0abe03a5b4.png?hl=ko)



