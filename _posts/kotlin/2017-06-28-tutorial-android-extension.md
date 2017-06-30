---
title: Kotlin - Android Extensions
date: 2017-06-28 21:00:00 +0900
layout: post
tags: [android, kotlin, intellij]
categories: [Kotlin]
---


**Android Developement를 위한 Kotlin**

 - [Kotlin - Android Developement 시작하기](/kotlin/2017/06/28/tutorial-start-android.html)
 - Kotlin - Android Extensions
 - [Kotlin Koans](/kotlin/2017/06/29/tutorial-koans.html)
 - [Working with Command line compiler](/kotlin/2017/06/28/tutorial-commandline-tools.html)

<br/>
<br/>


## Kotlin Android Extensions

kotlinlang.org의 [Kotlin Android Extensions](https://kotlinlang.org/docs/tutorials/android-plugin.html) 를 참고하고 있다.

단계별로 코틀린 플러그인에서 안드로이드 확장을 안드로이드 개발에 적용하는 과정을 설명하고 있다.


### Background

대부분 안드로이드 개발자는 **findViewById()** 메소드를 안다. 이곳은 잠재적인 버그와 지저분한 코드로 구성되어 읽기와 지원하기 어려운 점은 의심의 여지가 없다. 몇몇 라이브러리가 어노테이션을 이용해 **View**를 위해 런타임중에 솔루션을 제공하기도 한다.

코틀린 안드로이드 확장 플러그인은 별도의 코드 혹은 새로운 런타임을 추가히지 않고도 이와 같은 경험을 얻도록 해준다. 

안드로이드를 위한 코틀린 플러그인은 아래와 같은 코드가 된다:

```kotlin
// Using R.layout.activity_main from the main source set
import kotlinx.android.synthetic.main.activity_main.*

public class MyActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        textView.setText("Hello, world!") // Instead of findView(R.id.textView) as TextView
    }
}
```

감각적으로 *textView* 는 Activity에 대한 확장 자산으로 *activity_main.xml* 에 선언된 아이디 이다.

<br/>

### 코틀린 안드로이드 확장 사용하기

#### 의존성을 구성

여기서는 그래들을 IntelliJ나 Maven에서와 같은 구조로 사용한다. 코틀린에서 그래들을 설정하는 것은 [그래들 사용](https://kotlinlang.org/docs/reference/using-gradle.html)을 참조할 수 있다.

안드로이드 확장은 코틀린 플러그인의 부분으로 추가적인 플러그인을 설치할 필요는 없지만, *Android Extension Gradle plugin* 을 활성화 하려면 프로젝트 **build.gradle** 파일에 다음 같이 활성화 해준다.

```json
apply plugin: 'kotlin-android-extensions'
```

<br/>

#### 합성 속성 들여오기

아래는 특정 레이아웃에서 모든 위젯 속성을 들여오는 일반적인 방법이다.

```kotlin
import kotlinx.android.synthetic.main.<layout>.*
```

예를 들어 레이아웃 파일 이름이 *activity_mian.xml* 이라면 이렇게 들여온다.

```kotlin
import kotlinx.android.synthetic.main.activity_main.*
```

만약 View (어뎁터 클래스에서 유용한) 에서 속성을 호출하려면 아래 같이 들여온다.

```kotlin
kotlinx.android.synthetic.main.activity_main.view.*.
```

이렇게 합성한 속성을 코드로 들여온 후에, 예를 들어 이 레이아웃 XML 파일 안의 뷰 이름 속성을 코드에서 부를 수 있는 것이다. 예를 들어 아래 같은 속성이 있다면,

```xml
<TextView
    android:id="@+id/hello"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:text="Hello World, MyActivity"
/>
```

위 XML 레이아웃 TextView 속성 아이디를 코틀린에서 *hello* 으로 접근할 수 있다.

```kotlin
activity.hello.setText("Hi!")
```

<br/>

#### Android Flavors

안드로이드 확장 플러그인은 Android Flavors 를 지원한다. 예를 들어 **build.gradle** 의 flavor 이름 **free** 가 있다면,

```gradle
android {
    productFlavors {
        free {
            versionName "1.0-free"
        }
    }
}
```

이제 Flavor 바탕으로 fee 밑의 **free/res/layout/activity_free.xml** 레이아웃을 다음 import 로 들여 올 수 있다.

```
import kotlinx.android.synthetic.free.activity_free.*
```

<br/>

#### 핵심

코틀린 안드로이드 확장은 코틀린 컴파일러를 위한 플러그인이고 다음 두 가지 일을 한다:

  1. 숨겨진 캐싱 함수와 필드를 각 코틀린 액티비티 내부에 추가한다. 이 메소드는 아주 작아서 APK 크기를 증가시키지 않는다.
  2. 각 합성 속성 호출을 함수 호출로 교체한다.

이 합성 속성을 호출 할 때 이것이 동작하는 곳은 코틀린 Acitivity/Fragment 클래스인데 캐싱 함수가 호출되는 모듈 소스 안이다. 예를 들어:

```kotlin
class MyActivity: Activity()
fun MyActivity.a() { 
    this.textView.setText(“”) 
}
```

숨겨진 캐싱 함수는 MyActivity 안에 생성되므로 우리는 은닉 메커니즘을 사용 할 수 있다.

그러나 아래 경우는 액티비티 인지 일반 자바인지 알 수 없어서 캐싱 함수를 사용하지 않는다:

```kotlin
fun Activity.b() { 
    this.textView.setText(“”)     
}
```

