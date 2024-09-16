import { useEffect, useState } from "react";
import { getCrypto } from "../../api/external";
import Loader from "../../components/Loader/Loader";
import styles from './Crypto.module.css'

function Crypto() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        (async function cryptoApiCall() {

            try {
                const response = await getCrypto();

                if (response && Array.isArray(response)) {
                    setData(response); 
                } else {
                    console.error('Invalid data:', response);
                }

            } catch (error) {
                    console.error('Error fetching crypto data:', error);
            }finally {
                setLoading(false);
            }
           
        })();

        //cleanup
        setData([]);
    }, []);

    if (loading) {
        return <Loader text="cryptocurrencies" />
    }


    if (data.length === 0) {
        return <div>No crypto data available.</div>; 
    }

    const negativeStyle = {
        color: '#ea3043'
    }
    const positviStyle = {
        color: '#16c784'
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.head}>
                        <th>#</th>
                        <th>Coin</th>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>24h</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((coin) => (
                        <tr id={coin.id} className={styles.tableRow}>
                            <td>{coin.market_cap_rank}</td>
                            <td>
                                <div className={styles.logo}>
                                    <img src={coin.image} width={40} height={40} />
                                    {coin.name}
                                </div>
                            </td>
                            <td>
                                <div className={styles.symbolcoin}>{coin.symbol}</div>
                            </td>
                            <td>{coin.current_price}</td>
                            <td style={
                                coin.price_change_percentage_24h < 0 ? negativeStyle : positviStyle
                            }>{coin.price_change_percentage_24h}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Crypto;