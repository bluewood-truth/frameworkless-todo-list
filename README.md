# Frameworkless TodoList

[TodoMVC Template](https://github.com/tastejs/todomvc-app-template)을 기반으로 <프레임워크 없는 프론트엔드 개발> 서적을 공부하며 TodoList를 만듭니다.

## 1. 렌더링

### 순수 함수 컴포넌트

- 순수 함수로 컴포넌트를 구현한다.
  1. `cloneNode` 메서드로 대상 엘리먼트를 복제
  2. 복제한 엘리먼트의 innerHTML을 `state`에 따라 생성한 html string으로 교체
  3. 이를 상위 엘리먼트부터 하위 엘리먼트로 순차적으로 수행한 후 마지막에 실제 DOM과 교체
- 렌더링 최적화를 위해 [requestAnimationFrame](https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame)의 콜백 내에서 DOM을 조작한다.

### 레지스트리

- 레지스트리를 통해 렌더링이 필요한 엘리먼트와 컴포넌트 함수를 연결한다.
  -  HTML상에는 `data-componet` 프로퍼티로 필요한 컴포넌트의 이름을 명시하고, `registry` 객체에는 컴포넌트 이름을 키로, 컴포넌트 함수를 값으로 등록한다.
  - 컴포넌트 함수를 `renderWrapper` 고차함수로 래핑하여 `data-component` 프로퍼티를 가진 엘리먼트에 필요한 컴포넌트 함수를 `registry`에서 찾아 적용하게 한다.

### diff 알고리즘

- 위 과정을 통해 생성한 가상 DOM은 실제 DOM과 diff 알고리즘을 통해 비교하여 교체를 최소한으로 한다. 과정은 다음과 같다.
  - 파라미터로 (실제) 부모 노드, 실제 노드, 가상 노드를 받는다.
  - 가상 노드가 존재하지 않으면 실제 노드를 제거한다.
  - 가상 노드가 존재하면 부모 노드에 추가한다.
  - 실제 노드와 가상 노드 둘 다 존재하면 변경 여부를 체크하고 교체한다. 변경 여부는 다음 사항을 체크한다.
    - 두 노드의 어트리뷰트의 수가 다를 경우
    - 두 노드의 각 어트리뷰트의 값이 하나라도 다를 경우
    - 두 노드에게 자식 엘리먼트가 없고 `textContent`가 일치하지 않는 경우
    - 위 사항에 해당하지 않으면 해당 노드는 변경되지 않았다고 판단한다.
  - 실제 노드와 가상 노드 모두 존재하고 변경되지도 않았다면, 두 노드의 자식 노드들에 대해 이 과정을 재귀적으로 수행한다. 따라서 실제 노드와 가상 노드가 모두 정의되지 않은 경우는 존재하지 않는다.

## 2. DOM 이벤트 관리

### YANGI 원칙

>  당신이 필요하다고 예측할 때가 아니라 실제로 필요할 때 구현하라.

- 가장 중요한 기능에 초점을 맞춰 개발하고 이후 추가적인 요구가 생기면 이에 따라 아키텍처를 지속적으로 발전시켜 나간다.

### 템플릿 포팅

- 기존의 방식은 todo 문자열을 생성하고 이를 합쳐 부모 노드의 `innerHTML`에 추가했다. 하지만 문자열에는 이벤트 핸들러를 추가할 수 없다. 따라서 문자열을 다루는 부분을 DOM노드를 다루는 것으로 변경해야 한다.
- `<template>`는 JavaScript를 통해 인스턴스를 생성할 수 있는 HTML 코드를 담기 위한 태그다. 이를 이용해 손쉽게 노드를 생성할 수 있다.
- 우선 todo 컴포넌트에 `<template>`을 적용하고 이후 app 컴포넌트를 새로 만들어 여기에도 적용한다. 이를 통해 템플릿 기술을 전체 애플리케이션으로 확장할 수 있다.

### 기본 이벤트 처리 아키텍처

- 모든 이벤트 다음에 상태를 조작한 후 새로운 상태로 메인 렌더링 함수를 호출한다.

  > 초기 상태 → 렌더링 → 이벤트 → 새로운 상태 → 렌더링 → ...

- 상태를 조작하는 함수를 `events` 객체에 정의한 후 `events` 객체를 registry에 추가한다. 이를 통해 모든 컴포넌트에서 `events` 객체에 접근할 수 있게 된다.
- todo 항목을 삭제하는 핸들러는 리스트 엘리먼트에 추가하여 이벤트 위임을 할 수 있다. 버튼 하나하나에 핸들러를 추가하는 것에 비해 성능과 메모리 사용성을 개선할 수 있다.

## 3. 웹 컴포넌트

### 웹 컴포넌트

- 웹 컴포넌트란 커스텀 엘리먼트를 작성하고 캡슐화하기 위해 브라우저에서 제공하는 API들을 말한다. 크게 다음 세 가지 기술로 구성된다.
  - **HTML 템플릿**: `<template>`와 `<slot>` 태그를 사용해 JavaScript에서 DOM 엘리먼트를 동적으로 생성하기 위한 템플릿을 HTML상에 작성할 수 있다.
  - **커스텀 엘리먼트**: 말 그대로 자신만의 HTML 태그를 정의하고 사용할 수 있다.
  - **Shadow DOM**: 웹 컴포넌트가 외부 DOM의 영향을 받지 않도록 캡슐화하기 위해 사용한다.

### 커스텀 엘리먼트

- 커스텀 엘리먼트를 통해 자신만의 HTML 태그를 작성할 수 있다. 실제로 사용하면 다음과 같다.

  ```html
  <hello-world></hello-world>
  ```

  커스텀 엘리먼트는 `-`로 구분된 두 단어 이상의 태그명을 가져야 한다. 한 단어로 이루어진 태그명은 W3C에서만 사용할 수 있기 때문이다.

- 커스텀 엘리먼트는 다음과 같은 형태로 정의한다.

  ```javascript
  window.customElements.define(태그명, 클래스(, {extends: 확장할 태그명}));
  ```

  - 태그명: `-`로 구분되고, 두 단어 이상으로 이루어져야 한다.
  - 클래스: HTMLElement를 상속한 클래스로, 여기서 실제 엘리먼트의 동작방식을 결정한다.
  - 확장할 태그명: 커스텀 엘리먼트가 기존에 존재하는 HTML 태그를 기반으로 생성되도록 옵션을 줄 수 있다.

#### 속성 관리

- 엘리먼트의 속성은 HTML 상에서 추가하거나 엘리먼트 객체의 세터(setter)를 사용, 혹은 setAttribute 메서드를 사용해서 조작할 수 있다.

  ```html
  <input value="newText" />
  ```

  ```javascript
  input.value = 'newText';
  ```

  ```javascript
  input.setAttribute('value', 'newText');
  ```

  이들은 동일한 결과를 가져오고 서로 동기화된다.

- 이를 커스텀 엘리먼트에서 구현하려면 다음과 같이 작성할 수 있다.

  ```javascript
  class HelloWorld extends HTMLElement {
      get color() {
          return this.getAttribute('color');
      }
  
      set color(value) {
          this.setAttribute('color', value);
      }
  
      connectedCallback() {
          window.requestAnimationFrame(() => {
              const $div = document.createElement('div');
              $div.textContent = "Hello World!";
              $div.style.color = this.color;
  
              this.appendChild($div);
          });
      }
  }
  ```

  color 속성에 대한 setter와 getter는 각각 `setAttribute`, `getAttribute`의 래퍼이므로 동일한 결과를 가져오게 된다.

-  커스텀 엘리먼트의 클래스에서는 다양한 생명주기 콜백을 정의할 수 있다.

  - `connectedCallback`: 컴포넌트가 DOM에 연결될 때 호출된다.

  - `disconnectedCallback`: 컴포넌트가 DOM에서 제거될 때 호출된다.

  - `attributeChangedCallback`: 속성이 변경되었을 때마다 호출된다. 사용하기 위해선 변경을 체크할 속성을 `observedAttributes`로 정의해줘야 한다.

    ```javascript
    class HelloWorld extends HTMLElement {
        static get observedAttributes() { return ['color']; }
        // ...
    }
    ```

  > #### `constructor` vs `connectedCallback`
  >
  > - `constructor`는 엘리먼트가 생성되었을 때 호출된다.
  > - `connectedCallback`은 생성된 엘리먼트가 DOM에 추가되었을 때 호출된다.

- 특정한 동작에 대해 `CustomEvent` 생성자로 생성한 이벤트를 `dispatchEvent` 메서드로 전송할 수 있다.

  ```javascript
  class HelloWorld extends HTMLElement {
      set color(value) {
          this.setAttribute('color', value);
          onColorChange();
      }
  
      onColorChange() {
          const event = new CustomEvent(
              'COLOR_CHANGE',
              { detail: { color: this.color } }
          );
  
          this.dispatchEvent(event);
      }
      // ...
  }
  
  // ...
  
  const $helloWorld = document.querySelector('hello-world');
  $helloWorld.addEventListener('COLOR_CHANGE', (e) => {
     alert(`color is changed to ${e.detail.color}`) 
  });
  ```

### 웹 컴포넌트 vs 렌더링 함수

#### 코드 스타일

- 웹 컴포넌트는 클래스를 사용하여 HTMLElement를 확장해야 한다. C#이나 Java에 익숙하다면 비교적 쉽게 적응할 수 있다.
- 함수형 프로그래밍을 선호한다면 렌더링 함수가 더 맞을 것이다.
- 렌더링 함수로 시작하더라도 웹 컴포넌트로 래핑할 수도 있다. 두 방식은 상호 배타적이지 않다.

#### 테스트 가능성

- *책에서는 Jest 등에서 사용하는 JSDOM이 커스텀 엘리먼트를 지원하지 않아 웹 컴포넌트는 테스트가 어렵다고 하지만, 현재 JSDOM과 Jest는 커스텀 엘리먼트를 지원한다!*

#### 이식의 용이성(Portable)

- 웹 컴포넌트는 다른 DOM 요소와 동일하게 동작하므로, 잘 만들어진 웹 컴포넌트는 다른 웹 애플리케이션 간의 이식이 매우 용이하다.
- 반면 렌더링 함수는 구현 방식에 따라 이식이 어려울 수 있다.

#### 커뮤니티

- 웹 컴포넌트는 DOM UI 요소를 작성하는 표준 방법이므로 대규모 팀이나 빠르게 성장하는 팀이라면 명심해야 할 아주 유용한 기능이다.

### disappearing framework

- 웹 컴포넌트를 사용한 프레임워크는 빌드 결과물이 그 자체로 동작하는 표준 JavaScript 코드가 된다. 즉 React처럼 결과물에 프레임워크 코드를 따로 포함시킬 필요 없이 빌드 결과물 자체로 작동하는 코드가 된다.
- 이 방식을 사용하는 대표적인 프레임워크로 **Svelt.js**가 있다.



