import validator from 'validator';

export const isValidRegistrationData = (userData) => {
  if (!userData) {
    return { code: 500, result: 'Missing required data' };
  }
  if (isObject(userData)) {
    const requiredFields = ['login', 'password', 'repeatedPassword', 'email', 'name'];
    for (let key in userData) {
      if (requiredFields.includes(key)) {
        if (key === 'login') {
          const isValidLogin = !validator.isEmpty(userData[key]) && validator.isAlphanumeric(userData[key]);
          if (!isValidLogin) {
            return { code: 500, result: 'Not valid login' };
          }
        } else if (key === 'password') {
          const isValidPassword = !validator.isAlpha(userData[key], ['ru-RU']) && !validator.isEmpty(userData[key]) && userData[key].length >= 6;
          if (!isValidPassword) {
            return { code: 500, result: 'Not valid password' };
          }
        } else if (key === 'repeatedPassword') {
          const isEqualPasswords = validator.equals(userData[key], userData.password) && !validator.isEmpty(userData[key]);
          if (!isEqualPasswords) {
            return { code: 500, result: 'Passwords do not match' };
          }
        } else if (key === 'email') {
          const validEmail = isValidEmail(userData[key]);
          if (!validEmail) {
            return { code: 500, result: 'Not valid email' };
          }
        } else if (key === 'name') {
          const isValidName = !validator.isEmpty(userData[key]);
          if (!isValidName) {
            return { code: 500, result: 'Not valid name' };
          }
        }
      } else {
        return { code: 500, result: 'Not valid data composition' };
      }
    }
    return { code: 200, result: 'OK' };
  } else {
    return { code: 500, result: 'Wrond data type' };
  }
};

export const isObject = (obj) => {
  if (!obj) {
    return false;
  }
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return true;
  } else {
    return false;
  }
};

export const isValidEmail = (value) => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  const validEmail = validator.isEmail(value) && !validator.isEmpty(value);
  return validEmail;
};