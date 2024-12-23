import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAznzuhI20QA0DDW23dYr-0-IblqWGX6Y",
  authDomain: "crypto-app-1751f.firebaseapp.com",
  projectId: "crypto-app-1751f",
  storageBucket: "crypto-app-1751f.firebasestorage.app",
  messagingSenderId: "303407768710",
  appId: "1:303407768710:web:faf340bb9b73d215f39d07",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App = () => {
  const [search, setSearch] = useState("");
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [user, setUser] = useState(null);

  const currencies = ["usd", "eur", "gbp", "jpy", "inr"];

  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: currency,
            order: "market_cap_desc",
            per_page: 20,
            page: 1,
          },
        }
      );
      setCryptos(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (id) => {
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
        {
          params: {
            vs_currency: currency,
            days: 7,
          },
        }
      );

      const prices = data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString(),
        price,
      }));

      setChartData({
        labels: prices.map((p) => p.time),
        datasets: [
          {
            label: `Price (${currency.toUpperCase()})`,
            data: prices.map((p) => p.price),
            borderColor: "#34d399",
            backgroundColor: "rgba(52, 211, 153, 0.2)",
            tension: 0.3,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", error.message);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    fetchCryptos();
  }, [currency]);

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCryptoClick = (crypto) => {
    setSelectedCrypto(crypto);
    fetchChartData(crypto.id);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="sticky top-0 bg-gray-800 shadow-md py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <h1 className="text-xl font-bold">Crypto Price Checker</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md bg-gray-700 px-4 py-2">
              <FiSearch className="text-yellow-400 text-xl" />
              <input
                type="text"
                placeholder="Search cryptocurrency..."
                className="ml-2 bg-transparent outline-none text-white placeholder-gray-400 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-4 py-2 outline-none"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr.toUpperCase()}
                </option>
              ))}
            </select>
            {!user ? (
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Login with Google
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="hero bg-gradient-to-r from-yellow-400 to-orange-600 text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Crypto Trends</h2>
          <p className="text-lg">Real-time data for the top cryptocurrencies.</p>
        </section>

        <section id="trends" className="py-8 container mx-auto px-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="bg-gray-800 rounded-md shadow-md p-4 transform transition duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleCryptoClick(crypto)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-12 h-12"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{crypto.name}</h3>
                      <p className="text-gray-400">
                        {crypto.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p>
                      <span className="text-gray-400">Current Price:</span> $
                      {crypto.current_price.toFixed(2)}
                    </p>
                    <p>
                      <span className="text-gray-400">24h Change:</span>{" "}
                      <span
                        className={
                          crypto.price_change_percentage_24h > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedCrypto && chartData && (
          <section id="chart" className="py-8 container mx-auto px-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
              <h3 className="text-2xl font-bold mb-4 text-center">
                {selectedCrypto.name} Price Chart (Last 7 Days)
              </h3>
              <div className="relative h-80">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                        labels: {
                          color: "#ffffff",
                        },
                      },
                    },
                    animation: {
                      duration: 1500,
                      easing: "easeInOutQuart",
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: "#ffffff",
                        },
                      },
                      y: {
                        ticks: {
                          color: "#ffffff",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      <footer id="contact" className="bg-gray-800 text-center py-4">
        <p>&copy; 2024 Crypto Price Checker, Ankit Kumar</p>
      </footer>
    </div>
  );
};

export default App;
