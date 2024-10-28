import React, { useEffect } from 'react';

const CheckTimeLogOut = () => {
   useEffect(() => {
    const loginTime = localStorage.getItem("loginTime")
    if(loginTime){//Kiểm tra sự tồn tại
        const currentTime = new Date().getTime();
        const threeDay = 3 * 24 * 60 * 60 * 1000; // 3 ngày tính = miliseconds

        //Kiểm tra nếu ngày đã lớn hơn 3
        if(currentTime - loginTime > threeDay){
            //Xóa dữ liệu đã hết hạn
            localStorage.clear();
            sessionStorage.clear();
        }
    }
   },[]);
};

export default CheckTimeLogOut;