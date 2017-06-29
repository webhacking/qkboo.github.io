---
title: Kotlin - Start with IntelliJ IDEA
date: 2017-06-28 22:00:00 +0900
layout: post
tags: [android, kotlin, intellij]
categories:
- Kotlin
---


**Kotlin 이용 개발을 위한 Getting Started Korlin**

 - Start with IntelliJ
 - [Start with Eclipse](/kotlin/2017/06/29/tutorial-start-with-eclipse.html)
 - [Kotlin Koans](/kotlin/2017/06/29/tutorial-koans.html)
 - [Working with Command line compiler](/kotlin/2017/06/28/tutorial-commandline-tools.html)


## IntelliJ IDEA로 Kotlin 시작하기

kotlinlang.org의 [Getting Started](https://kotlinlang.org/docs/tutorials/getting-started.html) 를 참고하고 있다.
 - 문서 업데이트 날짜 : 2017/5/4


### 환경설정

IntelliJ IDEA 15 버전 이후부터 Kotlin을 탑재하고 있다.

> 이전 버전이 IntelliJ 혹은 Android Studio를 사용하고 있다면 설정 메뉴인 Preferences (OSX) 또는 Settings (Windows/Linux) > Plugins > Browse Repositories 에서 *kotlin*을 입력해서 Kotlin 플러그인을 찾아 설치한다.

##### 1. Install IntelliJ Community Edition

IntelliJ를 [Community Edition 링크](http://www.jetbrains.com/idea/download/index.html)에서 다운받아 설치한다.

> 2017/3/21 버전은 Java9, 8을 지원하고 Kotlin 1.1 을 java와 javascript vm에서 지원하고 있다.[^2]


##### 2. 새로운 프로젝트 화면에서 Java module과 SDK 을 선택하고, 체크박스 'Kotlink (java)' 를 선택 한다.

![](/images/kotlin/intellij-new-prj.png){: width="750"}


##### 3. 작업 디렉토리와 프로젝트 이름

![](/images/kotlin/intellij-new-prj-03.png){: width="600"}


##### 4. IntelliJ의 프로젝트는 아래 왼쪽 같은 폴더 구조를 가지고 있다. 여기서 Kotlin 프로젝트에 새 코틀린 소스 파일 **Kotlink File/class** 을 생성하고,  파일 이름을 *app* 으로 주면 `app.kt` 라는 코틀린 소스 파일이 생성된다.

![New Source](/images/kotlin/intellij-new-prj-new-source.png){:width="600"}

화면에 `Configure` 메시지 링크가 보이면 해당 프로젝트의 VM을 지정하지 않아서 그렇다. 그림 같이 java 혹은 javascript 모듈을 선택해 준다.

![Project configure](/images/kotlin/intellij-new-prj-java.png){:width="600"}


##### 5. 'app.kt' 파일에 메인 루틴을 아래 같이 입력한다. 이 메인 루틴이 코틀린 애플리케이션에서 시작점(Start point) 이다. 

IntelliJ 는 템플릿을 활용 할 수 있어어, 소스 코드에서 키워드 일부분을 입력하고 `^+space` 혹은 `tab`을 입력하면 자동완성 된다. 아래는 'main' 이라고 입력하고 `tab` 키를 누르면 자동 완성한 템플릿 코드가 입력된다.

![main template](/images/kotlin/intellij-new-prj-main.png){:width="600"}


IntelliJ 의 템플릿 기능을 활용해 자동완성과 참조 기능을 지원하는데, 예를 들어 *print* 입력한 후에 `print`로 시작하는 함수에 대한 사용을 확인해 볼 수 있다.

![Autocompletion](/images/kotlin/intellij-new-prj-println-template.png){:width="600"}

메인 루틴 내부에 `println('Hello, World!')` 구문은 문자열 'Hello World!'를 출력한다.

```kotlin
fun main(args: Array<String>) {
    println("Hello World!")
}
```


##### 6. 이제 애플리케이션을 실행해보자. 손쉬운 방법은 소스 코드 왼쪽 코틀린 아이콘을 클릭해서 Run 메뉴로 실행하거나 단축키 `Ctrl+Shift+R` 로 실행한다.

![Run project](/images/kotlin/intellij-new-prj-run.png){:width="600"}

실행된 결과는 화면 아래 Run tool 윈도우에 표시됩니다.


## 참조

[^2]: [IntelliJ What's new](https://www.jetbrains.com/idea/whatsnew/)

