import * as React from "react";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { pool1V3Contract } from "@/components/wagmi/contracts";
import TooltipSepolia from "../TooltipSepolia";

export const CollectTokens = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // States for input values
  const [recipient, setRecipient] = React.useState<string>("");
  const [tickLower, setTickLower] = React.useState<number>(0);
  const [tickUpper, setTickUpper] = React.useState<number>(0);
  const [amount0Requested, setAmount0Requested] = React.useState<string>("");
  const [amount1Requested, setAmount1Requested] = React.useState<string>("");

  // Handle form submission
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!writeContract) {
      return;
    }

    const formattedRecipient = recipient.trim().toLowerCase() as `0x${string}`;
    const formattedAmount0Requested = BigInt(amount0Requested);
    const formattedAmount1Requested = BigInt(amount1Requested);

    try {
      await writeContract({
        ...pool1V3Contract,
        functionName: "collect",
        args: [
          formattedRecipient,
          tickLower,
          tickUpper,
          formattedAmount0Requested,
          formattedAmount1Requested,
        ],
      });
    } catch (err) {
      console.error("Error:", err);
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Handlers for input change events
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

  const handleTickLowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTickLower(Number(e.target.value));
  };

  const handleTickUpperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTickUpper(Number(e.target.value));
  };

  const handleAmount0RequestedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmount0Requested(e.target.value);
  };

  const handleAmount1RequestedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmount1Requested(e.target.value);
  };

  return (
    <>
      <h1 className="w-full text-center font-bold bg-highlight-dark-500 py-5">
        COLLECT TOKENS
      </h1>
      <div className="text-xs flex my-2 items-center">
        <div className="text-xs">
          <strong>Explanation:</strong> Collects fees within the specified tick
          range. Returns the amounts of token0 and token1 collected.
        </div>
        <TooltipSepolia
          content={
            <div>
              <h3 className="font-bold">3. collect</h3>
              <p>
                <strong>Function:</strong> collect (Write Contract)
              </p>
              <p>
                <strong>Inputs:</strong>
              </p>
              <ul className="list-disc ml-5">
                <li>
                  recipient: 0x7FAEE86E94Ce9A4E3F5a21d74e7Da308CbD7b08d (Example
                  recipient address)
                </li>
                <li>tickLower: -10000 (Example lower tick value)</li>
                <li>tickUpper: 10000 (Example upper tick value)</li>
                <li>
                  amount0Requested: 1000000000000000000 (Example amount of
                  token0 requested)
                </li>
                <li>
                  amount1Requested: 2000000000000000000 (Example amount of
                  token1 requested)
                </li>
              </ul>
              <p>
                <strong>Outputs:</strong>
              </p>
              <ul className="list-disc ml-5">
                <li>
                  amount0: 1000000000000000000 (Example amount of token0
                  collected)
                </li>
                <li>
                  amount1: 2000000000000000000 (Example amount of token1
                  collected)
                </li>
              </ul>
              <p>
                <strong>Explanation:</strong> Collects fees within the specified
                tick range. Returns the amounts of token0 and token1 collected.
              </p>
            </div>
          }
        >
          <button className="text-xs text-nowrap bg-primary-gold-500/25 rounded p-2 text-primary-gold-500 ml-2">
            Help ?
          </button>
        </TooltipSepolia>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-2">
        <label className="text-white text-xs -mb-2">Recipient Address:</label>
        <input
          className="p-2 bg-primary-dark-500 border rounded"
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={handleRecipientChange}
          required
        />

        <label className="text-white text-xs -mb-2">Tick Lower:</label>
        <input
          className="p-2 bg-primary-dark-500 border rounded"
          type="number"
          placeholder="Tick Lower"
          value={tickLower}
          onChange={handleTickLowerChange}
          min="-100000"
          required
        />

        <label className="text-white text-xs -mb-2">Tick Upper:</label>
        <input
          className="p-2 bg-primary-dark-500 border rounded"
          type="number"
          placeholder="Tick Upper"
          value={tickUpper}
          onChange={handleTickUpperChange}
          min="-100000"
          required
        />

        <label className="text-white text-xs -mb-2">Amount0 Requested:</label>
        <input
          className="p-2 bg-primary-dark-500 border rounded"
          type="text"
          placeholder="Amount0 Requested"
          value={amount0Requested}
          onChange={handleAmount0RequestedChange}
          required
        />

        <label className="text-white text-xs -mb-2">Amount1 Requested:</label>
        <input
          className="p-2 bg-primary-dark-500 border rounded"
          type="text"
          placeholder="Amount1 Requested"
          value={amount1Requested}
          onChange={handleAmount1RequestedChange}
          required
        />

        <button
          className="bg-primary-gold-500 p-4 rounded text-white"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Collecting Tokens..." : "Collect Tokens"}
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Tokens collected successfully.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </form>
    </>
  );
};
