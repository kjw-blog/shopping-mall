2023-01-17 메모

- vite는 개발환경에서는 ESModule을 그대로 씀
- bundling을 안하기 때문에 속도가 빠름

웹팩은 초기로딩에 성능이 느릴수 밖에 없다. ( 사용하지 않는 컴포넌트도 번들링 하기 때문? )

- new URLSearchParams(params).toString()
- 파라미터를 get방식에 맞게 변형시켜주는거같음

2023-02-10 메모

- react-query invalidateQueries vs setQueryData
- invalidateQueries(queryKey) : 캐시를 무시하고 queryKey와 일치하는 GET api를 다시 호출하는 것 같음, 장점 : 간결한 소스

- setQueryData(queryKey,newData) : GET api를 다시 호출하지 않고 queryKey와 일치하는 데이터를 newData로 변경해주는 것 같음, 장점 : 한번 업데이트를 하면 같은 queryKey를
  사용하는 다른 컴포넌트에도 변경된 데이터로 적용된다

2023-02-13 메모

- controlled component (제어 컴포넌트) vs uncontrolled component (비제어 컴포넌트)

- controlled component :
  사용자 입력 기반으로 state를 관리 setState에 의해 업데이트 됨
  react에 의해 값이 제어되는 from element를 제어 컴포넌트 라고하는것 같음
  사용자 입력값이 실시간으로 필요할 때 사용

- uncontrolled component :
  ref 를 통해 form 에 접근함.
  setState로 일어나는 불필요한 렌더링을 줄이고, 제출시에만 값이 필요할 때 사용

2023-03-29 메모

infiniteQuery가 내려주는 data 형식

- data : {
  pages: [
  { products: [ ... ] },
  { products: [ ... ] } ,
  { products: [ ... ] }
  ],
  pageParams: [undefined, ... ]
  }
- 데이터 표출 방법

1.  map 안에서 map 을 한번 더 돌린다.
    (강사님 권장방법, 페이지 별 데이터 식별이 쉬움)
2.  data.pages.flatMap(page => page.products)를 사용해서 page안에 products을
    추출해서 새로운 배열을 만든다.

infiniteQuery의 끝 데이터 파악하는 방식

1. scrollTop + window.clientHeight 등을 이용해서 스크롤이 끝점에 도달했는지 파악
2. eventHandler (scroll) => 스크롤 이벤트로 감시. 매 스크롤 마다 이벤트가 발생하기 떄문에
   throttle / debounce 처리가 필요하다. -> 쓰레드 메모리를 차지하고, 성능에도 좋지않아서
   권장하지않음.
3. intersectionObserver 이벤트 등록을 따로 하지않고, 브라우저에서 제공하는 별개의 감시자임
   JS랑 별도로 동작이 되어서 성능이 좋음
