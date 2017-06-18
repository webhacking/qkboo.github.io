---
title: Jekyll Install
date: 2017-05-06 09:00:00 +0900
layout: post
tags: jekyll, install,
categories: jekyll
---


## jekyll

jekyllrb.com 의 가이드에 따라 github page에서 블로그로 사용하고자 한다.

<br/>
### 설치

Ruby 개발 도구가 반드시 필요한데 
 - macOS는 Ruby 최신 버전이 제공되고 있다.
 - Linux/Windows에서 `rvm` 이라는 가상 개발 환경으로 설치하는게 깔끔하다.
- GNU/Linux, Unix, or macOS
- Ruby version 2.0 or above, including all development headers
- RubyGems
- GCC and Make (in case your system doesn’t have them installed, which you can check by running gcc -v and make -v in your system’s command line interface)

Only required for Jekyll 2 and earlierPermalink
- NodeJS, or another JavaScript runtime (for CoffeeScript support).
- Python 2.7

Ruby 개발 도구가 반드시 필요한데 다음 같이 `rvm` 이라는 가상 개발 환경으로 설치하는게 깔끔하다. Ruby 가상개발환경을 설치한다.

#### Linux/Ubuntu

먼저 필요 패키지

```
$ sudo apt-get install gnupg2
$ sudo apt-get install curl
```

rvm을 설치한다.

```
$ gpg --keyserver hkp://keys.gnupg.net --recv-keys D39DC0E3
$ \curl -sSL https://get.rvm.io | bash -s stable
$ source /home/vjinn/.rvm/scripts/rvm
$ rvm install ruby-2.2.0
```

#### macOS

```
$ \curl -sSL https://get.rvm.io | bash -s stable
$ rvm requirements            #rvm 필수요소를 설치합니다
```

*$HOME/.rvm* 이 bashrc 에 추가된다. 로그아웃 하거나 쉘을 열어 rvm 을 샐행해 본다.
 - $HOME/.rvm/scripts/rvm 명령이 실행되야 한다.


#### Install Ruby on rvm

ruby 를 설치한다.
> macOS는 기본으로 ruby가 설치되어 있다.
> 단, armhf 인 경우는 binary가 제공되지 않아서 소스를 다운해서 빌드과정을 거친다.

```
$ rvm install ruby-2          #ruby-2 최신 버전을 설치
$ ruby -v
```

`rvm` 명령에 대한 사용은 [이 블로그](http://theeye.pe.kr/archives/1747)를 참조한다.


<br/>
### jekyll 설치

gem 으로 설치한다.

```
$ gem install jekyll bundler
...
```

bundler gem은 다른 Ruby gem을 관리하는 gem으로 gem과 gem 버전, 의존성을 지키게 해준다.

```
$ jekyll -v
jekyll 3.4.3
```

다음은 jekyll 개발자 버전을 설치한다면 사용한다.

<br/>
#### jekyll 개발버전 git에서 다운로드

최신 개발 버전 사용하고자 한다면 github 에서 다운로드해서 사용한다.

```
 $ git clone git://github.com/jekyll/jekyll.git
 $ cd jekyll
 $ script/bootstrap
 $ bundle exec rake build
 $ ls pkg/*.gem | head -n 1 | xargs gem install -l
```


<br/>
<br/>
### jekyll 사용

jekyll 명령으로 블로그 사이트를 생성, 갱신, 삭제 등이 가능하다.

```
$ jekyll new my-awesome-site
Running bundle install in /home/qkboo/Hdd/Blogs/qkboo.github...
```

그리고 다음 같이 서버를 실행해서 `config.yml` 파일을 생성하게 하자.

```
$ cd my-awesome-site
$ bundle exec jekyll serve

Server address: http://127.0.0.1:8080/
  Server running... press ctrl-c to stop.

Ctrl+C
```

`Ctrl+C` 종료 시키고 *my-site/_config.yml* 파일에 다음 같이 외부에서 접속 가능하게 해준다.

```
# deployment
host: 0.0.0.0
port: 5000
```

이렇게 해주어야 외부에서 브라우저로 접근할 수 있다.


<!-- 다음 워닝
you can ignore these warnings with 'rvm rvmrc warning ignore /home/qkboo/Hdd/Blogs/qkboo.github/Gemfile'.
To ignore the warning for all files run 'rvm rvmrc warning ignore allGemfiles'. -->

<br/>
#### jekyll 실행 확인

서버가 4000 포트에서 대기중인지 확인

```
sudo lsof -i :4000
```

<br/>
##### **jekyll** 명령 옵션

URL Root 위치를  *--baseurl* 로 변경

```
$ bundle exec jekyll serve -w --baseurl '/'
```
Port 변경

```
$ bundle exec jekyll server -w --baseurl '/' --port 4000
```

디버그 메시지 출력 *--trace*:

```
$ bundle exec jekyll server -w --trace
```


<br/>
<br/>
### RubyGem으로 jekyll 관리

RubyGem 을 사용하기 위해 gem 명령으로 사용한다:

```
$ jekyll --version
```

설치한 지킬 또는 gem 패키지 목록은 다음의 명령으로 확인할 수 있다.

```
$ gem list
or
$ gem list jekyll            # jekyll 목록
```

`RubyGems` 으로 gem 버전을 찾을 수 있다.

```
$ gem search jekyll --remote
```

지킬 특정 버전을 사용하고 싶다면 아래와 같은 옵션을 주면 된다. (예, 1.5.1)

```
$ gem install jekyll -v 1.5.1
```

지킬 삭제는 아래와 같다.

```
$ gem uninstall jekyll
```

특정 버전 삭제는 아래와 같다. (예, 1.5.1)

```
$ gem uninstall jekyll -v 1.5.1
```

다양한 지킬 버전이 설치되어 있을 때 최신 버전 제외 모두 삭제는 아래와 같다.

```
$ gem cleanup jekyll
```

지킬 버전 업데이트는 아래와 같다. gem update를 사용하는 것이 좋다.

```
$ gem update
or
$ gem update jekyll
```

위의 내용들은 아래의 명령을 통해 도움을 얻을 수 있다.

```
$ gem help
```


<br/>
<br/>
### MathJax

LaTex 같은 수학 수식을 지원하려면 *_include/head.html* 같은 위치에 MathJax 를 포함한다.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
```

<br/>
<br/>
## 참조

 - [Jekyll Installation](https://jekyllrb.com/docs/installation/)
 - [리눅스에서 지킬 설치](http://vjinn.github.io/install-jekyll/#리눅스에서-지킬-설치)]
 - [Jekyll extras](https://jekyllrb.com/docs/extras/)