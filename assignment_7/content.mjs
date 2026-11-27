// Source: Ex. Web API RBAC.pdf, pages 1–9. Findings concern the supplied design, not a deployed backend.
export const findings = [
  ['Nghiêm trọng','Thông tin chung, kiểm tra X-User-Role; frontend loadUsers()','Tin header vai trò và việc ẩn nút ở frontend','Ranh giới tin cậy; kiểm tra quyền ở server','Người gọi tự đổi header thành admin/manager, vượt toàn bộ kiểm tra.','Bỏ X-User-Role. Xác minh Bearer token, lấy userId và tập quyền hiện hành từ backend; kiểm tra từng thao tác và đối tượng.'],
  ['Nghiêm trọng','#4 getUserById dùng cả cho hồ sơ cá nhân','Không kiểm tra quyền trên tài nguyên được truy cập','Object-level authorization; FR-02','Thành viên thay id để đọc hồ sơ người khác (IDOR).','Dùng GET /me cho hồ sơ cá nhân; GET /users/{userId} yêu cầu users.read. Không lấy chủ thể từ id do client tự khai.'],
  ['Nghiêm trọng','#5 createUser; #6 user/update','Nhận role, is_active, password và mọi trường trong body','Allowlist đầu vào; BR-02; least privilege','Tự nâng quyền, sửa tài khoản khác hoặc thay mật khẩu qua form hồ sơ.','Tách profile, trạng thái, mật khẩu, quan hệ role thành API riêng; từ chối trường ngoài schema. Kiểm tra quyền trên target ở server.'],
  ['Nghiêm trọng','#15 addRoleToUser; quy tắc manager','Manager gán được mọi vai trò, kể cả Admin','BR-02: không cấp quyền vượt quyền bản thân','Manager có thể tạo ra quản trị viên và chiếm quyền hệ thống.','Yêu cầu users.roles.assign và P(role được gán) ⊆ P(actor). Áp dụng cùng quy tắc cho cập nhật quyền của vai trò.'],
  ['Cao','Địa chỉ server và mọi URL mẫu','Dùng HTTP cho thông tin đăng nhập và token','NFR: chỉ HTTPS; bảo mật đường truyền','Mật khẩu và token có thể bị đọc hoặc sửa trên đường truyền.','Dùng https://api.iam.example.edu.vn/v1; không nhận credential qua HTTP; HSTS trên HTTPS.'],
  ['Cao','#1 login; ?token= trong mọi nhóm API','Đưa mật khẩu và token vào URL','Bảo vệ credential; tránh dữ liệu nhạy cảm trong URL','URL có thể xuất hiện trong history, log proxy, analytics và referrer.','POST JSON cho login; Authorization: Bearer cho API bảo vệ. Redact credential khỏi log.'],
  ['Cao','User; response #1, #3 và #10','Trả password hash và salt cho client','Data minimization; không lộ thông tin xác thực','Tăng khả năng bẻ mật khẩu offline; lộ dữ liệu cho người không cần biết.','Dùng DTO allowlist; tuyệt đối không trả password/hash/salt. Hash mật khẩu bằng Argon2id với salt do thư viện quản lý.'],
  ['Cao','#1 login: lỗi khác nhau và không giới hạn thử','Lộ email tồn tại; không chặn đoán mật khẩu','BR-09; chống enumeration và brute force','Có thể dò tài khoản, thử mật khẩu liên tục và làm cạn tài nguyên.','Một lỗi AUTHENTICATION_FAILED cho email/mật khẩu sai hoặc tài khoản khóa; rate limit theo IP và email chuẩn hóa, ghi log thất bại.'],
  ['Cao','#7 xóa user; #8 khóa; #16 gỡ role','Không chặn thao tác bất lợi lên chính mình','BR-03','Tự xóa, tự khóa hoặc tự gỡ vai trò, trái quy tắc nghiệp vụ.','So sánh actorId với targetId ở backend; trả 403 SELF_ACTION_FORBIDDEN, không chỉ vô hiệu hóa nút.'],
  ['Cao','#7, #8, #16; chưa có bảo vệ admin cuối','Không bảo đảm luôn còn quản trị viên tối cao hoạt động','BR-04; nhất quán khi có request đồng thời','Hai request có thể cùng vượt kiểm tra đếm và làm hệ thống mất mọi admin.','Khóa bản ghi guard chung trong transaction, kiểm tra trạng thái sau thay đổi rồi commit; vi phạm trả 409 LAST_ACTIVE_ADMIN.'],
  ['Cao','#14; thao tác quyền role #17; thiếu phân biệt role hệ thống','Không bảo vệ vai trò mặc định','BR-05','Xóa hoặc sửa tập quyền mặc định khiến hệ thống mất chính sách nền.','Role có isSystem do server quản lý; cấm DELETE và thay tập quyền bằng 403 SYSTEM_ROLE_PROTECTED; code không đổi qua API.'],
  ['Cao','#14 DELETE /role/3','Xóa role đang được gán hoặc biến lỗi FK thành 500','BR-06; toàn vẹn tham chiếu','User trỏ tới role không tồn tại; lỗi nội bộ bị lộ.','Kiểm tra membership trong transaction, FK RESTRICT làm lớp bảo vệ cuối; trả 409 ROLE_IN_USE, không cascade ngầm.'],
  ['Cao','Toàn bộ thiết kế: chưa mô tả thu hồi quyền/token','Chưa có cơ chế quyền thay đổi có hiệu lực ngay','BR-07','Nếu dùng quyền cache trong token hoặc session cũ, người bị thu hồi vẫn thao tác được.','Mỗi request kiểm tra phiên/token còn hiệu lực và đọc quyền hiện hành nhất quán; không tin quyền cũ trong token.'],
  ['Cao','#20 chỉ đọc log; không đặc tả ghi log','Thiếu ghi nhật ký cho thay đổi và đăng nhập thất bại','BR-08','Không truy vết được ai cấp quyền, xóa dữ liệu hoặc thử đăng nhập.','Ghi audit trong cùng transaction với mutation; lưu actor/action/target/time/requestId và diff đã redact. Log mọi login thất bại, kể cả bị rate limit.'],
  ['Cao','#5 createUser: password="123"; lỗi thiếu email','Thiếu validation và chính sách mật khẩu','Validation tại trust boundary','Chấp nhận mật khẩu yếu; request lỗi gây exception và HTTP 500.','Schema chặt, giới hạn độ dài, mật khẩu 12–128 ký tự; lỗi dữ liệu trả 400 với field, không để DB/exception quyết định validation.'],
  ['Cao','#5 lỗi email trùng và thiếu email; #14 lỗi FK','Lộ SQL, đường dẫn máy chủ và stack trace','Thông báo lỗi không lộ nội bộ; phân loại lỗi HTTP','Lộ cấu trúc DB và triển khai; frontend không phân biệt lỗi có thể sửa.','409 EMAIL_ALREADY_EXISTS/ROLE_IN_USE; 400 VALIDATION_ERROR. Lỗi bất ngờ dùng 500 INTERNAL_ERROR kèm requestId, chi tiết chỉ ở log nội bộ.'],
  ['Trung bình','CORS trong mục 1; đổi PUT/DELETE sang GET/POST','Wildcard origin đi cùng credentials, thiếu method/header và preflight','CORS; HTTP safe method','Trình duyệt chặn request; việc đổi method che lỗi cấu hình và làm sai hợp đồng API.','Allowlist đúng origin; hỗ trợ OPTIONS, Authorization, Content-Type, If-Match và mọi method cần thiết. Thiết kế này không dùng cookie nên credentials=omit.'],
  ['Trung bình','#1 GET login; #2 GET logout; #7 GET delete; #17 GET xóa quyền','GET làm thay đổi trạng thái','GET phải safe; thống nhất HTTP method','Link preview, prefetch hoặc cache có thể kích hoạt thao tác ngoài ý muốn.','POST /auth/login, /auth/logout; DELETE /users/{id}; PUT /roles/{id}/permissions thay tập quyền. GET chỉ đọc.'],
  ['Trung bình','Quy ước mọi API 200; 401 khi thiếu quyền; #4 không tìm thấy','Sai mã trạng thái HTTP','Phân biệt 400/401/403/404/409; Uniform Interface','Client, monitoring và retry hiểu sai kết quả.','200/201/204 khi thành công; 401 chưa xác thực, 403 thiếu quyền, 404 không có tài nguyên, 409 xung đột nghiệp vụ.'],
  ['Trung bình','#3 50.000 user; #20 khoảng 2 triệu log','Trả toàn bộ dữ liệu không phân trang','Khả năng mở rộng; giới hạn tài nguyên','Tốn băng thông, RAM và thời gian; có nguy cơ lộ dữ liệu hàng loạt.','users có page/pageSize ≤100; audit dùng cursor/limit ≤100 và index theo thời gian, actor, action.'],
  ['Trung bình','#6 PUT nhưng chỉ gửi fullName; đặt trường thiếu thành null','Nhầm cập nhật một phần với thay toàn bộ','Ngữ nghĩa PUT và PATCH','Đổi họ tên làm mất email, điện thoại và các trường khác.','PATCH /users/{id} chỉ cập nhật field allowlist được gửi; PUT chỉ dùng cho tập con được thay thế đầy đủ.'],
  ['Trung bình','User.role; #19 trả "manager"; Role.perms dạng chuỗi','Mô hình dữ liệu không biểu diễn đúng nhiều-nhiều','RBAC theo mô tả; tính nhất quán schema','Không gán được nhiều role đúng nghĩa; chuỗi quyền khó kiểm tra và bảo đảm FK.','Dùng UserRole, RolePermission và danh mục Permission cố định; trả roles/permissions dạng mảng.'],
  ['Trung bình','#15 mỗi lần thêm một dòng; #15/#16 dùng roleName','Quan hệ bị trùng và định danh theo tên có thể đổi','Idempotency; định danh ổn định','Retry tạo membership trùng; đổi tên role làm hỏng thao tác.','PUT/DELETE /users/{userId}/roles/{roleId}; UNIQUE(userId, roleId). PUT lặp vẫn 204, không tạo dòng mới.'],
  ['Trung bình','#17 /roles/3/users/5/permissions/delete/user_edit','Không xác định xóa quyền của role hay của riêng user','Mô hình RBAC và phạm vi tài nguyên','Sửa role có thể ảnh hưởng tất cả thành viên; override theo user không nằm trong mô hình đề bài.','Tập quyền thuộc Role: PUT /roles/{roleId}/permissions. Quyền user là hợp các role; không có direct grant/deny trong thiết kế này.'],
  ['Trung bình','#1/#2 và thông tin chung','Thiếu refresh token, vòng đời phiên và hiệu lực logout','FR-01; Stateless không đồng nghĩa bỏ thu hồi token','Hết hạn phải login lại; token cũ có thể còn dùng sau logout/khóa.','Access token ngắn hạn, refresh token xoay vòng; logout thu hồi family và access token liên quan; mỗi request mang credential đầy đủ.'],
  ['Trung bình','Frontend deleteUser() và loadUsers()','Parse JSON khi server trả text, không kiểm tra res.ok','Hợp đồng response; Fetch không reject khi HTTP 4xx/5xx','Xóa thành công nhưng parse lỗi; hoặc xóa dòng UI dù server từ chối.','Kiểm tra res.ok/status; 204 không parse body. Chỉ cập nhật UI khi thành công; hiển thị error.code/message, xử lý network error.'],
  ['Thấp','#3/#4/#5/#9/#10/#11–#21','URI dùng động từ, số ít/số nhiều và chữ hoa lẫn lộn','URI tài nguyên; path định danh, query để lọc','Khó đoán endpoint, khó bảo trì và viết client thống nhất.','/v1/users/{id}, /roles, /permissions, /audit-logs; tìm/lọc/phân trang dùng query, không tạo getAll/search/update riêng.'],
  ['Thấp','Mục 2 dữ liệu và các response','Tên field, kiểu dữ liệu, thời gian và envelope không nhất quán','Representation JSON thống nhất','Client phải đổi kiểu và viết nhiều nhánh parse; dễ sai múi giờ.','camelCase, id chuỗi, boolean thật, RFC3339 UTC; {data,meta}; lỗi {error:{code,message,details,requestId}}. Namespace quyền dùng resource.action.']
].map((f,i)=>({id:`R${String(i+1).padStart(2,'0')}`, severity:f[0], location:f[1], title:f[2], principle:f[3], consequence:f[4], fix:f[5]}));

export const permissions = [
  ['profile.read','Xem hồ sơ, vai trò và quyền của mình'], ['profile.update','Sửa họ tên, số điện thoại của mình'], ['password.change','Đổi mật khẩu của mình'],
  ['users.read','Xem danh sách/chi tiết người dùng'], ['users.create','Tạo người dùng'], ['users.update','Sửa họ tên/điện thoại người dùng'], ['users.status.update','Khóa/mở khóa người dùng'], ['users.delete','Xóa người dùng'],
  ['users.roles.read','Xem vai trò của người dùng'], ['users.roles.assign','Gán vai trò trong phạm vi được phép'], ['users.roles.revoke','Gỡ vai trò của người dùng khác'], ['users.permissions.read','Xem quyền hiệu lực người dùng'],
  ['roles.read','Xem danh sách/chi tiết vai trò'], ['roles.create','Tạo vai trò tùy chỉnh'], ['roles.update','Sửa tên/mô tả vai trò'], ['roles.delete','Xóa vai trò tùy chỉnh chưa được gán'], ['roles.permissions.read','Xem tập quyền vai trò'], ['roles.permissions.update','Thay tập quyền vai trò tùy chỉnh'], ['roles.users.read','Xem người dùng mang vai trò'],
  ['permissions.read','Xem danh mục quyền cố định'], ['audit.read','Xem nhật ký kiểm toán']
];
export const defaults = {
  super_admin: permissions.map(p=>p[0]),
  user_manager: ['profile.read','profile.update','password.change','users.read','users.create','users.update','users.status.update','users.roles.read','users.roles.assign','users.roles.revoke','users.permissions.read','roles.read','roles.permissions.read','roles.users.read','permissions.read'],
  auditor: ['profile.read','profile.update','password.change','users.read','users.roles.read','users.permissions.read','roles.read','roles.permissions.read','roles.users.read','permissions.read','audit.read'],
  member: ['profile.read','profile.update','password.change']
};

// [method, URI (relative to /v1), operation, required permission/credential, success, FR]
export const endpoints = [
  ['POST','/auth/login','Đăng nhập','Email + mật khẩu','200','FR-01'],
  ['POST','/auth/refresh','Xoay refresh token, cấp access token mới','Refresh token','200','FR-01'],
  ['POST','/auth/logout','Thu hồi token family; logout lặp vẫn thành công','Refresh token trong body','204','FR-01'],
  ['GET','/me','Hồ sơ + vai trò + quyền hiệu lực của mình','profile.read','200','FR-02'],
  ['PATCH','/me','Sửa fullName/phone của mình','profile.update','200','FR-02'],
  ['POST','/me/password-changes','Đổi mật khẩu bằng currentPassword/newPassword; thu hồi mọi phiên','password.change','204','FR-02'],
  ['GET','/users','Tìm, lọc, sắp xếp, phân trang người dùng','users.read','200','FR-03'],
  ['POST','/users','Tạo tài khoản active, gán member mặc định phía server','users.create','201','FR-04'],
  ['GET','/users/{userId}','Chi tiết người dùng','users.read','200','FR-04'],
  ['PATCH','/users/{userId}','Sửa fullName/phone, không sửa field đặc quyền','users.update','200','FR-04'],
  ['PUT','/users/{userId}/status','Thay trạng thái {status: active|locked}','users.status.update','200','FR-04'],
  ['DELETE','/users/{userId}','Xóa mềm, thu hồi phiên và bỏ membership','users.delete','204','FR-04'],
  ['GET','/users/{userId}/roles','Danh sách vai trò của người dùng','users.roles.read','200','FR-05'],
  ['PUT','/users/{userId}/roles/{roleId}','Gán quan hệ, không trùng khi retry','users.roles.assign','204','FR-05'],
  ['DELETE','/users/{userId}/roles/{roleId}','Gỡ quan hệ; cấm tự gỡ','users.roles.revoke','204','FR-05'],
  ['GET','/users/{userId}/permissions','Hợp các quyền hiệu lực, loại trùng','users.permissions.read','200','FR-05'],
  ['GET','/roles','Danh sách vai trò có phân trang','roles.read','200','FR-06'],
  ['POST','/roles','Tạo role với code/name/description, permissions rỗng','roles.create','201','FR-06'],
  ['GET','/roles/{roleId}','Chi tiết vai trò','roles.read','200','FR-06'],
  ['PATCH','/roles/{roleId}','Sửa name/description; code và isSystem bất biến','roles.update','200','FR-06'],
  ['DELETE','/roles/{roleId}','Xóa role tùy chỉnh chưa được gán','roles.delete','204','FR-06'],
  ['GET','/roles/{roleId}/permissions','Danh sách mã quyền của role','roles.permissions.read','200','FR-07'],
  ['PUT','/roles/{roleId}/permissions','Thay TOÀN BỘ tập quyền của role tùy chỉnh','roles.permissions.update','200','FR-07'],
  ['GET','/roles/{roleId}/users','Danh sách user mang role, có phân trang','roles.users.read','200','FR-07'],
  ['GET','/permissions','Danh mục quyền cố định có phân trang; không có CRUD','permissions.read','200','FR-08'],
  ['GET','/audit-logs','Nhật ký, lọc và phân trang cursor','audit.read','200','FR-09']
];

export const trace = [
  ['FR-01','Login, refresh, logout','/auth/login · /auth/refresh · /auth/logout'],
  ['FR-02','Hồ sơ bản thân, vai trò/quyền, đổi mật khẩu','/me · /me/password-changes'],
  ['FR-03','Tìm/lọc/sắp xếp/phân trang','GET /users'],
  ['FR-04','CRUD, khóa/mở khóa','/users · /users/{userId} · /users/{userId}/status'],
  ['FR-05','Vai trò và quyền hiệu lực người dùng','/users/{userId}/roles · /users/{userId}/permissions'],
  ['FR-06','CRUD vai trò','/roles · /roles/{roleId}'],
  ['FR-07','Tập quyền vai trò, user mang vai trò','/roles/{roleId}/permissions · /roles/{roleId}/users'],
  ['FR-08','Danh mục quyền cố định','GET /permissions'],
  ['FR-09','Nhật ký có bộ lọc','GET /audit-logs'],
  ['BR-01','Email, role code duy nhất','Chuẩn hóa + UNIQUE index; xung đột trả 409'],
  ['BR-02','Không cấp quyền vượt quyền mình','Subset check ở gán role và thay tập quyền; đọc quyền hiện hành trong transaction'],
  ['BR-03','Không tự xóa/khóa/gỡ role','actorId == targetId → 403 SELF_ACTION_FORBIDDEN'],
  ['BR-04','Luôn còn admin tối cao hoạt động','Guard chung + transaction; kiểm tra hậu trạng thái; 409 LAST_ACTIVE_ADMIN'],
  ['BR-05','Bảo vệ role mặc định','isSystem: true → cấm xóa/thay quyền, không thể đổi code/isSystem qua API'],
  ['BR-06','Không xóa role đang được gán','409 ROLE_IN_USE + FK RESTRICT'],
  ['BR-07','Thu hồi có hiệu lực ngay','Quyền hiện hành mỗi request; thu hồi phiên khi khóa/xóa/logout/đổi mật khẩu'],
  ['BR-08','Nhật ký thay đổi và login thất bại','Audit transaction; redact secret; fail closed khi không ghi bền được'],
  ['BR-09','Tài khoản khóa, quá 5 lần sai/15 phút','Khóa → cùng lỗi login chung; lần sai thứ 6 trong cửa sổ → 429 + Retry-After']
];
