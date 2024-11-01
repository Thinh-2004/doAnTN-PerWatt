import React, { useCallback, useEffect, useState } from "react";
import Header from "../../../Header/Header";
import ToolBarFindMore from "./ToolBar/ToolBarFindMore";
import ListFindMore from "./List/ListFindMore";
import { useParams } from "react-router-dom";
import axios from "../../../../Localhost/Custumize-axios";
import { toast } from "react-toastify";
import SkeletonLoad from "../../../../Skeleton/SkeletonLoad";
import { Pagination } from "@mui/material";
import useDebounce from "../../../../CustumHook/useDebounce";
import ButtonFilter from "./ToolBar/FilterButton/ButtonFilter";
import './FindMoreProductStyle.css'

const FindMoreProduct = () => {
  const name = useParams();
  const [fill, setFill] = useState([]);
  const [fullList, setFullList] = useState([]);
  const [loading, setLoading] = useState(true); // trạng thái tải dữ liệu

  //Dữ liệu từ componets con
  const [searchMoreProduct, setSearchMoreProduct] = useState();
  const debounceSearch = useDebounce(searchMoreProduct, 500);
  const [nameAddress, setNameAddress] = useState([]); //Mảng tên địa chỉ
  const [nameTradeMark, setNameTradeMark] = useState("");

  //State nhận giá trị min max từ components con
  const [minFCChildren, setMinFCChildren] = useState("");
  const [maxFCChildren, setMaxFCChildren] = useState("");
  const debounceMinFCChildren = useDebounce(minFCChildren, 500);
  const debounceMaxFCChildren = useDebounce(maxFCChildren, 500);

  //State nhận giá trị idShopType để lọc
  const [idShopType, setIdShopType] = useState("");

  //Nhận dữ liệu ở local sliderMinMax nếu rỗng thì lấy dữ liệu được người dùng chọn
  const arrayPrice = localStorage.getItem("sliderMinMax");
  const minPriceToSend = arrayPrice
    ? JSON.parse(arrayPrice)[0] // Lấy giá trị nhỏ nhất
    : debounceMinFCChildren; // Giá trị mặc định nếu không có trong localStorage
  const maxPriceToSend = arrayPrice
    ? JSON.parse(arrayPrice)[1] // Lấy giá trị lớn nhất
    : debounceMaxFCChildren; // Giá trị mặc định nếu không có trong localStorage

  //Nhận dữ liệu ở local tradeMark nếu rỗng thì lấy dữ liệu người dùng chọn
  const arrayTradeMark = localStorage.getItem("selectedTradeMark");
  const tradeMarkToSend = arrayTradeMark
    ? JSON.parse(arrayTradeMark).join(", ")
    : nameTradeMark;

  //Nhận dữ liệu ở local shopType nếu rỗng thì lấy dữ liệu người dùng chọn
  const arrayShopType = localStorage.getItem("selectedShopType");
  const shopTypeToSend = arrayShopType
    ? JSON.parse(arrayShopType).join(", ")
    : idShopType;

  // Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalPage, setTotalPage] = useState(0); //Tổng số trang

  // Pagination
  const [currentPageFe, setCurrentPageFe] = useState(1); //Trang hiện tại
  const itemInPage = 20;

  // //Lọc sản phẩm được chọn
  const filterAddress = fullList.filter((filter) => {
    const filterProductByAddress = filter.store.address.toLowerCase();
    return nameAddress.some((check) =>
      filterProductByAddress.includes(check.toLowerCase())
    );
  });

  //Tính toán
  const lastIndex = currentPageFe * itemInPage; // đi đến trang típ theo
  const firstIndex = lastIndex - itemInPage; //Trở về trang (Ví dụ: 40 - 20)
  const records = filterAddress.slice(firstIndex, lastIndex); //cắt danh sách fill sp cần show
  const pageCount = Math.ceil(filterAddress.length / itemInPage); //ceil để làm tròn số số trang
  //State truyền dữ liệu xuống components ButtonFilter
  const [sortOption, setSortOption] = useState(""); // Trạng thái cho sắp xếp
  const [isAscending, setIsAscending] = useState(true); // Trạng thái tăng/giảm giá
  const [isSortOption, setIsSortOption] = useState(true); //Trạng thái sắp xếp cũ nhất mới nhất

  const load = async (
    pageNo,
    pageSize,
    keyWord,
    sortBy,
    minPrice,
    maxPrice,
    shopType,
    tradeMark
  ) => {
    setFill([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `findMore/${name.name}?pageNo=${pageNo || ""}&pageSize=${
          pageSize || ""
        }&keyWord=${keyWord || ""}&sortBy=${sortBy || ""}&minPriceSlider=${
          minPrice || ""
        }&maxPriceSlider=${maxPrice || ""}&shopType=${
          shopType || ""
        }&tradeMark=${tradeMark || ""}`
      );
      // console.log(res.data);
      setCurrentPage(res.data.currentPage);
      setTotalPage(res.data.totalPage);
     

      setFill(res.data.products);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setLoading(false); // Tắt loading sau khi dữ liệu được tải
    }
  };

  const loadFullList = async (
    pageNo,
    pageSize,
    keyWord,
    sortBy,
    minPrice,
    maxPrice,
    shopType,
    tradeMark
  ) => {
    setFullList([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `findMore/${name.name}?pageNo=${pageNo || ""}&pageSize=${
          pageSize || ""
        }&keyWord=${keyWord || ""}&sortBy=${sortBy || ""}&minPriceSlider=${
          minPrice || ""
        }&maxPriceSlider=${maxPrice || ""}&shopType=${
          shopType || ""
        }&tradeMark=${tradeMark || ""}`
      );
      // console.log(res.data);
      setCurrentPage(res.data.currentPage);
      setTotalPage(res.data.totalPage);

      //Full list
      const dataWithDetailsFullList = await Promise.all(
        res.data.fullListProduct.map(async (product) => {
          const resDetail = await axios.get(`/detailProduct/${product.id}`);

          //Đếm số sản phẩm đã bán
          const countOrderBy = await Promise.all(
            resDetail.data.map(async (detail) => {
              const res = await axios.get(`countOrderSuccess/${detail.id}`);
              return res.data;
            })
          );

          //Đếm
          const countQuantityOrderBy = countOrderBy.reduce(
            (acc, quantity) => acc + quantity,
            0
          );

          return {
            ...product,
            productDetails: resDetail.data,
            countQuantityOrderBy,
          };
        })
      );
      setFullList(dataWithDetailsFullList);
      // console.log(dataWithDetailsFullList);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setLoading(false); // Tắt loading sau khi dữ liệu được tải
    }
  };

  useEffect(() => {
    let shopTypeQuery = "";
    if (shopTypeToSend.includes("1") && shopTypeToSend.includes("2")) {
      shopTypeQuery = ""; // Hiển thị tất cả sản phẩm
    } else if (shopTypeToSend.includes("1")) {
      shopTypeQuery = "1"; // Lọc sản phẩm có taxcode
    } else if (shopTypeToSend.includes("2")) {
      shopTypeQuery = "2"; // Lọc sản phẩm không có taxcode
    }

    const loadingData = async () => {
      if (
        debounceSearch ||
        sortOption ||
        (minPriceToSend && maxPriceToSend) ||
        shopTypeToSend ||
        tradeMarkToSend
      ) {
        await load(
          0,
          20,
          debounceSearch,
          sortOption,
          minPriceToSend,
          maxPriceToSend,
          shopTypeQuery,
          tradeMarkToSend
        );
      } else {
        await load(); // Gọi API mà không có giá trị
      }
    };

    //FullList
    const loadingDataFullList = async () => {
      if (
        debounceSearch ||
        sortOption ||
        (minPriceToSend && maxPriceToSend && nameAddress.length > 0) ||
        shopTypeToSend ||
        tradeMarkToSend
      ) {
        await loadFullList(
          0,
          20,
          debounceSearch,
          sortOption,
          minPriceToSend,
          maxPriceToSend,
          shopTypeQuery,
          tradeMarkToSend
        );
      } else {
        await loadFullList(); // Gọi API mà không có giá trị
      }
    };

    //Tải dữ liệu nếu không có địa chỉ nào được chọn
    if (nameAddress.length === 0) {
      loadingData();
    } else {
      loadingDataFullList();
    }
  }, [
    debounceSearch,
    sortOption,
    maxPriceToSend,
    minPriceToSend,
    nameAddress,
    shopTypeToSend,
    tradeMarkToSend,
  ]);

  // Sự kiện đặt lại giá trị cho số trang
  const handlePageChange = async (e, value) => {
    if (nameAddress.length === 0) {
      if (
        (debounceSearch ||
          sortOption ||
          debounceSearch ||
          shopTypeToSend ||
          tradeMarkToSend) &&
        minPriceToSend &&
        maxPriceToSend
      ) {
        await load(
          value - 1,
          20,
          debounceSearch,
          sortOption,
          minPriceToSend,
          maxPriceToSend,
          shopTypeToSend,
          tradeMarkToSend
        );
      } else {
        await load(value - 1, 20);
      }
      setCurrentPage(value);
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        setCurrentPageFe(value);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    // console.log(value);
  };

  //Hàm xử lí dữ liệu từ components con
  const dataTextSearch = useCallback((text) => {
    setSearchMoreProduct(text);
    // console.log(text);
  }, []);

  //Hàm xử lí dữ liệu từ components con
  const dataNameAddress = useCallback((address) => {
    setNameAddress(address);
  }, []);

  const dataNameTradeMark = useCallback((trademark) => {
    setNameTradeMark(trademark.join(", "));
    // console.log(trademark);
  }, []);

  // Hàm xử lý việc xóa bộ lọc
  const handleClearFilters = useCallback((clear) => {
    if (clear) {
      // Reset các giá trị filter về mặc định
      setMinFCChildren("");
      setMaxFCChildren("");
      localStorage.removeItem("sliderMinMax");

      //Delay 500ms để phù hợp với useDebounce
      const timer = setTimeout(() => {
        setNameAddress([]);
        setNameTradeMark("");
        setIdShopType("");
        localStorage.removeItem("selectedTradeMark");
        localStorage.removeItem("selectedAddress");
        localStorage.removeItem("selectedShopType");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  //Hàm xử lí lấy giá trị min max price để lọc
  const dataMinMaxPrice = useCallback((minMax) => {
    setMinFCChildren(minMax[0]);
    setMaxFCChildren(minMax[1]);
  }, []);

  //Hàm xử lí lấy giá trị idShopType để lọc
  const dataIdShopType = useCallback((idShopType) => {
    setIdShopType(idShopType.join(", "));
    // console.log(idShopType.join(", "));
  }, []);

  //Hàm xử lí khi giá trị của sắp xếp
  const handleSortOption = (value) => {
    // console.log(value);
    if ((value === "oldItems") | (value === "newItems")) {
      load(0, 20, searchMoreProduct, value);
      setSortOption(value);
      setIsSortOption(!isSortOption); // Đặt lại giá trị boolean
      setIsAscending(false); // Đặt lại giá trị boolean cho giá
    } else if ((value === "priceASC") | (value === "priceDESC")) {
      load(0, 20, searchMoreProduct, value);
      setSortOption(value);
      setIsAscending(!isAscending); //Đặt lại giá trị boolean cho giá
      setIsSortOption(false); //Đặt lại giá trị boolean cho sort
    } else if (value === "bestSeller") {
      load(0, 20, searchMoreProduct, value);
      setSortOption(value);
      setIsSortOption(false); //Đặt lại giá trị boolean cho sort
      setIsAscending(false); //Đặt lại giá trị boolean cho giá
    }
  };

  return (
    <>
      <Header />
      <div className="container-fluid  ">
        <div className="row">
          <div className="col-lg-3 col-md-3 col-sm-3 border-end">
            <ToolBarFindMore
              text={dataTextSearch}
              address={dataNameAddress}
              trademark={dataNameTradeMark}
              onClearFilters={handleClearFilters}
              valueMinMax={dataMinMaxPrice}
              idShopType={dataIdShopType}
            />
          </div>
          <div className="col-lg-9 col-md-9 col-sm-9">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 mt-3 mb-3">
                <ButtonFilter
                  isAscending={isAscending}
                  isSortOption={isSortOption}
                  valueSort={handleSortOption}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end mt-3 mb-3 ">
                <Pagination
                  count={nameAddress.length === 0 ? totalPage : pageCount}
                  page={nameAddress.length === 0 ? currentPage : currentPageFe}
                  onChange={handlePageChange}
                  variant="outlined"
                  color="primary"
                />
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              {loading ? (
                <SkeletonLoad />
              ) : (
                <ListFindMore
                  data={nameAddress.length === 0 ? fill : records}
                />
              )}
            </div>
            <div className="mt-3 mb-3 d-flex justify-content-center">
              <Pagination
                count={nameAddress.length === 0 ? totalPage : pageCount}
                page={nameAddress.length === 0 ? currentPage : currentPageFe}
                onChange={handlePageChange}
                variant="outlined"
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindMoreProduct;
