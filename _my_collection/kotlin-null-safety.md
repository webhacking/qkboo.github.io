---
title: Kotlin - Ref/Null Safety
date: 2017-06-30 09:00:00 +0900
layout: post
tags: [kotlin, intellij]
categories: [Kotlin]
published: true
---

## Nullable types and Non-Null Types

코틀린의 데이터 형 시스템은 코드에서 null 참조의 위험을 제거하는데 촛점을 맞추고 있다 - 널 참조의 위험은 [The Billion Dollar Mistake](http://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions)로 알려져 있다.
Kotlin's type system is aimed at eliminating the danger of null references from code, also known as the [The Billion Dollar Mistake](http://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions).

멤버를 접근시 널 참조는 자바를 포함한 많은 프로그래밍 언어의 공통적인 위험 요소중 하나로 널 참조 예외를 발생시킨다. 자바에서 `NullPointerException` or 짧게 'NPE` 라고 알려져 있다.

코틀린은 'NullPointException'을 제거 시키는데 초점을 두고 NPE가 발생할 요소는 다음 같다:

* 명시적으로 `throw NullPointerException()`을 호출하는 경우
* 아래 설명한 `!!` 연산자를 사용하는 경우
* 외부 자바코드에서 발생한 경우
* 초기화로 간주했지만 어떤 데이터의 불일치 상황 ( 초기화 안한 *this* 가 생성자의 어딘가 존재하는 상황)

코틀린 형 시스템은 *null* ( 널인 참조) 와 null 이지 않는 것들에서 참조 구분할 수 있다.

예를 들어 `String` 형의 정식 변수는 *null*을 담을 수 없습니다:

``` kotlin
var a: String = "abc"
a = null // compilation error
```

null을 허용하려면 널인 스트링 변수로 `String?` 로 작성해야 합니다:

``` kotlin
var b: String? = "abc"
b = null // ok
```

이제 메서드 호출 혹은 널이 아닌 `a` 라는 속성에 접근시 NPE를 발생하지 않을 것임을 보장하므로 아래 같이 작성할 수 있습니다:

``` kotlin
val l = a.length
```

그러나 널일 수 있는 `b`를 접근할 때 안전하지 않아서 컴파일러는 에러를 발생합니다:

``` kotlin
val l = b.length // error: variable 'b' can be null
```

But we still need to access that property, right? There are a few ways of doing that.


## 조건식에서 *null* 점검

첫째 조건식으로  명확하게 `b`가 *null* 인지 점검하고, 두가지 경우를 다룰 수 있습니다:

``` kotlin
val l = if (b != null) b.length else -1
```

컴파일러는 제시한 정보를 추적해서 *if* 내부에서 `length` 를 호출할 수 있도록 허용해 줍니다.
더 복합적인 것도 가능한데:

``` kotlin
if (b != null && b.length > 0)
  print("String of length ${b.length}")
else
  print("Empty string")
```

> 이것은 `b`가 불변수랏 가능하다 (예. 지역변수 혹은 멤버 *var*는 점검과 사용하는 사이에 수정되지 않아야 한다. 또한 재정의할 수 없어야 한다.) 

> Note that this only works where `b` is immutable (i.e. a local variable which is not modified between the check and the
usage or a member *val*{: .keyword } which has a backing field and is not overridable), because otherwise it might
happen that `b` changes to *null*{: .keyword } after the check.


## Safe Calls

두번째 선택할 수 있는 것은 안전호출연산자인 `?.`를 사용한다. 예를 들어 앞서 선언한 `b` 변수는 :

``` kotlin
b?.length
```

이것은 `b`가 널이 아니면 `b.length` 를 그리고 널이면 *null*을 반환한다. 이 형식의 형은 `Int?`이다.
This returns `b.length` if `b` is not null, and *null*{: .keyword } otherwise. The type of this expression is `Int?`.

안전호출연산자는 체인에서 유용한데, 예를 들어 Deaprtment 에 소속된 Bob 은 Employee 로 소속되어 있을 때 이 Department의 부서장을 다른 Employee가 맞고 있고 이 부서장의 이름을 얻으려고 할 때 다음 같이 쓸 수 있습니다:
Safe calls are useful in chains. For example, if Bob, an Employee, may be assigned to a Department (or not),
that in turn may have another Employee as a department head, then to obtain the name of Bob's department head, if any), we write the following:

``` kotlin
bob?.department?.head?.name
```

위와 같은 체인에서 어떤 속성이라도 null이면 *null*을 반환할 것입니다.

## Elvis Operator

널일 수 있는 `b` 변수가 있고, `b` 값이 널이 아니면 사용하고, 만약 널이면 널이 아닌 값 `x` 를 사용하려는 경우에 다음 같이 if 조건식을 사용 할 수 있다.

``` kotlin
val l: Int = if (b != null) b.length else -1
```

위와 같은 if 조선식 혹은 삼항연산자를 엘비스 연산자 `?:` 를 사용해서 다음 같이 쓸 수 있다:

``` kotlin
val l = b?.length ?: -1
```

`?:` 연산자 왼쪽이 널이 아니면 왼쪽 값을 반환하고 반대라면 오른쪽 값을 반환한다. 오른쪽의 표현식은 왼쪽이 널일 경우에만 해석이된다.

> 엘비스 연산자 `?:`는 엘비스 프레슬리의 머리 모습 같다는 의미로 엘비스 연산자라고 한다.


> Note that, 코틀린에서 *throw* 와 *return* 은 표현식이기 때문에 엘비스 연산자에서는 오른쪽에만 사용할 수 있다. 예를 들어 함수의 매개변수를 점검하는 구문을 작성한다면 아래 같이 아주 단순해 진다:

``` kotlin
fun foo(node: Node): String? {
  val parent = node.getParent() ?: return null
  val name = node.getName() ?: throw IllegalArgumentException("name expected")
  // ...
}
```

##  `!!` 연산자

NPE를 위한 세번째 선택지는 `!!` 연산자로 변수의 널이 아닌 값을 반환합니다. 예를 들어 `b!!` 로 쓰면 `b`의 널이 아닌 값을 반환해 줍니다.
아래 코드에서 `String` 형인 b에서 `b` 가 null이면 NPE를 발생하거나 `b` 값을 반환합니다. 

``` kotlin
var b: String? = "abc"
val l = b!!.length()
```

그래서 NPE를 원하면 사용하도록 합니다. 
Thus, if you want an NPE, you can have it, but you have to ask for it explicitly, and it does not appear out of the blue.

## Safe Casts

형 캐스팅에서 대상의 형이 다르면 `ClassCastException` 을 발생합니다. 다른 선택사항으로 성공하지 못했다는 의미로 *null*을 반환할 수 있습니다.

``` kotlin
val aInt: Int? = a as? Int
```




## 참조
 - [Null-safety 참조](https://kotlinlang.org/docs/reference/null-safety.html)
