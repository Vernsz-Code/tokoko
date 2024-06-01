import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
      translation: {
        authR: "Register",
        authL: "Login",
        btnNext: "Next",
        btnBack: "Back",
        btnSumbit: "Sumbit",
        btnLogout: "Log Out",
        btnSetting: "Marketplace",
        feedback: "help & feedback",
        inputF: "Email or Phone",
        inputPass: "Enter your password",
        inputOTP: "Enter your OTP",
        inputUsername: "Enter your Username",
        inputFn: "Enter your firstname",
        inputLn: "Enter your lastname",
        inputSearch: "Type to search...",
        clickme: "Click Here!",
        labelPassword: "Password",
        labelUsername: "Username",
        labelFn: "Firstname",
        labelLn: "Lastname",
        nullData: "Field must be filled!",
        resendOTPB: "Resend on ",
        resendOTPA: "Resend",
        secondT: "s",
        toastOTPR: "OTP code was resend!",
        toastOTP: "OTP code was send!",
        toast1: "The account already exists, do you want to log in?",
        toast2: "There is no account yet, do you want to register?",
        toast3: "Sign in successfully, you will be directed to the main page",
        toast4: "your OTP code is wrong",
        toast5: "Are you sure want delete this data?",
        yes: "yes",
        makeMarketDialog: "Come on, register your account, sell your merchandise, and compete with others!",
        rMarket: "Come on, register!",
        marketRN: "FIll in Your Marketplace Data",
        marketNF: "Enter Your marketplace name",
        marketUF: "Enter Yourself name",
        marketOL: "Optional. This will use the username",
        marketDF: "Fill in Description",
        marketODL: "Opsional. This will blank text",
        successRM : "Success Register Your Own Marketplace!",
        failRM: "Failed Registery your own Marketplace!",
      },
    },
    id: {
      translation: {
        authR: "Daftar",
        authL: "Masuk",
        btnNext: "Selanjutnya",
        btnBack: "Kembali",
        btnSumbit: "Kirim",
        btnLogout: "Keluar",
        btnSetting: "Toko",
        feedback: "bantuan & masukan",
        inputPass: "Masukan password",
        inputOTP: "Masukan Kode OTP",
        inputUsername: "Masukan Username",
        inputFn: "Masukan nama depan",
        inputLn: "Masukan nama belakang",
        inputF: "Email atau No Telp",
        inputSearch: "Ketik untuk mencari...",
        clickme: "Klik sini!",
        labelPassword: "Password",
        labelUsername: "Username",
        labelFn: "Nama depan",
        labelLn: "Nama belakang",
        nullData: "Field harus diisi!",
        resendOTPB: "Kirim ulang dalam",
        resendOTPA: "Kirim ulang",
        secondT: "detik",
        toastOTPR: "Kode OTP telah dikirimkan!",
        toastOTP: "Kode OTP telah dikirimkan!",
        toast1: "Akun sudah ada, apakah anda ingin login?",
        toast2: "Akun belum ada, apakah anda ingin register",
        toast3: "berhasil Masuk, anda akan diarah kan ke halaman utama",
        toast4: "kode OTP anda salah",
        toast5: "Apakah anda yakin ingin menghapus data ini?",
        yes: "ya",
        makeMarketDialog: "Ayo daftarkan akunmu, jual barang-barang dagangan mu, dan bersaing dengan yang lain!",
        rMarket: "Ayo Daftarkan!",
        marketRN: "Isi Data Toko mu",
        marketNF: "Masukan Nama Tokomu",
        marketUF: "Masukan Namamu",
        marketOL: "Opsional. Ini akan menggunakan username",
        marketDF: "Isi deskripsi",
        marketODL: "Opsional. Ini akan dikosongkan",
        successRM : "Berhasil mendaftarkan Toko mu!",
        failRM: "Gagal mendaftarkan tokomu",
      },
    },
  };
  
  i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "id", 
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;