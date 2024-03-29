import { useRef, useState } from "react";
import cloudinary from "../../cloudinary/cloudinary";
import { useAccount, useWriteContract } from "wagmi";
import "./Create.scss";
import KIP17 from "../../assets/KIP17.json";

const Create = () => {
  const imgInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [collectionAddress, setCollectionAddress] = useState("");
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState(0);

  const handleCancelImage = () => {
    setFile(null);
    imgInputRef.current.value = "";
  };

  const handleMintNFT = async (metadata) => {
    await writeContractAsync({
      abi: KIP17,
      address: collectionAddress,
      functionName: "mintWithTokenURI",
      args: [address, tokenId, metadata],
    });
  };

  const postToCloudinary = async (file) => {
    return new Promise(
      (resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinary.upload_preset);
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudinary.cloud_name}/image/upload`
        );
        xhr.onload = () => {
          const res = JSON.parse(xhr.responseText);
          resolve(res.secure_url);
        };
        xhr.onerror = (err) => {
          reject(err);
        };
        xhr.send(formData);
      },
      (err) => console.log(err)
    );
  };

  return (
    <div className="Create">
      <h1>Mint</h1>
      {file && <img className="file" src={URL.createObjectURL(file)} />}
      <label htmlFor="file">
        <div className="item">
          <img src={Image} alt="" />
          <span>Upload Image</span>
        </div>
      </label>
      <input
        type="file"
        id="file"
        ref={imgInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          e.preventDefault();
          setFile(e.target.files[0]);
        }}
      />
      <input
        type="text"
        onChange={(e) => {
          e.preventDefault();
          setCollectionAddress(e.target.value);
        }}
        placeholder="Collection Address"
      />
      <input
        type="number"
        onChange={(e) => {
          e.preventDefault();
          setTokenId(e.target.value);
        }}
        placeholder="Token ID"
      />
      <button
        onClick={async () => {
          console.log("Uploading to Cloudinary...");

          const result = await postToCloudinary(file);
          await handleMintNFT(result);
          // send result as metadata to the blockchain
          console.log("Uploaded to Cloudinary:", result);
        }}
        disabled={!file || !collectionAddress || !tokenId}
      >
        Create
      </button>
    </div>
  );
};

export default Create;
