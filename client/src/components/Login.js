import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        //👇🏻 Calls the function
        postLoginDetails();
        setPassword("");
        setEmail("");
    };

    

    const gotoSignUpPage = () => navigate("/register");

    return (
        <div className='login__container'>
            <h2>Login </h2>
            <form className='login__form' onSubmit={handleSubmit}>
                <label htmlFor='email'>Email</label>
                <input
                    type='text'
                    id='email'
                    name='email'
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='loginBtn'>SIGN IN</button>
                <p>
                    Don't have an account?{" "}
                    <span className='link' onClick={gotoSignUpPage}>
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
};

const postLoginDetails = () => {
    fetch("http://localhost:4000/api/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error_message) {
                alert(data.error_message);
            } else {
                //👇🏻 Logs the username to the console
                console.log(data.data);
                //👇🏻 save the username to the local storage
                localStorage.setItem("username", data.data.username);
                //👇🏻 Navigates to the 2FA route
                navigate("/phone/verify");
            }
        })
        .catch((err) => console.error(err));
};

//👇🏻 variable that holds the generated code
let code;

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    let result = users.filter(
        (user) => user.email === email && user.password === password
    );

    if (result.length !== 1) {
        return res.json({
            error_message: "Incorrect credentials",
        });
    }
    code = generateCode();

    //👇🏻 Send the SMS via Novu
    sendNovuNotification(result[0].tel, code);

    res.json({
        message: "Login successfully",
        data: {
            username: result[0].username,
        },
    });
});

const postVerification = async () => {
    fetch("http://localhost:4000/api/verification", {
        method: "POST",
        body: JSON.stringify({
            code,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error_message) {
                alert(data.error_message);
            } else {
                //👇🏻 Navigates to the dashboard page
                navigate("/dashboard");
            }
        })
        .catch((err) => console.error(err));
};
const handleSubmit = (e) => {
    e.preventDefault();
    //👇🏻 Calls the function
    postVerification();
    setCode("");
};
app.post("/api/verification", (req, res) => {
    if (code === req.body.code) {
        return res.json({ message: "You're verified successfully" });
    }
    res.json({
        error_message: "Incorrect credentials",
    });
});

export default Login;