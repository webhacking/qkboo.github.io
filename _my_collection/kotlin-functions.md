---
title: Kotlin - Ref/기본문법
date: 2017-06-29 22:00:00 +0900
layout: post
tags: [kotlin, intellij]
categories: [Kotlin]
published: true
---


## Functions

### 함수 선언
코틀린에서 함수는 *fun* 키워드로 선언한다.

>  fun name(var:Type,,,)[:Return Type] { 
>  }

다음은 sum이라는 두개의 매개변수를 가진 함수를 선언하고 있습니다.

``` kotlin
fun sum(a: Int, b: Int): Int {
    return a + b;
}
```


### 표현문과 추론 반환형
an expression body and inferred return type

``` kotlin
fun sum(a:Int, b:Int) = a + b
```

``` kotlin
var result = sum(1, 2)
```


### 함수 사용
선언한 함수는 함수 이름과 *()* 연산자에 매개변수를 사용해 호출합니다.

``` kotlin
var result = sum(1, 2)
```

클래스에서 도트 표기로 함수를 실행할 수 있습니다.

```
Sample().sum(1,2)
```


#### 반환식

함수 선언시 반환형에 따라 결과를 반환합니다.

``` kotlin
fun printSum(a:Int, b:Int): Unit {
    print(a+b)
}
```

반환식 없이 선언할 수 있습니다.

``` kotlin
fun printSum2(a:Int, b:Int) {
    print(a+b)
}
```


#### Infix notation

infix 표기법으로 불리는 방법으로 함수를 호출해서 사용할 수 잇다
 - 함수 혹은 확장 함수의 의 멤버
 - 단일 파라미터 소유
 - infix 키워드로 지정

      
```
infix fun Int.shl(x: Int): Int {
    return 0
}
```

```
fun doInfix() {
    1 shl 2
    1.shl(2)
}
```


## 매개변수

함수 파라미터는 파스칼 표현식을 사용한다: "이름:형식", 파라미터는 정확한 형식을 지정하고 콤마로 구분해서 사용한다 각 파라미터는 기본 값을 가질 수 있다. 기본 값은 = 로 지정한다

```
fun powerOf(number : Int, exponent : Int ) {
    //
}
```


### 기본 인자

함수에서 매개변수의 각 인자는 기본 값을 가질 수 있습니다. 인자에 '=' 로 값을 대입하면 인자의 기본 값이 됩니다.

```
fun read(b: Array<Byte>, off: Int = 0, len: Int = b.size()) {
    //
}
```


### named arguments

함수의 매개변수는 인자의 위치 뿐만 아니라 인자에 이름을 붙일 수 있습니다.  이런 방법은 많은 인자를 가진 매개변수 혹은 하나만 선언하고 사용할 때 유리합니다.
아래 함수 선언을 살펴보면,

``` kotlin

fun reformat( str: String,
              normalizeCase: Boolean = false,
              divideByCamel: Boolean = false,
              wordSeperator: Char = ' ') {

}
```

다음은 앞서 선언한 reformat() 함수를 호출시 매개변수를 이름으로 지정해서 사용하고 있습니다.

```
reformat(str)   //기본 아규먼트,
reformat(str,true, true, fasle, '-') //기본 인자와 다른 인자를 호출
```


```
reformat( str,
//  normalizeCase = false,
//  divideByCamel = false,
//  wordSeperator = ' ') {
//}

//reformat( str,
//     normalizeCase = false }
```

그러나 자바 함수를 호출할 때는 아규먼트 이름을 사용할 수 없다


## Unit-returning functions

If a function does not return any useful value, its return type is Unit. Unit is a type with only one value - Unit. This value does not have to be returned explicitly

```
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```

The Unit return type declaration is also optional. The above code is equivalent to

fun printHello(name: String?) {
    ...
}
Single-Expression functions

When a function returns a single expression, the curly braces can be omitted and the body is specified after a = symbol

fun double(x: Int): Int = x * 2
Explicitly declaring the return type is optional when this can be inferred by the compiler

fun double(x: Int) = x * 2
Explicit return types

Functions with block body must always specify return types explicitly, unless it’s intended for them to return Unit, in which case it is optional. Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow in the body, and the return type will be non-obvious to the reader (and sometimes even for the compiler).

Variable number of arguments (Varargs)

A parameter of a function (normally the last one) may be marked with vararg modifier:

fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts is an Array
    result.add(t)
  return result
}
allowing a variable number of arguments to be passed to the function:

  val list = asList(1, 2, 3)
Inside a function a vararg-parameter of type T is visible as an array of T, i.e. the ts variable in the example above has type Array<out T>.

Only one parameter may be marked as vararg. If a vararg parameter is not the last one in the list, values for the following parameters can be passed using the named argument syntax, or, if the parameter has a function type, by passing a lambda outside parentheses.

When we call a vararg-function, we can pass arguments one-by-one, e.g. asList(1, 2, 3), or, if we already have an array and want to pass its contents to the function, we use the spread operator (prefix the array with *):

val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
Function Scope

In Kotlin functions can be declared at top level in a file, meaning you do not need to create a class to hold a function, like languages such as Java, C# or Scala. In addition to top level functions, Kotlin functions can also be declared local, as member functions and extension functions.

Local Functions

Kotlin supports local functions, i.e. a function inside another function

fun dfs(graph: Graph) {
  fun dfs(current: Vertex, visited: Set<Vertex>) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v, visited)
  }

  dfs(graph.vertices[0], HashSet())
}
Local function can access local variables of outer functions (i.e. the closure), so in the case above, the visited can be a local variable

fun dfs(graph: Graph) {
  val visited = HashSet<Vertex>()
  fun dfs(current: Vertex) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(graph.vertices[0])
}
Local functions can even return from outer functions using qualified return expressions

fun reachable(from: Vertex, to: Vertex): Boolean {
  val visited = HashSet<Vertex>()
  fun dfs(current: Vertex) {
    // here we return from the outer function:
    if (current == to) return@reachable true
    // And here -- from local function:
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(from)
  return false // if dfs() did not return true already
}
Member Functions

A member function is a function that is defined inside a class or object

class Sample() {
  fun foo() { print("Foo") }
}
Member functions are called with dot notation

Sample().foo() // creates instance of class Sample and calls foo
For more information on classes and overriding members see Classes and Inheritance

Generic Functions

Functions can have generic parameters which are specified using angle brackets before the function name

fun <T> singletonList(item: T): List<T> {
  // ...
}
For more information on generic functions see Generics

Inline Functions

Inline functions are explained here

Extension Functions

Extension functions are explained in their own section

Higher-Order Functions and Lambdas

Higher-Order functions and Lambdas are explained in their own section

Tail recursive functions

Kotlin supports a style of functional programming known as tail recursion. This allows some algorithms that would normally be written using loops to instead be written using a recursive function, but without the risk of stack overflow. When a function is marked with the tailrec modifier and meets the required form the compiler optimises out the recursion, leaving behind a fast and efficient loop based version instead.

tailrec fun findFixPoint(x: Double = 1.0): Double
        = if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
This code calculates the fixpoint of cosine, which is a mathematical constant. It simply calls Math.cos repeatedly starting at 1.0 until the result doesn’t change any more, yielding a result of 0.7390851332151607. The resulting code is equivalent to this more traditional style:

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (x == y) return y
        x = y
    }
}
To be eligible for the tailrec modifier, a function must call itself as the last operation it performs. You cannot use tail recursion when there is more code after the recursive call, and you cannot use it within try/catch/finally blocks. Currently tail recursion is only supported in the JVM backend.