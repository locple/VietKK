# Gõ tiếng Việt bằng kiểu gõ KK (Dual Keystrokes)

Đây là phương pháp nhấn phím đôi, có nghĩa là nhấn đồng thời 2 phím cạnh nhau để gõ dấu tiếng Việt, không nhấn tuần tự từng phím đơn để gõ dấu như các phương pháp trước đây.

Kiểu gõ này không chiếm dụng các dead key như S,F,R,X,J (TELEX) hay 1,2,3,4,5,6,7,8 (VNI) mà dùng các phím đôi chữ cái để gõ dấu tiếng Việt. Nhờ vậy có thể gõ văn bản hỗn hợp tiếng Việt và tiếng Anh hay gõ mật khẩu, các ký hiệu như (EF, A1...) một cách mượt mà, tiện lợi mà không cần phải chuyển đổi qua lại giữa chế độ gõ Anh - Việt.

Để người dùng TELEX dễ nhớ, KK cũng định nghĩa 5 **phím dấu thanh** gồm: **S, F, R, X, J** tương ứng với 5 dấu thanh (sắc, huyền, hỏi, ngã, nặng) trong tiếng Việt. Qua đó KK có 2 loại phím đôi:
- Phím đôi bên trái dấu thanh: gồm phím dấu thanh và phím sát bên trái nó
- Phím đôi bên phải dấu thanh: gồm phím dấu thanh và phím sát bên phải nó

# Hướng dẫn gõ dấu tiếng Việt trên bàn phím QWERTY:
<ins>**Trường hợp các từ có dấu thanh**</ins>: đầu tiên **gõ từ không dấu**, sau đó **thêm đồng thời dấu thanh và dấu phụ** (nếu có)  như hình dưới.
- Từ **không có dấu phụ thì nhấn cặp phím bên trái**
- Từ **có dấu mũ thì nhấn cặp phím bên phải**, nhấn lần nữa để thay đổi sang dấu trăng (breve) hay móc (horn)

<ins>**Trường hợp các từ không có dấu thanh mà chỉ có dấu phụ**</ins>: đầu tiên **gõ từ không dấu**, sau đó nhấn các phím đôi sau:
- Gõ dấu mũ (*circumflex*) thì nhấn phím đôi **I + O**
- Gõ dấu trăng (*breve*) hay dấu móc (*horn*) thì nhấn phím đôi **W + E**

<ins>**Trường hợp gõ phụ âm có dấu** (**Đ**)</ins>: nhấn phím đôi **D + F**

<img src="kk_layout_basic.jpg" width="800" height="300"/>

Tóm tắt kiểu gõ KK cơ bản:
- Gõ **chỉ dấu sắc** thì nhấn **S + A**; gõ **dấu sắc có mũ** thì nhấn **S + D**; gõ **dấu sắc có trăng hay dấu móc** thì nhấn **2 lần S + D**.
- Gõ **chỉ dấu huyền** thì nhấn **D + F**; gõ **dấu huyền có mũ** thì nhấn **F + G**; gõ **dấu huyền có trăng hay dấu móc** thì nhấn **2 lần F + G**.
- Gõ **chỉ dấu hỏi** thì nhấn **E + R**; gõ **dấu hỏi có mũ** thì nhấn **R + T**; gõ **dấu hỏi có trăng hay dấu móc** thì nhấn **2 lần R + T**.
- Gõ **chỉ dấu ngã** thì nhấn **Z + X**; gõ **dấu ngã có mũ** thì nhấn **X + C**; gõ **dấu ngã có trăng hay dấu móc** thì nhấn **2 lần X + C**.
- Gõ **chỉ dấu nặng** thì nhấn **H + J**; gõ **dấu nặng có mũ** thì nhấn **J + K**; gõ **dấu nặng có trăng hay dấu móc** thì nhấn **2 lần J + K**.
- Gõ phụ âm "Đ" thì nhấn **D + F**

Nếu thuần thục cách gõ KK cơ bản, có thể dùng các phím đôi KK mở rộng để gõ phụ âm kép hay nguyên âm kép nhanh hơn như hình dưới:

<img src="kk_layout_extended.jpg" width="800" height="80"/>

**Lưu ý KK là kiểu gõ dành cho máy tính (PC/ Laptop), không dùng cho thiết bị cảm ứng (smartphone, tablet...)**

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
