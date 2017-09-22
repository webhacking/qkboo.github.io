---
title: Kotlin - Command line compiler
date: 2017-06-28 23:00:00 +0900
layout: post
tags: [android, kotlin, intellij]
categories: [Programming]
---

**Kotlin 이용 개발을 위한 Getting Started Kotlin**
 - [Start with IntelliJ](/kotlin/2017/06/28/tutorial-start-with-intellij.html)
 - [Start with Eclipse](/kotlin/2017/06/29/tutorial-start-with-eclipse.html)
 - [Kotlin Koans](/kotlin/2017/06/29/tutorial-koans.html)
 - Working with Command line compiler

<br/>
<br/>

## 명령행 컴파일 시작하기

kotlinlang.org의 [Working with the Command line compiler](https://kotlinlang.org/docs/tutorials/command-line.html) 를 참고하고 있다.

명령행 컴파일러를 사용해서 'Hello, World'를 출력하는 애플리케이션을 만들어 보겠습니다.


### 컴파일러 다운로드

코틀린 정규 릴리즈에는 단독 컴파일러가 포함되어 있다. 단독 컴파일러는 현재 1.1.3 버전으로 [Github](https://github.com/JetBrains/kotlin/releases/tag/build-1.1.3) 에서 다운로드할 수 있다.

#### zip 설치

Github에서 다운받은 zip 파일을 다운로드 한 후에 압축을 풀고, 폴더의 **bin** 디렉토리를 환경변수 PATH에 추가하고, bin 디렉토리에 윈도우, 맥 그리고 리눅스에서 코틀린을 컴파일하고 실행할 수 있는 스크립트가 있다.

#### SDKMAN!
Mac OS, Linux, Cygwin, FreeBSD 그리고 Solaris 같은 유닉스 기반의 오에스에서는 `SDKMAN` 을 사용할 수 있다.

```sh
$ curl -s get.sdkman.io | bash
```

그리고 SDKMAN으로 코틀린을 설치할 수 있다.

```sh
$ sdk install kotlin
```


#### Homebrew

Mac OS 에서는 Homebrew 를 사용해서 컴파일러를 설치할 수 있다.

```
$ brew update
$ brew install kotlin
```


### 첫번째 애플리케이션을 생성하고 실행하기

코틀린에서 '안녕하세요'를 출력하는 첫번째 애플리케이션을 만들고 실행해 보자, 편리한 에디터를 사용해서 'hello.kt'라는 파일을 만든다. 그리고 아래 내용을 입력하고 저장한다.

``` kotlin
fun main(args: Array<String>) {
    println("Hello, World!")
}
```

코틀린 컴파일어를 사용해서 애플리케이션을 컴파일 한다.

```
$ kotlinc hello.kt -include-runtime -d hello.jar
```

코틀린 컴파일러에 사용하는 매개변수의 의미는 다음 같다:
 - **-d** : 목적 파일을 지정. 클래스 '.class' 파일을 위한 디렉토리 혹은 '.jar' 파일
 - **-include-runtime**: .jar 결과 파일에 코틀린 런타임 라이브러리를 포함한다.

코틀린 컴파일러에서 사용할 수 있는 옵션은 '-help'로 확인할 수 있다.

```
$ kotlinc -help
```

컴파일한 코틀린 애플리케이션은 java의 jar로 실행할 수 있다.

```
$ java -jar hello.jar
```


### 라이브러리 컴파일

코틀린 애플리케이션에서 사용할 수 있는 라이브러리를 개발한다면 코틀린 런타임을 제외하고 .jar 파일을 생성할 수 있다.

```
$ kotlinc hello.kt -d hello.jar
```

이 방법으로 컴파일한 바이너리를 코틀린 런타임이 클래스패스에 존재하는지에 따라 다르다.
또한 코틀린 컴파일러로 생성한 바이너리를 실행하기 위해 코틀린 스크립을 사용할 수 있다:

```
$ kotlin -classpath hello.jar HelloKt
```

*HelloKt*는 메인 클래스 이름으로 코틀린 컴파일러가 hello.kt 파일에 대해 생성한 것이다.



### Running the REPL

컴파일러는 REPL 모드로 상호작용이 가능한 쉘로 실행할 수 있습니다. 쉘 안에서 적절한 코틀린 코드를 입력해서 결과를 확인할 수 있다.

![](https://kotlinlang.org/assets/images/tutorials/command-line/kotlin_shell.png)


### Using the command line to run scripts

코틀린은 스크립팅 언어로 사용할 수 있습니다. 코틀린 스크립트 파일 *.kts* 로 저장된 스크립트를 실행한다.


```
   import java.io.File

   val folders = File(args[0]).listFiles { file -> file.isDirectory() }
   folders?.forEach { folder -> println(folder) }
```

위 스크립을 실행하려면 *-script* 옵션을 사용해서 컴파일한다.


```
$ kotlinc -script list_folders.kts <path_to_folder_to_inspect>
```

