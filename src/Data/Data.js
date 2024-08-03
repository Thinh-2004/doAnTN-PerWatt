import { UilInvoice, UilMoneyWithdrawal, UilStore, UilUser } from '@iconscout/react-unicons';

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
