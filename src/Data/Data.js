import { UilInvoice, UilMoneyWithdrawal, UilStore, UilUser ,UilProcess, UilTruck, UilCheckCircle, UilTimesCircle, UilRedo} from '@iconscout/react-unicons';
export const CardDataUs = [
  {
    title: "Processing",
    color: {
      backGround: "linear-gradient(180deg, #ffb347 0%, #ffcc33 100%)",
      boxShadow: "0px 10px 20px 0px #fef0c2",
    },
    barValue: 70,
    value: "",
    png: UilProcess,
    series: [
      {
        name: "Processing",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
  {
    title: "Shipped",
    color: {
      backGround: "linear-gradient(180deg, #a8c0ff 0%, #3f2b96 100%)",
      boxShadow: "0px 10px 20px 0px #d0d9ff",
    },
    barValue: 80,
    value: "",
    png: UilTruck,
    series: [
      {
        name: "Shipped",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
  {
    title: "Delivered",
    color: {
      backGround: "linear-gradient(180deg, #00c6ff 0%, #0072ff 100%)",
      boxShadow: "0px 10px 20px 0px #c4e3f3",
    },
    barValue: 90,
    value: "",
    png: UilCheckCircle,
    series: [
      {
        name: "Delivered",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
  {
    title: "Cancelled",
    color: {
      backGround: "linear-gradient(180deg, #ff6b6b 0%, #f06595 100%)",
      boxShadow: "0px 10px 20px 0px #f9dada",
    },
    barValue: 50,
    value: "",
    png: UilTimesCircle,
    series: [
      {
        name: "Cancelled",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  },
  {
    title: "Returned",
    color: {
      backGround: "linear-gradient(180deg, #ff9a9e 0%, #fad0c4 100%)",
      boxShadow: "0px 10px 20px 0px #fcdada",
    },
    barValue: 65,
    value: "",
    png: UilRedo,
    series: [
      {
        name: "Returned",
        data: [],  // Dữ liệu sẽ được cập nhật từ API
      }
    ]
  }
];
export const CardData = [{
  title: "Bill",
  color: {
    backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
    boxShadow: "0px 10px 20px 0px #e0c6f5",
  },
  barValue: 70,
  value: "",
  png: UilInvoice,
  series: [
    {
      name: "Bill",
      data: [31, 40, 28, 51, 42, 109, 100],
    }
  ]
},
{
  title: "Revenue",
  color: {
    backGround: "linear-gradient(180deg, #ff919d 0%, #fc929d 100%)",
    boxShadow: "0px 10px 20px 0px #fdc0c7",
  },
  barValue: 80,
  value: "14,200",
  png: UilMoneyWithdrawal,
  series: [
    {
      name: "Revenue",
      data: [10, 100, 50, 70, 80, 30, 40],
    }
  ]
},

{
  title: "Store",
  color: {
    backGround: "linear-gradient(180deg, #f7ff00 0%, #db36a4 100%)",
    boxShadow: "0px 10px 20px 0px #f2dce8",
  },
  barValue: 60,
  value: "Active",
  png: UilStore,
  series: [
    {
      name: "Store",
      data: [],  // Dữ liệu sẽ được cập nhật từ API
    }
  ]
},
{
  title: "User",  // Thêm biểu đồ User
  color: {
    backGround: "linear-gradient(180deg, #00c6ff 0%, #0072ff 100%)",
    boxShadow: "0px 10px 20px 0px #c4e3f3",
  },
  barValue: 50,
  value: "",
  png: UilUser,
  series: [
    {
      name: "Users",
      data: [],  // Dữ liệu sẽ được cập nhật từ API
    }
  ]
}];
