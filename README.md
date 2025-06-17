# Gõ tiếng Việt bằng kiểu gõ KK (Dual Keystrokes)

Phím đôi có nghĩa là nhấn đồng thời 2 phím cạnh nhau để gõ dấu tiếng Việt, không gõ tuần tự từng phím đơn khi thêm dấu như các kiểu gõ trước đây.

Phương pháp này không chiếm dụng các phím chết như S,F,R,X,J (TELEX) hay 1,2,3,4,5,6,7,8 (VNI) để gõ dấu mà chỉ dùng các phím đôi chữ cái. Nhờ vậy có thể gõ văn bản hỗn hợp tiếng Việt và tiếng Anh một cách tiện lợi.

# Hướng dẫn gõ trên bàn phím QWERTY:
Đầu tiên **gõ chữ không có dấu**, sau đó **thêm đồng thời dấu thanh và dấu phụ** bằng cách nhấn cùng lúc cặp phím như hình dưới.
- **Phím dấu thanh chính** gồm: **S, F, R, X, J** (sắc, huyền, hỏi, ngã, nặng). Tùy theo dấu phụ cần gõ mà nhấn phím đôi trái hay phím đôi phải.
- Từ **không có dấu phụ thì nhấn cặp phím bên trái**, từ **có dấu phụ thì nhấn cặp phím bên phải** (nhấn luân phiên để thay đổi dấu phụ).

Ví dụ: **dấu sắc có mũ** thì nhấn **S** + phím phải (**D**); **chỉ dấu sắc** thì nhấn **S** + phím trái (**A**); **dấu sắc có trăng** thì nhấn **2 lần S + D**.

Phụ âm **Đ**: nhấn cặp phím **DF**. Ngoài ra, nếu thuần thục có thể dùng các cặp phím khác để gõ tiện hơn như ghi chú bên dưới.
<img src="kk_layout_basic.jpg" width="800" height="300"/>
<img src="kk_layout_extended.jpg" width="800" height="80"/>

# Online Demo: [kk.ai.vn](https://kk.ai.vn)

# Online Typing Test: [kk.ai.vn/test](https://kk.ai.vn/test)

# Minh họa cách nhúng VietKK vào trang web:
Chương trình vietkk.js dùng để tích hợp phương pháp gõ KK vào các TextBox, TextArea trên trình duyệt web (đã test trên MS Edge).
```javascript
<script type="text/javascript" src="vietkk.js"></script>
<script>
    var textArea = document.getElementById("userInput");
    var vKK = new VietKK();
    vKK.attach(textArea);
    vKK.setMode(1);
</script>
```
Tham khảo file example.html

© 2024 **Lê Phước Lộc** *(phuocloc@gmail.com)*
