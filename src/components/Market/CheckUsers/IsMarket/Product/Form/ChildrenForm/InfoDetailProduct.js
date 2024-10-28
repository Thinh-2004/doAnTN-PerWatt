import React from 'react';
import Category from '../../../CategoryProduct/Category';
import Brand from '../../../Brand/Brand';
import Warranties from '../../../Warranties/Warranties';
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const InfoDetailProduct = ({formProduct, handleInputChange}) => {
    return (
        <div className="rounded-4 mt-3">
            <Card className="">
              <h3 className="mx-4 mt-4">Thông tin chi tiết</h3>
              <CardContent className="">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="mb-4 d-flex">
                      {/* Category Component */}
                      <Category
                        name="productcategory"
                        value={formProduct.productcategory}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4 d-flex">
                      {/* Brand Component */}
                      <Brand
                        name="trademark"
                        value={formProduct.trademark}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4 d-flex">
                      {/* Warranties Component */}
                      <Warranties
                        name="warranties"
                        value={formProduct.warranties}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 border-start">
                    <div className="mb-4 d-flex">
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-select-small-label">
                          Chuyên dụng cho game
                        </InputLabel>
                        <Select
                          name="specializedgame"
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={formProduct.specializedgame}
                          label="Chuyện dụng cho game"
                          onChange={handleInputChange}
                        >
                          <MenuItem value="Y">Có</MenuItem>
                          <MenuItem value="N">Không</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="mb-4 d-flex">
                      <TextField
                        name="size"
                        id="outlined-multiline-static"
                        placeholder="Nhập kích cỡ (Ví dụ: 15.6 inch hoặc 10cm x 5cm x 3cm)"
                        label="Kích thước sản phẩm"
                        multiline
                        rows={3}
                        value={formProduct.size}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
    );
};

export default InfoDetailProduct;