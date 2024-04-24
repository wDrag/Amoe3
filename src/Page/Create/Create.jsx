import { useEffect, useRef, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import "./Create.scss";
import KIP17 from "../../assets/KIP17.json";
import axios from "axios";
import * as fs from 'node:fs';

const Create = () => {
  const imgInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [collectionAddress, setCollectionAddress] = useState("");
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState(0);
  const [pinataApiKey, setPinataApiKey] = useState("");

  useEffect(() => {
    const pinataApiKey = localStorage.getItem('pinataApiKey');
    if (pinataApiKey) {
      setPinataApiKey(pinataApiKey);
    }
  }, []);
  // const handleCancelImage = () => {
  //   setFile(null);
  //   imgInputRef.current.value = "";
  // };

  const handleMintNFT = async (metadata) => {
    await writeContractAsync({
      abi: KIP17,
      address: collectionAddress,
      functionName: "mintWithTokenURI",
      args: [address, tokenId, metadata],
    });
  };

  const postToIPFS = async (file) => {
    const pinFileToIPFS = async () => {
      const formData = new FormData();
      
      formData.append('file', file)
      
      const pinataMetadata = JSON.stringify({
        name: 'File name',
      });
      formData.append('pinataMetadata', pinataMetadata);
      
      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      })
      formData.append('pinataOptions', pinataOptions);
  
      try{
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxBodyLength: "Infinity",
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'Authorization': `Bearer ${pinataApiKey}`
          }
        });
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    }
    return await pinFileToIPFS()
  }

  // const postToCloudinary = async (file) => {
  //   return new Promise(
  //     (resolve, reject) => {
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       formData.append("upload_preset", cloudinary.upload_preset);
  //       const xhr = new XMLHttpRequest();
  //       xhr.open(
  //         "POST",
  //         `https://api.cloudinary.com/v1_1/${cloudinary.cloud_name}/image/upload`
  //       );
  //       xhr.onload = () => {
  //         const res = JSON.parse(xhr.responseText);
  //         resolve(res.secure_url);
  //       };
  //       xhr.onerror = (err) => {
  //         reject(err);
  //       };
  //       xhr.send(formData);
  //     },
  //     (err) => console.log(err)
  //   );
  // };

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
      <input
        type="text"
        onChange={(e) => {
          e.preventDefault();
          setPinataApiKey(e.target.value);
          localStorage.setItem('pinataApiKey', e.target.value);
        }}
        placeholder="Pinata API Key, use to pin the image to IPFS"
        style={{ width: "50%" }}
        value={pinataApiKey}
      />
      <button
        onClick={async () => {
          console.log(file);

          const metadata = await postToIPFS(file);

          if (!metadata) {
            return;
          }

          const URI =  "https://ipfs.io/ipfs/" + metadata.IpfsHash;
          console.log(URI);

          await handleMintNFT(URI);
        }}
        disabled={!file || !collectionAddress || !tokenId}
      >
        Create
      </button>
    </div>
  );
};

export default Create;
