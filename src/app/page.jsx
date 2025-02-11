"use client"; 

import { useState } from "react";

export default function POSApp() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const fetchProduct = async () => {
    const res = await fetch(`http://127.0.0.1:8000/product/${code}`);
    if (res.ok) {
      const data = await res.json();
      setProduct(data);
    } else {
      alert("商品が見つかりません");
    }
  };

  const addToCart = () => {
    if (product) {
      setCart([...cart, { ...product, quantity: 1 }]);
      setProduct(null);
      setCode("");
    }
  };

  const purchase = async () => {
    const res = await fetch("http://127.0.0.1:8000/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emp_code: "E001",
        store_code: "S001",
        pos_no: "90",
        items: cart.map(item => ({ code: item.code, quantity: item.quantity })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      alert(`購入完了！合計金額: ${data.total_amount}円`);
      setCart([]);
    } else {
      alert("購入に失敗しました");
    }
  };

  return (
    <div>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="商品コード" />
      <button onClick={fetchProduct}>商品検索</button>
      {product && <div>{product.name} - {product.price}円</div>}
      <button onClick={addToCart}>追加</button>
      <button onClick={purchase}>購入</button>
    </div>
  );
}
