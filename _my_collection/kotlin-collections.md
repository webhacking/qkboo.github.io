# Collections

다른 언어와 다르게 코틀린은 가변과 불변 컬렉션(lists, sets, maps...)을 구분한다. Precise control over exactly when collections can be edited is useful for eliminating bugs, and for designing good APIs.


가변 컬렉션의 읽기 가능 뷰와 실제 불변 컬렉션 사이의 다른점을 이해햐는 것은 중요하다. 이 둘은 생성은 쉽지만 
It is important to understand up front the difference between a read only view of a mutable collection, and an actually immutable collection. Both are easy to create, but the type system doesn’t express the difference, so keeping track of that (if it’s relevant) is up to you.

코틀린 `List<out T>` 은 읽기만 가능한 기능인 크기, get 같은 것을 제공하는 인터페이스이다. 자바에서 처럼 `Collection<T>`와 `Iterable<T>`를 상속한다.

The Kotlin List<out T> type is an interface that provides read only operations like size, get and so on. Like in Java, it inherits from Collection<T> and that in turn inherits from Iterable<T>. Methods that change the list are added by the MutableList<T> interface. This pattern holds also for Set<out T>/MutableSet<T> and Map<K, out V>/MutableMap<K, V>.

기본적인 리스트와 집합 형식은 다음 같다:

```kotlin
val numbers: MutableList<Int> = mutableListOf(1,2,3)
var readOnlyView: List<Int> = numbers
print(numbers)          // prints "[1, 2, 3]"
numbers.add(4)
println(readOnlyView)   // prints "[1, 2, 3]"
readOnlyView.clear()    // --> does not compile

val strings = hashSetOf("a", "b", "c", "c")
assert(srings.size == 3)
```

코틀링는 리스트, 셋을 생성하기 위한 고정된 문법을 제공하지 않고 표준 라이브러리에서 `listOf()`, `mutableListOf()`, `setOf()`, `mutableSetOf()` 같은 메서드를 제공한다.
그래서 맵을 생성하기 위해서 간단한 `mapOf(a to b, c to d)` 같은 이디엄을 사용한다.

`readOnlyView` 변수는 리스트 내용이 변경시 같은 리스트를 가르키게 된다. 존재하는 리스트를 가르키는 메모리 참조만 한다면 읽기 전용으로, 이것이 전적인 불변 컬렉션으로 이해한다.
Note that the readOnlyView variable points to the same list and changes as the underlying list changes. If the only references that exist to a list are of the read only variety, we can consider the collection fully immutable. 
이런 켈렉션 리스트를 생성하는 간단한 방법은 :

```
var items = listOf(1, 2, 3)
```

때때로 어느 시점의 특정 지점의 컬렉션의 스냅샷을 호출자에게 반환하려 할 때, 이것은 변경되지 않은 것임을 보장해야 한다:

```
class Controller {
    private var _items = mutalbeListOf<String>()
    var items: List<String> get() = _items.toList()
}
```

`toList()` 메서드는 리스트 항목을 복제하는데 이렇게 해서 반환한 항목들은 변경되지 않는 것을 보장한다.

여러가지 유용한 리스트와 세트의 확장 메서드가 있다. 다음은 도움이 되는 것이다:

```kotlin
var items = listOf(1, 2, 3, 4)
items.first == 1
items.last == 4
items.filter { it % 2 == 0 }   // returns [2, 4]
rwList.requireNoNulls()
if ( rwList.none { it > 6 }) println("No items above 6")
var item = rwList.fitstOrNull()
```

또한 sort, zip, fold, reduce 등에 대한 메서드도 있다.

맵은 리스트와 동일한 패턴인데 다음과 같다:

```kotlin
var readWriteMap = hashMapOf("foo" to 1, "bar" to 2)
println(readWriteMap["foo"])
var snapshot: Map<String, Int> = HashMap(readWriteMap)
```

