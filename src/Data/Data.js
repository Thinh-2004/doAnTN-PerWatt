import { UilMoneyWithdrawal, UilStore, UilUser, UilProcess, UilTruck, UilCheckCircle, UilTimesCircle, UilRedo } from '@iconscout/react-unicons';

export const CardDataUs = [
  {
    title: "Đang chờ duyệt",
    color: {
      backGround: "linear-gradient(180deg, #ffb347 0%, #ffcc33 100%)",
      boxShadow: "0px 10px 20px 0px #fef0c2",
    },
    barValue: 70,
    value: "",
    png: UilProcess,
    series: [
      {
        name: "Đang chờ duyệt",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
  {
    title: "Chờ giao hàng",
    color: {
      backGround: "linear-gradient(180deg, #a8c0ff 0%, #3f2b96 100%)",
      boxShadow: "0px 10px 20px 0px #d0d9ff",
    },
    barValue: 80,
    value: "",
    png: UilTruck,
    series: [
      {
        name: "Chờ giao hàng",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
  {
    title: "Hoàn thành",
    color: {
      backGround: "linear-gradient(180deg, #00c6ff 0%, #0072ff 100%)",
      boxShadow: "0px 10px 20px 0px #c4e3f3",
    },
    barValue: 90,
    value: "",
    png: UilCheckCircle,
    series: [
      {
        name: "Hoàn thành",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
  {
    title: "Hủy",
    color: {
      backGround: "linear-gradient(180deg, #ff6b6b 0%, #f06595 100%)",
      boxShadow: "0px 10px 20px 0px #f9dada",
    },
    barValue: 50,
    value: "",
    png: UilTimesCircle,
    series: [
      {
        name: "Hủy",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
 
];

export const CardData = [
  {
    title: "Doanh thu",
    color: {
      backGround: "linear-gradient(180deg, #ff919d 0%, #fc929d 100%)",
      boxShadow: "0px 10px 20px 0px #fdc0c7",
    },
    barValue: 80,
    value: "14,200",
    png: UilMoneyWithdrawal,
    series: [
      {
        name: "Doanh thu",
        data: [10, 100, 50, 70, 80, 30, 40],
      }
    ]
  },
  {
    title: "Cửa hàng",
    color: {
      backGround: "linear-gradient(180deg, #f7ff00 0%, #db36a4 100%)",
      boxShadow: "0px 10px 20px 0px #f2dce8",
    },
    barValue: 60,
    value: "Active",
    png: UilStore,
    series: [
      {
        name: "Cửa hàng",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
  {
    title: "Người dùng",
    color: {
      backGround: "linear-gradient(180deg, #00c6ff 0%, #0072ff 100%)",
      boxShadow: "0px 10px 20px 0px #c4e3f3",
    },
    barValue: 50,
    value: "",
    png: UilUser,
    series: [
      {
        name: "Người dùng",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  }
];
