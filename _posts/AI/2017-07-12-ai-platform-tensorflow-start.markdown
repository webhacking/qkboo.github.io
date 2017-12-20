---
title: AI / Start Google TensorFlow
date: 2017-07-12 12:00:00 +0900
layout: post
tags: [Artificial Intelligence, 인공지능, TensorFlow]
categories: AI
---

[Getting Started with TensorFlow](https://www.tensorflow.org/get_started/get_started) 글을 요약 번역한다.

tensorflow를 사용하기 위해서는
 - Python 프로그래밍
 - 배열에 대한 이해
 - 머신러닝에 대한 이해. 

**TensorFlow**는 여러 API를 제공하고 있다.
 - TensorFlow Core: 가장 저수준 API
 - 고수준 API는 TensorFlow Core 위에 구성되 있다.

고수준 API 에서 **contrib-** 를 포함한 메서드 이름은 개발중으로 향후 변경 가능성이 크다.

<br/>
## Tensors

*TensorFlow* 에서 주요 데이터 단위가 **tensor** 이다. **tensor**는 어떤 차원의 배열로 구성된 기초적인 값의 집합이다. *tensor*의 **rank**는 차원의 수이다. 여러 rank를 가진 *tensors*의 예:

```json
3 # 하나의 rank 0 tensor; 모양 [] 인 스칼라 값이다.
[1. ,2., 3.] # rank 1 tensor; 모양 [3] 인 벡터이다.
[[1., 2., 3.], [4., 5., 6.]] # rank 2 tensor; 모양 [2,3]인 행렬이다.
[[[1., 2., 3.]], [[7., 8., 9.]]] # 모양 [2, 1, 3] 인 rank 3 tensor
```


<br/>
### TensorFlow Core tutorial

먼저 *import*로 tensorflow 패키지를 가져온다.

```python
import tensorflow as tf
```

#### 연산 그래프 Computational Graph

*TensorFlow Core* 프로그램은 두 개의 불연속 구획으로 구성되었다고 생각할 수 있다.

1. **연산 그래프** 구성하기
   - 그래프를 조립하는 단계
2. **연산 그래프** 실행하기
   - Session에서 graph 실행

> 예를 들어 뉴럴 네트워크를 표현하고 학습시키기 위해 구성 단계에는 graph를 만들고 실행 단계에는 graph의 훈련용 작업들(set of training ops)을 반복해서 실행합니다.[^1]

**연산 그래프**는 그래프 노드에 배열된 *TensorFlow* 작업의 급수이다. 간단한 **연산 그래프**를 구성해 보면, 각 노드는 0 혹은 다수의 *tensor*를 입력으로 가지고 *tensor* 하나를 출력으로 생성하게 하자. 노드 형식 중 하나는 상수인데, 모든 TensorFlow 상수 값은 입력으로 받지 않고, 초기화한 값을 사용한다. 아래 처럼 부동소수 *tensor*의 node1, node2 두 개를 생성해 보자

```python
node1 = tf.constant(3.0, dtype = tf.float32)
node2 = tf.constant(4.0) # 명시적으로 tf.float32 를 인자로 사용해도 된다.
print(node1, node2)
```

아래 같이 출력된다.

```
Tensor("Const:0", shape=(), dtype=float32) Tensor("Const_1:0", shape=(), dtype=float32)
```

실제 값이 연산되려면 `Session` 을 생성하고 실행해야 한다. 다음 같이 세션을 만들고 node를 실행한다.

```python
sess = tf.Session()
print(sess.run([node1, node2])) #[3.0, 4.0]
```

**Tensor** 노드를 묶어 복합적인 계산을 구성할 수 있다. 노드를 더해서 새로운 노드로 만들 수 있다.

```python
node3 = tf.add( node1, node2)
print("node3:", node3)
print("sess.run(node3):", sess.run(node3))
```

노드를 더하는 결과는 아래 같다.

```
node3: Tensor("Add:0", shape=(), dtype=float32)
sess.run(node3): 7.0
```

*TensorFlow* 는 **TensorBoard** 를 지원해 계산 그래프를 그림으로 표시할 수 있다. 아래는 *TensorBoard*로 출력한 스크립샷이다.

![](https://www.tensorflow.org/images/getting_started_add.png)

상수가 아닌 매개변수 형식으로 외부 입력을 받을 수 있는 *placeholders*{:.keyword} 를 사용하면 값을 나중에 입력받을 수 있다.

```python
a = tf.placeholder(tf.float32)
b = tf.placeholder(tf.float32)
adder_node = a + b  # + provides a shortcut for tf.add(a, b)

# 노드를 실행한다.
print(sess.run(adder_node, {a: 3, b:4.5}))
print(sess.run(adder_node, {a: [1,3], b: [2, 4]}))
```

결과는 

```
7.5
[ 3.  7.]
```

TensorBoard 로 그려본 그래프는 다음 같다.

![](https://www.tensorflow.org/images/getting_started_adder.png)

연산 그래프에 다른 연산을 더해 줄 수 있다.

```python
add_and_triple = adder_node * 3.
print(sess.run(add_and_triple, {a: 3, b:4.5})) # 22.5
```


앞의 연산에 대한 TensorBoard에서 그래프는,

![](https://www.tensorflow.org/images/getting_started_triple.png)


머신러닝에서 모델에 위와 같은 유효한 입력을 가지게 한다. 그리고 모델을 훈련시키기 위해서 새로운 출력을 갖도록 수정할 수 있다. *Variables* 는 그래프에 훈련시킬 매개변수를 더하게 해준다.

아래 같은 초기화 값이 있고,

```python
W = tf.Variable([.3], dtype=tf.float32)
b = tf.Variable([-.3], dtype=tf.float32)
x = tf.placeholder(tf.float32)
linear_model = W * x + b
```

상수는 *tf.constant*{:.keyword} 를 호출할 때 초기화 되지만 이후 값을 변경 할 수 없다. 반면 *Variable*은 *tf.Variable*{:.keyword}가 호출될 때 초기화 되지 않는다. 초기화 하려면 아래같은 암묵적인 연산을 해주어야 한다.

```
init = tf.global_variables_initializer()
sess.run(init)
```

그런데 `init` 의 실체는 모든 전역 변수를 초기화하는 *TensorFlow sub-graph* 핸들 이라는 것이다. 또한 `sess.run` 이 실행 될 때까지 초기화 되지 않는다.
이제 `x` 가 *placeholder*{:.keyword} 이기 때문에 다음 같이 *lenear_model* 의 수치를 구하게 한다.

```python
print(sess.run(linear_model, {x:[1,2,3,4]}))

# [ 0.          0.30000001  0.60000002  0.90000004]
```

이제 훈련 데이터로 *linear_model을* 평가하기 위해서 `y` placeholder를 준비하자. 그리고 *loss* 함수를 작성한다.
*loss* 함수는 제공한 데이터와 현재 모델 사이가 얼마나 떨어져 있는지를 측정한다. 이것은 선형회귀(Linear Regression)에 대한 표준 loss model로 현제 모델과 제공한 데이터 사이의 델타의 제곱근의 합이다. `linear_model - y` 는 예제의 에러 델타에 대응하는 요소로 이루어진 벡터를 생성한다. *tf.sqaure*{:.keyword} 를 호출해서 에러에 대한 제곱근을 구한다.

```python
y = tf.placeholder(tf.float32)
squared_deltas = tf.square(linear_model - y)
loss = tf.reduce_sum(squared_deltas)
print(sess.run(loss, {x:[1,2,3,4], y:[0,-1,-2,-3]}))
# 23.66
```

여기서 `W`, `b` 에 최적화된 값 -1, 1을 재지정 할 수 있는데, *tf.assign*{:.keyword} 같은 연산으로 바꿔 줄 수 있다. 

```python
fixW = tf.assign(W, [-1.])
fixb = tf.assign(b, [1.])
sess.run([fixW, fixb])
print(sess.run(loss, {x:[1,2,3,4], y:[0,-1,-2,-3]}))
# 0.0
```

결과 `0.0` 으로 `W`, `b`의 완벽한 값으 추축해 볼 수 있다. 머신러닝의 중요한 점은 자동으로 정확한 매개변수를 찾는 것이다. 다음 섹션에서 이것을 살펴볼 것이다.


### tf.train API

TensorFlow 는 **optimizers**를 제공해서 loss 함수의 매개변수 순서에 따라 값을 변경할 수 있다. 간단한 최적화는 **gradient optimizer** 이다. 함수의 전달하는 자릿수에 따라 각 값을 바꿀 수 있다.


### 코드

여기까지 코드는 아래와 같다:

{% gist qkboo/9d677cf28703fb18e2692278f90e1f6c %}


### 참조

- [텐서플로우 문서 한글 번역본](https://www.gitbook.com/book/tensorflowkorea/tensorflow-kr)
- [Getting Started TensorFlow](https://www.tensorflow.org/get_started/get_started)

[^1]: [텐서플로우 한글 번역본-기본적인 사용법](https://tensorflowkorea.gitbooks.io/tensorflow-kr/content/g3doc/get_started/basic_usage.html)
