import * as Hash from 'typestub-ipfs-only-hash';

export async function createIpfsHash(fileBuffer: Buffer): Promise<string> {
  const hash = await Hash.of(fileBuffer);
  return hash;
}
