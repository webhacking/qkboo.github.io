---
title: Kotlin - Ref/기본문법
date: 2017-06-29 22:00:00 +0900
layout: post
tags: [kotlin, intellij]
categories: [Kotlin]
---

## Getting Started : 기본 문법의 사용

kotlinlang.org의 [Kotlin Android Extensions](https://kotlinlang.org/docs/reference/basic-syntax.html) 를 참고하고 있다.

 - [AAAA]({{ site.baseurl }}{% post_url /kotlin/2017-06-28-tutorial-android-extension %})

### 패키지 선언

소스 파일의 꼭대기에 **package** 키워드를 사용해서 패키지를 명시합니다:

{% highlight kotlin %}

package my.demo

import java.util.*

// ...
{% endhighlight %}

소스 파일이 위치한 디렉토리와 패키지 이름이 일치하지 않아도 된다.

[패키지 설명 참조](https://kotlinlang.org/docs/reference/packages.html)

<br/>

### 함수 정의

함수는 **fun** 키워드로 선언한다

> fun name(var:Type,,,)[:Return Type] { 
> 
> }

코드의 시작점으로 *main* 함수를 사용한다.

```kotlin
fun main(args: Array<String>) {}
```

다음 함수는 두개의 *Int* 매개변수를 가지고 반환 형식으로 *Int*를 선언하고 있다:

```
fun sum(a: Int, b: Int): Int {
  return a + b
}
```

함수는 Expression body로 반환시 반환 형식을 추정한다. `sum()` 함수를 표현식을 사용해 선언할 수 있다:

{% highlight kotlin %}

fun sum(a: Int, b: Int) = a + b

{% endhighlight %}

함수는 의미있는 값을 반환하지 않을 수 있다:

{% highlight kotlin %}

fun printSum(a: Int, b: Int): Unit {
  print(a + b)
  println("$a + $b = ${a + b}")
}

{% endhighlight %}

Unit 반환 형식은 아래 같이 반환형을 제외한 형태를 표현한 것이다:

{% highlight kotlin %}
fun printSum(a: Int, b: Int) {
  println("$a + $b = ${a + b}")
}
{% endhighlight %}


[Kotlin functions]({{ site.baseurl }}{% link _my_collection/kotlin-functions.md %})



### 지역변수

한 번 대입하는 지역 변수들, 다음 같이 초기화 한다.

{% highlight kotlin %}
fun main(args: Array<String>) {
  var a: Int = 1      // 변수 a의 선언과 초기화
  var b = 1           // 'Int' 형식으로 참조
  var c: Int          // 변수 초기화 (초기값 지정)이 안되면 데이터 형식이 필요하다
  c = 1               // 명확한 대입

  println("a = $a, b = $b, c = $c")
}
{% endhighlight %}

Mutable 변수

```kotlin
fun main(args: Array<String>) {
  var x = 5  // Int 형으로 추정
  x += 1
}
```

[속성과 필드 보기](https://kotlinlang.org/docs/reference/properties.html)


#### 주석 Comments

또한 함수 혹은 코드 내에서 단어, 줄을 주석 처리 할 수 있다. 주석은 줄 혹은 묶음으로 처리하는데 Java, C 등과 같이 *//*로 한 줄 주석 그리고 */* */*로 묶음 범위에 대해 주석을 처리할 수 있습니다.

```kotlin
// 한 줄 주석

/*
 * 여러줄에 걸쳐 주석으로 묶을 수 있습니다.
 *
 */
```

자바와 코틀린은 달리 블럭 주석은 중첩할 수 있다:

[코트린 코드 문서화](https://kotlinlang.org/docs/reference/kotlin-doc.html) 참조


> 소스 kr.kotlin.ref.start.Basic01.kt



#### 문자열 템플릿 사용

문자열은 문자열 템플릿 표현식을 사용 할 수 있다. 문자열 템플릿을 사용해서 문장과 변수를 템플릿 같이 상요할 수 있습니다.

```kotlin
fun main(args: Array<String>) {
  if (args.size == 0) return

  print("First argument: ${args[0]}")
}
```


[스트림 템플릿](https://kotlinlang.org/docs/reference/basic-types.html#string-templates) 참조

> 소스파일: ref.start/Basic02_Var.kt



#### 조건 표현식 사용하기

조건 판단을 위해서 **if** 키워드를 사용하는데 다음 같이 **()** 안에 논리식을 이용해서 조건 판단을 합니다.

```kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```

위의 코드는 조건 판단을 위해서 **if express** 표현식을 사용해서 Expression body에 적용할 수 있습니다. 위 함수는 아래 같은 표현식으로 사용될 수 있습니다:

```kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```


> [if-expression 참조](https://kotlinlang.org/docs/reference/control-flow.html#if-expression)


### 널일 수 있는 값과 *null* 점검

변수 참조시 null 값일 가능성이 있으면 널 일 수 있음을 명시해야 합니다. 
예를 들어 parseInf()라는 함수를 선언시 반환 형식에 다음 같이 **Int?** 안전호출 연산자를 반환식에 사용하면 값이 Null이 아니면 값을, 만약 Null이라면 Null을 반환해 줍니다. 

```kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

널인 값을 반환하는 함수로 매개변수가 2개 미만인 경우 널인 값을 반환하게 된다.

```kotlin
fun main(args: Array<String>) {
    if(args.size < 2) {
        print("2개의 인자가 필요합니다")
        return
    }

    var x = parseInteger(args[0])
    var y = parseInteger(args[1])

    if( x != null && y != null) {
        print("${x} x ${y} = ${x*y}")
    }
}

fun parseInteger(s: String): Int? {
    return s.toInt()
}
```

IntelliJ 에서 프로그램 매개변수를 지정하려면 먼저 Ctrl+Shft+R 로 실행구성을 하나 생성한 후에 Edit configuration으로 명령 파라 미터를 다음 같이 추가한 후에 다시 실행합니다.

![](images/kotlin/intellij-kotlin-run-conf2.png) ![](images/kotlin/intellij-kotlin-run-conf1.png)

[그림. ]

또한 null 체크는 **==** 동등비교 연산자를 사용해서 다음 같이 사용할 수 있습니다:

```kotlin
  if (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }
```


> 소스파일: ref.start/Basic03_Null.kt 

그렇지만 Null-safety로 안전한 코드를 작성하게 제공하기 위해서 **?.** 라는 Null-safety 키워드를 사용할 수 있습니다. 

> [Null-safety 참조](ref-null-safety.md)
> [Null-safety](https://kotlinlang.org/docs/reference/null-safety.html)


### 형 점검과 자동 형 캐스트

**is** 연산자는 변수가 데이터 형에 맞는 인스턴스인지 점검합니다. 만약 불변 로컬 변수 혹은 속성이 특정 형식에 대해 점검되면 명시적으로 캐스트할 필요가 없다.

```kotlin
fun getStringLength(obj: Any): Int? {
  // 여기서 `obj`는 자동으로 `String`에 캐스팅된다.
  if (obj is String) {
    return obj.length
  }
  // 형 체크 범위 밖에서는 'obj'는 'Any'형으로 판단된다.
  return null
}
```

Any 형 객체가 스트링 관련 처리 요청시 역시 스트링으로 캐스팅된다. 다음 같이 obj.lengh 스트링 문자열 크기를 요청하면 스트링 캐스팅 된다.

```kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // 여기서 `obj`는 자동으로 `String`에 캐스팅된다
  return obj.length
}
```

비슷하게 다음 조건식 *if* 절에서 `obj`는 오른쪽 `&&` 뒤에서 자동으로 스트링 캐스팅됩니다.

```kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```

[클래스](https://kotlinlang.org/docs/reference/classes.html)와 형 [캐스트](https://kotlinlang.org/docs/reference/typecasts.html) 참조


### 범위값 사용하기

**in** 연산자를 사용해서 주어진 범위 사이의 숫자를 점검할 수 있다.

```kotlin
if (x in 1..y-1)
  print("OK")
```

**!** 연산자와 함께 사용해서 범위를 벗어나는지 점검한다:

```kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```


참조: [Ranges](https://kotlinlang.org/docs/reference/ranges.html) 


### for 반복문 사용

for 반복문은 컬렉션의 **in** 연산자를 사용해서 for 연산식을 사용한다.

```kotlin
for (x in 1..5)
  print(x)
```

for와  in 연산자를 컬렉션 요소를 직접 사용한다

```kotlin
fun main(args: Array<String>) {
  for (arg in args)
    print(arg)
}
```

혹은 컬렉션 인덱스를 사용해서 요소에 접근할 수 있다.

```kotlin
for (i in args.indices)
  print(args[i])
```


참조: [for loop](https://kotlinlang.org/docs/reference/control-flow.html#for-loops) 


### while 반복문 사용

```kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size)
    print(args[i++])
}
```

[while loop](https://kotlinlang.org/docs/reference/control-flow.html#while-loops) 참조



### when 표현식

**when ()** 안에 주어진 인스턴스의 식에 따라 분기 한다. 값에 따른 분기 판단은 *->* 연산자를 사용하고 값의 형식은 자동 연산된다.

```kotlin
fun cases(obj: Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
```

참조 [when 표현](https://kotlinlang.org/docs/reference/control-flow.html#when-expression)


#### 샘플 코드
> 소스코드: Basic04_ForWhen.kt

```kotlin
fun main(args: Array<String>) {
    for( i in 1..5) {
        when (i) {
            1 -> cases(1)
            2 -> cases("Hello")
            3 -> cases(100000000L)
            4 -> cases(args)
        }
    }
}

fun cases(obj: Any) {
    when (obj) {
        1 -> println("One")
        "Hello" -> println("Greeting")
        is Long -> println("Long")
        !is String -> println("Not a string")
        else -> println("Unknown")
    }
}
```





### 컬렉션 사용

컬렉션 데이터 위에서 되풀이 할 수 있습니다.

```kotlin
fun main(args: Array<String>) {
    var names = listOf( "이순신", "홍길동", "강감찬", "박문수", "유성룡")
 
    for( name in names) {
        println(name)
    }
}
```

Checking if a collection contains an object using in operator:
한 컬렉션을 **in** 연산자로 객체를 사용하는지 점검할 수 있다.

```kotlin
if( "박문수" in names) {
    println("어사 박문수가 있습니다")
}
```


람다 표현식을 사용해서 필터하고 컬렉션을 사상할 수 있다

```kotlin
names
    .filter { it.startsWith("A") }
    .sortedBy { it }
    .map { it.toUpperCase() }
    .forEach { print(it) }

```

참조: [고수준 함수와 람다](https://kotlinlang.org/docs/reference/lambdas.html)


