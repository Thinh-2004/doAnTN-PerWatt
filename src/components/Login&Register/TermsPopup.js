import React, { useContext } from "react";


const TermsPopup = () => {
  return (
    <div className="popup-overlay" >
      <div className="popup-content" >
        <div className="d-flex justify-content-around mt-3">
          <div className="overflow-auto w-75" style={{ height: "500px" }}>
            <h5 className="fw-bold">1. Giới thiệu và chấp nhận điều khoản</h5>
            <p>
              Chào mừng bạn đến với website PerWatt – nền tảng mua sắm trực
              tuyến các sản phẩm điện tử chất lượng cao. Khi truy cập, đăng ký
              tài khoản hoặc sử dụng bất kỳ dịch vụ nào trên website này, bạn
              đồng ý rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các điều
              khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào,
              vui lòng không tiếp tục sử dụng website. Chúng tôi có quyền sửa
              đổi, bổ sung hoặc cập nhật các điều khoản sử dụng này bất kỳ lúc
              nào nhằm đảm bảo tính phù hợp với các quy định pháp luật hiện hành
              và nhu cầu thực tiễn của dịch vụ. Mọi thay đổi sẽ được cập nhật
              trên website và có hiệu lực ngay lập tức.
            </p>
            <h5 className="fw-bold">2. Quy định về tài khoản người dùng</h5>
            <h6 className="fw-bold">2.1. Đăng ký tài khoản</h6>
            <p>
              Để sử dụng một số tính năng trên website, bạn cần đăng ký tài
              khoản và cung cấp các thông tin chính xác, đầy đủ bao gồm họ tên,
              email, số điện thoại và địa chỉ nhận hàng. Bạn chịu trách nhiệm
              hoàn toàn đối với thông tin đã cung cấp.
            </p>
            <h6 className="fw-bold">2.2. Bảo mật tài khoản</h6>
            <p>
              Bạn có trách nhiệm bảo mật tên đăng nhập và mật khẩu. Nếu bạn phát
              hiện có hành vi truy cập trái phép hoặc vi phạm bảo mật, vui lòng
              thông báo ngay cho chúng tôi qua email hoặc hotline. Chúng tôi
              không chịu trách nhiệm đối với các tổn thất phát sinh từ việc sử
              dụng trái phép tài khoản của bạn.
            </p>
            <h6 className="fw-bold">2.3. Chấm dứt tài khoản</h6>
            <p>
              Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn mà
              không cần thông báo nếu phát hiện hành vi vi phạm điều khoản sử
              dụng, gian lận hoặc gây hại đến hệ thống.
            </p>
            <h5 className="fw-bold">3. Quy định về sử dụng dịch vụ</h5>
            <h6 className="fw-bold">
              3.1. Người dùng không được phép sử dụng website để:
            </h6>
            <p>
              Phát tán nội dung vi phạm pháp luật, đạo đức, thuần phong mỹ tục.
              Lợi dụng website để thực hiện hành vi lừa đảo, gian lận hoặc vi
              phạm quyền lợi của các bên liên quan. Can thiệp vào hệ thống, làm
              gián đoạn dịch vụ hoặc gây hại cho website bằng các hành vi hack,
              sử dụng phần mềm độc hại.
            </p>
            <p></p>
            <h6 className="fw-bold">
              3.2. Chúng tôi có quyền kiểm soát, xóa hoặc chỉnh sửa nội dung do
              bạn đăng tải trên website nếu nội dung đó vi phạm quy định.
            </h6>
            <h5 className="fw-bold">4. Chính sách đặt hàng và thanh toán</h5>
            <h6 className="fw-bold">4.1. Quy trình đặt hàng</h6>
            <p>
              Sau khi đặt hàng, bạn sẽ nhận được email xác nhận đơn hàng. Đơn
              hàng chỉ được xử lý khi chúng tôi xác nhận thanh toán hoặc thỏa
              thuận phương thức thanh toán phù hợp. Nếu phát sinh lỗi kỹ thuật
              hoặc sự cố hệ thống dẫn đến việc giá hoặc thông tin sản phẩm không
              chính xác, chúng tôi có quyền hủy đơn hàng và thông báo lại với
              bạn.
            </p>
            <h6 className="fw-bold">4.2. Phương thức thanh toán</h6>
            <p>
              Chúng tôi cung cấp nhiều phương thức thanh toán, bao gồm:
              <ul>
                <li>
                  Thanh toán trực tuyến qua thẻ ngân hàng hoặc ví điện tử.
                </li>
                <li>Thanh toán khi nhận hàng (COD).</li>
              </ul>
            </p>
            <h6 className="fw-bold">4.3. Chính sách giá cả</h6>
            <p>
              Giá cả sản phẩm có thể thay đổi tùy thời điểm mà không cần báo
              trước. Giá được hiển thị trên website đã bao gồm thuế giá trị gia
              tăng (VAT) nhưng không bao gồm phí vận chuyển.
            </p>

            <h5 className="fw-bold">5. Chính sách đổi trả và bảo hành</h5>
            <h6 className="fw-bold">5.1. Điều kiện đổi trả</h6>
            <p>
              Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng và được đổi trả
              trong vòng 14 ngày.
            </p>
            <p>
              Chúng tôi chỉ chấp nhận đổi trả nếu sản phẩm bị lỗi từ nhà sản
              xuất hoặc không đúng với đơn hàng đã đặt.
            </p>
            <h6 className="fw-bold">5.2. Chính sách bảo hành</h6>
            <p>
              Sản phẩm được bảo hành theo chính sách của nhà sản xuất hoặc quy
              định riêng được ghi rõ trong mô tả sản phẩm.
            </p>
            <p>
              Khách hàng chịu chi phí vận chuyển sản phẩm bảo hành, trừ khi có
              quy định khác.
            </p>
            <h5 className="fw-bold">6. Bảo mật thông tin cá nhân</h5>
            <p>
              Chúng tôi cam kết bảo mật thông tin cá nhân của bạn và không sử
              dụng hoặc tiết lộ thông tin cho bên thứ ba trừ khi có sự đồng ý từ
              bạn hoặc theo quy định của pháp luật.
            </p>
            <h5 className="fw-bold">7. Quyền sở hữu trí tuệ</h5>
            <p>
              Toàn bộ nội dung trên website bao gồm văn bản, hình ảnh, thiết kế,
              mã nguồn và các tài nguyên khác thuộc quyền sở hữu của PerWatt
              hoặc các đối tác được cấp phép. Mọi hành vi sao chép, phát tán
              hoặc sử dụng trái phép đều bị nghiêm cấm và có thể bị xử lý theo
              pháp luật.
            </p>
            <h5 className="fw-bold">8. Giới hạn trách nhiệm</h5>
            <p>
              Chúng tôi không đảm bảo website sẽ hoạt động liên tục, không có
              lỗi hoặc không bị gián đoạn.
            </p>
            <p>
              Chúng tôi không chịu trách nhiệm với các tổn thất phát sinh do
              việc sử dụng website, trừ khi các tổn thất này trực tiếp do lỗi
              của chúng tôi gây ra.
            </p>
            <h5 className="fw-bold">9. Giải quyết tranh chấp</h5>
            <p>
              Mọi tranh chấp phát sinh liên quan đến việc sử dụng dịch vụ sẽ
              được ưu tiên giải quyết thông qua thương lượng. Nếu không đạt được
              thỏa thuận, tranh chấp sẽ được đưa ra tòa án có thẩm quyền tại
              Việt Nam.
            </p>
            <h5 className="fw-bold">10. Liên hệ hỗ trợ</h5>
            <p>
              Nếu có bất kỳ thắc mắc hoặc yêu cầu hỗ trợ, bạn có thể liên hệ với
              chúng tôi qua:
            </p>
            <p>Email: PerWatt@gmail.com.vn</p>
            <p>Hotline: 0845710208</p>
            <p>Địa chỉ: Cao đẳng FPT Polytechnic Cần Thơ</p>
            <h5 className="fw-bold">11. Điều khoản cuối cùng</h5>
            <p>
              Bằng việc sử dụng dịch vụ trên website, bạn đồng ý với các điều
              khoản này và mọi sửa đổi, bổ sung được công bố trong tương lai.
              Điều khoản này được điều chỉnh bởi pháp luật Việt Nam.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TermsPopup;
