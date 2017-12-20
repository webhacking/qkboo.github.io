---
title: Jekyll Liquid 와 Markdown
date: 2017-05-13 09:00:00 +0900
layout: post
tags: [jekyll, markdown, liquid]
categories: jekyll
---

Jekyll 은 템플릿 처리 작업을 위해 [Liquid](https://github.com/Shopify/liquid/wiki) 템플릿 언어를 사용한다. 표준 Liquid [Tag](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers#tags)와
[Filter](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers#standard-filters)를
모두 지원한다. 더우기 Jekyll 에만 추가된 필터와 태그도 있어서, 빈도가 높은
작업을 더 쉽게 처리할 수 있다.

## Liquid code 처리

아래 같이 Liquid 코드는 html, markdown 파일에서 해석되고 처리되어, backlit 혹은 Fenced code block 으로 코드를 표시할 수  없다. [^1]

### raw tag 이용

*liquid* 에서 `{% raw %}` 와 `{% endraw %}` 사이에 *Liquid* 태그를 넣으면 *markdown*에서 코드 형식으로 표시된다. [^2]

{% raw %}

```liquid
<ul>
{% for tag in site.tags %}
  {% assign name = tag | first %}
  {% assign posts = tag | last %}
  <li>{{ name | camelize | replace: "-", " " }} has {{posts | size}} posts</li>
{% endfor %}
</ul>
```

{% endraw %}


### Left Curl Braces 변수 사용

문서의 Front matter에서 \{ , \{\{ 사용시 아래 같이 lcb 변수를 사용해 코드에 사용하면 해석하지 않고 출력할 수 도 있다.[^2]

{% raw %}

```
---
layout: "post"
title: "Writing Liquid Template in Markdown Code Blocks with Jekyll"
date: "2016-04-26 21:00"
tags: [jekyll, website, liquid]
lcb: "{"
---
```

{% endraw %}


선언한 변수 lcb는 page.lcb로 접근해 사용한다.

{% raw %}

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

{% endraw %}


### Markdown에 Sylesheet 적용

스타일시트로 선언한 클래스, 아이디를 markdown 에서 `{: }` 태그를 사용해서 적용할 수 있다. [^2]
예를 들어 아래 같은 스타일시트가 있고,

```css
.mytable {
  border-collapse: collapse;

  > table, td, th {
    border: 1px solid black;
  }
}
```


이 스타일을 markdown 테이블에 적용한다.

{% raw %}

```liquid
| Item | Description | Price |
| ---- | ----------- | ----- |
| item1 | item1 description | 1.00 |
| item2 | item2 description | 100.00 |
{:.mytable}
```

{% endraw %}



| Item | Description | Price |
| ---- | ----------- | ----- |
| item1 | item1 description | 1.00 |
| item2 | item2 description | 100.00 |{:.table-hover}


http://digitaldrummerj.me/styling-jekyll-markdown/

## 참조

[^1]: [Liquid in markdown](http://ozzieliu.com/2016/04/26/writing-liquid-template-in-markdown-with-jekyll/)
[^2]: [Liquid for Designer: Raw](https://github.com/Shopify/liquid/wiki/liquid-for-designers#raw)

