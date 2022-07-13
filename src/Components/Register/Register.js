import styles from "./Register.module.css";
import React, { useState } from "react";
import axios from "axios";
import FormInput from "../../UI/Form/FormInput/FormInput";
import { registerAUser } from "../../storage/MongoDb";

const Register = () => {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    console.log(
      "%c --> %cline:14%ce.target",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
      e.target
    );

    const { name, value } = e.target;
    const groomedName = name.split("#")[1];
    setUser({
      ...user, //spread operator
      [groomedName]: value,
    });
  };
  //register function
  const egister = (e) => {
    e.preventDefault();

    const { userName, email, password } = user;
    console.log(
      "%c --> %cline:23%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
      user
    );
    if (userName && email && password) {
      // axios("http://localhost:8000/api/users/auth/register", user)
      registerAUser(user).then((res) => console.log(res));
    } else {
      alert("invalid input");
    }
  };
  return (
    <>
      <div className={styles["registration-container"]}>
        <div className={styles["registration-title-wrap"]}>
          <p className={styles["registration-container"]}>
            Create a new account
          </p>
        </div>
        <span className={styles["registration-question"]}>
          Already have an account ?
          <a
            href="#"
            target="_blank"
            className={styles["registration-sign-in-link"]}
          >
            Sign in
          </a>
        </span>
        <div className={styles["registration-form-wrap"]}>
          <form action="#">
            <div className={styles["registration-input-container"]}>
              <FormInput
                key={"register-4"}
                formNumber={1}
                inputDataObj={{
                  name: "userName",
                  title: "User Name",
                  type: "text",
                  value: user.name,
                  placeholder: "User Name",
                }}
                requiredError={{}}
                onChange={handleChange}
              />
            </div>

            <div className={styles["registration-input-container"]}>
              <FormInput
                key={"register-4"}
                formNumber={1}
                inputDataObj={{
                  name: "email",
                  title: "Email",
                  type: "email",
                  value: user.email,
                  placeholder: "Email Address",
                }}
                requiredError={{}}
                onChange={handleChange}
              />
            </div>

            <div className={styles["registration-input-container"]}>
              <FormInput
                key={"register-4"}
                formNumber={1}
                inputDataObj={{
                  name: "password",
                  title: "Password",
                  type: "password",
                  value: user.password,
                  placeholder: "Password",
                }}
                requiredError={{}}
                onChange={handleChange}
              />
            </div>

            <div class="flex w-full my-4">
              <button
                type="submit"
                class="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                onClick={egister}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Register;
