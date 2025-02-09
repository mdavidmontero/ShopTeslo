"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export const OrderSummary = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  // Accede solo al estado del carrito
  const cart = useCartStore((state) => state.cart);

  // Memoiza los cálculos para evitar renderizados innecesarios
  const { itemsInCart, subTotal, tax, total } = useMemo(() => {
    const subTotal = cart.reduce(
      (sum, product) => product.quantity * product.price + sum,
      0
    );
    const tax = subTotal * 0.15;
    const total = subTotal + tax;
    const itemsInCart = cart.reduce(
      (count, product) => count + product.quantity,
      0
    );

    return { itemsInCart, subTotal, tax, total };
  }, [cart]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (itemsInCart === 0 && loaded) {
      router.replace("/empty");
    }
  }, [itemsInCart, loaded]);

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2">
      <span>No. Productos</span>
      <span className="text-right">
        {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  );
};
