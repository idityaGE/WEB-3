import { getMetadataPointerState, getMint, getTokenMetadata, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";


const getMetaData = async (mint: PublicKey, connection: Connection) => {
  const mintInfo = await getMint(
    connection,
    mint,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  )

  // Retrieve and log the metadata pointer state
  const metadataPointer = getMetadataPointerState(mintInfo);
  console.log("\nMetadata Pointer:", JSON.stringify(metadataPointer, null, 2));


  // Retrieve and log the metadata state
  const metadata = await getTokenMetadata(
    connection,
    mint, // Mint Account address
  );
  console.log("\nMetadata:", JSON.stringify(metadata, null, 2));
}

export default getMetaData
