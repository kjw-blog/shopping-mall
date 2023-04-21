import { Product } from '../../graphql/products';
import AdminItem from './item';

type ProductListProps = {
  list: { products: Product[] }[];
  editingIndex: number | null;
  startEdit: (index: number) => () => void;
  doneEdit: () => void;
};

const ProductList = ({
  list,
  editingIndex,
  startEdit,
  doneEdit,
}: ProductListProps) => {
  return (
    <ul className='products'>
      {list.map((page) =>
        page.products.map((product, i) => (
          <AdminItem
            {...product}
            key={product.id}
            isEditing={editingIndex === i}
            startEdit={startEdit(i)}
            doneEdit={doneEdit}
          />
        ))
      )}
    </ul>
  );
};

export default ProductList;
