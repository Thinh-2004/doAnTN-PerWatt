import React from 'react';

const About = () => {
    return (
        <div className="d-flex justify-content-center mt-4">
          <div className="position-relative">
            <img
              src="https://cdn.tgdd.vn//GameApp/1395135//cach-choi-raiden-genshin-impact-thong-tin-guide-skill-moi-thumb-800x450.jpg"
              alt=""
              className="rounded-4"
             
            />
            <div className="position-absolute top-100 start-50 translate-middle shadow">
              <div className="bg-white rounded-4 p-3  " id="item-product">
                <h2 className="text-center mb-3">Danh mục nổi bật</h2>
                <div className="p-2 m-2" style={{ width: "600px" }}>
                  <div className="d-flex">
                    <a href="">
                      <img
                        src="https://img.advice.co.th/images_nas/pic_product4/A0051699/A0051699OK_BIG_1.jpg"
                        alt=""
                        className="img-fluid"
                      />
                      <p class="card-text text-center">RAM</p>
                    </a>
                    <a href="">
                      <img
                        src="https://bizweb.dktcdn.net/thumb/large/100/329/069/products/2-668a17f4-3ac6-4ee8-a049-b590fc87cfa2.png?v=1587457741607"
                        alt=""
                        className="img-fluid"
                      />
                      <p class="card-text text-center">Chuột</p>
                    </a>
                    <a href="">
                      <img
                        src="https://npc.vn/Content/uploads/2018/11/Mi%E1%BA%BFng-l%C3%B3t-chu%E1%BB%99t-SteelSeries-QcK-XXL-1-e1538470045685.jpg"
                        alt=""
                        className="img-fluid"
                      />
                      <p class="card-text text-center">Lót chuột</p>
                    </a>
                    <a href="">
                      <img
                        src="https://hanoicomputercdn.com/media/product/75916_ghe_game_dxracer_gaming_chair_drifting_c_neo_leatherette_black_white_l_gc_ldc23lta_nw_5.jpg"
                        alt=""
                        className="img-fluid"
                      />
                      <p class="card-text text-center">Ghế</p>
                    </a>
                    <a href="">
                      <img
                        src="https://www.mixie.vn/uploads/files/2022-04/cff1e841-16507123956263df4bec1c4.jpg"
                        alt=""
                        className="img-fluid"
                      />
                      <p class="card-text text-center">Tai nghe</p>
                    </a>
                    <a href="">
                      <img
                        src="https://hanoicomputercdn.com/media/product/76379_man_hinh_dell_p2424ht_850x850_3.jpg"
                        alt=""
                        className="img-fluid"
                      />
                      <p class="card-text text-center">Màn hình</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default About;