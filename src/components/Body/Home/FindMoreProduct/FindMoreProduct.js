import React, { useEffect, useState } from "react";
import Header from "../../../Header/Header";
import ToolBarFindMore from "./ToolBarFindMore";
import ListFindMore from "./ListFindMore";
import { useParams } from "react-router-dom";
import axios from "../../../../Localhost/Custumize-axios";
import { toast } from "react-toastify";
import SkeletonLoad from "../../../../Skeleton/SkeletonLoad";

const FindMoreProduct = () => {
  const name = useParams();
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(true); // trạng thái tải dữ liệu
  const load = async () => {
    try {
      const res = await axios.get(`findMore/${name.name}`);
      // Duyệt qua từng sản phẩm để lấy chi tiết sản phẩm và lưu vào productDetails
      const dataWithDetails = await Promise.all(
        res.data.map(async (product) => {
          const resDetail = await axios.get(`/detailProduct/${product.id}`);

          // Duyệt qua từng chi tiết sản phẩm để lấy số lượng đã bán
          const countOrderBy = await Promise.all(
            resDetail.data.map(async (detail) => {
              const res = await axios.get(`countOrderSuccess/${detail.id}`);
              return res.data; // Trả về số lượng đã bán cho chi tiết sản phẩm
            })
          );

          // Tính tổng số lượng sản phẩm đã bán cho tất cả chi tiết sản phẩm
          const countQuantityOrderBy = countOrderBy.reduce(
            (acc, quantity) => acc + quantity,
            0
          );

          return {
            ...product,
            productDetails: resDetail.data,
            countQuantityOrderBy, // lưu tổng số lượng đã bán
          };
        })
      );
      setFill(dataWithDetails);
      setLoading(false);
    } catch (error) {
      toast.error(error);
      console.log(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <div className="container-fluid mt-4 ">
        <div className="row">
          <div className="col-lg-3 col-md-3 col-sm-3 border-end">
            <ToolBarFindMore />
          </div>
          <div className="col-lg-9 col-md-9 col-sm-9">
            <div className="row d-flex justify-content-center">
              {loading ? <SkeletonLoad /> : <ListFindMore data={fill} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindMoreProduct;
