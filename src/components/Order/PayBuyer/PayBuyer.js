import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import useSession from "../../../Session/useSession";

const PayBuyer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedShippingInfo, setSelectedShippingInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const cartIds = query.get("cartIds");
  const [idUser] = useSession("id");

  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const getAvtUser = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (cartIds) {
          const response = await axios.get(`/cart?id=${cartIds}`);
          setProducts(response.data);
          console.log(response.data);
        }
        const paymentResponse = await axios.get("/paymentMethod");
        setPaymentMethods(paymentResponse.data);

        if (idUser) {
          const shippingInfoResponse = await axios.get(
            `/shippingInfo?userId=${idUser}`
          );
          setShippingInfo(shippingInfoResponse.data);
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [cartIds, idUser]);

  const groupByStore = (products) => {
    return products.reduce((groups, product) => {
      const storeId = product.product.store.id;
      if (!groups[storeId]) {
        groups[storeId] = {
          store: product.product.store,
          products: [],
        };
      }
      groups[storeId].products.push(product);
      return groups;
    }, {});
  };

  const groupedProducts = groupByStore(products);

  const handleOrder = async () => {
    try {
      if (!selectedPaymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
      }
      if (!selectedShippingInfo) {
        alert("Vui lòng chọn địa chỉ nhận hàng!");
        return;
      }

      const storeIds = [...new Set(products.map((p) => p.product.store.id))];
      const storeId = storeIds.length > 0 ? storeIds[0] : null;

      if (!storeId) {
        alert("Cửa hàng không hợp lệ!");
        return;
      }

      const order = {
        user: { id: idUser },
        paymentmethod: { id: selectedPaymentMethod },
        shippinginfor: { id: selectedShippingInfo },
        fee: { id: 1 },
store: { id: storeId },
        paymentdate: new Date().toISOString(),
        orderstatus: "Đang chờ duyệt",
      };

      const orderDetails = products.map((product) => ({
        product: { id: product.product.id },
        quantity: product.quantity,
        price: product.product.price,
      }));

      const response = await axios.post("/orderCreate", {
        order,
        orderDetails,
      });

      alert("Đặt hàng thành công!");
      navigate("/order");
    } catch (error) {
      alert("Đặt hàng thất bại!");
    }
  };

  return (
    <div>
      <Header />
      <div className="col-8 offset-2">
        {loading ? (
          <div>Loading...</div>
        ) : (
          Object.keys(groupedProducts).map((storeId) => {
            const { store, products: storeProducts } = groupedProducts[storeId];
            return (
              <div className="card mt-3" key={storeId}>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <img
                      src={getAvtUser(store.user.id, store.user.avatar)}
                      id="imgShop"
                      className="mx-2"
                      alt="Shop Logo"
                      style={{ height: "80%" }}
                    />
                    <h5 id="nameShop" className="mb-0">
                      {store.namestore}
                    </h5>
                  </div>
                  <hr id="hr" />
                  {storeProducts.map((cart) => {
                    const firstIMG =
                      Array.isArray(cart.product.images) &&
                      cart.product.images.length > 0
                        ? cart.product.images[0]
                        : null;
                    return (
                      <div className="d-flex" key={cart.product.id}>
                        {firstIMG ? (
                          <img
                            src={geturlIMG(cart.product.id, firstIMG.imagename)}
                            id="img"
                            alt="Product"
                          />
                        ) : (
                          <div>Không có ảnh</div>
                        )}
                        <div className="col-5 mt-3 mx-2">
                          <div id="fontSizeTitle">{cart.product.name}</div>
                          <div id="fontSize">
                            {`${cart.product.productcategory.name}, ${cart.product.trademark.name}, ${cart.product.warranties.name}`}
                          </div>
                        </div>
                        <div className="col-8 mx-3 mt-5">
                          <div className="d-flex">
                            <div className="col-3">
                              Giá: {cart.product.price} VNĐ
                            </div>
                            <div className="col-2">
                              Số lượng: {cart.quantity}
</div>
                            <div className="col-4">
                              Thành tiền: {cart.product.price * cart.quantity}{" "}
                              VNĐ
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
        <div className="card mt-3">
          <div className="row card-body">
            <div className="col-6">
              <select
                className="form-select"
                value={selectedPaymentMethod || ""}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">Chọn phương thức thanh toán</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <select
                className="form-select"
                value={selectedShippingInfo || ""}
                onChange={(e) => setSelectedShippingInfo(e.target.value)}
              >
                <option value="">Chọn địa chỉ nhận hàng</option>
                {shippingInfo.map((shipping) => (
                  <option key={shipping.id} value={shipping.id}>
                    {shipping.address}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            <button className="btn btn-primary" onClick={handleOrder}>
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PayBuyer;