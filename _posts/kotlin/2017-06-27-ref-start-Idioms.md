---
title: Kotlin - Getting Started/Idioms
date: 2017-06-29 22:10:00 +0900
layout: post
tags: [kotlin, intellij]
categories: [Programming]
---

## Getting Started : Idioms

kotlinlang.org의 [Getting Started/Idioms](https://kotlinlang.org/docs/reference/idioms.html) 를 요약 번역한다.
- 아래 내용에서 **[링크:..]** 는 외부 링크이다.

코틀린에서 임의로 자주 사용하는 이디엄을 정리했다.

### Creating DTO’s (POJO’s/POCO’s)

POJO 등에서 getter, setter 클래스 멤버 메서드를 생성한다. 코틀린은 클래스 선언만으로 이것을 완성 할 수 있다.

`Customer` 클래스 

```kotlin
data class Customer(val name: String, val email: String)
```

Customer 클래스는 선언만으로 아래 기능을 제공한다:

- getters  : 모든 인자에 대해서 getter. *var*{:.keyword} 는 setters 포함
- equals() 
- hashCode()
- toString()
- copy()
- component1(), component2(), …, : 모든 인자에 대해 ( [링크 Data classes](http://kotlinlang.org/docs/reference/data-classes.html) 참조)

 
### 함수 매개변수에 대한 기본 값

함수 선언에서 자세히 보겠지만 아래 같이 함수 매개변수에서 인자의 기본값을 선언할 수 있습니다.

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```


### 리스트를 필터한다

리스트 자료구조는 직접 필터를 적용할 수 있습니다.

```kotlin
val positives = list.filter { x -> x > 0 }
```

Or alternatively, even shorter:

```kotlin
val positives = list.filter { it > 0 }
```


### 문자열 삽입 표현식

문자열에 동적 내용을 삽입하려면 *$var* 연산자를 사용한다.

```kotlin
println("Name $name")
```


참조: Idioms01.kt


### Instance Checks

is 연산자를 사용한 객체 판단 

```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```


### 맵과 리스트 쌍을 횡단하기 Traversing a map/list of pairs

*() in* 연산자를 사용해 맵의 요소를 접근한다

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```


### Using ranges

*..* 범위 표현식을 사용해서 컬렉션의 범위를 사용할 수 있다.

```kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```


### Read-only list

```kotlin
var names = listOf( "이순신", "홍길동", "강감찬", "박문수", "유성룡")
```

### Read-only map

```kotlin
var titles = mapOf( "이순신" to "장군", "홍길동" to "의적")
```

### Accessing a map

```kotlin
println(map["key"])
map["key"] = value

```


### Lazy property
*by lazy* 키워드

```kotlin
val p: String by lazy {
    // compute the string
}
```


### Extension Functions

클래스에 새로운 함수를 추가할 수 있다.

```kotlin
fun String.spaceToCamelCase() : String {
    var ret: String = "UPPER"
    return ret
}
// 다음 같이 즉시 사용할 수 있다.
"Convert this to camelcase".spaceToCamelCase()
```


### Creating a singleton

```kotlin
object Resource {
    val name = "Name"
}
```


### If not null shorthand

Null-safety 연산자 `?`를 사용해서 널이 아닌 변수는 "널이 아니라면" 연산을 짧게 표현할 수 있다. 다음은 files 객체가 널이 아니라면 size() 연산을 처리한다.

```kotlin
val files = File("Test").listFiles()
println(files?.size)
```


### If not null and else shorthand

엘비스 연산자를 사용해서 if else 조건식을 표현 할 수 있다. 아래는 files 객체가 널이 아니면 size() 함수를 호출하고 아니면 "empty" 값을 반환하는 표현식을 사용하고 있다.

```kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```


### Executing a statement if null

엘비스 연산자의 오른쪽은 표현식 구문을 가져올 수 있다. 아래는 'email' 속성이 널이면 throw 구문을 실행한다.

```kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

### Execute if not null

`?.` 연산자와 {} 구문 블록을 사용해서, 널이 아니라면 구문을 실행하게 한다.

```kotlin
val data = ...

data?.let {
    ... // execute this block if not null
}
```

### Return on when 구문

아래 함수는 Int 반환해야 하는데 when 연산자에서 throw 로 예외를 반환할 수 있다.

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```


### ‘try/catch’ 표현식

실행 구문을 실행하고 throw 발생시 아래 같이 잡을 수 있다.

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // Working with result
}
```


### ‘if’ 표현식

변수 값에 if else 구문의 결과를 반환하게 사용할 수 있다.

```kotlin
fun foo(param: Int) {
    val result = if (param == 1) {
        "one"
    } else if (param == 2) {
        "two"
    } else {
        "three"
    }
}
```


### Builder-style usage of methods that return Unit

빌더 패턴을 사용한 메서드

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```


### Single-expression functions

단순 반환 함수의 사용

```kotlin
fun theAnswer() = 42
```

이것은 아래와 같다

```kotlin
fun theAnswer(): Int {
    return 42
}
```

이것은 다른 구문과 결합해 when 구문을 사용해 표현식을 결합할 수 있다.
This can be effectively combined with other idioms, leading to shorter code. E.g. with the when-expression:

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

### Calling multiple methods on an object instance (‘with’)

with 구문을 사용한 메서드 호출

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { //draw a 100 pix square
    penDown()
    for(i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```


### Java 7’s try with resources

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```


### Convenient form for a generic function that requires the generic type information

```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json): T = this.fromJson(json, T::class.java)
```
