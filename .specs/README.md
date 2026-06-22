# .specs/ — Spec-Driven Development (Backend)

Thư mục này là **nguồn sự thật duy nhất** cho mọi feature backend trong dự án.
Không có code nào được viết mà không có spec tương ứng ở đây.

---

## Triết lý

```
Requirements → Design → Tasks → Implement → Pest Tests
```

**Không bao giờ đi ngược lại.** Human phải approve từng bước trước khi tiến sang bước tiếp theo.

---

## Cấu trúc

```
.specs/
├── README.md
├── _templates/
│   ├── requirements.md   ← Copy khi tạo spec mới
│   ├── design.md
│   └── tasks.md
└── <module-name>/        ← Một folder per module/feature
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

---

## 3 bước của một Spec

| Bước | File | Ai làm | Trigger tiếp theo |
|------|------|--------|--------------------|
| **1. Requirements** | `requirements.md` | Dev/PM viết | Human approve → AI tạo Design |
| **2. Design** | `design.md` | AI generate | Human approve → AI tạo Tasks |
| **3. Tasks** | `tasks.md` | AI generate | Human approve → AI implement từng task |

---

## Trạng thái (Status)

Mỗi file có header `Status:` — chỉ được set bởi human:

```
DRAFT → IN_REVIEW → APPROVED → IN_PROGRESS → DONE
```

---

## Quy ước commit

Mỗi task hoàn thành = một commit riêng:

```
feat(language): T-006 create LanguageRepo
feat(language): T-007 create LanguageServiceInterface
test(language): T-012 add LanguageStoreTest
```

---

## Khi nào cần spec?

✅ Tạo module mới  
✅ Refactor đổi pattern lớn  
✅ Thêm endpoint có logic phức tạp  
✅ Breaking change trên API contract  
❌ Fix bug nhỏ < 10 lines — không cần spec
