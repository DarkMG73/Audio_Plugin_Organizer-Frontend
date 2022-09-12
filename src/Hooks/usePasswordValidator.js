import passwordValidator from "password-validator";

export const passwordRequirements =
  'The password must be at between 7 and 14 characters and inlcude at least one of each of the following: uppercase letter, lowercase letter and a number. It can not contain any spaces and can not be an unssafe password like "password123"';

// Add properties to it
const usePasswordValidator = () => {
  // Create a schema
  const outputFunction = () => {
    const schema = new passwordValidator();
    schema
      .is()
      .min(7) // Minimum length 8
      .is()
      .max(14) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .digits(1) // Must have at least 2 digits
      .has()
      .not()
      .spaces() // Should not have spaces
      .is()
      .not()
      .oneOf(["Passw0rd", "Password123"]); // Blacklist these values}
    return schema;
  };
  return outputFunction;
};

export default usePasswordValidator;
