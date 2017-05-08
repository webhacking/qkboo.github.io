# jekyll

jekyll 구성을 위해서

## 설치

Ruby 개발 도구가 반드시 필요한데 다음 같이 `rvm` 이라는 가상 개발 환경으로 설치하는게 깔끔하다.

##### 필요사항

- GNU/Linux, Unix, or macOS
- Ruby version 2.0 or above, including all development headers
- RubyGems
- GCC and Make (in case your system doesn’t have them installed, which you can check by running gcc -v and make -v in your system’s command line interface)

Only required for Jekyll 2 and earlierPermalink
- NodeJS, or another JavaScript runtime (for CoffeeScript support).
- Python 2.7

Ruby 개발 도구가 반드시 필요한데 다음 같이 `rvm` 이라는 가상 개발 환경으로 설치하는게 깔끔하다.

### rvm for Ruby

Ruby 가상개발환경을 설치한다.

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

$HOME/.rvm 이 bashrc 에 추가된다. 로그아웃 하거나 쉘을 열어 rvm 을 샐행해 본다.
 - $HOME/.rvm/scripts/rvm 명령이 실행되야 하낟.


#### Install Ruby on rvm

ruby 를 설치한다.
> macOS는 기본으로 ruby가 설치되어 있다.
> 단, armhf 인 경우는 binary가 제공되지 않아서 소스를 다운해서 빌드과정을 거친다.

```
$ rvm install ruby-2          #ruby-2 최신 버전을 설치
$ ruby -v
```


> rvm usage: http://theeye.pe.kr/archives/1747
> 

#### jekyll 설치

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

##### jekyll 개발버전 git에서 다운로드

최신 개발 버전 사용하고자 한다면 github 에서 다운로드해서 사용한다.

```
 $ git clone git://github.com/jekyll/jekyll.git
 $ cd jekyll
 $ script/bootstrap
 $ bundle exec rake build
 $ ls pkg/*.gem | head -n 1 | xargs gem install -l
```


### jekyll 사용

jekyll 명령으로 블로그 사이트를 생성, 갱신, 삭제 등이 가능하다.


```
$ jekyll new my-awesome-site
Running bundle install in /home/qkboo/Hdd/Blogs/qkboo.github...
```

그리고 다음 같이 한 번 실행해서 `config.yml` 파일을 생성하게 하자.

```
$ cd my-awesome-site
$ bundle exec jekyll serve

Server address: http://127.0.0.1:8080/
  Server running... press ctrl-c to stop.

Ctrl+C
```

Ctrl+C 종료 시키고 my-site/_config.yml 파일에 다음 같이 외부에서 접속 가능하게 해준다.

```
# deployment
host: 0.0.0.0
port: 5000
```

이렇게 해주어야 외부에서 브라우저로 접근할 수 있다.


<!-- 다음 워닝

you can ignore these warnings with 'rvm rvmrc warning ignore /home/qkboo/Hdd/Blogs/qkboo.github/Gemfile'.
To ignore the warning for all files run 'rvm rvmrc warning ignore allGemfiles'. -->


##### jekyll 실행 확인

서버가 4000 포트에서 대기중인지 확인

```
sudo lsof -i :4000
```

##### **jekyll** 명령 옵션

URL Root 위치를  *--baseurl* 로 변경

```
$ jekyll serve -w --baseurl '/'
```
Port 변경

```
$ jekyll server -w --baseurl '/' --port 4000
```

디버그 메시지 출력 *--trace*:

```
$ jekyll server -w --trace
```



### jekyll 관리


```
$ jekyll --version
$ gem list jekyll```

You can also use RubyGems to find the current versioning of any gem. But you can also use the gem command line tool:

$ gem search jekyll --remote


지킬 특정 버전을 사용하고 싶다면 아래와 같은 옵션을 주면 된다. (예, 1.5.1)

$ gem install jekyll -v 1.5.1
지킬 삭제는 아래와 같다.

$ gem uninstall jekyll
특정 버전 삭제는 아래와 같다. (예, 1.5.1)

$ gem uninstall jekyll -v 1.5.1
다양한 지킬 버전이 설치되어 있을 때 최신 버전 제외 모두 삭제는 아래와 같다.

$ gem cleanup jekyll
지킬 버전 업데이트는 아래와 같다. gem update를 사용하는 것이 좋다.

$ gem update
or
$ gem update jekyll
설치한 지킬 또는 gem 패키지 목록은 다음의 명령으로 확인할 수 있다.


$ gem list
or
$ gem list jekyll
위의 내용들은 아래의 명령을 통해 도움을 얻을 수 있다.

$ gem help
지킬 버전을 한 눈에 보고 싶다면 아래 링크를 보자.




## 참조
 - [Jekyll Installation](https://jekyllrb.com/docs/installation/)
 - [리눅스에서 지킬 설치](http://vjinn.github.io/install-jekyll/#리눅스에서-지킬-설치)]
