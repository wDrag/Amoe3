import "./Collections.scss";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import CollectionFactory from "../../assets/CollectionFactory.json";
import KIP17 from "../../assets/KIP17.json";
import { readContract } from "@wagmi/core";
import { WagmiConfig } from "../../wagmiConfig";

const COLLECTION_FACTORY_ADDRESS = "0x7839aB3FDDA33F2EBd35c4468215C31FC8640933";

const Collections = () => {
  const [CollectionsList, setCollectionsList] = useState([]); // [name, symbol, address, totalSupply]
  const [collectionAddressesList, setCollectionAddressesList] = useState([]); // [address1, address2, address3]
  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");

  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [collectionAddress, setCollectionAddress] = useState("");
  // const { refetch: refetchCollectionDetails } = useReadContract({
  //   abi: KIP17,
  //   address: collectionAddress,
  //   functionName: "name",
  //   onSuccess: (name) => {
  //     console.log("Collection Name: ", name);
  //   },
  // });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        console.log("Address: ", address);
        const collections = await readContract(WagmiConfig, {
          abi: CollectionFactory,
          address: COLLECTION_FACTORY_ADDRESS,
          functionName: "getCollectionsByOwner",
          args: [address],
        });
        console.log("Collections: ", collections);
        setCollectionAddressesList(collections);
      } catch (error) {
        console.error("Error while fetching collections: ", error);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    const fetchNFTsURI = async (paramCollectionAddress, totalSupply) => {
      let result = [];
      try {
        for (let i = 0; i < totalSupply; i++) {
          const NFT_id = await readContract(WagmiConfig, {
            abi: KIP17,
            address: paramCollectionAddress,
            functionName: "tokenByIndex",
            args: [i],
          });
          const NFT_URI = await readContract(WagmiConfig, {
            abi: KIP17,
            address: paramCollectionAddress,
            functionName: "tokenURI",
            args: [NFT_id],
          });
          result.push(NFT_URI);
        }
        return result;
      } catch (error) {
        console.error("Error while fetching NFTs: ", error);
      }
    };

    const fetchCollectionsDetails = async () => {
      console.log("CollectionDetails", collectionAddressesList);
      collectionAddressesList.forEach(async (collectionAddress) => {
        console.log("reading collection: ", collectionAddress);
        const name = await readContract(WagmiConfig, {
          abi: KIP17,
          address: collectionAddress,
          functionName: "name",
        });
        console.log("done reading name: ", name);
        const symbol = await readContract(WagmiConfig, {
          abi: KIP17,
          address: collectionAddress,
          functionName: "symbol",
        });
        console.log("done reading symbol: ", symbol);
        const totalSupply = await readContract(WagmiConfig, {
          abi: KIP17,
          address: collectionAddress,
          functionName: "totalSupply",
        });
        console.log("done reading totalSupply: ", totalSupply);
        const NFTs = await fetchNFTsURI(collectionAddress, totalSupply);
        setCollectionsList((prev) => [
          ...prev,
          { name, symbol, address: collectionAddress, totalSupply, NFTs },
        ]);
        console.log("CollectionsList: ", CollectionsList);
      });
    };
    if (CollectionsList.length === 0 && collectionAddressesList.length > 0) {
      fetchCollectionsDetails();
    }
  }, [collectionAddressesList]);

  const handleCreateCollection = async () => {
    await writeContractAsync({
      abi: CollectionFactory,
      address: COLLECTION_FACTORY_ADDRESS,
      functionName: "createNewCollection",
      args: [collectionName, collectionSymbol],
    });
  };

  return (
    <div className="Collections">
      <h1 className="Title">Collections</h1>
      <div className="CreateCollection">
        <input
          placeholder="Collection Name"
          value={collectionName}
          onChange={(e) => {
            e.preventDefault();
            setCollectionName(e.target.value);
          }}
        />
        <input
          placeholder="Collection Symbol"
          value={collectionSymbol}
          onChange={(e) => {
            e.preventDefault();
            setCollectionSymbol(e.target.value);
          }}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            handleCreateCollection();
          }}
        >
          Create Collection
        </button>
      </div>
      <div className="CollectionsList">
        {CollectionsList.map((collection) => {
          return (
            <div className="Collection" key={collection.address}>
              <span>{collection.name}</span>
              <span>{collection.symbol}</span>
              <span>{collection.address}</span>
              <span>{parseInt(collection.totalSupply)}</span>
              <div className="NFTs">
                {collection.NFTs?.map((NFT, index) => {
                  return (
                    <div className="NFT" key={index}>
                      <img src={NFT} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collections;
