// src/Data/Data.js
import { UilUsdSquare, UilMoneyWithdrawal, UilClipboardAlt } from '@iconscout/react-unicons';

export const CardData = [{
  title: "Sales",
  color: {
    backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
    boxShadow: "0px 10px 20px 0px #e0c6f5",
  },
  barValue: 70,
  value: "25,970",
  png: UilUsdSquare,
  series: [
    {
      name: "Sales",
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
  title: "Expenses",
  color: {
    backGround: "linear-gradient(180deg, #f7ff00 0%, #db36a4 100%)",
    boxShadow: "0px 10px 20px 0px #f2dce8",
  },
  barValue: 60,
  value: "10,300",
  png: UilClipboardAlt,
  series: [
    {
      name: "Expenses",
      data: [40, 50, 70, 80, 20, 30, 50],
    }
  ]
}];
