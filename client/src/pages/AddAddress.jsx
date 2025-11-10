import { assets } from "../assets/assets";
import { useState } from "react";
import { useAppContext } from "../context/useAppContext";
import { toast } from "react-hot-toast";

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none
text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    name={name}
    onChange={handleChange}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const { axios, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/address/add', address);
      if (data.success) {
        toast.success('Address added successfully');
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  };

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md ">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              type="email"
              placeholder="Email"
            />
            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              type="text"
              placeholder="Street"
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                handleChange={handleChange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                handleChange={handleChange}
                address={address}
                name="zipCode"
                type="text"
                placeholder="Zip Code"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              type="tel"
              placeholder="Phone"
            />
            <button
              type="submit"
              className="w-full py-3 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
            >
              Save Address
            </button>
          </form>
        </div>
        <img
          src={assets.add_address_iamge}
          className="md:mr-16 mb_16 md:mt-0"
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
