import InputForm from "../Elements/Input";
import Button from "../Elements/Button"
import axios from "axios";

const FormLogin = () => {
    const handleLogin = async (e) => {
      e.preventDefault();
      let username = e.target.username.value;
      let password = e.target.password.value;
        
        try {
          const response = await axios.post('https://violet-grass-drug.glitch.me/login', {
            username, 
            password,
          });
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          console.log(response.data);
          localStorage.setItem('token', response.data.token);
          //setToken(response.data.token); // Simpan token
         // alert('Login successful!'); // Pesan sukses
          window.location.href = '/';
        } catch (error) {
          alert(error.response.data); // Tampilkan pesan error
          console.error('Login error:', error.response.data); // Tampilkan pesan error di konsol
        }
      };

    return (
        <form onSubmit={handleLogin}>
            <InputForm type="text" name="username" label="Username" placeholder="Your Name" />
            <InputForm type="password" name="password" label="Password" placeholder="*****" />
            <Button classname="bg-black w-full" type="submit">Login</Button>
          </form>
    )
}

export default FormLogin;