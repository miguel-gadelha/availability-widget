class Validator {
  static email(email: string) {
    // Simple regex for basic email validation
    const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return re.test(String(email).toLowerCase());
  }

  static password(password: string) {
    // At least one number, one lowercase and one uppercase letter
    // At least eight characters
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  }
}

export default Validator;
