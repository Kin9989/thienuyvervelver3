import React, { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../functions/product";
import ProductCardv2 from "../cards/ProductCardv2/ProductCardv2";
import LoadingCard from "../cards/LoadingCard";
import { Pagination } from "antd";

// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    // sort, order, limit
    getProducts("sold", "desc", page).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4">
                <ProductCardv2 product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="row">
        <nav className="col-md-4 offset-md-4 d-flex justify-content-center pt-5 p-3">
          {/* <Pagination count={Math.ceil(productsCount / 3)} page={page} variant="outlined" color="secondary" onChange={(value) => setPage(value)} /> */}
          <Pagination
            current={page}
            total={(productsCount / 3) * 10}
            onChange={(value) => setPage(value)}
            simple
          />
        </nav>
      </div>
    </>
  );
};

export default BestSellers;
