import request from "../utiles/request";

//获取验证码api
export const getCode = (data) => {
    return  request.post("/get/code", {
      tel: data.tel,
    });
};

//注册接口api
export const register = ({userName,passWord,validCode}) => {
    return request.post("/user/authentication",
      {
        userName,
        passWord,
        validCode,
      }
    )
}

//登录接口api
export const login = ({ userName, passWord}) => {
  return request.post("/login", {
    userName,
    passWord,
  });
};

//树形菜单权限数据
export const userGetMenu = () => {
  return request.get("/user/getmenu");
};
//权限修改 /user/setmenu
export const userSetMenu = ({name,permissions,id}) => {
  return request.post("/user/setmenu", {
    name,
    permissions,
    id,
  });
};

//菜单权限列表 /menu/list
export const MenuList = (params) => {
  return request.get("/menu/list", {params});
};

//菜单权限下拉/menu/selectlist
export const MenuSelectList = () => {
  return request.get("/menu/selectlist");
};

//账号管理列表/auth/admin
export const authAdminList = (params) => {
  return request.get("/auth/admin", { params });
};

//用户信息修改/update/user
export const updateUserData = ({ name, permissions_id }) => {
  return request.post("/user/setmenu", {
    name,
    permissions_id,
  });
};

//用户菜单权限/menu/permissions
export const menuPermissions = () => {
  return request.get("/menu/permissions");
};

//创建陪护师https://v3pz.itndedu.com/v3pz/companion
export const createCompanion = (data)=>{
  return request.post("/companion",data);
}

//陪护师列表/companion/list  
export const companionList = (params) => {
  return request.get("/companion/list",{params});
};

//陪护师头像/photo/list
export const photoList = () => {
  return request.get("/photo/list");
};

//陪护师删除 /delete/companion
export const deleteCompanion = (data) => {
  return request.post("/delete/companion", data);
};

//订单列表/admin/order
export const orderList = (params) => {
  return request.get("/admin/order",{params});
};

//服务状态完成POST   https://v3pz.itndedu.com/v3pz/update/order
export const updateOrder = (data) => {
  return request.post("/update/order", data);
};