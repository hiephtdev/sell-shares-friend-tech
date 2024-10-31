// pages/api/sellShares.js
import { ethers } from "ethers";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests are allowed" });
    }

    const { rpcUrl, privateKey, sharesSubject, amount } = req.body;

    try {
        // Cấu hình provider và ví
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        // Địa chỉ contract và ABI
        const contractAddress = "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4";
        const abi = [
            "function sellShares(address sharesSubject, uint256 amount)"
        ];

        // Tạo instance của contract
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        // Gọi hàm sellShares
        const gasPrice = await provider.getFeeData();
        const estimatedGas = await contract.sellShares.estimateGas(sharesSubject, amount);
        const gasLimit = estimatedGas * 400n / 100n;

        const tx = await contract.sellShares(sharesSubject, amount, {
            gasLimit: gasLimit,
            gasPrice: gasPrice.gasPrice * 3n
        });

        // Đợi giao dịch được xác nhận
        const receipt = await tx.wait();
        res.status(200).json({ message: "Giao dịch thành công", txHash: receipt.transactionHash });
    } catch (error) {
        console.error("Lỗi khi gọi hàm sellShares:", error);
        res.status(500).json({ message: `Lỗi khi gọi hàm sellShares: ${error.shortMessage || ""}`, error: error.message });
    }
}
