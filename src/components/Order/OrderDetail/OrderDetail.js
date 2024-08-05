import React, { useEffect, useState } from "react";
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const [fill1, setFill1] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/orderDetail/${id}`);
        setFill1(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, [id]);

  return (
    <div>
      <Header></Header>
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
            <a className="btn btn-primary" href="/order">
              Quay lại
            </a>
          </div>
        </div>
        {fill1.map((orderDetail, index) => (
          <div className="card mt-3" id="cartItem" key={index}>
            <div className="card-body">
              <div className="col-8">
                <div className="d-flex">
                  <div className="col-8 mt-3">
                    <div id="fontSizeTitle">{orderDetail.product.name}</div>
                    <div id="fontSize">
                      {orderDetail.product.productcategory.name +
                        ", " +
                        orderDetail.product.trademark.name +
                        ", " +
                        orderDetail.product.warranties.name}
                    </div>
                  </div>
                  <div className="col-8 mx-3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="card mt-3">
          <div className="card-body text-end">Tổng cộng: 1.000.000VNĐ</div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default OrderDetail;
