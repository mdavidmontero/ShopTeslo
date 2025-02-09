export const revalidate = 0;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductImage, Title } from "@/components";
import { currencyFormat } from "@/utils";
import Link from "next/link";

type SearchParams = Promise<{ page?: string }>;

export default async function OrdersPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams; //
  const page = Number(searchParams?.page) || 1; //

  try {
    const { products, totalPages } = await getPaginatedProductsWithImages({
      page,
    });

    return (
      <>
        <Title title="Mantenimiento de productos" />

        <div className="flex justify-end mb-5">
          <Link href="/admin/product/new" className="btn-primary">
            Nuevo producto
          </Link>
        </div>

        <div className="mb-10">
          <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Imagen
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Título
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Precio
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Género
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Inventario
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Tallas
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td className="px-6 py-4">
                    <Link href={`/product/${product.slug}`}>
                      <ProductImage
                        src={product.ProductImage[0]?.url}
                        width={80}
                        height={80}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/product/${product.slug}`}
                      className="hover:underline"
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{currencyFormat(product.price)}</td>
                  <td className="px-6 py-4">{product.gender}</td>
                  <td className="px-6 py-4">{product.inStock}</td>
                  <td className="px-6 py-4">{product.sizes.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination totalPages={totalPages} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error cargando productos:", error);
    return <p className="text-red-500">Error al cargar los productos.</p>;
  }
}
