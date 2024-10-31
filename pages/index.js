// pages/index.js
import { useState } from 'react';

export default function Home() {
    const [rpcUrl, setRpcUrl] = useState('https://mainnet.base.org'); // Default RPC URL for Base network
    const [privateKey, setPrivateKey] = useState('');
    const [sharesSubject, setSharesSubject] = useState('');
    const [amount, setAmount] = useState(1); // Default amount set to 1
    const [message, setMessage] = useState('');
    const [txHash, setTxHash] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setTxHash(null);

        const response = await fetch('/api/sellShares', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rpcUrl, privateKey, sharesSubject, amount }),
        });

        const result = await response.json();

        if (response.ok) {
            setMessage(result.message);
            setTxHash(result.txHash);
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6 text-center">Sell Shares Interface</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">RPC URL:</label>
                        <input
                            type="text"
                            value={rpcUrl}
                            onChange={(e) => setRpcUrl(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Private Key:</label>
                        <input
                            type="text"
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Shares Subject:</label>
                        <input
                            type="text"
                            value={sharesSubject}
                            onChange={(e) => setSharesSubject(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Amount:</label>
                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Sell Shares
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-gray-700">{message}</p>
                )}
                {txHash && (
                    <p className="mt-2 text-center text-blue-600">
                        Transaction Hash:{" "}
                        <a
                            href={`https://basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            {txHash}
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}
