---
title: Kotlin - Ref/Properties and Fields
date: 2017-06-30 09:00:00 +0900
layout: post
tags: [kotlin, intellij]
categories: [Kotlin]
published: true
---

kotlinlang.org의 [Reference | Properties and Fields](https://kotlinlang.org/docs/reference/properties.html) 를 한글로 번역한 것이다.
 - 2017/7/1, 고강태.

## Declaring Properties

코틀린에서 클래스는 속성을 가질수 있다. 속성은 *var*{: .keyword } 키워드를 사용해 가변형으로 선언하거나 읽기 전용 불변형 *val*{:.keyword} 키워드로 선언할 수 있다.


``` kotlin
class Address {
    var name: String = ...
    var street: String = ...
    var city: String = ...
    var state: String? = ...
    var zip: String = ...
}
```

속성을 사용하려면 접근자 `.`로 속성 이름을 참조하면 된다 - 자바에서 필드라고 했다:

``` kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // 코틀린에서 'new' 키워드는 없다
    result.name = address.name // 접근자로 속성이 호출된다
    result.street = address.street
    // ...
    return result
}
```

<br/>
## Getters and Setters

속성(Property)를 선언하는 문법은 

``` kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

initializer, getter, setter는 선택적이다. 속성 형식도 initializer로 참조되면 선택사항 일 수 있다. (또는 아래처럼 getter의 반환 형식에서)

Examples:

``` kotlin
var allByDefault: Int? // error: explicit initializer required, default getter and setter implied
var initialized = 1 // has type Int, default getter and setter
```

읽기전용 속성 선언은 가변형과 두 가지 방법에서 다르다: `val` 로 선언하고 setter를 허용하지 않는다:

The full syntax of a read-only property declaration differs from a mutable one in two ways: it starts with `val` instead of `var` and does not allow a setter:

``` kotlin
val simple: Int? // has type Int, default getter, must be initialized in constructor
val inferredType = 1 // has type Int and a default getter
```

일반 함수에서 내부 속성 선언같이 사용자 정의 접근자를 쓸 수 있는데 getter 이다:

We can write custom accessors, very much like ordinary functions, right inside a property declaration. Here's an example of a custom getter:

``` kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

사용자 정의 setter는 아래 같다:

``` kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 문자열을 해체하고 다른 속성에 대입한다
    }
```

일반적으로 setter 매개변수 이름은 `value` 이지만 다른 이름을 사용해도 된다.
By convention, the name of the setter parameter is `value`, but you can choose a different name if you prefer.

Kotlin 1.1 이후로 속성의 형식을 getter로 부터 추정할 수 있으면 빠뜨릴수 있다
Since Kotlin 1.1, you can omit the property type if it can be inferred from the getter:

``` kotlin
val isEmpty get() = this.size == 0  // Boolean 형식으로 추정한다
```


접근자의 가시성을 변경한다든지, 어노테이션을 달거나 할 때 기본 구현을 변경할 필요가 없다
If you need to change the visibility of an accessor or to annotate it, but don't need to change the default implementation,
you can define the accessor without defining its body:

``` kotlin
var setterVisibility: String = "abc"
    private set // the setter is private and has the default implementation

var setterWithAnnotation: Any? = null
    @Inject set // annotate the setter with Inject
```

### Backing Fields

Classes in Kotlin cannot have fields. However, sometimes it is necessary to have a backing field when using custom accessors. For these purposes, Kotlin provides
an automatic backing field which can be accessed using the `field` identifier:

``` kotlin
var counter = 0 // the initializer value is written directly to the backing field
    set(value) {
        if (value >= 0) field = value
    }
```

The `field` identifier can only be used in the accessors of the property.

A backing field will be generated for a property if it uses the default implementation of at least one of the accessors, or if a custom accessor references it through the `field` identifier.

For example, in the following case there will be no backing field:

``` kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### Backing Properties

If you want to do something that does not fit into this "implicit backing field" scheme, you can always fall back to having a *backing property*:

``` kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // Type parameters are inferred
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

In all respects, this is just the same as in Java since access to private properties with default getters and setters is optimized so that no function call overhead is introduced.


## Compile-Time Constants

Properties the value of which is known at compile time can be marked as _compile time constants_ using the `const` modifier.
Such properties need to fulfil the following requirements:

  * Top-level or member of an `object`
  * Initialized with a value of type `String` or a primitive type
  * No custom getter

Such properties can be used in annotations:

``` kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```


## Late-Initialized Properties

Normally, properties declared as having a non-null type must be initialized in the constructor.
However, fairly often this is not convenient. For example, properties can be initialized through dependency injection,
or in the setup method of a unit test. In this case, you cannot supply a non-null initializer in the constructor,
but you still want to avoid null checks when referencing the property inside the body of a class.

To handle this case, you can mark the property with the `lateinit` modifier:

``` kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // dereference directly
    }
}
```

The modifier can only be used on `var` properties declared inside the body of a class (not in the primary constructor), and only
when the property does not have a custom getter or setter. The type of the property must be non-null, and it must not be
a primitive type.

Accessing a `lateinit` property before it has been initialized throws a special exception that clearly identifies the property
being accessed and the fact that it hasn't been initialized.

## Overriding Properties

See [Overriding Properties](classes.html#overriding-properties)

## Delegated Properties
  
The most common kind of properties simply reads from (and maybe writes to) a backing field. 
On the other hand, with custom getters and setters one can implement any behaviour of a property.
Somewhere in between, there are certain common patterns of how a property may work. A few examples: lazy values,
reading from a map by a given key, accessing a database, notifying listener on access, etc.

Such common behaviours can be implemented as libraries using [_delegated properties_](delegated-properties.html).