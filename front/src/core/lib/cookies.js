export const setCookie = (name, value, options) => {
  if (document && document !== undefined && name) {
    let stringOptions = '';
    if (options) {
      for (let key in options) {
        stringOptions += `${key}=${options[key]};`;
      }
    }
    document.cookie = `${name}=${value}; ${stringOptions}`;
  }
};

export const getCookie = (name) => {
  if (document && document !== undefined && name) {
    let cookies = document.cookie;
    const splitedCookies = cookies.split(';');
    let result = '';
    for (let item of splitedCookies) {
      const cookieName = item.split('=')[0];
      if (name === cookieName.trim()) {
        result = item.split('=')[1];
        break;
      }
    }
    return result;
  }
};

export const deleteCookie = (name) => {
  if (document && document !== undefined && name) {
    const expireTime = new Date();
    expireTime.setTime(expireTime.getTime() - 1);
    document.cookie = name += '=; expires=' + expireTime.toGMTString();
  }
}