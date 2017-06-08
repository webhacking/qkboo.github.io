---
title: Jekyll Syntax Highlighter
date: 2017-05-07 13:00:00 +0900
layout: post
tags: jekyll
categories: jekyll
lcb: "{"
---

# Syntax Highlighter

## Liquid code

아래 같이 Liquid 코드는 html, markdown 파일에서 해석되고 처리되어, backlit 혹은 Fenced code block 으로 코드를 표시할 수  없다. [링크](https://github.com/jekyll/jekyll/issues/814)

### raw tag 이용

{% raw %}
```html
<ul>
{% for tag in site.tags %}
  {% assign name = tag | first %}
  {% assign posts = tag | last %}
  <li>{{ name | camelize | replace: "-", " " }} has {{posts | size}} posts</li>
{% endfor %}
</ul>
```
{% endraw %}

이때  [raw tag](https://github.com/Shopify/liquid/wiki/liquid-for-designers#raw)를 사용해서 ```{{page.lcb}}% raw %}``` 와 ```{{page.lcb}}% endraw %}``` 사이에 Liquid 코드를 두면 제대로 랜더링 해준다.

```liquid
{{page.lcb}}% raw %}
<ul>
{{page.lcb}}% for tag in site.tags %}
  {{page.lcb}}% assign name = tag | first %}
  {{page.lcb}}% assign posts = tag | last %}
  <li>{{ name | camelize | replace: "-", " " }} has {{posts | size}} posts</li>
{{page.lcb}}% endfor %}
</ul>
{{page.lcb}}% endraw %}
```



### Left Curl Braces 변수 사용

문서의 Front matter에서 \{ , \{\{ 사용시 아래 같이 lcb 변수를 사용해 코드에 사용하면 해석하지 않고 출력할 수 도 있다.

```
---
layout: "post"
title: "Writing Liquid Template in Markdown Code Blocks with Jekyll"
date: "2016-04-26 21:00"
tags: [jekyll, website, liquid]
lcb: "{"
---
```

선언한 변수 lcb는 page.lcb로 접근해 사용한다.

```liquid
{% raw %}
{{page.lcb}}% raw %}
<ul>
{{page.lcb}}% for tag in site.tags %}
  {{page.lcb}}% assign name = tag | first %}
  {{page.lcb}}% assign posts = tag | last %}
  <li>{{ name | camelize | replace: "-", " " }} has {{posts | size}} posts</li>
{{page.lcb}}% endfor %}
</ul>
{{page.lcb}}% endraw %}
{% endraw %}
```


## Markdown


| Item | Description | Price |
| --- | --- | ---: |
| item1 | item1 description | 1.00 |
| item2 | item2 description | 100.00 |
{:.mbtablestyle}

SCSS in _base.scss file in /_sass/ directory

```
.mbtablestyle {
        border-collapse: collapse;

   > table, td, th {
        border: 1px solid black;
        }
}```

## 참조
 - http://ozzieliu.com/2016/04/26/writing-liquid-template-in-markdown-with-jekyll/
