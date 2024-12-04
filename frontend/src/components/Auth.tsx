import React, { useState } from "react";
import { signup, login } from "../api";

const Auth: React.FC = () => {
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      await signup(formData);
    } else {
      const { data } = await login(formData);
      localStorage.setItem("token", data.token);
      // ユーザー情報を保存、リダイレクトなど
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{isSignup ? "サインアップ" : "ログイン"}</h2>
        <input
          type="text"
          placeholder="ユーザー名"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="パスワード"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">{isSignup ? "登録" : "ログイン"}</button>
        <button type="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "ログインはこちら" : "サインアップはこちら"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
