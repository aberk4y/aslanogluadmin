import { useState, useEffect } from "react";
import API from "./api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [prices, setPrices] = useState([]);
  const [productMargins, setProductMargins] = useState([]);

  const [marginType, setMarginType] = useState("percent");
  const [marginValue, setMarginValue] = useState("");

  useEffect(() => {
    if (token) {
      fetchPrices();
      fetchProductMargins();
    }
  }, [token]);

  const fetchPrices = async () => {
    try {
      const res = await API.get("/prices");
      setPrices(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProductMargins = async () => {
    try {
      const res = await API.get("/product-margin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductMargins(res.data);
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

  const updateGlobalMargin = async () => {
    try {
      await API.post(
        "/margin",
        { type: marginType, value: Number(marginValue) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPrices();
      alert("Global marj güncellendi");
    } catch {
      alert("Hata oluştu");
    }
  };

  const updateProductMargin = async (product) => {
    try {
      await API.post(
        "/product-margin",
        {
          product: product.product,
          buy_type: product.buy_type,
          buy_value: Number(product.buy_value),
          sell_type: product.sell_type,
          sell_value: Number(product.sell_value),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPrices();
      alert("Ürün marjı güncellendi");
    } catch (err) {
      console.log(err.response?.data);
      alert("Kaydedilemedi");
    }
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...productMargins];
    updated[index][field] = value;
    setProductMargins(updated);
  };

  if (!token) {
    return (
      <div className="bg-darkbg min-h-screen flex items-center justify-center">
        <div className="bg-cardbg border border-borderc p-10 rounded-2xl w-[350px] shadow-xl">
          <h2 className="text-gold text-2xl font-bold mb-6 text-center">
            Aslanoğlu Kuyumculuk Admin
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className="w-full p-3 rounded-lg bg-darkbg border border-borderc text-white"
              type="text"
              placeholder="Kullanıcı adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full p-3 rounded-lg bg-darkbg border border-borderc text-white"
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-gold text-black font-semibold p-3 rounded-lg">
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
        <h1 className="text-3xl font-bold text-gold">
          Aslanoğlu Kuyumculuk Yönetim Paneli
        </h1>
        <button
          onClick={handleLogout}
          className="border border-gold text-gold px-4 py-2 rounded-lg"
        >
          Çıkış Yap
        </button>
      </div>

      {/* GLOBAL MARGIN */}
      <div className="bg-cardbg border border-borderc p-6 rounded-2xl mb-10">
        <h3 className="text-xl text-gold font-semibold mb-4">
          Global Marj Ayarı
        </h3>

        <div className="flex gap-4 flex-wrap">
          <select
            className="bg-darkbg border border-borderc p-3 rounded-lg"
            value={marginType}
            onChange={(e) => setMarginType(e.target.value)}
          >
            <option value="percent">Yüzde (%)</option>
            <option value="tl">Sabit TL</option>
          </select>

          <input
            className="bg-darkbg border border-borderc p-3 rounded-lg"
            type="number"
            placeholder="Değer gir"
            value={marginValue}
            onChange={(e) => setMarginValue(e.target.value)}
          />

          <button
            onClick={updateGlobalMargin}
            className="bg-gold text-black px-6 rounded-lg font-semibold"
          >
            Güncelle
          </button>
        </div>
      </div>

      {/* PRODUCT MARGIN */}
      <div>
        <h2 className="text-2xl text-gold font-bold mb-6">
          Ürün Bazlı Marj Yönetimi
        </h2>

        <div className="space-y-6">
          {productMargins.map((item, index) => (
            <div
              key={item.product}
              className="bg-cardbg border border-borderc p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-4 text-gold">
                {item.product}
              </h3>

              <div className="grid md:grid-cols-4 gap-4">
                <select
                  value={item.buy_type}
                  onChange={(e) =>
                    handleProductChange(index, "buy_type", e.target.value)
                  }
                  className="bg-darkbg border border-borderc p-2 rounded"
                >
                  <option value="percent">% Buy</option>
                  <option value="tl">₺ Buy</option>
                </select>

                <input
                  type="number"
                  value={item.buy_value}
                  onChange={(e) =>
                    handleProductChange(index, "buy_value", e.target.value)
                  }
                  className="bg-darkbg border border-borderc p-2 rounded"
                />

                <select
                  value={item.sell_type}
                  onChange={(e) =>
                    handleProductChange(index, "sell_type", e.target.value)
                  }
                  className="bg-darkbg border border-borderc p-2 rounded"
                >
                  <option value="percent">% Sell</option>
                  <option value="tl">₺ Sell</option>
                </select>

                <input
                  type="number"
                  value={item.sell_value}
                  onChange={(e) =>
                    handleProductChange(index, "sell_value", e.target.value)
                  }
                  className="bg-darkbg border border-borderc p-2 rounded"
                />
              </div>

              <button
                onClick={() => updateProductMargin(item)}
                className="mt-4 bg-gold text-black px-4 py-2 rounded"
              >
                Kaydet
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;