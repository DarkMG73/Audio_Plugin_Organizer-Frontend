import styles from "./Login.module.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import FormInput from "../../UI/Form/FormInput/FormInput";
import { sign_inAUser } from "../../storage/audioToolsDB";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { authActions } from "../../store/authSlice";
const Login = (props) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  // const user = { name: "Mike Glass", email: "email@something.com" };
  useEffect(() => {}, [dispatch]);

  const handleChange = (e) => {
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

    const { email, password } = user;
    console.log(
      "%c --> %cline:23%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
      user
    );
    if (email && password) {
      // axios("http://localhost:8000/api/users/auth/register", user)
      sign_inAUser(user).then((res) => {
        console.log(res);
        dispatch(authActions.logIn(res.data.user));
      });
    } else {
      alert("invalid input");
    }
  };
  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-title-wrap"]}>
        <h3 className={styles["login-title"]}>Login</h3>
      </div>
      <span className={styles["login-question"]}>
        Need to register?
        <PushButton
          inputOrButton="button"
          id="create-entry-btn"
          colorType="primary"
          value="Add a Question"
          data=""
          size="small"
          onClick={props.toggleSignupLoginButtonHandler}
        >
          Sign Up &#10140;
        </PushButton>
      </span>
      <div className={styles["login-form-wrap"]}>
        <form className={styles["form"]} action="#">
          <div className={styles["form-input-container"]}>
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

          <div className={styles["form-input-container"]}>
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

          <div className={styles["form-submit-button-wrap"]}>
            <PushButton
              inputOrButton="button"
              id="create-entry-btn"
              colorType="primary"
              value="Add a Question"
              data=""
              size="medium"
              onClick={egister}
            >
              Login
            </PushButton>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
