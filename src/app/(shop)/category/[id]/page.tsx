import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

const seedProducts = initialData.products;
interface Props {
  params: {
    id: Category;
  };
}
export default function ProductsCategoryPage({ params }: Props) {
  const { id } = params;

  const labels: Record<Category, string> = {
    men: "para Hombres",
    women: "para Mujeres",
    kid: "para Niños",
    unisex: "para todos",
  };

  const products = seedProducts.filter((product) => product.gender === id);
  // if (id === "kids") {
  //   notFound();
  // }
  return (
    <>
      <Title
        title={`Articulos ${labels[id]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid products={products} />
    </>
  );
}
