export const commonErrors = [
  [400,'INVALID_REQUEST','JSON không hợp lệ; query/path/header sai định dạng, query/field không được hỗ trợ hoặc body sai schema. VALIDATION_ERROR có details.field cho lỗi trường.'],
  [401,'UNAUTHENTICATED / INVALID_TOKEN','API bảo vệ: thiếu Bearer, access token hết hạn/sai/bị thu hồi. WWW-Authenticate: Bearer realm="iam"; token sai thêm error="invalid_token". Login/refresh có mã riêng bên dưới.'],
  [403,'FORBIDDEN','Đã xác thực nhưng thiếu permission. Kiểm tra permission trước khi tra cứu tài nguyên; không có quyền đọc không được suy ra tài nguyên có tồn tại. Không áp dụng permission gate cho login/refresh/logout.'],
  [404,'NOT_FOUND','Route không tồn tại; với route hợp lệ, chỉ trả lỗi user/role cụ thể cho chủ thể đã đủ permission. Người dùng đã xóa mềm được coi là không tồn tại.'],
  [405,'METHOD_NOT_ALLOWED','Method không hỗ trợ ở URI; trả Allow liệt kê các method thực sự có.'],
  [406,'NOT_ACCEPTABLE','Accept loại trừ application/json; response lỗi vẫn dùng JSON theo hợp đồng.'],
  [413,'PAYLOAD_TOO_LARGE','Body vượt 64 KiB; từ chối trước khi xử lý. Không ghi nội dung credential vào log.'],
  [415,'UNSUPPORTED_MEDIA_TYPE','Request có JSON body nhưng Content-Type không phải application/json (chấp nhận tham số charset=utf-8). GET/DELETE không body không cần Content-Type.'],
  [429,'RATE_LIMITED','Vượt giới hạn endpoint/IP/chủ thể; Retry-After là số giây dương đến lúc thử lại. Login còn có AUTH_RATE_LIMITED riêng.'],
  [500,'INTERNAL_ERROR','Lỗi không dự kiến; message chung, requestId để tra log nội bộ; không trả stack, SQL hoặc token.'],
  [503,'SERVICE_UNAVAILABLE','DB, kho token hoặc audit không sẵn sàng; Retry-After: 30. Không bỏ qua xác thực/phân quyền, không commit mutation thiếu audit.']
];

const user = { id:'101', email:'cuong.le@example.edu.vn', fullName:'Lê Văn Cường', phone:'+84901234567', status:'active', createdAt:'2026-11-27T08:00:00Z', updatedAt:'2026-11-27T08:00:00Z' };
const member = { id:'4', code:'member', name:'Thành viên', isSystem:true };
const self = {...user, id:'5', email:'an.nguyen@example.edu.vn', fullName:'Nguyễn Văn An'};
const stringify=value=>JSON.stringify(value,null,2);
const json=(status,value,headers='')=>`HTTP/1.1 ${status}\nContent-Type: application/json; charset=utf-8\nCache-Control: no-store\nX-Request-Id: req-example${headers ? '\n'+headers : ''}\n\n${stringify(value)}`;
const noContent='HTTP/1.1 204 No Content\nCache-Control: no-store\nX-Request-Id: req-example';
const auth='Authorization: Bearer at_example_redacted';
const origin='Origin: https://admin.example.edu.vn';
const req=(method,path,body,headers='')=>`${method} /v1${path} HTTP/1.1\nHost: api.iam.example.edu.vn\n${origin}\n${headers ? headers+'\n' : ''}Accept: application/json${body !== undefined ? '\nContent-Type: application/json\n\n'+stringify(body) : ''}`;

export const details = [
  {
    id:'login', method:'POST',path:'/auth/login',title:'Đăng nhập', permission:'Không yêu cầu access token; email + mật khẩu trong body.',
    request:req('POST','/auth/login',{email:'an.nguyen@example.edu.vn',password:'Example-Only-Password!'}),
    response:json('200 OK',{data:{accessToken:'at_example_redacted',tokenType:'Bearer',expiresIn:300,refreshToken:'rt_example_redacted',refreshExpiresIn:1296000}}),
    rules:['email bắt buộc, tối đa 254 ký tự, trim + lowercase theo quy ước hệ thống; password là chuỗi 12–128 ký tự, không trim hoặc ghi log. Token ví dụ đã được thay bằng giá trị minh họa.',
      'Email không có, mật khẩu sai hoặc tài khoản bị khóa: cùng 401 AUTHENTICATION_FAILED, message chung. Dùng dummy password hash verification khi không có email để giảm chênh lệch thời gian.',
      'Mỗi lần thất bại đều ghi audit. Đếm theo email chuẩn hóa (kể cả không tồn tại) và IP. 5 lần sai đầu trong 15 phút trả 401; lần thứ 6 bị 429. Cửa sổ tính từ lần sai đầu, hết cửa sổ mới bỏ chặn; đúng mật khẩu trong thời gian chặn vẫn bị 429.',
      'Thành công tạo token family; access token 5 phút, refresh token tối đa 15 ngày tính từ lúc tạo family. Chỉ lưu token hash phía server; trả Cache-Control: no-store.'],
    errors:[[400,'VALIDATION_ERROR','Thiếu trường, email sai định dạng, password không đúng kiểu/độ dài; unknown field.'],[401,'AUTHENTICATION_FAILED','Email/mật khẩu không đúng hoặc tài khoản không được đăng nhập; không phân biệt lý do.'],[429,'AUTH_RATE_LIMITED','Vượt 5 lần sai trong 15 phút hoặc vượt quota IP; có Retry-After.']],
    errorExample:json('401 Unauthorized',{error:{code:'AUTHENTICATION_FAILED',message:'Thông tin đăng nhập không hợp lệ.',details:[],requestId:'req-example'}},'WWW-Authenticate: Bearer realm="iam"')
  },
  {
    id:'refresh',method:'POST',path:'/auth/refresh',title:'Làm mới token',permission:'Refresh token là credential; không yêu cầu access token còn hạn.',
    request:req('POST','/auth/refresh',{refreshToken:'rt_example_redacted'}),
    response:json('200 OK',{data:{accessToken:'at_new_redacted',tokenType:'Bearer',expiresIn:300,refreshToken:'rt_new_redacted',refreshExpiresIn:1295400}}),
    rules:['Body chỉ có refreshToken không rỗng, tối đa 512 ký tự. Xác thực hash, expiry của family, trạng thái user và trạng thái thu hồi trong kho token.',
      'Xoay refresh token bằng transaction: token cũ dùng một lần, token mới giữ cùng family và không kéo dài quá mốc 15 ngày ban đầu. expiresIn không vượt thời hạn còn lại của family.',
      'Tái sử dụng refresh token cũ → thu hồi toàn family và trả 401. Client serialize refresh, không tự retry token cũ khi kết quả lần trước không rõ; cần đăng nhập lại nếu không thể khôi phục.',
      'Logout dùng POST /auth/logout với {refreshToken}; server thu hồi family và mọi access token thuộc family. Token không còn hiệu lực khi logout lặp vẫn 204; thiếu body/field trả 400.'],
    errors:[[400,'VALIDATION_ERROR','Thiếu refreshToken, sai kiểu, chuỗi rỗng hoặc field thừa.'],[401,'INVALID_REFRESH_TOKEN','Sai/hết hạn/bị thu hồi, family không tồn tại, user khóa/xóa hoặc phát hiện token reuse.']],
    errorExample:json('401 Unauthorized',{error:{code:'INVALID_REFRESH_TOKEN',message:'Phiên không còn hiệu lực. Vui lòng đăng nhập lại.',details:[],requestId:'req-example'}},'WWW-Authenticate: Bearer realm="iam"')
  },
  {
    id:'me',method:'GET',path:'/me',title:'Xem hồ sơ của mình',permission:'profile.read. Chủ thể chỉ lấy từ access token đã xác minh.',
    request:req('GET','/me',undefined,auth),
    response:json('200 OK',{data:{...self,roles:[member],permissions:['password.change','profile.read','profile.update']}},'ETag: "u5-v1-a1"'),
    rules:['Không nhận userId để chọn người khác. Trả DTO không có password/hash/salt, cùng roles và quyền hiệu lực đã loại trùng, sắp xếp theo mã.',
      'PATCH /me chỉ nhận fullName/phone; cùng schema với PATCH user ở dưới. Không nhận email, roles, permissions, status hoặc id. If-Match dùng ETag của /me: gồm version user và authzVersion toàn hệ thống, tăng khi quan hệ/quyền hoặc metadata role đổi; tránh ETag cũ trong response có quyền hiệu lực.',
      'POST /me/password-changes nhận currentPassword/newPassword; kiểm tra password.change, mật khẩu hiện tại và chính sách độ dài. Sai mật khẩu hiện tại → 400 CURRENT_PASSWORD_INVALID; mới giống cũ → 400 PASSWORD_UNCHANGED. Thành công 204, thu hồi mọi phiên kể cả phiên gọi.'],
    errors:[[401,'UNAUTHENTICATED / INVALID_TOKEN','Thiếu/sai/hết hạn token hoặc user bị khóa/xóa khiến phiên bị thu hồi.'],[403,'FORBIDDEN','Không có profile.read. Không dùng /me để bỏ qua permission.']],
    errorExample:json('401 Unauthorized',{error:{code:'INVALID_TOKEN',message:'Phiên không còn hiệu lực.',details:[],requestId:'req-example'}},'WWW-Authenticate: Bearer realm="iam", error="invalid_token"')
  },
  {
    id:'list-users',method:'GET',path:'/users',title:'Danh sách người dùng có lọc và phân trang',permission:'users.read. Bộ lọc không mở rộng quyền của người gọi.',
    request:req('GET','/users?search=cuong&status=active&roleId=4&createdFrom=2026-11-01T00%3A00%3A00Z&createdTo=2026-12-01T00%3A00%3A00Z&sort=-createdAt&page=1&pageSize=20',undefined,auth),
    response:json('200 OK',{data:[user],meta:{page:1,pageSize:20,total:1,totalPages:1}}),
    rules:['search: tối đa 100 ký tự; tìm chứa trong fullName hoặc email, không phân biệt hoa/thường. status: active|locked; roleId: ID chuỗi số. Các filter kết hợp AND; roleId không có kết quả → 200 data:[], không phải 404.',
      'createdFrom inclusive, createdTo exclusive, RFC3339 UTC; from < to. sort cho phép createdAt/fullName/email, tiền tố - là giảm dần; luôn thêm id làm tie-breaker. Mặc định -createdAt.',
      'page nguyên ≥1; pageSize nguyên 1–100, mặc định 20. Quá trang cuối trả data:[] với meta đúng; danh sách rỗng totalPages=0. Từ chối query lạ, lặp tham số và giá trị sai.',
      'Không trả tài khoản đã xóa mềm. Danh sách và total được đọc trong cùng snapshot của response; dữ liệu có thể dịch chuyển giữa các lần tải khi hệ thống thay đổi.'],
    errors:[[400,'INVALID_QUERY','Sai enum, trang/size, sort, ID, khoảng thời gian; search quá dài, query lạ hoặc lặp.'],[401,'UNAUTHENTICATED / INVALID_TOKEN','Access token không dùng được.'],[403,'FORBIDDEN','Không có users.read.']],
    errorExample:json('400 Bad Request',{error:{code:'INVALID_QUERY',message:'Tham số không hợp lệ.',details:[{field:'pageSize',reason:'Phải là số nguyên từ 1 đến 100.'}],requestId:'req-example'}})
  },
  {
    id:'create-user',method:'POST',path:'/users',title:'Tạo người dùng',permission:'users.create và P(member) ⊆ P(actor) cho vai trò member được server gán mặc định.',
    request:req('POST','/users',{email:'cuong.le@example.edu.vn',password:'Example-Only-Password!',fullName:'Lê Văn Cường',phone:'+84901234567'},auth),
    response:json('201 Created',{data:user},'Location: /v1/users/101\nETag: "u101-v1"'),
    rules:['Cho phép đúng email/password/fullName/phone; email ≤254, fullName trim dài 2–120, phone tùy chọn hoặc null, nếu có phải E.164 (+ và 7–15 chữ số); password 12–128 ký tự. Field lạ bị từ chối.',
      'Server tự đặt id, status=active, thời gian, gán member mặc định; client không truyền role/status/isSystem. Đây là lựa chọn thiết kế để tài khoản mới dùng được hồ sơ cá nhân (FR-02), vẫn kiểm tra BR-02 cho quyền được gán ngầm.',
      'Email chuẩn hóa có UNIQUE index, bao gồm email đã xóa mềm để không tái dùng danh tính cũ; không dựa riêng vào kiểm tra trước INSERT. Hash bằng Argon2id, membership + user + audit cùng transaction.',
      'POST không mặc nhiên idempotent. Nếu timeout, client tra cứu email trước khi tạo lại; retry cùng email trả 409, không tạo hai tài khoản. Không trả mật khẩu trong response.'],
    errors:[[400,'VALIDATION_ERROR','Thiếu/sai field hoặc gửi field đặc quyền như roles/status.'],[401,'UNAUTHENTICATED / INVALID_TOKEN','Access token không dùng được.'],[403,'FORBIDDEN / PRIVILEGE_SCOPE_EXCEEDED','Thiếu users.create hoặc không được phép cấp toàn bộ quyền member.'],[409,'EMAIL_ALREADY_EXISTS','Trùng email sau chuẩn hóa, kể cả cạnh tranh đồng thời.']],
    errorExample:json('409 Conflict',{error:{code:'EMAIL_ALREADY_EXISTS',message:'Email đã được sử dụng.',details:[{field:'email',reason:'Email phải là duy nhất.'}],requestId:'req-example'}})
  },
  {
    id:'patch-user',method:'PATCH',path:'/users/{userId}',title:'Cập nhật một phần người dùng',permission:'users.update. Nếu chỉ sửa bản thân, dùng PATCH /me với profile.update.',
    request:req('PATCH','/users/101',{fullName:'Lê Văn Cường (mới)'},auth+'\nIf-Match: "u101-v1"'),
    response:json('200 OK',{data:{...user,fullName:'Lê Văn Cường (mới)',updatedAt:'2026-11-27T08:10:00Z'}},'ETag: "u101-v2"'),
    rules:['userId chuỗi số nguyên dương. Body không rỗng, chỉ fullName và/hoặc phone; cùng validation khi tạo. Không có field → không đổi; phone:null là xóa điện thoại. fullName:null không hợp lệ.',
      'Không cho sửa email, password, roles, permissions, status, createdAt, deletedAt hay id. Từ chối field lạ để tránh mass assignment, không im lặng bỏ qua.',
      'If-Match bắt buộc để tránh ghi đè thay đổi người khác. So phiên bản và UPDATE trong cùng transaction; thành công tăng version và trả ETag mới. Payload đặt giá trị nên lặp không làm cộng dồn; request lặp với ETag cũ trả 412.'],
    errors:[[400,'INVALID_REQUEST / VALIDATION_ERROR','ID/body sai, fullName rỗng, phone sai, field cấm hoặc body rỗng.'],[401,'UNAUTHENTICATED / INVALID_TOKEN','Access token không dùng được.'],[403,'FORBIDDEN','Thiếu users.update.'],[404,'USER_NOT_FOUND','User không tồn tại hoặc đã xóa.'],[428,'PRECONDITION_REQUIRED','Thiếu If-Match.'],[412,'PRECONDITION_FAILED','ETag cũ; GET lại dữ liệu, xử lý xung đột rồi gửi lại.']],
    errorExample:json('412 Precondition Failed',{error:{code:'PRECONDITION_FAILED',message:'Dữ liệu đã thay đổi. Vui lòng tải lại trước khi sửa.',details:[],requestId:'req-example'}})
  },
  {
    id:'assign-role',method:'PUT',path:'/users/{userId}/roles/{roleId}',title:'Gán vai trò cho người dùng',permission:'users.roles.assign và toàn bộ quyền role được gán nằm trong quyền hiện hành của actor (BR-02).',
    request:req('PUT','/users/101/roles/7',undefined,auth),response:noContent,
    rules:['Không có body. Dùng roleId ổn định, không dùng tên vai trò. User và role phải tồn tại. Lấy actor từ token; không nhận actorId/X-User-Role từ client.',
      'Trong transaction: đọc quyền hiện hành actor và role một cách nhất quán; kiểm tra P(role) ⊆ P(actor), rồi upsert membership với UNIQUE(userId,roleId). Không cấp role chứa quyền ngoài phạm vi kể cả role đó là mặc định.',
      'PUT lặp cùng quan hệ trả 204, chỉ tồn tại một dòng. Role isSystem không bị cấm gán; BR-05 cấm xóa/sửa quyền role, không cấm sử dụng role.',
      'Ghi audit cho mutation thực tế. Tự gán không thêm được quyền ngoài quyền sẵn có vì subset check; tự gỡ bị chặn ở endpoint tiếp theo.'],
    errors:[[400,'INVALID_REQUEST','userId/roleId sai, hoặc request gửi body.'],[401,'UNAUTHENTICATED / INVALID_TOKEN','Access token không dùng được.'],[403,'FORBIDDEN / PRIVILEGE_SCOPE_EXCEEDED','Thiếu quyền gán hoặc role vượt phạm vi actor; manager không gán được super_admin.'],[404,'USER_NOT_FOUND / ROLE_NOT_FOUND','User hoặc role không còn tồn tại.']],
    errorExample:json('403 Forbidden',{error:{code:'PRIVILEGE_SCOPE_EXCEEDED',message:'Không được cấp quyền vượt phạm vi của bạn.',details:[],requestId:'req-example'}})
  },
  {
    id:'revoke-role',method:'DELETE',path:'/users/{userId}/roles/{roleId}',title:'Gỡ vai trò khỏi người dùng',permission:'users.roles.revoke và P(role) ⊆ P(actor); cấm tự gỡ mọi vai trò, bảo vệ admin tối cao cuối cùng.',
    request:req('DELETE','/users/101/roles/7',undefined,auth),response:noContent,
    rules:['Không có body. Kiểm tra user/role tồn tại và permission; nếu actorId == userId trả 403 dù quan hệ có tồn tại hay không.',
      'Khi user/role còn tồn tại và actor có đủ phạm vi, quan hệ không có sẵn vẫn 204. DELETE lặp không lỗi vì membership đã mất; nếu user/role đã bị xóa, trả 404. Hạn chế phạm vi gỡ là lựa chọn bổ sung để manager không gỡ role cao hơn mình.',
      'Guard toàn cục + transaction kiểm tra sau khi gỡ vẫn còn ≥1 active super_admin. Vi phạm trả 409. Không dùng đếm ở ngoài transaction.',
      'Sau commit, quyền của target được tính lại trên mỗi request mới; role khác vẫn giữ quyền chung nếu còn. Request đã được cấp phép và commit trước lần thu hồi không thể bị đảo ngược.'],
    errors:[[400,'INVALID_REQUEST','ID sai hoặc gửi body.'],[401,'UNAUTHENTICATED / INVALID_TOKEN','Access token không dùng được.'],[403,'FORBIDDEN / SELF_ACTION_FORBIDDEN / PRIVILEGE_SCOPE_EXCEEDED','Thiếu quyền gỡ, role ngoài phạm vi hoặc đang gỡ role của chính mình.'],[404,'USER_NOT_FOUND / ROLE_NOT_FOUND','User/role không tồn tại.'],[409,'LAST_ACTIVE_ADMIN','Sẽ không còn super_admin hoạt động sau thao tác.']],
    errorExample:json('403 Forbidden',{error:{code:'SELF_ACTION_FORBIDDEN',message:'Không được tự gỡ vai trò của mình.',details:[],requestId:'req-example'}})
  },
  {
    id:'replace-permissions',method:'PUT',path:'/roles/{roleId}/permissions',title:'Thay toàn bộ tập quyền của vai trò',permission:'roles.permissions.update; role tùy chỉnh; proposedPermissions ⊆ currentPermissions(actor).',
    request:req('PUT','/roles/7/permissions',{permissions:['profile.read','profile.update','password.change','users.read']},auth+'\nIf-Match: "r7-v2"'),
    response:json('200 OK',{data:{roleId:'7',permissions:['password.change','profile.read','profile.update','users.read']}},'ETag: "r7-v3"'),
    rules:['Body có đúng permissions: mảng mã thuộc danh mục, không trùng, tối đa 21 mã (kích thước catalog phiên bản này). [] là tập rỗng hợp lệ cho role tùy chỉnh; không mang nghĩa cấp mọi quyền.',
      'PUT thay cả tập, không append. Quyền bị bỏ khỏi mảng sẽ bị thu hồi với mọi user mang role; cần hiển thị tác động này trên UI quản trị. Không có API xóa quyền riêng của một user trong role.',
      'isSystem=true → 403 SYSTEM_ROLE_PROTECTED. Với role tùy chỉnh, toàn bộ tập mới phải nằm trong quyền actor; đây là chính sách chặt hơn chỉ kiểm tra phần thêm. Không chấp nhận wildcard "*" hoặc quyền tự tạo.',
      'If-Match so version của ROLE (GET /roles/{id} và GET /roles/{id}/permissions trả cùng ETag). Thay membership quyền, tăng version, kiểm tra bất biến và ghi audit cùng transaction; mọi user chịu ảnh hưởng thấy quyền mới ngay sau commit.'],
    errors:[[400,'INVALID_REQUEST / VALIDATION_ERROR','ID sai, permissions thiếu/sai kiểu, mã lạ, trùng, wildcard hoặc field thừa.'],[401,'UNAUTHENTICATED / INVALID_TOKEN','Access token không dùng được.'],[403,'FORBIDDEN / SYSTEM_ROLE_PROTECTED / PRIVILEGE_SCOPE_EXCEEDED','Thiếu quyền, role mặc định hoặc tập quyền đề xuất vượt quyền actor.'],[404,'ROLE_NOT_FOUND','Role không còn tồn tại.'],[428,'PRECONDITION_REQUIRED','Thiếu If-Match.'],[412,'PRECONDITION_FAILED','Role đã thay đổi từ lần đọc trước.']],
    errorExample:json('403 Forbidden',{error:{code:'SYSTEM_ROLE_PROTECTED',message:'Không được thay tập quyền của vai trò hệ thống.',details:[],requestId:'req-example'}})
  },
  {
    id:'delete-role',method:'DELETE',path:'/roles/{roleId}',title:'Xóa vai trò',permission:'roles.delete; role không phải hệ thống và không có user mang vai trò.',
    request:req('DELETE','/roles/7',undefined,auth+'\nIf-Match: "r7-v3"'),response:noContent,
    rules:['Không có body. Đủ quyền trước khi tra cứu role. isSystem=true bị cấm xóa; role tùy chỉnh còn membership, kể cả user bị khóa, trả 409 ROLE_IN_USE.',
      'If-Match bắt buộc. Khóa role và kiểm tra membership trong cùng transaction; luồng gán role cũng phải khóa/serialize nhất quán. FK RESTRICT ngăn race gán trong lúc xóa. Xóa role_permissions, role và ghi audit cùng transaction.',
      'Không tự gỡ tất cả user để xóa cho bằng được. API DELETE lặp sau khi role đã mất trả 404; hiệu ứng vẫn idempotent vì tài nguyên tiếp tục không tồn tại.',
      'Audit giữ actorId, targetId và snapshot tên/code; không cascade xóa nhật ký khi xóa tài nguyên.'],
    errors:[[400,'INVALID_REQUEST','ID sai hoặc gửi body.'],[401,'UNAUTHENTICATED / INVALID_TOKEN','Access token không dùng được.'],[403,'FORBIDDEN / SYSTEM_ROLE_PROTECTED','Thiếu roles.delete hoặc cố xóa role mặc định.'],[404,'ROLE_NOT_FOUND','Role đã mất hoặc không tồn tại.'],[409,'ROLE_IN_USE','Vẫn còn user mang role, hoặc FK phát hiện quan hệ mới trong lúc cạnh tranh.'],[428,'PRECONDITION_REQUIRED','Thiếu If-Match.'],[412,'PRECONDITION_FAILED','Phiên bản role không còn khớp.']],
    errorExample:json('409 Conflict',{error:{code:'ROLE_IN_USE',message:'Vai trò vẫn đang được gán cho người dùng.',details:[],requestId:'req-example'}})
  }
];
