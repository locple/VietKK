# Gõ tiếng Việt bằng KK (Key Combination)

Tổ hợp phím có nghĩa là nhấn đồng thời 2 hay nhiều phím, để xuất ra mỗi lần một chữ cái tiếng Việt có đầy đủ dấu *(không thêm dấu sau khi gõ nữa)*
- Mỗi nguyên âm có dấu được tổ hợp từ 2 phím lân cận.</li>
- Các phím dấu thanh có thể tổ hợp với phím nguyên âm không dấu hoặc tổ hợp phím nguyên âm có dấu.

Phương pháp này cho phép gõ xen kẽ tiếng Việt và tiếng Anh rất tiện lợi.
# Hướng dẫn gõ trên bàn phím QWERTY:
<img src="kk_keyboard_layout.jpg" width="800" height="400"/>

# Online Demo: [k2.ai.vn](https://k2.ai.vn)

# Minh họa cách nhúng VietKK vào trang web:
Chương trình vietkk.js dùng để tích hợp phương pháp gõ KK vào các TextBox, TextArea trên trình duyệt web (đã test trên MS Edge).
```javascript
<script type="text/javascript" src="vietkk.js"></script>
<script>
    var textArea = document.getElementById("userInput");
    var vKK = new VietKK();
    vKK.attach(textArea);
</script>
```
Tham khảo file example.html

© 2024 **Lê Phước Lộc** *(phuocloc@gmail.com)*
