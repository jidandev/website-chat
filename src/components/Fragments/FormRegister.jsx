import InputForm from "../Elements/Input";
import Button from "../Elements/Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";


const FormRegister = () => {
  const Navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        let username = e.target.username.value;
        let password = e.target.password.value;
        let confirmpassword = e.target.confirmpassword.value;
        let terlarang = ["Kontol", "Memek", "Halo", "Dick", "Pussy", "test", "tes"];

        for (let word of terlarang) {
          if (username.toLowerCase().includes(word.toLowerCase())) {
            alert('Nama terdapat kata terlarang');
            return false;
          }
        }
        if(password !== confirmpassword) {
            alert('Confirm password tidak sama dengan password');
            return false;
        }
        try {
          const response = await axios.post('https://violet-grass-drug.glitch.me/register', {
            username,
            password,
          });
          console.log(response.data);
          alert('Registration successful! Please log in.'); // Pesan sukses
          Navigate('/login');
        } catch (error) {
          alert(error.response.data); // Tampilkan pesan error
          console.error('Registration error:', error.response.data); // Tampilkan pesan error di konsol
        }
        console.log('p')
      };
      console.log('p')
    return (
        <form onSubmit={handleRegister}>
            <InputForm type="text" name="username" label="Username" placeholder="Your Name" />
            <InputForm type="password" name="password" label="Password" placeholder="*****" />
            <InputForm type="password" name="confirmpassword" label="Confirm Password" placeholder="*****" />
            <Button classname="bg-black w-full" type="submit">Register</Button>
          </form>
    )
}

export default FormRegister;