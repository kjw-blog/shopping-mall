2023-01-17 메모

- vite는 개발환경에서는 ESModule을 그대로 씀
- bundling을 안하기 때문에 속도가 빠름

웹팩은 초기로딩에 성능이 느릴수 밖에 없다. ( 사용하지 않는 컴포넌트도 번들링 하기 때문? )

- new URLSearchParams(params).toString()
- 파라미터를 get방식에 맞게 변형시켜주는거같음

2023-02-10 메모

- react-query invalidateQueries vs setQueryData
- invalidateQueries(queryKey) : 캐시를 무시하고 queryKey와 일치하는 GET api를 다시 호출하는 것 같음
- setQueryData(queryKey,newData) : GET api를 다시 호출하지 않고 queryKey와 일치하는 데이터를 newData로 변경해주는 것 같음
