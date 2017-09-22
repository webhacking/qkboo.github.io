---
title: AI / Google TensorFlow Install
date: 2017-07-12 11:00:00 +0900
layout: post
tags: [Artificial Intelligence, 인공지능, TensorFlow]
categories: AI
---

2015년 인공지능 개발용 오픈소스 **TensorFlow** 를 공개했다.

## TensorFlow 

TensorFlow는 머신러닝을 위한 Research cloud로 1000 Cloud TPU로 가동하고 있다. 1000 TPU는 180Petaflops를 제공하고 있다.

![Cloud TPU](https://www.tensorflow.org/tfrc/assets/images/gallery/2x/5.jpg){: width="650"}


Ubuntu Linux, macOS X, Windows 머신에 설치할 수 있다. Ubuntu 14.04 이상에서 설치 가능하다.
 - [Install on Ubuntu](https://www.tensorflow.org/install/install_linux)


### Install

먼저 TensorFlow 종류를 결정한다.
 - **TensorFlow CPU only support** : 시스템에 NVIDI&reg; GPU가 없으면 CPU 버전을 설치한다. 5~10분 정도 소요되고 쉽다. GPU가 있더라도 이 버전을 먼저 시도해 볼 것을 권한다.
 - **TensorFlow GPU only support** : CPU보다 현저하게 빠르다. NVIDIA&reg; GPU가 있고, 요구사항에 부합하며 성능 문제를 고려하면 이 버전을 설치한다.

<br/>
#### NVIDIA GPU에서 TensorFlow 실행시 요구조건

GPU 지원 TensorFlow를 설치하려면 아래 NVIDIA 소프트웨어가 설치되야 한다:

 - **CUDA® Toolkit 8.0** : [NVIDIA's documentation](http://docs.nvidia.com/cuda/cuda-installation-guide-linux/#axzz4VZnqTJ2A). *LD_LIBRARY_PATH* 환경변수에 Cuda 경로 추가해준다. 
 - CUDA Toolkit 8.0 관련 **The NVIDIA drivers** 설치.
 - **cuDNN v5.1**: [NVIDIA's documentation](https://developer.nvidia.com/cudnn) 참고, 설치후 *CUDA_HOME* 환경변수 설정.
 - GPU card with CUDA Compute Capability 3.0 or higher. 지원하는 종류는 [VIDIA documentation](https://developer.nvidia.com/cuda-gpus)를 참조.
 - **libcupti-dev** library: 아래 명령으로 NVIDIA CUDA Profile Tools Interface를 설치한다.

```sh
$ sudo apt-get install libcupti-dev
```

시스템에 설치된 소프트웨어가 위에 명시하 패키지 보다 이전 버전이면 업그레이드가 필요하다. 아닌 경우 TensorFlow가 실행되지만 아래 작업을 해주어야 한다:

 - TensorFlow 를 소스에서 설치한다 [Installing TensorFlow from Sources](https://www.tensorflow.org/install/install_sources).
 - 최소 아래 NVIDIA versions으로 설치한다:
   - CUDA toolkit 7.0 or greater
   - cuDNN v3 or greater
   - GPU card with CUDA Compute Capability 3.0 or higher.

<br/>
### TensorFlow 설치 방법

TensorFlow는 virtualenv, "native" pip, Docker, Anaconda 에서 설치할 수 있다.
virtualenv 환경을 권장한다.


#### virtualenv 환경에서 설치

여기서는 
- [macOS에서 Python 가상 개발환경 설치]({% post_url /python/2017-04-03-virtualenv-mac %})
- [Linux에서 Python 가상 개발환경 설치]({% post_url /python/2017-04-03-virtualenv-linux %})


를 참조해서 virtualenv, virtualenvwrapper 를 구성해서 사용한다고 가정한다.


```sh
$ mkvirtualenv --system-site-packages -p python3 tensorflow
(tensorflow)$ 
```


그리고 `tensorflow` 패키지를 설치한다 - GPU 버전을 선택적으로 설치한다.

```sh
(tensorflow)$ pip install --upgrade tensorflow      # CPU
(tensorflow)$ pip install --upgrade tensorflow-gpu  # GPU
```

위 명령으로 설치가 실패시 pip 버전이 8.1 이하일 수 있다. 업그레이드 후 재 시도한다. 혹은 다음 명령으로 TensorFlow Python package를 직접 설치한다.

```sh
(tensorflow)$ pip install --upgrade tfBinaryURL
```

`tfBinaryURL` 은 [여기](https://www.tensorflow.org/install/install_linux#the_url_of_the_tensorflow_python_package)서 찾아서 직접 지정한다.


#### Uninstall Tensorflow

가상환경 디렉토리를 삭제하거나

```sh
(tensorflow)$ deactivate
$ rm -rf .virtualenv/tensorflow
```

혹은 가상환경에서 tensorflow 를 pip로 지운다.

```sh
(tensorflow)$ pip uninstall tensorflow      # CPU
(tensorflow)$ pip uninstall tensorflow-gpu  # GPU
```


<br/>
### Run a short TensorFlow program

`python` 을 실행해 REPL 환경 혹은 스크립트로 아래 코드를 입력한다:

```python
import tensorflow as tf
hello = tf.constant('Hello, TensorFlow!')
sess = tf.Session()
print(sess.run(hello))
```

결과로 `b'Hello, TensorFlow!'` 같이 출력되면 성공적으로 실행된 것이다.

이어서 [Getting Started with TensorFlow]() 를 따라간다.


## 참조

[^1]: [Intruducing TensorFlow Research Cloud](https://www.tensorflow.org/tfrc/)


