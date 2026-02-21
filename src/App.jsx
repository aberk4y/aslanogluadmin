import { useState, useEffect } from "react";
import API from "./api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [prices, setPrices] = useState([]);
  const [marginType, setMarginType] = useState("percent");
  const [marginValue, setMarginValue] = useState("");

  useEffect(() => {
    if (token) fetchPrices();
  }, [token]);

  const fetchPrices = async () => {
    try {
      const res = await API.get("/prices");
      setPrices(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch {
      alert("Giriş başarısız");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const updateMargin = async () => {
    try {
      await API.post(
        "/margin",
        { type: marginType, value: Number(marginValue) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPrices();
      alert("Marj güncellendi");
    } catch {
      alert("Hata oluştu");
    }
  };

  if (!token) {
    return (
      <div className="bg-darkbg min-h-screen flex items-center justify-center">
        <div className="bg-cardbg border border-borderc p-10 rounded-2xl w-[350px] shadow-xl">
          <h2 className="text-gold text-2xl font-bold mb-6 text-center">
            Aslanoglu Kuyumculuk Admin
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className="w-full p-3 rounded-lg bg-darkbg border border-borderc text-white focus:outline-none focus:border-gold"
              type="text"
              placeholder="Kullanıcı adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full p-3 rounded-lg bg-darkbg border border-borderc text-white focus:outline-none focus:border-gold"
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-gold text-black font-semibold p-3 rounded-lg hover:opacity-90 transition">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-darkbg min-h-screen text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">Kuyumcu Panel</h1>
        <button
          onClick={handleLogout}
          className="border border-gold text-gold px-4 py-2 rounded-lg hover:bg-gold hover:text-black transition"
        >
          Çıkış Yap
        </button>
      </div>

      {/* Margin Card */}
      <div className="bg-cardbg border border-borderc p-6 rounded-2xl mb-8">
        <h3 className="text-xl text-gold font-semibold mb-4">
          Kar Marjı Ayarı
        </h3>
        <div className="flex gap-4 flex-wrap">
          <select
            className="bg-darkbg border border-borderc p-3 rounded-lg"
            value={marginType}
            onChange={(e) => setMarginType(e.target.value)}
          >
            <option value="percent">Yüzde (%)</option>
            <option value="fixed">Sabit TL</option>
          </select>

          <input
            className="bg-darkbg border border-borderc p-3 rounded-lg"
            type="number"
            placeholder="Değer gir"
            value={marginValue}
            onChange={(e) => setMarginValue(e.target.value)}
          />

          <button
            onClick={updateMargin}
            className="bg-gold text-black px-6 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Güncelle
          </button>
        </div>
      </div>

      {/* Prices Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {prices.map((item, index) => (
          <div
            key={index}
            className="bg-cardbg border border-borderc p-4 rounded-xl hover:border-gold transition"
          >
            <h4 className="text-gold font-semibold mb-2">{item.key}</h4>
            <p>Satış: {item.sell}</p>
            <p className="font-bold text-gold">
              Marjlı: {item.sell_with_margin}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;