import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import { toast } from "react-hot-toast";

const SellerLogin = () => {
  const { setIsSeller, axios } = useAppContext();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/seller/login", { email, password });

      if (data.success) {
        // ✅ Store JWT token
        localStorage.setItem("sellerToken", data.token);

        // ✅ Mark as seller and redirect
        setIsSeller(true);
        toast.success("Login successful!");
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center text-sm text-gray-600"
    >
      <div
        className="flex flex-col gap-5 items-start p-8 py-12 min-w-80 
          sm:min-w-88 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto mb-3">
          <span className="text-primary">Seller </span>Login
        </p>

        <div className="w-full">
          <p className="font-medium">Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p className="font-medium">Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md cursor-pointer hover:opacity-90"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default SellerLogin;
