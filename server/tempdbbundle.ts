import { v4 as uuid } from 'uuid';
import { writeDB, DBField } from './src/dbController';

// server 경로로 와서 npx ts-node tempdbbundle.ts 를 실행시켜주면 아래 db가 만들어지면서 products.json 파일에 작성하게된다

const db = Array.from({ length: 100 }).map((_, i) => ({
  id: uuid(),
  imageUrl: `https://picsum.photos/id/${i + 1}/200/150`,
  price: Math.ceil(Math.random() * 30) * 1000,
  title: `임시상품${i + 1}`,
  description: `임시상세내용${i + 1}`,
  createdAt: 1677819532080 + 1000 * 60 * 60 * 5 * i,
}));

writeDB(DBField.PRODUCTS, db);
