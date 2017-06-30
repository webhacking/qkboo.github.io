---
title: Kotlin - Android Developement 시작하기
date: 2017-06-28 20:00:00 +0900
layout: post
tags: [android, kotlin, intellij]
categories: [Kotlin]
---


**Android Developement를 위한 Kotlin**

 - Kotlin - Android Developement 시작하기
- [Kotlin - Android Extensions](/kotlin/2017/06/28/tutorial-android-extension.html)
  - [Kotlin Koans](/kotlin/2017/06/29/tutorial-koans.html)
 - [Working with Command line compiler](/kotlin/2017/06/28/tutorial-commandline-tools.html)

<br/>
<br/>


## 코틀린으로 안드로이드 개발 시작하기

kotlinlang.org의 [Getting Started with Android Developement](https://kotlinlang.org/docs/tutorials/kotlin-android.html) 를 참고하고 있다.

이 튜로리얼은 *Android Studio*에서 안드로이 앱을 간단한 코틀린 앱으로 작성하는 과정을 따라간다.

    Android Studio 는 이하 AS로 표기한다.

### Kotlin plugin 설치하기

AS는 kotlin을 지원하기 위해서 JetBrain plugin인 Kotlin plugin 설치가 필요하다.  현재 AS 버전은 `2.3.3` 이다. 향후 정식 버전이 될 Android Studio 3.0 버전은 2017/06 현재  프리뷰 버전이지만, *AS 3.0 버전 부터 Kotlin plugin*이 같이 제공하고 있다. 

`AS 2.3.3` 같이 이전 버전은 *Android studio*에서 Kotlin plugin을 설치해서 Kotlin을 사용한다. Preferences -> Pluin 에서 *Intall JetBrain pluin*에서 Kotlin을 찾아 설치한다.

![](/images/kotlin/as-kotlin-plugin.png){:width="600"}

AS 2.3.3과 AS 3.0을 동시에 설치해서 사용할 수 있다.[^1]


#### Android Project 시작하기

새로운 Android project를 시작한다. 시작 화면에서 *Start a new Android Studio project* 혹은 *File -> New Project* 메뉴로 새 프로젝트를 시작한다.

![](/images/kotlin/as-kotlin-new-prj1.png){:width="700"}

안드로이드 액티비티 템플릿에서 *Empty Activity* 를 선택하고, 액티비티 이름과 레이아웃 파일 이름을 입력한다.

![](/images/kotlin/as-kotlin-new-prj2.png){:width="700"}

**Java code to Kotlin** 

- AS 2.3.x 버전까지는 프로젝트를 만들면 Java 기반의 Activity 클래스가 생성된다.
- AS 3.0 버전 부터는 Kotlin으로 액티비티가 생성된다.

<br/>

#### 기존 Android Java를 Kotlin으로 변환

AS 2.x 버전을 사용하면 Java 코드를 Kotlin 코드로 변환해야 하고 크게 두가지 방법이 있다. 먼저 MainActivity.java 를 열고 *Java File to Kotlin* 액션 (단축키 **Cmd+Shift+A**)을 사용할 수 있다..[^2]

![Convert to Kotlin](https://kotlinlang.org/assets/images/tutorials/kotlin-android/convert-java-to-kotlin.png){:width="700"}

혹은 메뉴 *Code -> Convert Java file to Kotlin file* 을 실행할 수 있다. 실행하면 아래 같이 Java 기반의 액티비티 코드가 Kotlin 기반으로 변환된다.

![](/images/kotlin/as-kotlin-new-prj-java-kt.png){:width="700"}

<br/>

#### Configuring Kotlin in the project

코틀린 파일을 추가한 후에 AS는 프로젝트에서 사용 할 코틀린 런타임을 선택하도록 **Configure** 메뉴가 표시된다. 이것은 *Tools | Kotlin | Configure Kotlin in Project* 메뉴에서 실행할 수 있다.

![](https://kotlinlang.org/assets/images/tutorials/kotlin-android/kotlin-not-configured.png){:width="700"}

코틀린 버전을 선택한다.

![](https://kotlinlang.org/assets/images/tutorials/kotlin-android/configure-kotlin-in-project-details.png){:width="700"}

코틀린을 구성한 후에 *build.gradle* 파일에는 코틀린 플러그인이 포함되어 아래 같이 갱신된다. 

![](https://kotlinlang.org/assets/images/tutorials/kotlin-android/sync-project-with-gradle.png){:width="700"}

이제 마지막으로 프로젝트를 동기화해서 코틀린 플러그인을 사용하도록 'Sync Now'를 실행한다.


<br/>

#### 안드로이드에서 코틀린 앱 빌드와 배포

코틀린 코드로 안드로이드 앱을 빌드하는 것은 기존 AS에서 사용하던 동일한 절차와 방법을 사용한다. 

코틀린은 작은 크기를 가진 런터임을 가지고 있다: 라이브러리는 약 859KB (kotlin plugin 1.1.3 version) 이라서 작은 크기의 *.apk* 파일 크기를 생성할 수 있다.

이제 앱을 에뮬레이터 혹은 단말에서 실행해 보려면 Shift+F10 혹은 디버그 모드로 실행하려면 Shift+F9로 실행할 수 있다.


<br/>
<br/>


## 참조

[^1]: [Androdi Studio Preview 버전 설치](https://developer.android.com/studio/preview/install-preview.html)
[^2]: [Find Action](https://www.jetbrains.com/idea/help/navigating-to-action.html)