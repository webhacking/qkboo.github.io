---
title: Kotlin - Start with Eclipse
date: 2017-06-29 10:00:00 +0900
layout: post
tags: [android, kotlin, intellij]
categories: [Kotlin]
---


**Kotlin 이용 개발을 위한 Getting Started Kotlin**

 - [Start with IntelliJ](/kotlin/2017/06/28/tutorial-start-with-intellij.html)
 - Start with Eclipse
 - [Kotlin Koans](/kotlin/2017/06/29/tutorial-koans.html)
 - [Working with Command line compiler](/kotlin/2017/06/28/tutorial-commandline-tools.html)

<br/>
<br/>


## Eclipse 로 시작하기

kotlinlang.org의 [Getting Started with Eclipse Neon](https://kotlinlang.org/docs/tutorials/getting-started-eclipse.html) 를 참고하고 있다.
 - 문서 업데이트 날짜 : 2016/11/10



### 환경설정

최신 Eclise Neon (이하 **이클립스**)를 [다운로드 링크](https://www.eclipse.org/downloads/)에서 *Eclipse IDE for Java Developer* 를 다운로드 한다.

이클립스 마켓플레이스에서 *Kotlin plugin*을 다운로드 한다. 마켓플레이스를 열기 위해 
(1) 아래 아이콘 링크를 이클립스 윈도우에 드래드-드롭하면 마켓플에이스 윈도우가 나타난다.

[![](http://marketplace.eclipse.org/sites/all/themes/solstice/public/images/marketplace/btn-install.png)](http://marketplace.eclipse.org/sites/all/themes/solstice/public/images/marketplace/btn-install.png){:witdh="130"}


(2) 혹은 Help -> Eclipse Marketplace 메뉴를 실행한다.

![](https://kotlinlang.org/assets/images/tutorials/getting-started-eclipse/marketplace.png)

코틀린 플러그인을 설치한 후에 이클립스를 재시작하고 퍼스펙티브를 코틀린 퍼스펙티브로 열고 사용하면 된다.
Kotlin perspective 메뉴: Window -> Open Perspective -> Other ... -> Kotlin


### 새 프로젝트 만들기

코틀린 플러그인과 퍼스펙티브가 코틀린으로 전환된 상태면 새로운 프로젝트 메뉴에 *Kotlin Proejct* 를 볼 수 있다. 메뉴 New -> Kotlin Project 로 빈 프로젝트를 생성하면 타겟이 JVM 인 프로젝트가 생성된다. 프로젝트 뷰는 Java 같지만 Kotlin 환경이 적용되어 있다.
왼쪽 그림 *src* 폴더에 코틀린 소스코드 파일이 위치한다. 오른쪽 그림 처럼 새로운 Kotlin file을 만든다. 파일 이름을 *hello* 로 주면 자동으로 *.kt* 확장자를 붙여준다.

![New Kotlin file](/images/kotlin/eclipse-new-prj-02.png){:width="600"}

'hello.kt' 파일에 메인 루틴을 아래 같이 입력한다. 이 메인 루틴이 코틀린 애플리케이션에서 시작점(Start point) 이다. 이클립스의 자동완성으로 소스 코드에서 키워드 일부분을 입력하면 템플릿 창에서 선택할 수 있다. 아래는 'main' 이라고 입력하고 `tab` 키를 누르면 자동 완성한 템플릿 코드가 입력된다.

![](https://kotlinlang.org/assets/images/tutorials/getting-started-eclipse/main.png){:width="600"}

혹은 나중에 키워드를 입력하고 `^+space` 입력하면 자동완성을 사용할 수 있다. 


메인 루틴 내부에 `println('Hello, World!')` 구문은 문자열 'Hello World!'를 출력한다.

```kotlin
fun main(args: Array<String>) {
    println("Hello World!")
}
```

#### 애플리케이션 실행하기

소스 파일에서 마우스 오른쪽 클릭으로 나오는 메뉴에서 *Run As -> Kotlin Application* 을 선택하면 실행할 수 있다. 실행한 결과는 Console view에 표시된다. 

![](https://kotlinlang.org/assets/images/tutorials/getting-started-eclipse/output.png)


