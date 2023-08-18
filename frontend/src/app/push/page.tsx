"use client"

import * as PushAPI from '@pushprotocol/restapi';
import { Wallet } from "ethers";
require("dotenv").config();

const PUSH_CHANNEL_ADDRESS = process.env.PUSH_CHANNEL_ADDRESS

export const getConnectSigner = ():any => {
  const signer = new Wallet(process.env.PRIVATE_KEY as string);
  return signer;
};

export const sendNotifications = async(address: string) => {
  const env: any = 'staging';
  // get signer
  const signer = getConnectSigner();
  // send notifications
  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: signer,
    type: 3, // target
    identityType: 2, // direct payload
    notification: {
      title: `【document checker】Received Notification`,
      body: `You were received ***!!`
    },
    payload: {
      title: `【document checker】Received Notification`,
      body: `You were received ***!! Please check it!!`,
      cta: '',
      img: ''
    },
    recipients: `eip155:5:${address}`, // recipient address
    channel: `eip155:5:${PUSH_CHANNEL_ADDRESS}`, // channel address
    env: env,
  });

  console.log("send notification result:", apiResponse);
};

export const loadNotifications = async(
  account: string
): Promise<PushAPI.ParsedResponseType[]> => {
  
  const env: any = 'staging';
  console.log("account:", account)
  // get spams
  const spams: PushAPI.ParsedResponseType[] = await PushAPI.user.getFeeds({
    user: `eip155:5:${account}`,
    // spam: true,
    env: env
  });

  return spams;
};

export default function Page(){
  const loadNotifi = async() => {
    const data = await loadNotifications("0xB05c8a4a1589F6809d1be61E81C0296a36652A26");
    console.log(data);
  }

  return(
    <>
      <button onClick={() => sendNotifications("0xB05c8a4a1589F6809d1be61E81C0296a36652A26")}>send</button>
      <button className="mt-15" onClick={() =>loadNotifi()}>load</button>
    </>
  )
}